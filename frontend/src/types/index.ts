export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  owner: User;
  collaborators: User[];
}

export interface TaskData {
  id: string;
  name: string;
  description: string | null;
  status: 'pendiente' | 'en progreso' | 'completada';
  priority: 'baja' | 'media' | 'alta';
  assignees: User[];
}