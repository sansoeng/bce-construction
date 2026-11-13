import { useCallback, useEffect, useState } from "react";
import { api, type AuditItem } from "./adminApi";
import { Banner, Button, EmptyState, formatDate } from "./ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 50;

export default function AuditLog() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (nextOffset = 0) => {
    setLoading(true);
    setError("");
    try {
      const result = await api.listAudit({ limit: PAGE_SIZE, offset: nextOffset });
      setItems(result.items);
      setTotal(result.total);
      setOffset(nextOffset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the audit log");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(0);
  }, [load]);

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <p className="adm-eyebrow">Operations <em>·</em> Audit</p>
          <h1 className="adm-title">Audit log</h1>
          <p className="adm-sub">Admin writes · 180 days</p>
        </div>
        <div className="adm-actions">
          <Button onClick={() => void load(offset)} disabled={loading}>Refresh</Button>
        </div>
      </header>

      {error && <Banner tone="error">{error}</Banner>}

      {loading && items.length === 0 ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No activity yet">Admin changes will be listed here.</EmptyState>
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id ?? `${item.created_at}-${index}`}>
                  <TableCell><span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span></TableCell>
                  <TableCell><span className="text-xs">{item.actor}</span></TableCell>
                  <TableCell><span className="font-mono text-xs">{item.action}</span></TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.resource_type}{item.resource_id ? ` · ${item.resource_id}` : ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[42ch] truncate text-xs text-muted-foreground" title={item.detail}>
                      {item.detail ?? "—"}
                    </p>
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
    </div>
  );
}
