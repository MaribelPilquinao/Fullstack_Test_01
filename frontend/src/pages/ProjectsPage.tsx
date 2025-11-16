import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import EditProjectModal from '../components/projects/EditProjectModal';
import api from '../lib/api';
import { type ProjectData } from '../types';

const fetchProjects = async (): Promise<ProjectData[]> => {
  const { data } = await api.get('/projects?page=1&limit=20');
  return data;
};

const deleteProject = async (projectId: string) => {
  return await api.delete(`/projects/${projectId}`);
};

const ProjectsPage = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Error al eliminar el proyecto');
    },
  });

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      deleteMutation.mutate(projectId);
    }
  };

  const handleEditClick = (e: React.MouseEvent, project: ProjectData) => {
    e.preventDefault();
    setEditingProject(project);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Proyectos</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
        >
          Crear Proyecto
        </button>
      </div>

      {isLoading && <p className="mt-4 text-slate-600">Cargando proyectos...</p>}
      {isError && <p className="mt-4 text-red-600">Error al cargar los proyectos.</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects &&
          projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group relative overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-lg"
            >
              <div className="p-5">
                <h3 className="text-lg font-medium text-slate-900">{project.name}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {project.description || 'Sin descripción'}
                </p>
              </div>
              
              <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={(e) => handleEditClick(e, project)}
                    className="text-xs font-medium text-teal-600 hover:text-teal-500 z-10"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    disabled={deleteMutation.isPending && deleteMutation.variables === project.id}
                    className="text-xs font-medium text-red-600 hover:text-red-500 z-10 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </Link>
          ))}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {editingProject && (
        <EditProjectModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          project={editingProject}
        />
      )}
    </>
  );
};

export default ProjectsPage;