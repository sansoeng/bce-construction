import { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  Command as CommandIcon,
  ExternalLink,
  FileJson,
  FileText,
  FolderOpen,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  Newspaper,
  Search,
  Settings,
  ScrollText,
} from "lucide-react";
import { api, ApiError, type Me } from "./adminApi";
import { SCHEMAS } from "./adminSchemas";
import { publicSiteUrl } from "./adminUrls";
import ContentManager from "./ContentManager";
import Dashboard from "./Dashboard";
import LeadsManager from "./LeadsManager";
import MediaManager from "./MediaManager";
import SettingsManager from "./SettingsManager";
import AuditLog from "./AuditLog";
import { Button, Spinner, cn } from "./ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { buttonVariants } from "@/components/ui/button";
import "./admin.css";
import "./base.css";
import "./base-overrides.css";

const ADMIN_HOST = "admin.bce-construction.com";

const typeIcons = {
  homepage: Home,
  projects: FolderOpen,
  posts: Newspaper,
  vacancies: Briefcase,
  resources: FileText,
  businesses: Building2,
  offerings: Layers,
  pages: FileJson,
} as const;

const operationsNav = [
  { hash: "#/leads", label: "Leads", icon: Mail },
  { hash: "#/media", label: "Media", icon: ImageIcon },
  { hash: "#/settings", label: "Settings", icon: Settings },
  { hash: "#/audit", label: "Audit", icon: ScrollText },
];

export default function AdminApp() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<{ message: string; status?: number } | null>(null);
  const [hash, setHash] = useState(() => location.hash || "#/dashboard");
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onAdminHost =
      location.hostname === ADMIN_HOST || location.hostname.startsWith("admin.") || location.hostname === "localhost";
    if (!onAdminHost) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((identity) => setMe(identity))
      .catch((err: unknown) => {
        setAuthError({
          message: err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Could not reach the admin API",
          status: err instanceof ApiError ? err.status : undefined,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onHash = () => setHash(location.hash || "#/dashboard");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
    return (
      <div className="bce-admin adm-login-main">
        <Spinner label="Checking Cloudflare Access" />
      </div>
    );
  }

  if (!me) {
    return <LoginScreen error={authError} />;
  }

  const navigate = (next: string) => {
    location.hash = next.replace(/^#/, "");
    setCommandOpen(false);
  };

  const route = hash.replace(/^#\/?/, "");
  const [section, param] = route.split("/");
  const contentSchema = section === "content" && param ? SCHEMAS[param] : undefined;
  const breadcrumb =
    contentSchema?.label ??
    (section === "leads" ? "Leads" : section === "media" ? "Media" : section === "settings" ? "Settings" : section === "audit" ? "Audit" : "Dashboard");

  let page: React.ReactNode;
  if (contentSchema) {
    page = <ContentManager key={param} type={param} />;
  } else if (section === "leads") {
    page = <LeadsManager />;
  } else if (section === "media") {
    page = <MediaManager />;
  } else if (section === "settings") {
    page = <SettingsManager />;
  } else if (section === "audit") {
    page = <AuditLog />;
  } else {
    page = <Dashboard me={me} onNavigate={navigate} />;
  }

  const signOut = () => {
    window.location.href = "/cdn-cgi/access/logout";
  };

  const staging = () =>
    location.hostname.startsWith("admin.") ? "https://staging.bce-construction.com/" : "/";

  const navProps = { me, hash, section, param, navigate };

  return (
    <div className="bce-admin">
      <div className="adm-shell">
          <aside className="adm-sidebar" aria-label="Admin navigation">
            <SidebarInner {...navProps} />
          </aside>

          <div className="adm-body">
            <header className="adm-topbar">
              <div className="flex min-w-0 items-center gap-2">
                <Breadcrumb className="hidden md:block">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#/dashboard" onClick={(event) => { event.preventDefault(); navigate("#/dashboard"); }}>
                        BCE
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#/dashboard" onClick={(event) => { event.preventDefault(); navigate("#/dashboard"); }}>
                        Operations
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <span className="truncate text-sm font-medium md:hidden">{breadcrumb}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCommandOpen(true)} className="gap-2 text-muted-foreground">
                  <Search className="size-4" />
                  <span className="hidden sm:inline">Search</span>
                  <span className="ml-1 hidden rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline">⌘K</span>
                </Button>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => window.open(publicSiteUrl("/"), "_blank")}>
                  Live site <ExternalLink className="size-3.5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-accent"
                      aria-label="Account menu"
                    >
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
                          {me.email.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel>
                      <p className="truncate text-sm">{me.email}</p>
                      <p className="text-xs font-normal text-muted-foreground">Cloudflare Access · {me.role}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.open(publicSiteUrl("/"), "_blank")}>
                      <ExternalLink className="size-4" /> View live site
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(staging(), "_blank")}>
                      <ExternalLink className="size-4" /> View staging
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("#/settings")}>
                      <Settings className="size-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="size-4" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            <main className="adm-main">{page}</main>
          </div>
        </div>

        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder="Search content and operations…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Content">
              {Object.values(SCHEMAS).map((schema) => {
                const Icon = typeIcons[schema.type as keyof typeof typeIcons] ?? FileText;
                return (
                  <CommandItem key={schema.type} value={schema.label} onSelect={() => navigate(`#/content/${schema.type}`)}>
                    <Icon className="size-4" />
                    {schema.label}
                    <CommandShortcut>{schema.type}</CommandShortcut>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Operations">
              {operationsNav.map((item) => (
                <CommandItem key={item.hash} value={item.label} onSelect={() => navigate(item.hash)}>
                  <item.icon className="size-4" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick actions">
              <CommandItem value="Dashboard" onSelect={() => navigate("#/dashboard")}>
                <LayoutDashboard className="size-4" /> Dashboard
              </CommandItem>
              <CommandItem value="View live site" onSelect={() => window.open(publicSiteUrl("/"), "_blank")}>
                <ExternalLink className="size-4" /> View live site
              </CommandItem>
              <CommandItem value="View staging" onSelect={() => window.open(staging(), "_blank")}>
                <CommandIcon className="size-4" /> View staging
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        <Toaster position="bottom-right" richColors closeButton />
      </div>
  );
}

function SidebarInner({
  me,
  hash,
  section,
  param,
  navigate,
}: {
  me: Me;
  hash: string;
  section: string;
  param?: string;
  navigate: (next: string) => void;
}) {
  return (
    <>
      <div className="adm-sidebar-brand">
        <a href="#/dashboard" className="adm-wordmark" onClick={(event) => { event.preventDefault(); navigate("#/dashboard"); }}>
          BCE
          <small>Operations</small>
        </a>
        <span className="adm-brand-mark" aria-hidden>OPS</span>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav className="adm-nav">
          <p className="adm-nav-label">Overview</p>
          <NavLink href="#/dashboard" label="Dashboard" icon={LayoutDashboard} active={hash === "#/dashboard"} onClick={() => navigate("#/dashboard")} />

          <p className="adm-nav-label">Content</p>
          {Object.values(SCHEMAS).map((schema) => {
            const Icon = typeIcons[schema.type as keyof typeof typeIcons] ?? FileText;
            return (
              <NavLink
                key={schema.type}
                href={`#/content/${schema.type}`}
                label={schema.label}
                icon={Icon}
                active={section === "content" && param === schema.type}
                onClick={() => navigate(`#/content/${schema.type}`)}
              />
            );
          })}

          <p className="adm-nav-label">Operations</p>
          {operationsNav.map((item) => (
            <NavLink key={item.hash} href={item.hash} label={item.label} icon={item.icon} active={hash === item.hash} onClick={() => navigate(item.hash)} />
          ))}
        </nav>
      </ScrollArea>

      <div className="adm-sidebar-foot">
        <div className="flex items-center gap-3">
          <Avatar className="size-8 border border-white/15">
            <AvatarFallback className="bg-white/10 text-[10px] text-white">{me.email.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="adm-user-email" title={me.email}>{me.email}</p>
            <p className="adm-user-role">Cloudflare Access · {me.role}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={(event) => { event.preventDefault(); onClick(); }}
      className={cn("adm-nav-link", active && "is-active")}
      aria-current={active ? "page" : undefined}
    >
      <span className="adm-nav-icon" aria-hidden><Icon className="size-4" /></span>
      {label}
    </a>
  );
}

function LoginScreen({ error }: { error: { message: string; status?: number } | null }) {
  const onAdminHost =
    location.hostname === ADMIN_HOST || location.hostname.startsWith("admin.") || location.hostname === "localhost";
  const loginUrl = `/cdn-cgi/access/login?redirect_url=${encodeURIComponent(location.href)}`;

  return (
    <div className="bce-admin adm-login">
      <aside className="adm-login-aside">
        <div className="adm-wordmark">
          BCE
          <small>Operations</small>
        </div>
        <div>
          <p className="adm-login-kicker">Content · Leads · Media</p>
          <h1 className="adm-login-title">Build the site from one quiet place.</h1>
        </div>
        <p className="adm-login-foot">Battambang Construction and Engineering Co., Ltd.<br />bce-construction.com</p>
      </aside>

      <main className="adm-login-main">
        <div className="adm-login-card">
          <p className="adm-eyebrow">Cloudflare Access <em>·</em> Admin</p>
          <h2 className="adm-login-form-title">Sign in to BCE Operations</h2>

          {error && <div className="mt-5"><AdmError message={error.message} /></div>}

          {onAdminHost ? (
            <>
              <p className="adm-login-form-copy">Use the email on the BCE allowlist. We will send a one-time code.</p>
              <a href={loginUrl} className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}>
                Sign in with Cloudflare Access
              </a>
              <p className="adm-login-foot">Sessions last 24 hours.</p>
            </>
          ) : (
            <>
              <p className="adm-login-form-copy">Open the Access-protected console to sign in.</p>
              <a href={`https://${ADMIN_HOST}/`} className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}>
                Open admin.bce-construction.com
              </a>
            </>
          )}

          <div className="adm-login-foot">BCE Operations · Cloudflare Access</div>
        </div>
      </main>
    </div>
  );
}

function AdmError({ message }: { message: string }) {
  return <div className="rounded-[12px] bg-[var(--base-red-50)] px-4 py-3 text-sm leading-5 text-[var(--base-red-700)]">{message}</div>;
}
