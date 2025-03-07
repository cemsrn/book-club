async function deleteBook(id) {
  try {
    const BASE_API = import.meta.env.VITE_BASE_API;
    const response = await fetch(`${BASE_API}/books/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete book: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in deleteBook:", error);
    throw error;
  }
}

export default deleteBook;
