export const getUserById = async (userId) => {
  try {
    const BASE_API = import.meta.env.VITE_BASE_API;
    const response = await fetch(`${BASE_API}/users/${userId}`);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
