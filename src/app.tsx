// src/app.tsx
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
// The `api` object is used in your route components, not here for providing context.
// So, the import is not needed in this file.

export default function App() {
  // Create a new instance of QueryClient. This should only be created once.
  const queryClient = new QueryClient();

  return (
    // The QueryClientProvider from @tanstack/solid-query is the correct provider.
    // It makes the QueryClient available to all components, which the tRPC
    // client (`api`) will use automatically.
    <QueryClientProvider client={queryClient}>
      <Router
        root={props => (
          <MetaProvider>
            <Title>SolidStart - tRPC</Title>
            {/* Add a global stylesheet link */}
            <link
              href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
              rel="stylesheet"
            />
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </QueryClientProvider>
  );
}
