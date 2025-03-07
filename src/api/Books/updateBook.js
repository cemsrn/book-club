const updateBook = async (bookId, bookData) => {
  try {
    const BASE_API = import.meta.env.VITE_BASE_API;

    const response = await fetch(`${BASE_API}/books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...bookData,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update book: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export default updateBook;
