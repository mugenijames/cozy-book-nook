const API_URL = import.meta.env.VITE_API_URL;

export const getBooks = async () => {
  const res = await fetch(`${API_URL}/books`);
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
};

export const getOrders = async () => {
  const res = await fetch(`${API_URL}/orders`);
  return res.json();
};
