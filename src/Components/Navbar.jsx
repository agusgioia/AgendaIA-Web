import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex items-center gap-6 text-gray-200">
      <span className="font-bold text-lg text-white">Agenda IA</span>

      <Link to="/" className="text-gray-300 hover:text-white transition">
        Dashboard
      </Link>

      <Link to="/agenda" className="text-gray-300 hover:text-white transition">
        Agenda
      </Link>
    </div>
  );
}
