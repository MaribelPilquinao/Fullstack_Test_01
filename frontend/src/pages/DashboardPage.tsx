import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  tasksByStatus: {
    pendiente: number;
    en_progreso: number;
    completada: number;
  };
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};

const DashboardPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Cargando estadísticas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-red-600">Error al cargar datos: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">Aquí están tus estadísticas en tiempo real.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <p className="truncate text-sm font-medium text-slate-500">Total de Proyectos</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              {data?.totalProjects}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <p className="truncate text-sm font-medium text-slate-500">Total de Tareas</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              {data?.totalTasks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;