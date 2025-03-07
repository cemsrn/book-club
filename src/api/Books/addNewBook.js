const addNewBook = async (bookData) => {
  try {
    const BASE_API = import.meta.env.VITE_BASE_API;

    const randomId = Math.floor(100 + Math.random() * 9900).toString();
    const payload = {
      id: bookData?.id || randomId,
      name: bookData?.name || "New Book Title",
      image: bookData?.image || "https://loremflickr.com/640/480/nature",
      language: bookData?.language || "English",
      isbn:
        typeof bookData?.isbn === "number"
          ? bookData.isbn
          : Math.floor(10000 + Math.random() * 90000),
      user_id: typeof bookData?.user_id === "number" ? bookData.user_id : 1,
      price: typeof bookData?.price === "number" ? bookData.price : 30,
      status: typeof bookData?.status === "boolean" ? bookData.status : false,
      author: bookData?.author || "Unknown Author",
      publishing_house: bookData?.publishing_house || "Publishing House",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Sending book data:", payload);

    const response = await fetch(`${BASE_API}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add book: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding new book:", error);
    throw error;
  }
};

export default addNewBook;
