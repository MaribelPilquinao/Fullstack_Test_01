// Ruta: src/layouts/Sidebar.tsx
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    // --- CAMBIOS AQUÍ ---
    <aside className="w-64 bg-white text-slate-700 p-4 border-r border-slate-200">
      <div className="text-2xl font-bold mb-8 text-slate-900">GestorPro</div>
      <nav>
        <ul>
          {/* Usamos NavLink para un estilo 'activo' */}
          <li className="mb-2">
            <NavLink
              to="/dashboard"
              // --- CAMBIOS AQUÍ ---
              // Aplica bg-slate-100 y text-teal-600 si la ruta está activa
              className={({ isActive }) =>
                `block p-2 rounded ${
                  isActive
                    ? 'bg-slate-100 text-teal-600'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/projects"
              // --- CAMBIOS AQUÍ ---
              className={({ isActive }) =>
                `block p-2 rounded ${
                  isActive
                    ? 'bg-slate-100 text-teal-600'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              Proyectos
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;