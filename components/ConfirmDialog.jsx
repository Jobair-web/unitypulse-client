"use client";

export default function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel = "Keep it", danger = true, pending, onConfirm, onCancel }) {
  return (
    <div className={`modal ${open ? "modal-open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open}>
      <div className="modal-box rounded-3xl">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="py-3 text-muted-foreground">{description}</p>
        <div className="modal-action">
          <button type="button" className="btn btn-ghost rounded-full" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn rounded-full ${danger ? "btn-error" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={pending}
            aria-busy={pending}
          >
            {pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={pending ? undefined : onCancel} />
    </div>
  );
}
