import { useAuthStore } from '../store/auth.store';

const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex h-16 w-full items-center justify-between bg-white px-4 shadow-md">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          Bienvenido, {user?.fullName || 'Usuario'}
        </h1>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;