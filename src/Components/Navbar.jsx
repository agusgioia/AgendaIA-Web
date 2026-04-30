import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <Link to="/" className="text-gray-300 hover:text-white transition">
        Dashboard
      </Link>
      <Link to="/agenda" className="text-gray-300 hover:text-white transition">
        Agenda
      </Link>
    </>
  );

  return (
    <nav className="w-full bg-gray-800 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white text-xl">Agenda IA</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          {links}
        </div>

        {/* Mobile menu button */}
        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div id="mobile-menu" role="region" aria-label="Menú móvil" className="md:hidden bg-gray-800 px-4 pb-4">
          <div className="pt-2 flex flex-col space-y-2">
            {links}
          </div>
        </div>
      )}
    </nav>
  );
}
