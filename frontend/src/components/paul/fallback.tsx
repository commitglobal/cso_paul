export function Fallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="flex flex-col mt-10 px-10">
      {error.message}
    </div>
  );
}
