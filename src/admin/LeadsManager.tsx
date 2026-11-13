import { useCallback, useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { api, type Lead, type LeadDetail } from "./adminApi";
import { Badge, Banner, Button, ConfirmDialog, EmptyState, Modal, Select, TextArea, TextInput, formatDate } from "./ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const STATUSES = ["new", "contacted", "quoted", "won", "closed", "spam"] as const;
const PAGE_SIZE = 50;

const statusTone = (status: string) => {
  if (status === "new") return "blue" as const;
  if (status === "quoted") return "amber" as const;
  if (status === "won") return "green" as const;
  if (status === "spam" || status === "closed") return "slate" as const;
  return "slate" as const;
};

const csvEscape = (value: unknown) => {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export default function LeadsManager() {
  const [items, setItems] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<LeadDetail | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null);
  const debounce = useRef<number | undefined>(undefined);

  const load = useCallback(async (nextOffset = 0) => {
    setLoading(true);
    setError("");
    try {
      const result = await api.listLeads({ status, q: query.trim(), limit: PAGE_SIZE, offset: nextOffset });
      setItems(result.items);
      setTotal(result.total);
      setOffset(nextOffset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load leads");
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  useEffect(() => {
    if (debounce.current) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => void load(0), 250);
    return () => {
      if (debounce.current) window.clearTimeout(debounce.current);
    };
  }, [load]);

  const open = async (lead: Lead) => {
    setError("");
    try {
      const result = await api.getLead(lead.id);
      setSelected(result.lead);
      setNotes(result.lead.notes ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open lead");
    }
  };

  const saveLead = async (nextStatus?: string) => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      await api.patchLead(selected.id, { status: nextStatus ?? selected.status, notes });
      toast.success("Lead updated.");
      setSelected(null);
      await load(offset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update lead");
    } finally {
      setSaving(false);
    }
  };

  const remove = (lead: Lead) => {
    setConfirmState({
      title: `Delete “${lead.name || "this lead"}”?`,
      description: "This removes the lead permanently.",
      action: () => {
        void (async () => {
          setError("");
          try {
            await api.deleteLead(lead.id);
            toast.success("Lead deleted.");
            setSelected(null);
            await load(offset);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not delete lead");
          }
        })();
      },
    });
  };

  const exportCsv = () => {
    const columns = ["created_at", "status", "kind", "name", "phone", "email", "company", "service", "project", "location", "message", "notes"];
    const rows = [
      columns.join(","),
      ...items.map((lead) =>
        columns.map((column) => csvEscape((lead as unknown as Record<string, unknown>)[column])).join(","),
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `bce-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const quickStatus = async (lead: Lead, nextStatus: string) => {
    setError("");
    try {
      await api.patchLead(lead.id, { status: nextStatus });
      toast.success(`Marked ${nextStatus}.`);
      await load(offset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update lead");
    }
  };

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <p className="adm-eyebrow">Operations <em>·</em> Leads</p>
          <h1 className="adm-title">Leads</h1>
        </div>
        <div className="adm-actions">
          <Button onClick={exportCsv} disabled={!items.length}>Export CSV</Button>
          <Button onClick={() => void load(offset)} disabled={loading}>Refresh</Button>
        </div>
      </header>

      {error && <Banner tone="error">{error}</Banner>}

      <div className="adm-toolbar">
        <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone, email, project…" className="max-w-sm" />
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="w-40">
          <option value="all">All statuses</option>
          {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <span className="adm-toolbar-count">{total} total · showing {items.length}</span>
      </div>

      {loading && items.length === 0 ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-md" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No leads yet">New quote requests will appear here as soon as they are submitted.</EmptyState>
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Received</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell><span className="text-xs text-muted-foreground">{formatDate(lead.created_at)}</span></TableCell>
                  <TableCell>
                    <button className="text-sm font-medium hover:underline" onClick={() => void open(lead)}>
                      {lead.name || "Unnamed"}
                    </button>
                    <p className="mt-1 text-xs text-muted-foreground">{lead.phone || lead.email || "No contact"}</p>
                  </TableCell>
                  <TableCell><span className="font-mono text-xs text-muted-foreground">{lead.service || "—"}</span></TableCell>
                  <TableCell><p className="max-w-[34ch] truncate text-xs text-muted-foreground">{lead.message || lead.project || "—"}</p></TableCell>
                  <TableCell><Badge tone={statusTone(lead.status)}>{lead.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => void open(lead)}>Open</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            aria-label="Lead actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => void open(lead)}>Open lead</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => void quickStatus(lead, "contacted")}>Mark contacted</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => void quickStatus(lead, "quoted")}>Mark quoted</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => void quickStatus(lead, "won")}>Mark won</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => void remove(lead)}>Delete</DropdownMenuItem>
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
                onClick={(event) => { event.preventDefault(); if (offset > 0) void load(offset - PAGE_SIZE); }}
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
                onClick={(event) => { event.preventDefault(); if (offset + PAGE_SIZE < total) void load(offset + PAGE_SIZE); }}
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
        confirmLabel="Delete"
        destructive
        onConfirm={() => { confirmState?.action(); setConfirmState(null); }}
        onOpenChange={(open) => !open && setConfirmState(null)}
      />

      <Modal open={Boolean(selected)} title={selected ? `${selected.name || "Lead"} · ${selected.kind}` : "Lead"} onClose={() => setSelected(null)} wide>
        {selected && (
          <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail label="Phone" value={selected.phone} href={selected.phone ? `tel:${selected.phone.replace(/\s/g, "")}` : undefined} />
                <Detail label="Email" value={selected.email} href={selected.email ? `mailto:${selected.email}` : undefined} />
                <Detail label="Service" value={selected.service} />
                <Detail label="Project" value={selected.project} />
                <Detail label="Location" value={selected.location} />
                <Detail label="Received" value={formatDate(selected.created_at)} />
                <Detail label="Source" value={selected.source} />
                <Detail label="User agent" value={selected.user_agent} />
              </div>
              <div>
                <p className="adm-label">Message</p>
                <p className="mt-1 whitespace-pre-wrap rounded-[4px] border border-[color:var(--adm-line)] bg-[color:var(--adm-warm)] p-3 text-[13px] leading-[1.55] text-[color:var(--adm-ink)]">
                  {selected.message || "—"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="adm-label">Original payload</p>
                <pre className="adm-code mt-1 max-h-52 overflow-auto">
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(selected.payload ?? "{}"), null, 2);
                    } catch {
                      return selected.payload ?? "—";
                    }
                  })()}
                </pre>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <label className="adm-field">
                <span className="adm-label">Status</span>
                <Select value={selected.status} onChange={(event) => setSelected({ ...selected, status: event.target.value })}>
                  {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
                </Select>
              </label>
              <label className="adm-field">
                <span className="adm-label">Internal notes</span>
                <TextArea rows={8} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Call outcome, quoted amount, follow-up date…" />
              </label>
              <div className="adm-actions">
                <Button variant="primary" onClick={() => void saveLead()} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                <Button onClick={() => void saveLead("contacted")} disabled={saving}>Mark contacted</Button>
                <Button onClick={() => void saveLead("quoted")} disabled={saving}>Mark quoted</Button>
                <Button variant="danger" onClick={() => void remove(selected)}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value, href }: { label: string; value?: string; href?: string }) {
  return (
    <div>
      <p className="adm-label">{label}</p>
      {value ? (
        href ? <a className="text-[13px] text-[color:var(--adm-blue)] hover:underline" href={href}>{value}</a> : <p className="text-[13px] text-[color:var(--adm-ink)]">{value}</p>
      ) : (
        <p className="text-[13px] text-[color:var(--adm-faint)]">—</p>
      )}
    </div>
  );
}
