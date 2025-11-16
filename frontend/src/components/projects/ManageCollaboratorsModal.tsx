import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useDebounce } from '../../hooks/useDebounce';
import Modal from '../ui/Modal';
import { type ProjectData, type User } from '../../types';

const searchUsers = async (query: string): Promise<User[]> => {
  if (!query) return [];
  const { data } = await api.get(`/users/search?q=${query}`);
  return data;
};

const addCollaborator = async ({ projectId, userId }: { projectId: string; userId: string }) => {
  return await api.post(`/projects/${projectId}/collaborators`, { userId });
};

const removeCollaborator = async ({ projectId, userId }: { projectId: string; userId: string }) => {
  return await api.delete(`/projects/${projectId}/collaborators/${userId}`);
};

interface ManageCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
}

const ManageCollaboratorsModal: React.FC<ManageCollaboratorsModalProps> = ({ isOpen, onClose, project }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const queryClient = useQueryClient();

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['userSearch', debouncedSearchQuery],
    queryFn: () => searchUsers(debouncedSearchQuery),
    enabled: !!debouncedSearchQuery,
  });

  const addMutation = useMutation({
    mutationFn: addCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
    },
  });

  const handleAddCollaborator = (userId: string) => {
    addMutation.mutate({ projectId: project.id, userId });
  };

  const handleRemoveCollaborator = (userId: string) => {
    removeMutation.mutate({ projectId: project.id, userId });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manejar Colaboradores">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Añadir Colaborador</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por email o nombre..."
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
          <div className="mt-2 max-h-32 overflow-y-auto">
            {isSearching && <p className="text-sm text-slate-500">Buscando...</p>}
            {searchResults && searchResults.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 hover:bg-slate-100">
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => handleAddCollaborator(user.id)}
                  disabled={addMutation.isPending}
                  className="rounded bg-teal-600 px-2 py-1 text-xs text-white hover:bg-teal-700"
                >
                  Añadir
                </button>
              </div>
            ))}
          </div>
          {addMutation.isError && <p className="text-sm text-red-600">{(addMutation.error as any).response?.data?.message}</p>}
        </div>

        <div>
          <h4 className="font-medium text-slate-800">Colaboradores Actuales</h4>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-medium">{project.owner.fullName}</p>
                <p className="text-sm text-slate-500">{project.owner.email}</p>
              </div>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">Dueño</span>
            </div>
            
            {project.collaborators.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2">
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => handleRemoveCollaborator(user.id)}
                  disabled={removeMutation.isPending}
                  className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))}
            {removeMutation.isError && <p className="text-sm text-red-600">{(removeMutation.error as any).response?.data?.message}</p>}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ManageCollaboratorsModal;