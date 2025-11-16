import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import api from '../../lib/api';
import { type ProjectData } from '../../types';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const projectSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  description: z.string().optional(),
});

type ProjectFormInputs = z.infer<typeof projectSchema>;

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
}

const updateProject = async ({ projectId, data }: { projectId: string, data: ProjectFormInputs }) => {
  const response = await api.put(`/projects/${projectId}`, data);
  return response.data;
};

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInputs>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || '',
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description || '',
      });
    }
  }, [project, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProjectFormInputs) => updateProject({ projectId: project.id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      onClose();
    },
    onError: (error: any) => {
      setApiError(error.response?.data?.message || 'Error al actualizar el proyecto');
    },
  });

  const onSubmit: SubmitHandler<ProjectFormInputs> = (data) => {
    setApiError(null);
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Proyecto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {apiError && <p className="text-sm text-red-600">{apiError}</p>}
        <Input
          label="Nombre del Proyecto"
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

export default EditProjectModal;