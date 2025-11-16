import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import Input from '../components/ui/Input';
import api from '../lib/api';
import { useAuthStore } from '../store/auth.store';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setApiError(null);

    try {
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data;
      setToken(token, user);
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setApiError(error.response.data.message);
      } else {
        setApiError('Un error inesperado ocurrió. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Inicia sesión en tu cuenta
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{apiError}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              registration={register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Tu contraseña"
              registration={register('password')}
              error={errors.password?.message}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/register"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;