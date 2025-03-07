import { getUserById } from "../Users/getUserData.js";

const getCurrentlyBorrowed = async (userId) => {
  try {
    const user = await getUserById(userId);

    if (!user || !user.history) {
      return [];
    }

    const borrowedBooks = user.history.filter(
      (item) => item.status === "borrowed"
    );

    return borrowedBooks.map((book) => ({
      id: book.book_id,
      name: book.book_name,
      author: book.author,
      publishing_house: book.publishing_house,
      borrow_date: book.borrow_date,
    }));
  } catch (error) {
    console.error(`Error fetching borrowed books for user ${userId}:`, error);
    return [];
  }
};

export default getCurrentlyBorrowed;
