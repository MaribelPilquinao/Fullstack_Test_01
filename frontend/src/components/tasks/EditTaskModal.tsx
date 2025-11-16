import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import { useState, useEffect } from 'react';
import { TaskStatus, TaskPriority } from '../../entities/Task';
import { type ProjectData, type TaskData } from '../../types';

const taskSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  assigneeIds: z.array(z.string()).optional(),
});

type TaskFormInputs = z.infer<typeof taskSchema>;

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: ProjectData;
  task: TaskData;
}

const updateTask = async ({ taskId, data }: { taskId: string; data: TaskFormInputs }) => {
  const response = await api.put(`/tasks/${taskId}`, data);
  return response.data;
};

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  projectData,
  task,
}) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task.name,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assigneeIds: task.assignees ? task.assignees.map(a => a.id) : [],
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        name: task.name,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assigneeIds: task.assignees ? task.assignees.map(a => a.id) : [],
      });
    }
  }, [task, reset]);

  const mutation = useMutation({
    mutationFn: (data: TaskFormInputs) => updateTask({ taskId: task.id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectData.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      onClose();
    },
    onError: (error: any) => {
      setApiError(error.response?.data?.message || 'Error al actualizar la tarea');
    },
  });

  const onSubmit: SubmitHandler<TaskFormInputs> = (data) => {
    setApiError(null);
    mutation.mutate(data);
  };

  const projectMembers = [
    projectData.owner,
    ...projectData.collaborators,
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Tarea">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {apiError && <p className="text-sm text-red-600">{apiError}</p>}
        
        <Input
          label="Nombre de la Tarea"
          type="text"
          registration={register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Descripción (Opcional)"
          type="text"
          registration={register('description')}
          error={errors.description?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Estado"
            registration={register('status')}
            error={errors.status?.message}
          >
            <option value={TaskStatus.PENDIENTE}>Pendiente</option>
            <option value={TaskStatus.EN_PROGRESO}>En Progreso</option>
            <option value={TaskStatus.COMPLETADA}>Completada</option>
          </Select>
          <Select
            label="Prioridad"
            registration={register('priority')}
            error={errors.priority?.message}
          >
            <option value={TaskPriority.BAJA}>Baja</option>
            <option value={TaskPriority.MEDIA}>Media</option>
            <option value={TaskPriority.ALTA}>Alta</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Asignar a:</label>
          <div className="mt-2 max-h-32 overflow-y-auto rounded-md border border-slate-300 p-2">
            <Controller
              name="assigneeIds"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {projectMembers.map((member) => (
                    <label key={member.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-teal-600 shadow-sm focus:ring-teal-500"
                        value={member.id}
                        checked={field.value?.includes(member.id)}
                        onChange={(e) => {
                          const id = member.id;
                          const isChecked = e.target.checked;
                          const currentValue = field.value || [];
                          if (isChecked) {
                            field.onChange([...currentValue, id]);
                          } else {
                            field.onChange(currentValue.filter((v) => v !== id));
                          }
                        }}
                      />
                      <span>{member.fullName} ({member.id === projectData.owner.id ? 'Dueño' : 'Colab'})</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 disabled:opacity-50">
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;