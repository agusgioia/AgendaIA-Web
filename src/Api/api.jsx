import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

//Audio
export const sendVoice = async (text, email) => {
  const response = await api.post(`/voice?email=${email}`, { text });
  return response.data;
};

//Eventos
export const getUserEvents = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (event) => {
  const res = await api.post("/events", event);

  return res.data;
};

//Usuarios

export const getId = async (email) => {
  const response = await api.get(`/users?email=${email}`);
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user) => {
  const res = await api.post("/users", user);
  return res.data;
};

export default api;
