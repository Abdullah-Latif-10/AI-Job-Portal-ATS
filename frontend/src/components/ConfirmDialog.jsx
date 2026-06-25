import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Go back",
  variant = "destructive",
  loading = false,
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const useThemeAccent = variant === "destructive" || variant === "primary";

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center sm:p-6 bg-foreground/20 backdrop-blur-sm"
      onClick={loading ? undefined : onCancel}
    >
      <div
        className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-border shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                useThemeAccent ? "bg-primary/10 text-primary" : "bg-accent/60 text-accent-foreground"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="confirm-dialog-title" className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              {description && (
                <p id="confirm-dialog-description" className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-muted border-none bg-transparent cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-muted transition bg-transparent cursor-pointer text-foreground disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition border-none cursor-pointer disabled:opacity-50 ${
              useThemeAccent
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
