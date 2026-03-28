import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Adjunta el token de Firebase en cada request automáticamente
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Eventos
export const getUserEvents = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (event) => {
  const res = await api.post("/events", event);
  return res.data;
};

export const updateEvent = async (id, event) => {
  const res = await api.put(`/events/${id}`, event);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};

// Voz
export const sendVoice = async (text, email) => {
  const response = await api.post(`/voice?email=${email}`, { text });
  return response.data;
};

// Usuarios
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
