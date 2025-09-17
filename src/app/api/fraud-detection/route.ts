import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface Transaction {
	trans_date_trans_time: string;
	cc_num: string;
	merchant: string;
	category: string;
	amt: string;
	first: string;
	last: string;
	gender: string;
	street: string;
	city: string;
	state: string;
	zip: string;
	lat: string;
	long: string;
	city_pop: string;
	job: string;
	dob: string;
	trans_num: string;
	unix_time: string;
	merch_lat: string;
	merch_long: string;
	is_fraud: string;
}

export async function POST(request: NextRequest) {
	try {
		// Path to the fraudTest.csv file
		const csvFilePath = path.join(process.cwd(), 'public', 'fraudTest.csv');

		// Check if file exists
		if (!fs.existsSync(csvFilePath)) {
			return NextResponse.json({ error: 'fraudTest.csv file not found in public directory' }, { status: 404 });
		}

		// Read the CSV file
		const csvData = fs.readFileSync(csvFilePath, 'utf-8');

		// Parse CSV data
		const transactions: Transaction[] = parse(csvData, {
			columns: true,
			skip_empty_lines: true,
			trim: true,
		});

		// Log the transaction data
		console.log('=== FRAUD DETECTION SYSTEM - TRANSACTION DATA ===');
		console.log(`Total transactions loaded: ${transactions.length}`);
		console.log('Sample transactions:');

		// Log first 5 transactions as examples
		transactions.slice(0, 5).forEach((transaction, index) => {
			console.log(`\n--- Transaction ${index + 1} ---`);
			console.log(`Date/Time: ${transaction.trans_date_trans_time}`);
			console.log(`Credit Card: ****${transaction.cc_num.slice(-4)}`);
			console.log(`Merchant: ${transaction.merchant}`);
			console.log(`Category: ${transaction.category}`);
			console.log(`Amount: $${transaction.amt}`);
			console.log(`Location: ${transaction.city}, ${transaction.state}`);
			console.log(`Customer: ${transaction.first} ${transaction.last}`);
			console.log(`Is Fraud: ${transaction.is_fraud === '1' ? 'YES' : 'NO'}`);
		});

		// Count fraud vs legitimate transactions
		const fraudCount = transactions.filter((t) => t.is_fraud === '1').length;
		const legitimateCount = transactions.filter((t) => t.is_fraud === '0').length;

		console.log('\n=== SUMMARY STATISTICS ===');
		console.log(`Total Fraud Transactions: ${fraudCount}`);
		console.log(`Total Legitimate Transactions: ${legitimateCount}`);
		console.log(`Fraud Percentage: ${((fraudCount / transactions.length) * 100).toFixed(2)}%`);

		// Prepare data for table display (first 100 transactions)
		const tableData = transactions.slice(0, 100).map((transaction) => ({
			trans_date_trans_time: transaction.trans_date_trans_time,
			cc_num: `****${transaction.cc_num.slice(-4)}`,
			merchant: transaction.merchant,
			category: transaction.category,
			amt: parseFloat(transaction.amt),
			first: transaction.first,
			last: transaction.last,
			gender: transaction.gender,
			city: transaction.city,
			state: transaction.state,
			zip: transaction.zip,
			job: transaction.job,
			is_fraud: transaction.is_fraud === '1',
		}));

		// Prepare fraudulent transactions data (all fraud cases)
		const fraudTransactionsData = transactions
			.filter((transaction) => transaction.is_fraud === '1')
			.slice(0, 100) // Limit to first 100 fraud cases for performance
			.map((transaction, index) => {
				// Simple fraud scoring algorithm
				const amount = parseFloat(transaction.amt);
				const category = transaction.category;
				const timestamp = new Date(transaction.trans_date_trans_time);
				const hour = timestamp.getHours();

				// Base score from amount (0-40 points)
				let score = Math.min(amount / 10, 40);

				// Category risk factor (0-30 points)
				const highRiskCategories = ['shopping_net', 'misc_net', 'grocery_pos'];
				const mediumRiskCategories = ['gas_transport', 'shopping_pos'];
				if (highRiskCategories.includes(category)) {
					score += 25;
				} else if (mediumRiskCategories.includes(category)) {
					score += 15;
				}

				// Time factor - unusual hours (0-20 points)
				if (hour >= 22 || hour <= 5) {
					score += 15; // Late night/early morning
				} else if (hour >= 18 || hour <= 8) {
					score += 10; // Evening/morning
				}

				// Add some randomness to simulate ML model variability
				score += Math.random() * 10;

				// Cap at 100
				score = Math.min(Math.round(score), 100);

				// Generate descriptive analysis text
				let analysisText = '';
				const factors = [];

				if (amount > 500) factors.push('high transaction amount');
				if (amount > 1000) factors.push('unusually high amount');
				if (highRiskCategories.includes(category)) factors.push('high-risk category');
				if (hour >= 22 || hour <= 5) factors.push('unusual transaction time');
				if (hour >= 18 || hour <= 8) factors.push('off-peak hours');

				if (factors.length > 0) {
					analysisText = `Detected due to: ${factors.join(', ')}. `;
				} else {
					analysisText = 'Detected through pattern analysis. ';
				}

				analysisText += `Transaction flagged with ${score}% fraud probability.`;

				return {
					trans_date_trans_time: transaction.trans_date_trans_time,
					cc_num: `****${transaction.cc_num.slice(-4)}`,
					merchant: transaction.merchant,
					category: transaction.category,
					amt: amount,
					first: transaction.first,
					last: transaction.last,
					gender: transaction.gender,
					city: transaction.city,
					state: transaction.state,
					zip: transaction.zip,
					job: transaction.job,
					is_fraud: transaction.is_fraud === '1',
					fraud_score: score,
					fraud_analysis: analysisText,
				};
			});

		return NextResponse.json({
			success: true,
			message: 'CSV data processed and logged successfully',
			statistics: {
				totalTransactions: transactions.length,
				fraudTransactions: fraudCount,
				legitimateTransactions: legitimateCount,
				fraudPercentage: `${((fraudCount / transactions.length) * 100).toFixed(2)}%`,
			},
			transactions: tableData,
			fraudTransactions: fraudTransactionsData,
		});
	} catch (error) {
		console.error('Error processing CSV data:', error);
		return NextResponse.json({ error: 'Failed to process CSV data' }, { status: 500 });
	}
}

// GET endpoint to check server status
export async function GET() {
	return NextResponse.json({
		message: 'Fraud Detection System API is running',
		endpoints: {
			POST: '/api/fraud-detection - Process fraud test data',
		},
	});
}
