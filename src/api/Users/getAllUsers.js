const getAllUsers = async () => {
  try {
    const BASE_API = import.meta.env.VITE_BASE_API;

    const response = await fetch(`${BASE_API}/users`);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response format from users API");
    }

    return data;
  } catch (error) {
    console.error("Error fetching Users:", error);
    return [];
  }
};

export default getAllUsers;
