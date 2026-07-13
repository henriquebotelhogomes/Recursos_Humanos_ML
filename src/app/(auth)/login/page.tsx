"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email ou senha inválidos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  function fillDemo() {
    setEmail("demo123");
    setPassword("demo123");
  }

  return (
    <div className="card p-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-fg">
          <ShieldAlert size={20} />
        </div>
        <span className="text-xl font-bold">PeopleRisk</span>
      </div>
      <h1 className="text-2xl font-bold">Entrar</h1>
      <p className="mt-1 text-sm text-muted">Acesse o painel de People Analytics.</p>

      <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
        <p className="font-medium">Acesso demo</p>
        <p className="text-muted">demo123 / demo123</p>
        <button onClick={fillDemo} type="button" className="mt-1 text-sm font-medium text-primary hover:underline">
          Preencher automaticamente
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            placeholder="voce@empresa.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-risk-critical">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-fg disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
