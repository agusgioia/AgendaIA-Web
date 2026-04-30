import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const localApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL_LOCAL,
});

// Adjunta el token de Firebase en cada request automáticamente
const getFirebaseToken = () =>
  new Promise((resolve) => {
    const auth = getAuth();
    if (auth.currentUser) {
      resolve(auth.currentUser.getIdToken(true));
    } else {
      const unsub = onAuthStateChanged(auth, (user) => {
        unsub();
        resolve(user ? user.getIdToken(true) : null);
      });
    }
  });

localApi.interceptors.request.use(async (config) => {
  const token = await getFirebaseToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Eventos
export const getUserEvents = async (id) => {
  const response = await localApi.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (event, email) => {
  const res = await localApi.post(`/events?email=${email}`, event);
  return res.data;
};

export const updateEvent = async (id, event) => {
  const res = await localApi.put(`/events/${id}`, event);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await localApi.delete(`/events/${id}`);
  return res.data;
};

// Voz
export const sendVoice = async (text, email) => {
  const response = await localApi.post(`/voice?email=${email}`, { text });
  return response.data;
};

// Usuarios
export const getId = async (email) => {
  const response = await localApi.get(`/users?email=${email}`);
  return response.data;
};

export const getUser = async (id) => {
  const response = await localApi.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user) => {
  const res = await localApi.post("/users", user);
  return res.data;
};

export default localApi;
