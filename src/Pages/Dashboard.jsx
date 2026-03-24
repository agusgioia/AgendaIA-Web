import Layout from "../Components/Layout";
import VoiceAssistant from "../Components/VoiceAssistant";
import useAuth from "../Hooks/useAuth";
import { useEffect, useState } from "react";
import { getId } from "../Api/api";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Dashboard() {
  const { user } = useAuth();
  const [id, setId] = useState(null);

  useEffect(() => {
    if (user) {
      const loadId = async () => {
        try {
          const response = await getId(user.email);
          console.log(response);
          setId(response.id);
        } catch (e) {
          console.error(e);
        }
      };
      loadId();
    }
  }, [user]);

  if (!user || !id) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <ProgressSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-2 gap-6">
        <VoiceAssistant />
      </div>
    </Layout>
  );
}
