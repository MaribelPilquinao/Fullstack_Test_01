import React, { type InputHTMLAttributes } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, registration, error, ...rest }) => {
  return (
    <div className="w-full">
      <label
        htmlFor={registration.name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={registration.name}
        {...registration}
        {...rest}
        className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;