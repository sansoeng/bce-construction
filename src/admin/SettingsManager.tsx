import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "./adminApi";
import { FieldEditor } from "./FieldEditor";
import { Banner, Button, Card, FieldShell, Spinner, TextArea, TextInput, Toggle } from "./ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Settings = Record<string, any>;

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"fields" | "json">("fields");

  useEffect(() => {
    (async () => {
      try {
        const result = await api.getSettings();
        setSettings(result.settings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (group: string, key: string, value: unknown) => {
    setSettings((current) => ({
      ...(current ?? {}),
      [group]: { ...((current?.[group] as Record<string, unknown>) ?? {}), [key]: value },
    }));
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setError("");
    try {
      await api.putSettings({
        site: settings.site ?? {},
        contact: settings.contact ?? {},
        seo: settings.seo ?? {},
        features: settings.features ?? {},
      });
      toast.success("Staged. Publish from the dashboard.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-10"><Spinner label="Loading settings" /></div>;
  if (!settings) return <Banner tone="error">{error || "Settings unavailable"}</Banner>;

  const site = settings.site ?? {};
  const contact = settings.contact ?? {};
  const seo = settings.seo ?? {};
  const features = settings.features ?? {};
  const phones = Array.isArray(contact.phones) ? contact.phones.join(", ") : String(contact.phones ?? "");

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <p className="adm-eyebrow">Operations <em>·</em> Settings</p>
          <h1 className="adm-title">Settings</h1>
        </div>
        <div className="adm-actions">
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Stage changes"}</Button>
        </div>
      </header>

      {error && <Banner tone="error">{error}</Banner>}

      <Tabs value={tab} onValueChange={(value) => setTab(value as "fields" | "json")} className="gap-4">
        <TabsList>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="json">Raw JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json">
        <Card>
          <FieldEditor
            field={{ key: "settings", label: "Settings JSON", type: "json", rows: 26, wide: true }}
            value={settings}
            onChange={(value) => setSettings((value && typeof value === "object" ? value : {}) as Settings)}
          />
        </Card>
        </TabsContent>

        <TabsContent value="fields">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="adm-card-head">
              <h2 className="adm-card-title">Company</h2>
              <span className="adm-card-meta">Identity</span>
            </div>
            <div className="flex flex-col gap-4">
              <FieldShell label="Legal name (English)"><TextInput value={site.nameEn ?? ""} onChange={(event) => update("site", "nameEn", event.target.value)} /></FieldShell>
              <FieldShell label="Legal name (Khmer)"><TextInput value={site.nameKm ?? ""} onChange={(event) => update("site", "nameKm", event.target.value)} /></FieldShell>
              <FieldShell label="Short name"><TextInput value={site.shortName ?? ""} onChange={(event) => update("site", "shortName", event.target.value)} /></FieldShell>
              <FieldShell label="Tagline"><TextInput value={site.tagline ?? ""} onChange={(event) => update("site", "tagline", event.target.value)} /></FieldShell>
              <FieldShell label="Founded"><TextInput type="number" value={site.founded ?? ""} onChange={(event) => update("site", "founded", Number(event.target.value) || undefined)} /></FieldShell>
            </div>
          </Card>

          <Card>
            <div className="adm-card-head">
              <h2 className="adm-card-title">Contact</h2>
              <span className="adm-card-meta">Public channels</span>
            </div>
            <div className="flex flex-col gap-4">
              <FieldShell label="Hotlines">
                <TextInput value={phones} onChange={(event) => update("contact", "phones", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} />
              </FieldShell>
              <FieldShell label="Email"><TextInput type="email" value={contact.email ?? ""} onChange={(event) => update("contact", "email", event.target.value)} /></FieldShell>
              <FieldShell label="Telegram"><TextInput value={contact.telegram ?? ""} onChange={(event) => update("contact", "telegram", event.target.value)} /></FieldShell>
              <FieldShell label="Address"><TextArea rows={3} value={contact.address ?? ""} onChange={(event) => update("contact", "address", event.target.value)} /></FieldShell>
              <FieldShell label="Operating hours"><TextInput value={contact.hours ?? ""} onChange={(event) => update("contact", "hours", event.target.value)} /></FieldShell>
            </div>
          </Card>

          <Card>
            <div className="adm-card-head">
              <h2 className="adm-card-title">SEO defaults</h2>
              <span className="adm-card-meta">Search &amp; social</span>
            </div>
            <div className="flex flex-col gap-4">
              <FieldShell label="Title"><TextInput value={seo.title ?? ""} onChange={(event) => update("seo", "title", event.target.value)} /></FieldShell>
              <FieldShell label="Description"><TextArea rows={4} value={seo.description ?? ""} onChange={(event) => update("seo", "description", event.target.value)} /></FieldShell>
              <FieldShell label="Open Graph image"><TextInput value={seo.ogImage ?? ""} onChange={(event) => update("seo", "ogImage", event.target.value)} /></FieldShell>
            </div>
          </Card>

          <Card>
            <div className="adm-card-head">
              <h2 className="adm-card-title">Feature flags</h2>
              <span className="adm-card-meta">Runtime</span>
            </div>
            <div className="flex flex-col gap-4">
              <Toggle checked={Boolean(features.leadsEnabled)} onChange={(value) => update("features", "leadsEnabled", value)} label="Accept website leads" />
              <Toggle checked={Boolean(features.aiAssistEnabled)} onChange={(value) => update("features", "aiAssistEnabled", value)} label="Enable Workers AI assist" />
              <Toggle checked={Boolean(features.mediaEnabled)} onChange={(value) => update("features", "mediaEnabled", value)} label="Enable media uploads" />
              <p className="adm-hint">
                These flags are returned by the public settings endpoint and can be used to hide features during maintenance.
              </p>
            </div>
          </Card>
        </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
