"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error?.message ?? "Erro ao cadastrar");
      return;
    }
    // auto-login
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card p-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-fg">
          <ShieldAlert size={20} />
        </div>
        <span className="text-xl font-bold">PeopleRisk</span>
      </div>
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <p className="mt-1 text-sm text-muted">Cadastre-se para acessar o painel.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Nome" value={form.name} onChange={(v) => set("name", v)} />
        <Field label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" />
        <Field label="Senha" value={form.password} onChange={(v) => set("password", v)} type="password" />
        <Field
          label="Confirmar senha"
          value={form.confirmPassword}
          onChange={(v) => set("confirmPassword", v)}
          type="password"
        />
        {error && <p className="text-sm text-risk-critical">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-fg disabled:opacity-60"
        >
          {loading ? "Cadastrando..." : "Cadastrar e entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
      />
    </div>
  );
}
