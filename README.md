# Book Club 

A Vue.js application for managing a book club or small library. This web application allows users to track books, manage borrowers, and view dashboard statistics about borrowing patterns.

## Features

- **User Management**

  - View all users/members
  - View user details and currently borrowed books
  - Load users with pagination

- **Book Management**

  - Browse all books in the library
  - Add new books to the collection
  - Edit existing book details
  - Delete books from the collection
  - Load books with pagination

- **Dashboard & Analytics**
  - Summary statistics of library activity
  - Weekly book borrowing chart
  - Top 5 publishing houses
  - Top 5 book languages
  - Top 10 members by books borrowed

## Technologies Used

- Vue 3 (Composition API with `<script setup>` syntax)
- Vue Router for navigation
- Chart.js for data visualization
- Tailwind CSS for styling

## Installation

1. Clone the repository

```bash
git clone [repository-url]
cd book-club
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
# Create a .env file with your API endpoint
VITE_BASE_API=your_api_endpoint (e.g. https://123.mockapi.io/api/v1/)
```

4. Start the development server

```bash
npm run dev
```

## Project Structure

- `/src`
  - `/api` - API service functions
  - `/assets` - Static assets
  - `/components` - Reusable Vue components
  - `/composables` - Data processing and calculations
  - `/views` - Main page components
  - `App.vue` - Root component
  - `main.js` - Application entry point

## Usage

- **Home Page**: Navigate to Users, Books, or Dashboard sections
- **Users Page**: View all members and their borrowing activity
- **Books Page**: Manage the book collection (add, edit, delete)
- **Dashboard**: View statistics and borrowing patterns
