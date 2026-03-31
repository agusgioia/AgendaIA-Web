/* global importScripts, firebase */
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey:"AIzaSyB-HRW5Ss1CjTUG6yiY-q7lw5x6pwELWYY",
  authDomain:"ecommerce-84e80.firebaseapp.com",
  projectId:"ecommerce-84e80",
  messagingSenderId:"401405541993",
  appId:"1:401405541993:web:f6c46e0a927aaba6792cf8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192x192.png",
  });
});

//cache
const CACHE_NAME = "agenda-ia-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/index.html"]);
    }),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    }),
  );
});
