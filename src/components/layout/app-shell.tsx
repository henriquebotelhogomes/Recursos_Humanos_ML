"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LayoutDashboard, Users, Lightbulb, Table2, Settings, LogOut, Menu, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { ThemeToggle } from "./theme-toggle";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Profissionais", icon: Users },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/dataset", label: "Dataset", icon: Table2 },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              active ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface hover:text-fg"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-surface p-4 lg:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-fg">
            <ShieldAlert size={18} />
          </div>
          <span className="text-lg font-bold">{site.name}</span>
        </div>
        <NavLinks />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:text-fg"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-surface p-4">
            <div className="mb-6 flex items-center justify-between px-2">
              <span className="text-lg font-bold">{site.name}</span>
              <button onClick={() => setOpen(false)} aria-label="Fechar menu">
                <X size={20} />
              </button>
            </div>
            <NavLinks />
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted"
            >
              <LogOut size={18} /> Sair
            </button>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/80 px-4 py-3 backdrop-blur lg:px-8">
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <div className="hidden text-sm font-medium text-muted lg:block">
            People Analytics · Risco de Attrition
          </div>
          <ThemeToggle />
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
