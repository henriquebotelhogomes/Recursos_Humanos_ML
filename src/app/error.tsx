"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-bold">Algo deu errado</h2>
      <p className="text-sm text-muted">Ocorreu um erro ao carregar esta página.</p>
      <button onClick={reset} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg">
        Tentar novamente
      </button>
    </div>
  );
}
