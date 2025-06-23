import { uniqueId } from 'lodash';

type FieldHelperTextProps = {
  errors?: string[] | string;
  hint?: string;
};

export function FieldHelperText({ errors, hint }: FieldHelperTextProps) {
  return (
    <div className='flex flex-col gap-y-0.5 text-sm text-gray-500'>
      {Array.isArray(errors) &&
        errors?.map((error) => (
          <div key={uniqueId()} className='text-error'>
            {error}
          </div>
        ))}
      {Boolean(errors) && !Array.isArray(errors) && (
        <div className='text-error'>{errors}</div>
      )}
      {!errors?.length && hint && <div>{hint}</div>}
    </div>
  );
}
