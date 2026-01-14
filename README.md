# Fraud Detection System

A modern web application built with Next.js that analyzes transaction data to detect fraudulent activities using machine learning algorithms.

## Features

- **Transaction Analysis**: Process and analyze large datasets of financial transactions
- **Fraud Detection**: Identify fraudulent transactions using advanced algorithms
- **Interactive Dashboard**: Real-time statistics and visualizations
- **Data Tables**: Sortable and filterable transaction data tables
- **CSV Processing**: Handle large CSV files efficiently
- **Modern UI**: Clean, responsive interface built with shadcn/ui components

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/roastedbeans/fraud-detection-system.git
   cd fraud-detection-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up data files**
   Place your CSV data files in the `public/` directory:
   - `fraudTest.csv` - Test dataset for fraud detection
   - `fraudTrain.csv` - Training dataset for model training

   > **Note**: CSV files are ignored by Git to prevent large file uploads. You'll need to obtain these files separately.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

To build and run the application in production:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Usage

1. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

2. **Process Fraud Data**
   - Click the "Process Fraud Data" button on the main page
   - The system will analyze the transaction data from `fraudTest.csv`
   - Processing may take a few moments for large datasets

3. **View Results**
   - **Overview Tab**: See summary statistics including total transactions, fraud count, and fraud rate
   - **All Transactions Tab**: Browse through the processed transaction data
   - **Fraud Detected Tab**: View only the transactions flagged as fraudulent

## Project Structure

```
fraud-detection-system/
├── public/                    # Static files and data
│   ├── fraudTest.csv         # Test dataset (not tracked by git)
│   ├── fraudTrain.csv        # Training dataset (not tracked by git)
│   └── ...                   # Other static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── fraud-detection/
│   │   │       └── route.ts   # API endpoint for fraud analysis
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Main page component
│   └── components/
│       ├── ui/               # shadcn/ui components
│       ├── fraud-data-table.tsx    # Transaction data table
│       └── fraud-analysis-dialog.tsx # Analysis dialog
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.ts            # Next.js configuration
└── README.md                 # This file
```

## Data Format

The application expects CSV files with the following columns:

- `trans_date_trans_time`: Transaction timestamp
- `cc_num`: Credit card number
- `merchant`: Merchant name
- `category`: Transaction category
- `amt`: Transaction amount
- `first`: Customer first name
- `last`: Customer last name
- `gender`: Customer gender
- `city`: Customer city
- `state`: Customer state
- `zip`: Customer ZIP code
- `job`: Customer job title
- `is_fraud`: Fraud flag (target variable)

## API Endpoints

### POST `/api/fraud-detection`

Processes transaction data and performs fraud detection analysis.

**Response:**
```json
{
  "message": "Data processed successfully",
  "statistics": {
    "totalTransactions": 1000,
    "fraudTransactions": 15,
    "legitimateTransactions": 985,
    "fraudPercentage": "1.5%"
  },
  "transactions": [...],
  "fraudTransactions": [...]
}
```

## Technologies Used

- **Next.js 15** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **CSV Parser** - Data processing

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

The project uses ESLint for code linting and follows TypeScript best practices for type safety.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **CSV files not found**
   - Ensure `fraudTest.csv` and `fraudTrain.csv` are placed in the `public/` directory
   - Check file permissions and format

2. **Build failures**
   - Ensure all dependencies are installed: `npm install`
   - Check Node.js version compatibility

3. **Performance issues**
   - Large CSV files may take time to process
   - Consider processing data in chunks for very large datasets

### Git LFS Issues

If you encounter issues with large file uploads to GitHub:
- CSV files are intentionally excluded from version control
- Use Git LFS if you need to track large data files
- See `.gitignore` for excluded file patterns

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the GitHub repository.