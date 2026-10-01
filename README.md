# Expense Tracker

A responsive web-based Expense Tracker built using HTML, CSS, and JavaScript. The application allows users to manage income and expense transactions, monitor their financial balance, search and filter transactions, and view monthly and category-wise spending summaries.

## 📌 Project Overview

The Expense Tracker is designed to provide a simple and user-friendly way to record and manage personal financial transactions directly from the browser.

Users can:

- Add income and expense transactions
- Specify transaction amount, category, date, and description
- Edit existing transactions
- Delete transactions
- Search transactions
- Filter transactions by type and category
- View total income
- View total expenses
- View current balance
- View monthly financial summaries
- View category-wise expense information
- Persist transaction data using browser Local Storage
- Use the application across desktop and mobile devices

The application runs entirely on the client side and does not require a backend server or external database.

---

## ✨ Features

### 1. Transaction Management

Users can create transactions by providing:

- Transaction type
  - Income
  - Expense
- Amount
- Category
- Date
- Description

Each transaction is displayed in the transaction list after submission.

### 2. Edit Transactions

Existing transactions can be edited without creating a new transaction.

Users can update:

- Transaction type
- Amount
- Category
- Date
- Description

### 3. Delete Transactions

Users can remove unwanted transactions from the transaction list.

The corresponding transaction is also removed from Local Storage.

### 4. Financial Summary

The dashboard provides real-time calculations for:

- Total Income
- Total Expenses
- Current Balance

The balance is calculated as:

```text
Balance = Total Income - Total Expenses