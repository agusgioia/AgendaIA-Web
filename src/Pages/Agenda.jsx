import Layout from "../Components/Layout";
import Eventlist from "../Components/Eventlist";
import { useEffect, useState } from "react";
import { getId } from "../Api/api";
import useAuth from "../Hooks/useAuth";
import PushNotificationButton from "../Components/PushNotificationButton";

export default function Agenda() {
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      if (!user) return;
      const data = await getId(user.email);
      setUserId(data.id);
    };
    getUserId();
  }, [user]);

  return (
    <Layout>
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Calendario</h2>

        <p>Aquí se mostrará el calendario de eventos.</p>
        <Eventlist id={userId} />
        <PushNotificationButton userId={userId} />
      </div>
    </Layout>
  );
}
