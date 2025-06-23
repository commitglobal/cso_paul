import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import {
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
  useState,
} from 'react';
import { FieldHelperText } from './FieldHelperText';
import { EyeIcon } from '@heroicons/react/24/outline';

export type InputFieldProps = {
  errors?: string[] | string;
  hint?: string;
  label: string;
  maxLength?: InputHTMLAttributes<HTMLInputElement>['maxLength'];
  min?: InputHTMLAttributes<HTMLInputElement>['min'];
  name: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: InputHTMLAttributes<HTMLInputElement>['placeholder'];
  readOnly?: InputHTMLAttributes<HTMLInputElement>['readOnly'];
  required?: InputHTMLAttributes<HTMLInputElement>['required'];
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  unit?: string;
  value?: InputHTMLAttributes<HTMLInputElement>['value'];
};

export function InputField({
  errors,
  hint,
  label,
  maxLength,
  min,
  name,
  onBlur,
  onChange,
  placeholder,
  readOnly,
  required,
  type = 'text',
  unit,
  value,
}: InputFieldProps) {
  const isError = (errors?.length ?? 0) > 0;
  const [internalType, setInternalType] = useState(type);

  return (
    <div className='flex flex-col gap-1 relative'>
      {label && (
        <label
          htmlFor={name}
          className='text-sm font-medium text-gray-700'
        >
          {label}
          {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      <div
        className={classNames(
          'flex items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-main pr-3 bg-white',
          { 'ring-red-300': isError },
          readOnly && '!bg-gray-100 focus-within:ring-gray-300',
        )}
      >
        <input
          autoComplete={name}
          className='block flex-1 border-0 bg-transparent py-2 px-3 text-black placeholder:text-gray-500 outline-0 text-sm'
          id={name}
          maxLength={maxLength}
          min={min}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          type={internalType}
          value={value}
        />

        {type === 'password' && (
          <button
            className={classNames(
              'hover:bg-gray-100 absolute p-1 rounded-full',
              isError ? 'right-8' : 'right-1',
            )}
            onClick={() =>
              setInternalType((prev) => (prev === type ? 'text' : type))
            }
            type='button'
          >
            <EyeIcon className='h-4 cursor-pointer' />
          </button>
        )}

        {isError && (
          <div className='h-2 w-5 flex items-center text-error'>
            <ExclamationCircleIcon />
          </div>
        )}
        {unit && <div className='text-sm text-gray-500 uppercase'>{unit}</div>}
      </div>
      {(Boolean(errors) || Boolean(hint)) && (
        <FieldHelperText errors={errors} hint={hint} />
      )}
    </div>
  );
}
