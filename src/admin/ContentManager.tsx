import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError, type ContentDoc, type ContentItem } from "./adminApi";
import { mergeTranslation } from "../contentStore";
import { SCHEMAS, slugifyTitle, type ContentSchema, type ContentSection, type Field } from "./adminSchemas";
import { publicSiteUrl } from "./adminUrls";
import { FieldEditor } from "./FieldEditor";
import { ContentPreview } from "./ContentPreview";
import { Badge, Banner, Button, Card, ConfirmDialog, EmptyState, Select, Spinner, TextInput, cx, formatDate } from "./ui";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type EditorState = {
  data: Record<string, unknown>;
  km: Record<string, unknown>;
  slug: string;
  status: "draft" | "staged";
  sort: number;
  originalSlug?: string;
  isNew: boolean;
  live: boolean;
  hasStage: boolean;
};

const PAGE_SIZE = 50;

const previewUrl = (type: string, slug: string) => {
  switch (type) {
    case "projects":
      return `/?project=${encodeURIComponent(slug)}`;
    case "posts":
      return `/?blog&post=${encodeURIComponent(slug)}`;
    case "vacancies":
      return `/?recruitment&job=${encodeURIComponent(slug)}`;
    case "businesses":
      return `/?business=${encodeURIComponent(slug)}`;
    default:
      return "/";
  }
};

const blankValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(blankValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, blankValue(item)]),
    );
  }
  return typeof value === "string" ? "" : value;
};

const blankTranslation = (data: Record<string, unknown>) => blankValue(data) as Record<string, unknown>;

/** Fill a partial Khmer object into the full English shape without losing existing translations. */
const fillTranslation = (base: unknown, overlay: unknown): unknown => {
  if (Array.isArray(base)) {
    const source = Array.isArray(overlay) ? overlay : [];
    return base.map((item, index) => fillTranslation(item, source[index]));
  }
  if (base && typeof base === "object") {
    const source = overlay && typeof overlay === "object" && !Array.isArray(overlay)
      ? (overlay as Record<string, unknown>)
      : {};
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(base as Record<string, unknown>)) {
      out[key] = fillTranslation((base as Record<string, unknown>)[key], source[key]);
    }
    for (const key of Object.keys(source)) {
      if (!(key in out)) out[key] = source[key];
    }
    return out;
  }
  return overlay === undefined || overlay === null ? base : overlay;
};

/** Only text-like fields appear in the Khmer form. */
const translatableFields = (fields: Field[]): Field[] =>
  fields.flatMap((field) => {
    if (field.locale === false) return [];
    if (["image", "select", "number", "boolean"].includes(field.type)) return [];
    if (field.type === "group") {
      const nested = translatableFields(field.fields ?? []);
      return nested.length ? [{ ...field, fields: nested }] : [];
    }
    if (field.type === "objectList") {
      const nested = translatableFields(field.itemFields ?? []);
      return nested.length ? [{ ...field, itemFields: nested }] : [];
    }
    return [field];
  });

const khmerFields = (schema: ContentSchema) =>
  translatableFields(schema.fields.filter((field) => !(schema.skipKm ?? []).includes(field.key)));

type FieldGroup = ContentSection & { fields: Field[] };

/** Split the visible fields into the schema's editor cards; anything unlisted closes in a "More fields" card. */
const groupFields = (fields: Field[], sections: ContentSection[]): FieldGroup[] => {
  const used = new Set<string>();
  const groups: FieldGroup[] = sections
    .map((section) => {
      const present = section.keys
        .map((key) => fields.find((field) => field.key === key))
        .filter((field): field is Field => Boolean(field));
      present.forEach((field) => used.add(field.key));
      return { ...section, fields: present };
    })
    .filter((group) => group.fields.length > 0);

  const rest = fields.filter((field) => !used.has(field.key));
  if (rest.length) groups.push({ id: "more", title: "More fields", keys: [], fields: rest });
  return groups;
};

const statusTone = (status: string) => {
  if (status === "published") return "green" as const;
  if (status === "staged") return "blue" as const;
  if (status === "deleted") return "red" as const;
  return "amber" as const;
};

export default function ContentManager({ type }: { type: string }) {
  const schema = SCHEMAS[type];
  const slugKey = schema?.slugKey ?? "slug";
  const titleKey = schema?.titleKey ?? "title";

  const [items, setItems] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [offset, setOffset] = useState(0);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [lang, setLang] = useState<"en" | "km">("en");
  const [activeSection, setActiveSection] = useState("");
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [confirmState, setConfirmState] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    destructive?: boolean;
    action: () => void;
  } | null>(null);
  const debounce = useRef<number | undefined>(undefined);

  const canReorder = statusFilter === "all" && !query.trim() && offset === 0;

  const load = useCallback(
    async (nextOffset = offset, append = false) => {
      if (!schema) return;
      setLoading(true);
      setError("");
      if (!append) setSelectedSlugs(new Set());
      try {
        const result = await api.listContent(type, { status: statusFilter, q: query.trim(), limit: PAGE_SIZE, offset: nextOffset });
        setItems((current) => (append ? [...current, ...result.items] : result.items));
        setTotal(result.total);
        setOffset(nextOffset);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load content");
      } finally {
        setLoading(false);
      }
    },
    [offset, query, schema, statusFilter, type],
  );

  useEffect(() => {
    setItems([]);
    setOffset(0);
    setEditor(null);
    setQuery("");
    setStatusFilter("all");
    void load(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (debounce.current) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => void load(0, false), 280);
    return () => {
      if (debounce.current) window.clearTimeout(debounce.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, statusFilter]);

  const openNew = () => {
    const data = schema.defaults();
    setEditor({
      data,
      km: blankTranslation(data),
      slug: schema?.singleton ? "home" : "",
      status: "staged",
      sort: items.length,
      isNew: true,
      live: false,
      hasStage: false,
    });
    setLang("en");
  };

  const openEdit = async (item: ContentItem) => {
    setError("");
    try {
      const doc = (await api.getContent(type, item.slug)) as ContentDoc;
      const data = doc.stageData ?? doc.data ?? {};
      const km = fillTranslation(blankTranslation(data), doc.stageKm ?? doc.km ?? {}) as Record<string, unknown>;
      setEditor({
        data,
        km,
        slug: doc.slug,
        status: doc.stageStatus === "draft" ? "draft" : "staged",
        sort: doc.sort,
        originalSlug: doc.slug,
        isNew: false,
        live: doc.status === "published",
        hasStage: doc.hasStage,
      });
      setLang("en");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open document");
    }
  };

  // Singletons (the homepage) open their one document straight away: there is no list to choose from.
  const autoOpened = useRef(false);
  useEffect(() => {
    autoOpened.current = false;
  }, [type]);
  useEffect(() => {
    if (!schema?.singleton || loading || editor || !items.length || autoOpened.current) return;
    autoOpened.current = true;
    void openEdit(items[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema?.singleton, loading, items, editor]);

  const save = async () => {
    if (!editor) return;
    setSaving(true);
    setError("");
    try {
      const fallback = slugifyTitle(String(editor.data[titleKey] ?? ""));
      const slug = (editor.slug.trim() || fallback).toLowerCase().replace(/[^a-z0-9-]/g, "-");
      if (slug.length < 2) throw new Error("Add a slug (at least 2 characters) before saving.");
      const data = { ...editor.data, [slugKey]: slug };

      if (!editor.isNew && editor.originalSlug) {
        await api.patchContent(type, editor.originalSlug, {
          slug,
          status: editor.status,
          sort: editor.sort,
          data,
          km: editor.km,
        });
      } else {
        await api.saveContent(type, { slug, status: editor.status, sort: editor.sort, data, km: editor.km });
      }

      setEditor({ ...editor, slug, data, isNew: false, originalSlug: slug, hasStage: true });
      toast.success(editor.status === "draft" ? "Saved as a draft on staging." : "Staged. Promote when ready.");
      await load(0, false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const promote = async () => {
    if (!editor?.originalSlug) return;
    if (!window.confirm("Push this staged update to production?")) return;
    setSaving(true);
    setError("");
    try {
      await api.promoteContent(type, editor.originalSlug);
      setEditor({ ...editor, hasStage: false, live: true });
      toast.success("Published to production.");
      await load(0, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Promote failed");
    } finally {
      setSaving(false);
    }
  };

  const promoteItem = async (item: ContentItem) => {
    const message = item.status === "deleted"
      ? `Apply the deletion of “${item.title}” to production?`
      : `Publish “${item.title}” to production?`;
    if (!window.confirm(message)) return;
    setError("");
    try {
      await api.promoteContent(type, item.slug);
      toast.success(item.status === "deleted" ? "Deletion published." : "Published to production.");
      await load(0, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Promote failed");
    }
  };

  const remove = (item: { slug: string; title: string; live?: boolean }) => {
    setConfirmState({
      title: `Delete “${item.title}”?`,
      description: item.live
        ? "The deletion is staged and will be applied on the next production publish."
        : "This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      action: () => {
        void (async () => {
          setError("");
          try {
            await api.deleteContent(type, item.slug);
            toast.success(item.live ? "Deletion staged for production." : "Deleted.");
            if (editor?.originalSlug === item.slug) setEditor(null);
            await load(0, false);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
          }
        })();
      },
    });
  };

  const duplicate = async (item: ContentItem) => {
    setError("");
    try {
      const result = await api.duplicateContent(type, item.slug);
      toast.success(`Duplicated as “${result.slug}” (draft).`);
      await load(0, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
    }
  };

  const move = async (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setReordering(true);
    try {
      await api.reorderContent(next.map((item, i) => ({ type, slug: item.slug, sort: i })));
      toast.success("Order staged.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reorder failed");
      await load(0, false);
    } finally {
      setReordering(false);
    }
  };

  const toggleOne = (slug: string, checked: boolean) => {
    setSelectedSlugs((current) => {
      const next = new Set(current);
      if (checked) next.add(slug);
      else next.delete(slug);
      return next;
    });
  };

  const allSelected = items.length > 0 && items.every((item) => selectedSlugs.has(item.slug));

  const toggleAll = (checked: boolean) => {
    setSelectedSlugs(checked ? new Set(items.map((item) => item.slug)) : new Set());
  };

  const bulkPromote = async () => {
    const chosen = items.filter((item) => selectedSlugs.has(item.slug) && item.hasStage && item.status !== "deleted");
    if (!chosen.length) {
      toast.info("Select a staged item to promote.");
      return;
    }
    setSaving(true);
    try {
      for (const item of chosen) await api.promoteContent(type, item.slug);
      toast.success(`Published ${chosen.length} item${chosen.length === 1 ? "" : "s"}.`);
      setSelectedSlugs(new Set());
      await load(offset, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk promote failed");
    } finally {
      setSaving(false);
    }
  };

  const bulkDelete = () => {
    const chosen = items.filter((item) => selectedSlugs.has(item.slug));
    if (!chosen.length) return;
    setConfirmState({
      title: `Delete ${chosen.length} item${chosen.length === 1 ? "" : "s"}?`,
      description: "Published items are removed on the next production publish. This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      action: () => {
        void (async () => {
          setError("");
          try {
            for (const item of chosen) await api.deleteContent(type, item.slug);
            toast.success(`Deleted ${chosen.length} item${chosen.length === 1 ? "" : "s"}.`);
            setSelectedSlugs(new Set());
            await load(offset, false);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Bulk delete failed");
          }
        })();
      },
    });
  };

  const title = useMemo(
    () => (editor?.isNew || !editor ? `New ${schema?.singular ?? "item"}` : String(editor.data[titleKey] ?? editor.slug)),
    [editor, schema, titleKey],
  );

  /** The cards in the current language, used by the tabbed editor (homepage). */
  const editorGroups = useMemo(() => {
    if (!schema) return [] as FieldGroup[];
    const fields = editor && lang === "km" ? khmerFields(schema) : schema.fields;
    return groupFields(fields, schema.sections);
  }, [schema, editor, lang]);
  const sectionKey = editorGroups.map((group) => group.id).join("|");

  useEffect(() => {
    if (!schema?.tabs) return;
    setActiveSection((current) =>
      editorGroups.some((group) => group.id === current) ? current : editorGroups[0]?.id ?? "",
    );
    // The group ids are enough to detect a language or field-set change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema?.tabs, sectionKey]);

  if (!schema) return <Banner tone="error">Unknown content type: {type}</Banner>;

  if (editor) {
    const activeData = lang === "en" ? editor.data : editor.km;
    const fields = lang === "en" ? schema.fields : khmerFields(schema);
    const groups = editorGroups;
    const activeGroup = groups.find((group) => group.id === activeSection) ?? groups[0];
    const activeIndex = Math.max(0, groups.findIndex((group) => group.id === activeGroup?.id));
    const previewData = lang === "en"
      ? editor.data
      : (mergeTranslation(editor.data, editor.km) as Record<string, unknown>);
    const setActive = (key: string, value: unknown) => {
      if (lang === "en") {
        setEditor({ ...editor, data: { ...editor.data, [key]: value } });
      } else {
        setEditor({ ...editor, km: { ...editor.km, [key]: value } });
      }
    };

    const changeLang = (next: "en" | "km") => {
      if (next === "km") {
        setEditor({
          ...editor,
          km: fillTranslation(blankTranslation(editor.data), editor.km) as Record<string, unknown>,
        });
      }
      setLang(next);
    };

    return (
      <div className="adm-page">
        <header className="adm-page-head">
          <div>
            {!schema.singleton && <button className="adm-back" onClick={() => setEditor(null)}>← Back to {schema.label}</button>}
            <p className="adm-eyebrow">Content <em>·</em> {schema.label}</p>
            <h1 className="adm-title adm-title--sm">{title || `New ${schema.singular}`}</h1>
            <p className="adm-sub">{editor.isNew ? "Unsaved" : editor.originalSlug}</p>
          </div>
          <div className="adm-actions">
            {editor.live && <Badge tone="green">Live</Badge>}
            {editor.hasStage && (
              <Badge tone={editor.status === "draft" ? "amber" : "blue"}>
                {editor.status === "draft" ? "Draft" : "Staged"}
              </Badge>
            )}
            <RadioGroup
              value={editor.status}
              onValueChange={(value) => setEditor({ ...editor, status: value as "draft" | "staged" })}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="draft" id="status-draft" />
                <Label htmlFor="status-draft" className="text-xs font-normal">Draft</Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="staged" id="status-staged" />
                <Label htmlFor="status-staged" className="text-xs font-normal">Staged</Label>
              </div>
            </RadioGroup>
            {editor.hasStage && (
              <Button onClick={() => void promote()} disabled={saving}>Promote</Button>
            )}
            <Button variant="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </header>

        {error && <Banner tone="error">{error}</Banner>}

        <div className="adm-editor">
          <div className="adm-editor-main">
            <div className="adm-editor-switch">
              <ToggleGroup
                type="single"
                value={lang}
                onValueChange={(value) => value && changeLang(value as "en" | "km")}
                className="adm-lang-toggle"
                aria-label="Language"
              >
                <ToggleGroupItem value="en">English</ToggleGroupItem>
                <ToggleGroupItem value="km">ខ្មែរ</ToggleGroupItem>
              </ToggleGroup>
              <p className="adm-editor-mode">
                {lang === "en" ? "Editing the English source" : "Editing the Khmer translation"}
              </p>
            </div>

            {schema.tabs && (
              <div className="adm-subtabs" role="tablist" aria-label={`${schema.label} sections`}>
                {groups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    role="tab"
                    aria-selected={activeGroup?.id === group.id}
                    className={cx("adm-subtab", activeGroup?.id === group.id && "is-active")}
                    onClick={() => setActiveSection(group.id)}
                  >
                    {group.title}
                  </button>
                ))}
              </div>
            )}

            {(schema.tabs && activeGroup ? [activeGroup] : groups).map((group) => (
              <Card key={`${lang}-${group.id}`} className="adm-section-card">
                <div className="adm-section-head">
                  <h2 className="adm-section-title">{group.title}</h2>
                  {group.hint && <p className="adm-section-hint">{group.hint}</p>}
                </div>
                <div className="adm-form-grid">
                  {group.fields.map((field) => (
                    <FieldEditor
                      key={`${lang}-${field.key}`}
                      field={field}
                      value={field.key === slugKey && lang === "en" ? editor.slug || activeData[slugKey] : activeData[field.key]}
                      onChange={(value) => {
                        if (field.key === slugKey && lang === "en") {
                          setEditor({ ...editor, slug: String(value ?? ""), data: { ...editor.data, [slugKey]: value } });
                        } else {
                          setActive(field.key, value);
                        }
                      }}
                    />
                  ))}
                </div>
              </Card>
            ))}

            {schema.tabs && groups.length > 1 && (
              <div className="adm-subtabs-nav">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={activeIndex <= 0}
                  onClick={() => setActiveSection(groups[activeIndex - 1].id)}
                >
                  ← Previous
                </Button>
                <span className="adm-subtabs-count">
                  {activeIndex + 1} / {groups.length}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={activeIndex >= groups.length - 1}
                  onClick={() => setActiveSection(groups[activeIndex + 1].id)}
                >
                  Next →
                </Button>
              </div>
            )}

            {lang === "km" && <p className="adm-hint">Empty Khmer fields fall back to English.</p>}

            <div className="adm-editor-footer">
              <p className="adm-hint">
                Saves stay on staging until you promote this {schema.singular.toLowerCase()} or publish staging.
              </p>
              {!editor.isNew && !schema.singleton && (
                <Button
                  variant="danger"
                  onClick={() =>
                    editor.originalSlug &&
                    remove({
                      slug: editor.originalSlug,
                      title: String(editor.data[titleKey] ?? editor.originalSlug),
                      live: editor.live,
                    })
                  }
                >
                  Delete
                </Button>
              )}
            </div>
          </div>

          <aside className="adm-editor-preview" aria-label="Live preview">
            <ContentPreview
              type={type}
              data={previewData}
              lang={lang}
              section={schema.tabs ? activeGroup?.id : undefined}
              sectionLabel={schema.tabs ? activeGroup?.title : undefined}
              href={publicSiteUrl(previewUrl(type, editor.slug))}
            />
          </aside>
        </div>

        <ConfirmDialog
          open={Boolean(confirmState)}
          title={confirmState?.title ?? ""}
          description={confirmState?.description ?? ""}
          confirmLabel={confirmState?.confirmLabel ?? "Continue"}
          destructive={confirmState?.destructive}
          onConfirm={() => { confirmState?.action(); setConfirmState(null); }}
          onOpenChange={(open) => !open && setConfirmState(null)}
        />
      </div>
    );
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <p className="adm-eyebrow">Content <em>·</em> {schema.label}</p>
          <h1 className="adm-title">{schema.label}</h1>
        </div>
        <div className="adm-actions">
          <Button onClick={() => void load(0, false)} disabled={loading}>Refresh</Button>
          {(!schema.singleton || items.length === 0) && <Button variant="primary" onClick={openNew}>+ New {schema.singular}</Button>}
        </div>
      </header>

      {error && <Banner tone="error">{error}</Banner>}

      <div className="adm-toolbar">
        <TextInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${schema.label.toLowerCase()}…`}
          className="max-w-xs"
        />
        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-36">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="staged">Staged</option>
          <option value="draft">Drafts</option>
          <option value="deleted">Deleted</option>
        </Select>
        <span className="adm-toolbar-count">{total} total</span>
        {selectedSlugs.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground">{selectedSlugs.size} selected</span>
            <Button size="sm" onClick={() => void bulkPromote()} disabled={saving}>Promote</Button>
            <Button size="sm" variant="danger" onClick={bulkDelete}>Delete</Button>
          </div>
        )}
        {reordering && <Spinner label="Reordering" />}
      </div>

      {loading && items.length === 0 ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-md" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title={`No ${schema.label.toLowerCase()} yet`}>
          Create the first one.
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={(checked) => toggleAll(Boolean(checked))} aria-label="Select all" />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSlugs.has(item.slug)}
                      onCheckedChange={(checked) => toggleOne(item.slug, Boolean(checked))}
                      aria-label={`Select ${item.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button className="adm-row-title text-left hover:underline" onClick={() => void openEdit(item)}>
                          {item.title}
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent align="start" className="w-80">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.excerpt || item.slug}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell><span className="font-mono text-xs text-muted-foreground">{item.slug}</span></TableCell>
                  <TableCell>
                    <span className="flex flex-wrap gap-1">
                      {item.live && <Badge tone="green">Live</Badge>}
                      {item.hasStage && item.status !== "deleted" && (
                        <Badge tone={item.status === "draft" ? "amber" : "blue"}>
                          {item.status === "draft" ? "Draft" : "Staged"}
                        </Badge>
                      )}
                      {item.status === "deleted" && <Badge tone="red">Deleted</Badge>}
                      {!item.live && !item.hasStage && <Badge tone="amber">Draft</Badge>}
                    </span>
                  </TableCell>
                  <TableCell><span className="text-xs text-muted-foreground">{formatDate(item.updatedAt)}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => void openEdit(item)}>Edit</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canReorder && (
                            <>
                              <DropdownMenuItem disabled={index === 0} onClick={() => void move(index, -1)}>Move up</DropdownMenuItem>
                              <DropdownMenuItem disabled={index === items.length - 1} onClick={() => void move(index, 1)}>Move down</DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {item.hasStage && <DropdownMenuItem onClick={() => void promoteItem(item)}>Promote</DropdownMenuItem>}
                          {!schema.singleton && <DropdownMenuItem onClick={() => void duplicate(item)}>Duplicate</DropdownMenuItem>}
                          {!schema.singleton && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => void remove(item)}>Delete</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {total > PAGE_SIZE && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => { event.preventDefault(); if (offset > 0) void load(Math.max(0, offset - PAGE_SIZE), false); }}
                className={offset === 0 ? "pointer-events-none opacity-40" : undefined}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive onClick={(event) => event.preventDefault()}>
                {Math.floor(offset / PAGE_SIZE) + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => { event.preventDefault(); if (offset + PAGE_SIZE < total) void load(offset + PAGE_SIZE, false); }}
                className={offset + PAGE_SIZE >= total ? "pointer-events-none opacity-40" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <ConfirmDialog
        open={Boolean(confirmState)}
        title={confirmState?.title ?? ""}
        description={confirmState?.description ?? ""}
        confirmLabel={confirmState?.confirmLabel ?? "Continue"}
        destructive={confirmState?.destructive}
        onConfirm={() => { confirmState?.action(); setConfirmState(null); }}
        onOpenChange={(open) => !open && setConfirmState(null)}
      />
    </div>
  );
}
