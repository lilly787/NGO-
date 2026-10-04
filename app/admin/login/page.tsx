import { redirect } from "next/navigation";
import { signIn, isAdmin } from "@/lib/auth";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  async function login(f: FormData) {
    "use server";
    const result = await signIn(String(f.get("password")));
    if (result === true) redirect("/admin");
    redirect(`/admin/login?error=${result}`);
  }

  const messages = {
    password: "Password is incorrect.",
  };

  return (
    <main className="section shell">
      <h1>GSEI Admin</h1>
      <p>Sign in to manage News &amp; Stories and GSEI Voices.</p>
      {error && (
        <p className="danger" role="alert">
          {messages[error as keyof typeof messages] || "Unable to sign in."}
        </p>
      )}
      <form className="form" action={login}>
        <label>
          Password
          <input
            required
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </label>
        <button className="button primary">Sign in</button>
      </form>
    </main>
  );
}
