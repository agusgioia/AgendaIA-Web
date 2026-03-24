import Router from "./Router/Router";
import AuthProvider from "./Context/AuthProvider";

function App() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("SW registrado"))
        .catch((err) => console.log("SW error", err));
    });
  }

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
