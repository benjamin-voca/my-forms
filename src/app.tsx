import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Suspense } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import ErrorPage from "./routes/error";
import './app.css'

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={(err) => <ErrorPage error={err} />}>
        <Router
          root={(props) => (
            <MetaProvider>
              <Title>SolidStart - tRPC</Title>
              {/* Global stylesheet */}
              <Suspense>{props.children}</Suspense>
            </MetaProvider>
          )}
        >
          <FileRoutes />
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
