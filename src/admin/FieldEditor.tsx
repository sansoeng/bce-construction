import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { api } from "./adminApi";
import { uploadOptimisedImage } from "./mediaUtils";
import type { Field } from "./adminSchemas";
import { Banner, Button, FieldShell, Select, TextArea, TextInput, Toggle, cx } from "./ui";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const pretty = (value: unknown) => {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
};

const blankFor = (fields: Field[] = []): Record<string, unknown> => {
  const item: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "select") item[field.key] = field.options?.[0] ?? "";
    else if (field.type === "boolean") item[field.key] = false;
    else if (field.type === "list" || field.type === "objectList") item[field.key] = [];
    else if (field.type === "group") item[field.key] = blankFor(field.fields);
    else if (field.type === "json") item[field.key] = {};
    else item[field.key] = "";
  }
  return item;
};

function JsonEditor({ value, onChange, rows }: { value: unknown; onChange: (value: unknown) => void; rows?: number }) {
  const [text, setText] = useState(() => pretty(value));
  const [error, setError] = useState("");
  const lastEmitted = useRef<string>("");

  useEffect(() => {
    const next = pretty(value);
    if (lastEmitted.current && lastEmitted.current === next) return;
    setText((current) => {
      try {
        return JSON.stringify(JSON.parse(current)) === JSON.stringify(value) ? current : next;
      } catch {
        return next;
      }
    });
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <TextArea
        value={text}
        rows={rows ?? 12}
        spellCheck={false}
        className="font-mono text-xs leading-relaxed"
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          try {
            const parsed = JSON.parse(next);
            lastEmitted.current = pretty(parsed);
            setError("");
            onChange(parsed);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid JSON");
          }
        }}
      />
      <span className={cx("text-xs", error ? "text-[var(--base-negative)]" : "text-[var(--base-positive)]")}>
        {error ? `Invalid JSON — ${error}` : "Valid JSON"}
      </span>
    </div>
  );
}

function ImageInput({ value, onChange, aspect }: { value: unknown; onChange: (value: unknown) => void; aspect?: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const url = typeof value === "string" ? value : "";

  const choose = async (file?: File) => {
    if (!file) return;
    setError("");
    setSaved("");
    setUploading(true);
    try {
      const result = await uploadOptimisedImage(file, api.uploadMedia);
      onChange(result.url);
      setSaved(
        `Uploaded ${result.optimised.name} (${Math.round(result.optimised.originalBytes / 1024)} KB → ${Math.round(result.optimised.optimizedBytes / 1024)} KB)`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <TextInput value={url} placeholder="/Image/bce/... or /api/media/..." onChange={(event) => onChange(event.target.value)} />
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(event) => choose(event.target.files?.[0])} />
        <Button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? "Optimising…" : "Upload"}
        </Button>
      </div>
      {saved && <span className="text-xs text-[var(--base-positive)]">{saved}</span>}
      {error && <Banner tone="error">{error}</Banner>}
      {url && (
        <figure className="adm-image-preview">
          <div className={`adm-image-frame${aspect ? "" : " is-natural"}`} style={aspect ? { aspectRatio: aspect } : undefined}>
            <img src={url} alt="" loading="lazy" />
          </div>
          <figcaption className="adm-image-meta">
            <span>{aspect ? `Site frame · ${aspect.replace(/\s/g, "")}` : "Natural size"}</span>
            <a href={url} target="_blank" rel="noopener noreferrer">Open image ↗</a>
          </figcaption>
        </figure>
      )}
    </div>
  );
}

export function FieldEditor({ field, value, onChange }: { field: Field; value: unknown; onChange: (value: unknown) => void }) {
  if (field.type === "group") {
    const object = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
    return (
      <div className="adm-subcard adm-span-2">
        {field.label && <p className="adm-label mb-3">{field.label}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {(field.fields ?? []).map((sub) => (
            <FieldEditor
              key={sub.key}
              field={sub}
              value={object[sub.key]}
              onChange={(next) => onChange({ ...object, [sub.key]: next })}
            />
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "objectList") {
    const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    const update = (index: number, next: Record<string, unknown>) => {
      const copy = [...items];
      copy[index] = next;
      onChange(copy);
    };
    return (
      <div className="flex flex-col gap-2 adm-span-2">
        <div className="flex items-center justify-between">
          <span className="adm-label">{field.label}</span>
          <Button type="button" size="sm" onClick={() => onChange([...items, blankFor(field.itemFields)])}>+ Add {field.itemLabel ?? "item"}</Button>
        </div>
        {items.length === 0 && <p className="adm-hint rounded-[4px] border border-dashed border-[color:var(--adm-line)] px-3 py-4">No items yet.</p>}
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <Collapsible key={index} defaultOpen={index === 0} className="adm-item">
              <div className="adm-item-head">
                <CollapsibleTrigger asChild>
                  <Button type="button" size="sm" variant="ghost" className="group gap-2 px-1">
                    <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                    <span className="adm-item-title">{field.itemLabel ?? "Item"} {index + 1}</span>
                  </Button>
                </CollapsibleTrigger>
                <div className="adm-item-actions">
                  <Button type="button" size="sm" variant="ghost" disabled={index === 0} onClick={() => {
                    const copy = [...items];
                    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
                    onChange(copy);
                  }}>↑</Button>
                  <Button type="button" size="sm" variant="ghost" disabled={index === items.length - 1} onClick={() => {
                    const copy = [...items];
                    [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
                    onChange(copy);
                  }}>↓</Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => onChange(items.filter((_, i) => i !== index))}>Remove</Button>
                </div>
              </div>
              <CollapsibleContent>
                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  {(field.itemFields ?? []).map((sub) => (
                    <FieldEditor
                      key={sub.key}
                      field={sub}
                      value={item[sub.key]}
                      onChange={(next) => update(index, { ...item, [sub.key]: next })}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "list") {
    const items = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="flex flex-col gap-2 adm-span-2">
        <span className="adm-label">{field.label}</span>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <TextInput
                value={item}
                onChange={(event) => {
                  const copy = [...items];
                  copy[index] = event.target.value;
                  onChange(copy);
                }}
              />
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange(items.filter((_, i) => i !== index))}>✕</Button>
            </div>
          ))}
        </div>
        <div>
          <Button type="button" size="sm" onClick={() => onChange([...items, ""])}>+ Add line</Button>
        </div>
      </div>
    );
  }

  if (field.type === "json") {
    return (
      <div className="flex flex-col gap-1.5 adm-span-2">
        <span className="adm-label">{field.label}</span>
        <JsonEditor value={value} onChange={onChange} rows={field.rows} />
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="flex flex-col gap-1.5 adm-span-2">
        <span className="adm-label">{field.label}</span>
        <Toggle checked={Boolean(value)} onChange={onChange} label={Boolean(value) ? "On" : "Off"} />
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <FieldShell label={field.label} required={field.required} wide={field.wide ?? true}>
        <ImageInput value={value} onChange={onChange} aspect={field.aspect} />
      </FieldShell>
    );
  }

  if (field.type === "select") {
    return (
      <FieldShell label={field.label} required={field.required} wide={field.wide}>
        <Select value={String(value ?? field.options?.[0] ?? "")} onChange={(event) => onChange(event.target.value)}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Select>
      </FieldShell>
    );
  }

  if (field.type === "textarea") {
    return (
      <FieldShell label={field.label} required={field.required} wide={field.wide ?? true}>
        <TextArea rows={field.rows ?? 4} value={String(value ?? "")} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
      </FieldShell>
    );
  }

  if (field.type === "number") {
    return (
      <FieldShell label={field.label} required={field.required} wide={field.wide}>
        <TextInput
          type="number"
          value={value === undefined || value === null ? "" : String(value)}
          onChange={(event) => onChange(event.target.value === "" ? undefined : Number(event.target.value))}
        />
      </FieldShell>
    );
  }

  return (
    <FieldShell label={field.label} required={field.required} wide={field.wide}>
      <TextInput value={String(value ?? "")} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
    </FieldShell>
  );
}
