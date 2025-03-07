const getBook = async (bookId) => {
  try {
    const BASE_API = import.meta.env.VITE_BASE_API;

    const response = await fetch(`${BASE_API}/books/${bookId}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch book with ID ${bookId}: ${response.status}`
      );
    }

    const book = await response.json();
    return book;
  } catch (error) {
    console.error(`Error fetching book with ID ${bookId}:`, error);
    throw error;
  }
};

export default getBook;
