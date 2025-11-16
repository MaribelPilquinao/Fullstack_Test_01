import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ManageCollaboratorsModal from '../components/projects/ManageCollaboratorsModal';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import EditTaskModal from '../components/tasks/EditTaskModal';
import api from '../lib/api';
import { type ProjectData, type TaskData } from '../types';

const fetchProjectDetails = async (projectId: string): Promise<ProjectData> => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data;
};
const fetchProjectTasks = async (projectId: string): Promise<TaskData[]> => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data;
};

const deleteTask = async (taskId: string) => {
  return await api.delete(`/tasks/${taskId}`);
};

const ProjectDetailPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);

  const { data: project, isLoading: isLoadingProject, isError: isErrorProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectDetails(projectId!),
    enabled: !!projectId,
  });
  const { data: tasks, isLoading: isLoadingTasks, isError: isErrorTasks } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchProjectTasks(projectId!),
    enabled: !!projectId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Error al eliminar la tarea');
    },
  });

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteMutation.mutate(taskId);
    }
  };

  if (isLoadingProject) return <p className="p-8">Cargando proyecto...</p>;
  if (isErrorProject) return <p className="p-8 text-red-600">Error al cargar el proyecto.</p>;
  if (!project) return <p className="p-8">Proyecto no encontrado.</p>;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="mt-2 text-slate-600">{project.description || 'Sin descripción.'}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setIsCollabModalOpen(true)} className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm border border-slate-300 hover:bg-slate-50">
            Manejar Colaboradores
          </button>
          <button onClick={() => setIsCreateTaskModalOpen(true)} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700">
            Crear Tarea
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-800">Tareas</h2>
        {isLoadingTasks && <p className="mt-4">Cargando tareas...</p>}
        {isErrorTasks && <p className="mt-4 text-red-600">Error al cargar las tareas.</p>}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="rounded-lg bg-white p-4 shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-900">{task.name}</h3>
                    <div className="flex -space-x-1 overflow-hidden">
                      {task.assignees && task.assignees.length > 0 ? (
                        task.assignees.map(assignee => (
                          <span key={assignee.id} title={assignee.fullName} className="inline-flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white text-xs font-medium bg-slate-300 text-slate-700">
                            {assignee.fullName.substring(0, 1)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">Sin asignar</span>
                      )}
                    </div>
                  </div>
                  {task.description && <p className="mt-1 text-sm text-slate-600">{task.description}</p>}
                </div>

                <div className="mt-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-500 capitalize">{task.status}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      task.priority === 'alta' ? 'bg-red-100 text-red-800' :
                      task.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => setEditingTask(task)}
                      className="text-xs font-medium text-teal-600 hover:text-teal-500"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={deleteMutation.isPending && deleteMutation.variables === task.id}
                      className="text-xs font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !isLoadingTasks && <p className="text-slate-500 col-span-full">Este proyecto aún no tiene tareas.</p>
          )}
        </div>
      </div>
      
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        projectId={projectId!}
        projectData={project}
      />
      <ManageCollaboratorsModal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        project={project}
      />
      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          projectData={project}
          task={editingTask}
        />
      )}
    </>
  );
};

export default ProjectDetailPage;