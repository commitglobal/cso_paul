import { type ChangeEvent } from 'react';

export function handleChange<TForm>(
  key: keyof TForm,
  setData: (key: keyof TForm, value: unknown) => void,
  clearErrors?: (key: keyof TForm) => void,
) {
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clearErrors?.(key);
    setData(key, event.target.value);
  };
}
