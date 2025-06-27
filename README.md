# Mini Reconciliation Tool

A simple React-based app to compare transactions from two CSV files (internal vs provider), highlight discrepancies, and export categorized results.

## Features

- Upload two CSV files
- Compare using `transaction_reference`
- Categorize into:
  - ✅ Matched Transactions (flags mismatches)
  - ⚠️ Internal Only
  - ❌ Provider Only
- Export each category as CSV
- Color-coded, responsive UI using Bootstrap

## Tech Stack

- React.js (Create React App)  
- PapaParse  
- File‑Saver  
- Bootstrap  

## Setup & Run

```bash
git clone <https://github.com/mnesh01/Reconciliation.git>
cd reconc
npm install
npm start
