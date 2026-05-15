import type { PropsWithChildren } from "react";

export function Panel({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <section className={`rounded-lg border border-border bg-white shadow-panel ${className}`}>{children}</section>;
}

export function PanelHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-border px-5 py-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
