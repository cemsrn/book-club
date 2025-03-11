export default async function getAvailableBooks() {
  try {
    const BASE_API = import.meta.env.VITE_BASE_API;
    const response = await fetch(`${BASE_API}/books`);

    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.status}`);
    }

    const allBooks = await response.json();

    return allBooks.filter((book) => book.status === true);
  } catch (error) {
    console.error("Error fetching available books:", error);
    throw error;
  }
}
