import { Component } from 'solid-js';
type AppError = {
  message?: string;
  status?: number;
};

// You can export this as a shared error boundary too
const ErrorPage: Component<{ error: unknown }> = (props) => {
  const err = props.error as AppError;

  const message = err?.message ?? 'Something went wrong.';
  const status = err?.status ?? 500;

  return (
    <div class="mt-2 bg-red-100 text-red-700 p-3 rounded p-2 text-center">
      <h1 class="font-semibold">Error {status}</h1>
      <p>{message}</p>
    </div>
  );
};

export default ErrorPage;
