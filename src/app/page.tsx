'use client';

import { useState } from 'react';
import { FraudDataTable } from '@/components/fraud-data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Statistics {
	totalTransactions: number;
	fraudTransactions: number;
	legitimateTransactions: number;
	fraudPercentage: string;
}

interface TransactionData {
	trans_date_trans_time: string;
	cc_num: string;
	merchant: string;
	category: string;
	amt: number;
	first: string;
	last: string;
	gender: string;
	city: string;
	state: string;
	zip: string;
	job: string;
	is_fraud: boolean;
	fraud_score?: number;
	fraud_analysis?: string;
}

export default function Home() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [statistics, setStatistics] = useState<Statistics | null>(null);
	const [transactions, setTransactions] = useState<TransactionData[]>([]);
	const [fraudTransactions, setFraudTransactions] = useState<TransactionData[]>([]);
	const [message, setMessage] = useState<string>('');

	const handleProcessData = async () => {
		setIsProcessing(true);
		setMessage('');
		setStatistics(null);
		setTransactions([]);
		setFraudTransactions([]);

		try {
			const response = await fetch('/api/fraud-detection', {
				method: 'POST',
			});

			const data = await response.json();

			if (response.ok) {
				setStatistics(data.statistics);
				setTransactions(data.transactions || []);
				setFraudTransactions(data.fraudTransactions || []);
				setMessage(data.message);
			} else {
				setMessage(data.error || 'Failed to process data');
			}
		} catch (error) {
			setMessage('Network error occurred');
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>Fraud Detection System</h1>
					<p className='text-lg text-gray-600 mb-6'>
						Process transaction data from fraudTest.csv to analyze fraud patterns
					</p>
					<Button
						onClick={handleProcessData}
						disabled={isProcessing}
						size='lg'
						className='px-8'>
						{isProcessing ? 'Processing...' : 'Process Fraud Data'}
					</Button>
				</div>

				{message && (
					<Card className='mb-6'>
						<CardContent className='pt-6'>
							<div
								className={`p-4 rounded-lg ${
									message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
								}`}>
								<p className='font-medium'>{message}</p>
							</div>
						</CardContent>
					</Card>
				)}

				{statistics && (
					<Tabs
						defaultValue='overview'
						className='w-full'>
						<TabsList className='grid w-full grid-cols-3'>
							<TabsTrigger value='overview'>Overview</TabsTrigger>
							<TabsTrigger value='transactions'>All Transactions</TabsTrigger>
							<TabsTrigger value='fraud'>Fraud Detected</TabsTrigger>
						</TabsList>

						<TabsContent
							value='overview'
							className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>Total Transactions</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold text-blue-600'>
											{statistics.totalTransactions.toLocaleString()}
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>Fraud Transactions</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold text-red-600'>
											{statistics.fraudTransactions.toLocaleString()}
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>Legitimate Transactions</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold text-green-600'>
											{statistics.legitimateTransactions.toLocaleString()}
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>Fraud Rate</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold text-yellow-600'>{statistics.fraudPercentage}</div>
									</CardContent>
								</Card>
							</div>

							<Card>
								<CardHeader>
									<CardTitle>Fraud Analysis Summary</CardTitle>
									<CardDescription>Key insights from the transaction data</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex items-center justify-between'>
										<span className='text-sm font-medium'>Dataset Size</span>
										<Badge variant='secondary'>{statistics.totalTransactions.toLocaleString()} transactions</Badge>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-sm font-medium'>Fraud Detection Rate</span>
										<Badge variant={parseFloat(statistics.fraudPercentage) > 1 ? 'destructive' : 'secondary'}>
											{statistics.fraudPercentage}
										</Badge>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-sm font-medium'>Data Quality</span>
										<Badge variant='outline'>High - All fields populated</Badge>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent
							value='transactions'
							className='space-y-6'>
							<Card>
								<CardHeader>
									<CardTitle>Transaction Data</CardTitle>
									<CardDescription>
										Interactive table showing the first 100 transactions (showing {transactions.length} of 100)
									</CardDescription>
								</CardHeader>
								<CardContent>
									{transactions.length > 0 ? (
										<FraudDataTable data={transactions} />
									) : (
										<div className='text-center py-8 text-muted-foreground'>
											No transaction data available. Click "Process Fraud Data" to load transactions.
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent
							value='fraud'
							className='space-y-6'>
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center gap-2'>
										<span className='text-red-600'>🚨</span>
										Fraud Detected Transactions
									</CardTitle>
									<CardDescription>
										List of {statistics.fraudTransactions.toLocaleString()} fraudulent transactions identified in the
										dataset
									</CardDescription>
								</CardHeader>
								<CardContent>
									{fraudTransactions.length > 0 ? (
										<FraudDataTable data={fraudTransactions} />
									) : (
										<div className='text-center py-8 text-muted-foreground'>
											No fraudulent transactions detected. Click "Process Fraud Data" to analyze transactions.
										</div>
									)}
								</CardContent>
							</Card>

							{fraudTransactions.length > 0 && (
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<Card>
										<CardContent className='pt-6'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Fraud Count</span>
												<Badge variant='destructive'>{statistics.fraudTransactions.toLocaleString()}</Badge>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardContent className='pt-6'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Fraud Rate</span>
												<Badge variant='destructive'>{statistics.fraudPercentage}</Badge>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardContent className='pt-6'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Risk Level</span>
												<Badge variant={parseFloat(statistics.fraudPercentage) > 1 ? 'destructive' : 'secondary'}>
													{parseFloat(statistics.fraudPercentage) > 1 ? 'High' : 'Low'}
												</Badge>
											</div>
										</CardContent>
									</Card>
								</div>
							)}
						</TabsContent>
					</Tabs>
				)}

				<div className='mt-6 text-center text-sm text-gray-500'>
					<p>Check server logs for detailed transaction processing information</p>
				</div>
			</div>
		</div>
	);
}
