import { FileText, Library, Plus, Workflow } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "项目", icon: FileText },
  { to: "/create", label: "新建", icon: Plus },
  { to: "/skills", label: "Skills", icon: Library },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-10 w-56 border-r border-border bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Workflow className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-semibold">内容工厂</div>
            <div className="text-xs text-muted-foreground">口播稿工作台</div>
          </div>
        </div>
        <nav className="grid gap-1 p-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="ml-56 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
