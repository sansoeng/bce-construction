import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { api, type Me, type Overview } from "./adminApi";
import { SCHEMAS } from "./adminSchemas";
import { publicSiteUrl } from "./adminUrls";
import { Badge, Banner, Button, Card, Stat, formatBytes, formatDate } from "./ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const serviceLabel: Record<string, string> = {
  ok: "Operational",
  bound: "Bound",
  enforced: "Enforced",
  not_enabled: "Not enabled",
  not_bound: "Not bound",
  dev_only: "Dev only",
};

const serviceTone = (value: string) => {
  if (value === "ok" || value === "bound" || value === "enforced") return "green" as const;
  if (value === "dev_only") return "amber" as const;
  return "red" as const;
};

const stagingSiteUrl = () =>
  location.hostname.startsWith("admin.") ? "https://staging.bce-construction.com/" : "/";

export default function Dashboard({ me, onNavigate }: { me: Me; onNavigate: (hash: string) => void }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  const load = async () => {
    setError("");
    try {
      setOverview(await api.overview());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the dashboard");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const publish = async () => {
    if (!overview?.pendingPublish) return;
    if (!window.confirm(`Push ${overview.pendingPublish} staged change${overview.pendingPublish === 1 ? "" : "s"} to production?`)) return;
    setBusy("publish");
    setError("");
    try {
      const result = await api.publishStaging();
      const bits = [
        result.published ? `${result.published} content` : "",
        result.settings ? "settings" : "",
        result.deleted ? `${result.deleted} removed` : "",
      ].filter(Boolean);
      toast.success(`Published ${bits.join(" · ") || "staging"}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy("");
    }
  };

  const revalidate = async () => {
    setBusy("revalidate");
    setError("");
    try {
      const result = await api.revalidate();
      toast.success(`Cache cleared. Production v${result.version}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revalidation failed");
    } finally {
      setBusy("");
    }
  };

  const restoreBundled = async () => {
    if (!window.confirm("Stage the bundled content snapshot? It stays on staging until you publish.")) return;
    setBusy("import");
    setError("");
    try {
      const response = await fetch("/content-seed.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Bundled snapshot not found. Run npm run content:export and redeploy.");
      const payload = (await response.json()) as { documents: { type: string; slug: string; sort: number; data: unknown }[] };
      const documents = payload.documents.filter((doc) => SCHEMAS[doc.type]);
      const result = await api.importContent(documents.map((doc) => ({ ...doc, status: "staged" })));
      toast.success(`Staged ${result.imported} bundled documents.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy("");
    }
  };

  if (!overview) {
    return error ? (
      <Banner tone="error">{error}</Banner>
    ) : (
      <div className="adm-page">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-md" />)}
        </div>
        <Skeleton className="h-72 rounded-md" />
      </div>
    );
  }

  const published = Object.values(overview.counts).reduce((n, row) => n + row.published, 0);
  const staged = Object.values(overview.counts).reduce((n, row) => n + row.staged, 0);
  const drafts = Object.values(overview.counts).reduce((n, row) => n + row.draft, 0);
  const newLeads = overview.leads.byStatus.new ?? 0;
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const chartData = Object.values(SCHEMAS).map((schema) => ({
    name: schema.label.replace(" pages", "").replace(" services", ""),
    live: overview.counts[schema.type]?.published ?? 0,
    staged: overview.counts[schema.type]?.staged ?? 0,
  }));
  const chartConfig = {
    live: { label: "Live", color: "#111111" },
    staged: { label: "Staged", color: "#293e8a" },
  } satisfies ChartConfig;

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <p className="adm-eyebrow">Overview <em>·</em> {today}</p>
          <h1 className="adm-title">Dashboard</h1>
        </div>
        <div className="adm-actions">
          <Button onClick={() => window.open(publicSiteUrl("/"), "_blank")}>Live site</Button>
          <Button onClick={() => window.open(stagingSiteUrl(), "_blank")}>Staging</Button>
          <Button variant="primary" onClick={() => void publish()} disabled={!overview.pendingPublish || Boolean(busy)}>
            {busy === "publish" ? "Publishing…" : `Publish${overview.pendingPublish ? ` (${overview.pendingPublish})` : ""}`}
          </Button>
        </div>
      </header>

      {error && <Banner tone="error">{error}</Banner>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat dark label="Published" value={published} hint={`${drafts} draft${drafts === 1 ? "" : "s"}`} />
        <Stat label="Staged" value={staged} hint="Waiting for production" />
        <Stat label="New leads" value={newLeads} hint={`${overview.leads.total} total`} />
        <Stat label="Media" value={overview.media.count} hint={formatBytes(overview.media.bytes)} />
      </div>

      <Card>
        <div className="adm-card-head">
          <h2 className="adm-card-title">Content by collection</h2>
          <span className="adm-card-meta">Live vs staged</span>
        </div>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={chartData} margin={{ left: -20, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="live" fill="var(--color-live)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="staged" fill="var(--color-staged)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Card>

      <Card>
        <div className="adm-card-head">
          <h2 className="adm-card-title">Services</h2>
          <span className="adm-card-meta">Free tier</span>
        </div>
        <div className="adm-list">
          {Object.entries(overview.services).map(([name, value]) => (
            <div key={name} className="adm-list-row">
              <span className="adm-list-title uppercase tracking-[.12em]">{name}</span>
              <Badge tone={serviceTone(value)}>{serviceLabel[value] ?? value}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="adm-card-head">
            <h2 className="adm-card-title">Recent activity</h2>
            <span className="adm-card-meta">Last 12</span>
          </div>
          {overview.recentAudit.length === 0 ? (
            <p className="adm-hint">No activity yet.</p>
          ) : (
            <div className="adm-list">
              {overview.recentAudit.map((item, index) => (
                <div key={item.id ?? index} className="adm-list-row">
                  <div className="adm-list-main">
                    <p className="adm-list-title">{item.action}</p>
                    <p className="adm-list-meta">{item.actor} · {item.resource_id ?? ""}</p>
                  </div>
                  <span className="adm-list-aside">{formatDate(item.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="adm-card-head">
            <h2 className="adm-card-title">Maintenance</h2>
            <span className="adm-card-meta">Settings · cache</span>
          </div>
          <div className="adm-actions">
            <Button onClick={() => void revalidate()} disabled={Boolean(busy)}>
              {busy === "revalidate" ? "Clearing…" : "Clear cache"}
            </Button>
            <Button onClick={() => void restoreBundled()} disabled={Boolean(busy)}>
              {busy === "import" ? "Staging…" : "Stage bundled content"}
            </Button>
            <Button onClick={() => onNavigate("#/settings")}>Settings</Button>
          </div>
          <p className="adm-hint mt-4">Signed in as {me.email}</p>
        </Card>
      </div>
    </div>
  );
}
