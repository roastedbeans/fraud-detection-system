'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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

interface FraudAnalysisDialogProps {
	transaction: TransactionData | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function FraudAnalysisDialog({ transaction, open, onOpenChange }: FraudAnalysisDialogProps) {
	if (!transaction) return null;

	const formatDateTime = (dateTime: string) => {
		const date = new Date(dateTime);
		return date.toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getRiskColor = (score: number) => {
		if (score >= 80) return 'text-red-600';
		if (score >= 60) return 'text-orange-600';
		if (score >= 40) return 'text-yellow-600';
		return 'text-green-600';
	};

	const getRiskLevel = (score: number) => {
		if (score >= 80) return 'High Risk';
		if (score >= 60) return 'Medium Risk';
		if (score >= 40) return 'Low Risk';
		return 'Very Low Risk';
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<span className='text-red-600'>🔍</span>
						Fraud Analysis Report
					</DialogTitle>
					<DialogDescription>Detailed analysis of flagged transaction</DialogDescription>
				</DialogHeader>

				<div className='space-y-6'>
					{/* Transaction Details */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Transaction Details</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='text-sm font-medium text-muted-foreground'>Date/Time</label>
									<p className='font-mono text-sm'>{formatDateTime(transaction.trans_date_trans_time)}</p>
								</div>
								<div>
									<label className='text-sm font-medium text-muted-foreground'>Amount</label>
									<p className='text-lg font-semibold text-green-600'>${transaction.amt.toFixed(2)}</p>
								</div>
								<div>
									<label className='text-sm font-medium text-muted-foreground'>Merchant</label>
									<p className='text-sm'>{transaction.merchant}</p>
								</div>
								<div>
									<label className='text-sm font-medium text-muted-foreground'>Category</label>
									<Badge variant='outline'>{transaction.category}</Badge>
								</div>
								<div>
									<label className='text-sm font-medium text-muted-foreground'>Customer</label>
									<p className='text-sm'>
										{transaction.first} {transaction.last}
									</p>
								</div>
								<div>
									<label className='text-sm font-medium text-muted-foreground'>Location</label>
									<p className='text-sm'>
										{transaction.city}, {transaction.state}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Fraud Analysis */}
					{transaction.fraud_score && transaction.fraud_analysis && (
						<Card>
							<CardHeader>
								<CardTitle className='text-lg'>Fraud Detection Analysis</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-sm font-medium'>Fraud Probability</span>
										<span className={`text-lg font-bold ${getRiskColor(transaction.fraud_score)}`}>
											{transaction.fraud_score}%
										</span>
									</div>
									<Progress
										value={transaction.fraud_score}
										className='h-2'
									/>
									<div className='flex justify-between text-xs text-muted-foreground'>
										<span>0%</span>
										<span className={`font-medium ${getRiskColor(transaction.fraud_score)}`}>
											{getRiskLevel(transaction.fraud_score)}
										</span>
										<span>100%</span>
									</div>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>Analysis Details</label>
									<p className='text-sm text-muted-foreground leading-relaxed'>{transaction.fraud_analysis}</p>
								</div>

								<div className='flex justify-center'>
									<Badge
										variant='destructive'
										className='text-sm'>
										🚨 FRAUD DETECTED
									</Badge>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
