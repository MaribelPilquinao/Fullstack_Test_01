import React, { type SelectHTMLAttributes } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, registration, error, children, ...rest }) => {
  return (
    <div className="w-full">
      <label
        htmlFor={registration.name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <select
        id={registration.name}
        {...registration}
        {...rest}
        className={`mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;