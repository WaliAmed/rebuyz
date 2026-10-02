"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { X, PackageOpen, ArrowRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "./button";
export function Modal({
  open,
  onClose,
  title,
  children,
  drawer = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  drawer?: boolean;
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className={drawer ? "dialog drawer" : "dialog"}>
          <div className="section-heading">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Close">
              <X size={20} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            {title} — use the controls below or press Escape to close.
          </Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function Confirm({
  label,
  title,
  onConfirm,
  danger = false,
}: {
  label: string;
  title: string;
  onConfirm: () => void | Promise<unknown>;
  danger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant={danger ? "danger" : "outline"}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <p>This updates the saved frontend demo data.</p>
        <div className="actions">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Keep unchanged
          </Button>
          <Button
            onClick={async () => {
              await onConfirm();
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}
export function Empty({
  title = "Nothing here yet",
  text = "Try changing your filters or explore the collection.",
  href = "/shop",
  label = "Explore the shop",
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="empty">
      <PackageOpen size={40} />
      <h2>{title}</h2>
      <p>{text}</p>
      <Button asChild>
        <Link href={href}>
          {label}
          <ArrowRight size={16} />
        </Link>
      </Button>
    </div>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  const s = String(children);
  return (
    <span
      className={`badge ${/Live|Verified|Delivered|Active|New|Published/.test(s) ? "green" : /Pending|Review|Preparing|Changes|Attention/.test(s) ? "amber" : /Cancelled|Rejected|Damaged|Removed/.test(s) ? "red" : ""}`}
    >
      {children}
    </span>
  );
}
export function PageTitle({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {children}
    </div>
  );
}
export function Skeleton() {
  return (
    <div className="skeleton-grid" aria-label="Loading demo data" role="status">
      {Array.from({ length: 6 }, (_, i) => (
        <div className="skeleton" key={i} />
      ))}
    </div>
  );
}
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="icon-button"
      aria-label={`Copy ${value}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success("Copied");
        } catch {
          toast.error("Copy unavailable. Select and copy the displayed value.");
        }
      }}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
