import classNames from 'classnames';
import { ChangeEventHandler, FocusEventHandler, ReactNode } from 'react';
import { FieldHelperText } from './FieldHelperText';

type CheckboxProps = {
  checked?: boolean;
  errors?: string[] | string;
  label: ReactNode;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  required?: boolean;
};

export function Checkbox({
  checked,
  errors,
  label,
  name,
  onChange,
  onBlur,
  readOnly,
  required,
}: CheckboxProps) {
  const isError = (errors?.length ?? 0) > 0;

  return (
    <div>
      <div className='relative flex gap-x-3'>
        <div className='flex h-6 items-center'>
          <input
            checked={checked}
            id={name}
            name={name}
            onChange={onChange}
            type='checkbox'
            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 accent-primary-main'
            disabled={readOnly}
            onBlur={onBlur}
          />
        </div>
        <div className='text-sm leading-6'>
          <label
            htmlFor={name}
            className={classNames(
              'font-medium text-gray-900',
              isError && '!text-error',
            )}
          >
            {label}
            {required && <span className='text-red-500'>*</span>}
          </label>
        </div>
      </div>
      {Boolean(errors) && <FieldHelperText errors={errors} />}
    </div>
  );
}
