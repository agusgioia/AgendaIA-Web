import { useState } from "react";
import { requestNotificationPermission } from "../../firebase";
import { updateFcmToken } from "../Api/api";

export default function usePushNotifications(userId) {
  const [status, setStatus] = useState("idle");

  const subscribe = async () => {
    console.log("1. Notification.permission antes:", Notification.permission);

    if (!("Notification" in window)) {
      setStatus("unsupported");
      return;
    }

    if (Notification.permission === "denied") {
      setStatus("blocked");
      return;
    }

    setStatus("loading");
    try {
      console.log("2. Pidiendo permiso...");
      const permission = await Notification.requestPermission();
      console.log("3. Permiso obtenido:", permission);

      const token = await requestNotificationPermission();
      console.log("4. Token:", token);

      if (!token) {
        setStatus("blocked");
        return;
      }
      await updateFcmToken(userId, token);
      setStatus("granted");
    } catch (e) {
      console.error("Error completo:", e.name, e.message);
      setStatus("denied");
    }
  };

  return { status, subscribe };
}
