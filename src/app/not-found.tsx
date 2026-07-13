import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-3xl font-bold">404</h2>
      <p className="text-sm text-muted">Página não encontrada.</p>
      <Link href="/" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg">
        Voltar ao início
      </Link>
    </div>
  );
}
