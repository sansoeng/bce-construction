import { useCallback, useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { api, type MediaItem } from "./adminApi";
import { uploadOptimisedImage } from "./mediaUtils";
import { Badge, Banner, Button, ConfirmDialog, EmptyState, Modal, TextInput, formatBytes, formatDate } from "./ui";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [bytes, setBytes] = useState(0);
  const [r2Enabled, setR2Enabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [uploadValue, setUploadValue] = useState(0);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [alt, setAlt] = useState("");
  const [name, setName] = useState("");
  const [confirmState, setConfirmState] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.listMedia({ limit: 100 });
      setItems(result.items);
      setTotal(result.total);
      setBytes(result.bytes);
      setR2Enabled(result.r2Enabled);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const uploadFiles = async (files: FileList | File[]) => {
    const list = [...files];
    if (!list.length) return;
    setUploading(true);
    setError("");
    let done = 0;
    for (const file of list) {
      setProgress(`Uploading ${done + 1} of ${list.length}: ${file.name}`);
      setUploadValue(Math.round((done / list.length) * 100));
      try {
        const result = await uploadOptimisedImage(file, api.uploadMedia);
        const saved = result.optimised.originalBytes - result.optimised.optimizedBytes;
        toast.success(
          `Uploaded ${list.length} file${list.length === 1 ? "" : "s"}. ` +
            (saved > 0 ? `Browser optimisation saved ${formatBytes(saved)} before upload.` : ""),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : `Could not upload ${file.name}`);
        break;
      }
      done += 1;
      setUploadValue(Math.round((done / list.length) * 100));
    }
    setProgress("");
    setUploading(false);
    await load();
  };

  const copy = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(new URL(item.url, location.origin).href);
      toast.success("URL copied to clipboard.");
    } catch {
      setError("Could not copy the URL. Open the image and copy it from the address bar.");
    }
  };

  const remove = (item: MediaItem) => {
    setConfirmState({
      title: `Delete ${item.name}?`,
      description: "Files already used on a page will break. This cannot be undone.",
      action: () => {
        void (async () => {
          setError("");
          try {
            await api.deleteMedia(item.key);
            toast.success("Media deleted.");
            setSelected(null);
            await load();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
          }
        })();
      },
    });
  };

  const saveMeta = async () => {
    if (!selected) return;
    setError("");
    try {
      await api.patchMedia(selected.key, { alt, name });
      toast.success("Media details saved.");
      setSelected(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const openEdit = (item: MediaItem) => {
    setSelected(item);
    setAlt(item.alt ?? "");
    setName(item.name);
  };

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <p className="adm-eyebrow">Operations <em>·</em> Media</p>
          <h1 className="adm-title">Media library</h1>
          <p className="adm-sub">{total} files · {formatBytes(bytes)} in R2</p>
        </div>
        <div className="adm-actions">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
            className="hidden"
            onChange={(event) => event.target.files && void uploadFiles(event.target.files)}
          />
          <Button variant="primary" onClick={() => inputRef.current?.click()} disabled={!r2Enabled || uploading}>
            {uploading ? "Uploading…" : "Upload files"}
          </Button>
        </div>
      </header>

      {!r2Enabled && (
        <Banner tone="warning">
          <strong>R2 is not enabled yet.</strong> Enable R2 once in the Cloudflare dashboard (Storage &amp; databases → R2),
          create a bucket named <code>bce-media</code>, then uncomment the R2 binding in <code>wrangler.toml</code> and
          redeploy. Everything else in the admin works without it.
        </Banner>
      )}
      {uploading && (
        <div className="grid gap-2 rounded-md border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">{progress}</p>
          <Progress value={uploadValue} />
        </div>
      )}
      {error && <Banner tone="error">{error}</Banner>}

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (r2Enabled && event.dataTransfer.files.length) void uploadFiles(event.dataTransfer.files);
        }}
        className="adm-dropzone"
      >
        <p className="adm-dropzone-title">Drop images or PDFs here</p>
        <p className="adm-dropzone-copy">JPEG · PNG · WebP · AVIF · PDF — 25 MB per file</p>
      </div>

      {loading && items.length === 0 ? (
        <div className="adm-media-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-56 w-full rounded-md" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No media yet">Upload the first image to start building the library.</EmptyState>
      ) : (
        <div className="adm-media-grid">
          {items.map((item) => (
            <ContextMenu key={item.key}>
              <ContextMenuTrigger asChild>
                <article className="adm-media">
                  <div className="adm-media-frame">
                    {item.content_type.startsWith("image/") ? (
                      <img src={item.url} alt={item.alt ?? item.name} loading="lazy" />
                    ) : (
                      <span className="font-mono text-[11px] uppercase tracking-[.14em] text-muted-foreground">PDF</span>
                    )}
                  </div>
                  <div className="adm-media-body">
                    <div className="flex items-start justify-between gap-2">
                      <p className="adm-media-name" title={item.name}>{item.name}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            aria-label="Media actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => void copy(item)}>Copy URL</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(item)}>Edit details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => void remove(item)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="adm-media-meta">
                      {formatBytes(item.size)}
                      {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
                    </p>
                    <p className="adm-media-meta">{formatDate(item.created_at)}</p>
                  </div>
                </article>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => void copy(item)}>Copy URL</ContextMenuItem>
                <ContextMenuItem onClick={() => openEdit(item)}>Edit details</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem className="text-destructive" onClick={() => void remove(item)}>Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
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

      <Modal open={Boolean(selected)} title="Media details" onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {selected.content_type.startsWith("image/") && (
                <img src={selected.url} alt="" className="h-24 w-24 rounded-[4px] object-cover" />
              )}
              <div>
                <p className="text-[15px] font-medium text-[color:var(--adm-ink)]">{selected.name}</p>
                <p className="adm-media-meta mt-1">{formatBytes(selected.size)} · {selected.content_type}</p>
                <p className="adm-slug mt-1">{selected.key}</p>
              </div>
            </div>
            <label className="adm-field">
              <span className="adm-label">Display name</span>
              <TextInput value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="adm-field">
              <span className="adm-label">Alt text</span>
              <TextInput value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="Describe the image for accessibility" />
            </label>
            <div className="adm-actions">
              <Button variant="primary" onClick={() => void saveMeta()}>Save</Button>
              <Button onClick={() => void copy(selected)}>Copy URL</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
