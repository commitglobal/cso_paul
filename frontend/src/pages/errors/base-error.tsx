import type { BaseErrorProps } from "@/pages/errors/error-props";

export default function BaseError({ code, title, message }: BaseErrorProps) {
  return (
    <div className="flex items-center justify-center h-full relative">
      <div className="absolute h-1/2 w-full top-0 bg-primary-dark z-[1]" />
      <div className="flex flex-col rounded-md shadow-md gap-2 w-full lg:max-w-3xl items-center justify-center pt-32 pb-24 bg-white z-20 my-6">
        <div className="font-amalia-medium text-3xl">{code}</div>
        <div className="font-amalia-bold text-black text-5xl">{title}</div>
        <div className="text-gray-500">{message}</div>
      </div>
    </div>
  );
}
