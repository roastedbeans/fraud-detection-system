'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { FraudAnalysisDialog } from './fraud-analysis-dialog';

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
}

interface FraudDataTableProps {
	data: TransactionData[];
}

type SortField = keyof TransactionData;
type SortDirection = 'asc' | 'desc';

export function FraudDataTable({ data }: FraudDataTableProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortField, setSortField] = useState<SortField | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
	const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const filteredAndSortedData = useMemo(() => {
		let filtered = data;

		// Filter by search term
		if (searchTerm) {
			filtered = data.filter((transaction) =>
				Object.values(transaction).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// Sort data
		if (sortField) {
			filtered = [...filtered].sort((a, b) => {
				const aValue = a[sortField];
				const bValue = b[sortField];

				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
				}

				if (typeof aValue === 'number' && typeof bValue === 'number') {
					return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
				}

				if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
					return sortDirection === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
				}

				return 0;
			});
		}

		return filtered;
	}, [data, searchTerm, sortField, sortDirection]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

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

	const getSortIcon = (field: SortField) => {
		if (sortField !== field) return null;
		return sortDirection === 'asc' ? <ChevronUp className='ml-1 h-4 w-4' /> : <ChevronDown className='ml-1 h-4 w-4' />;
	};

	const handleRowClick = (transaction: TransactionData) => {
		setSelectedTransaction(transaction);
		setIsDialogOpen(true);
	};

	return (
		<div className='w-full'>
			{/* Search Bar */}
			<div className='flex items-center space-x-2 mb-4'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Search transactions...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='pl-8'
					/>
				</div>
				<div className='text-sm text-muted-foreground'>
					{filteredAndSortedData.length} of {data.length} transactions
				</div>
			</div>

			{/* Table */}
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Button
									variant='ghost'
									onClick={() => handleSort('trans_date_trans_time')}
									className='h-auto p-0 font-medium hover:bg-transparent'>
									Date/Time
									{getSortIcon('trans_date_trans_time')}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant='ghost'
									onClick={() => handleSort('cc_num')}
									className='h-auto p-0 font-medium hover:bg-transparent'>
									Card
									{getSortIcon('cc_num')}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant='ghost'
									onClick={() => handleSort('merchant')}
									className='h-auto p-0 font-medium hover:bg-transparent'>
									Merchant
									{getSortIcon('merchant')}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant='ghost'
									onClick={() => handleSort('category')}
									className='h-auto p-0 font-medium hover:bg-transparent'>
									Category
									{getSortIcon('category')}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant='ghost'
									onClick={() => handleSort('amt')}
									className='h-auto p-0 font-medium hover:bg-transparent'>
									Amount
									{getSortIcon('amt')}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant='ghost'
									onClick={() => handleSort('first')}
									className='h-auto p-0 font-medium hover:bg-transparent'>
									Customer
									{getSortIcon('first')}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant='ghost'
									onClick={() => handleSort('city')}
									className='h-auto p-0 font-medium hover:bg-transparent'>
									Location
									{getSortIcon('city')}
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant='ghost'
									onClick={() => handleSort('is_fraud')}
									className='h-auto p-0 font-medium hover:bg-transparent'>
									Status
									{getSortIcon('is_fraud')}
								</Button>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredAndSortedData.map((transaction, index) => (
							<TableRow
								key={index}
								className='cursor-pointer hover:bg-muted/50 transition-colors'
								onClick={() => handleRowClick(transaction)}>
								<TableCell className='font-mono text-sm'>{formatDateTime(transaction.trans_date_trans_time)}</TableCell>
								<TableCell className='font-mono text-sm'>{transaction.cc_num}</TableCell>
								<TableCell className='max-w-[200px] truncate'>{transaction.merchant}</TableCell>
								<TableCell>
									<Badge
										variant='outline'
										className='text-xs'>
										{transaction.category}
									</Badge>
								</TableCell>
								<TableCell className='font-medium text-green-600'>${transaction.amt.toFixed(2)}</TableCell>
								<TableCell>
									{transaction.first} {transaction.last}
								</TableCell>
								<TableCell className='text-sm text-muted-foreground'>
									{transaction.city}, {transaction.state}
								</TableCell>
								<TableCell>
									<Badge
										variant={transaction.is_fraud ? 'destructive' : 'secondary'}
										className='text-xs'>
										{transaction.is_fraud ? 'Fraud' : 'Legitimate'}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{filteredAndSortedData.length === 0 && (
				<div className='text-center py-8 text-muted-foreground'>No transactions found matching your search.</div>
			)}

			{/* Fraud Analysis Dialog */}
			<FraudAnalysisDialog
				transaction={selectedTransaction}
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			/>
		</div>
	);
}
