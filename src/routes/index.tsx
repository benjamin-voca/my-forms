// src/routes/index.tsx
import { createSignal } from "solid-js";

export default function Home() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isLogin, setIsLogin] = createSignal(true);
  const [error, setError] = createSignal("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setError("");

    const endpoint = isLogin() ? "/api/login" : "/api/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email(), password: password() }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      // Redirect or show logged-in state
      location.href = "/dashboard"; // or set a session state
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  }

  return (
    <main class="p-6 max-w-md mx-auto text-center">
      <h1 class="text-2xl font-bold mb-4">{isLogin() ? "Login" : "Sign Up"}</h1>

      <form onSubmit={handleSubmit} class="space-y-4">
        <input
          class="border p-2 w-full"
          type="email"
          placeholder="Email"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <input
          class="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          required
        />

        {error() && <div class="text-red-600">{error()}</div>}

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
          {isLogin() ? "Login" : "Sign Up"}
        </button>
      </form>

      <button
        class="mt-4 text-blue-700 underline"
        onClick={() => setIsLogin(!isLogin())}
      >
        {isLogin() ? "Create an account" : "Already have an account?"}
      </button>
    </main>
  );
};
