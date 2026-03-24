import Layout from "../Components/Layout";
import Eventlist from "../Components/Eventlist";

export default function Agenda() {
  return (
    <Layout>
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Calendario</h2>

        <p>Aquí se mostrará el calendario de eventos.</p>
        <Eventlist />
      </div>
    </Layout>
  );
}
