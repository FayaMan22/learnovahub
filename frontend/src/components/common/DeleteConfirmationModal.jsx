import "./common.css";

export default function DeleteConfirmationModal({
  open,
  title = "Delete item?",
  itemName,
  warning = "This action cannot be undone.",
  confirmText = "Delete",
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        if (!loading) {
          onCancel();
        }
      }}
    >
      <div
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="delete-modal-icon">!</div>

        <h2 id="delete-modal-title">{title}</h2>

        {itemName && (
          <p>
            Are you sure you want to delete <strong>{itemName}</strong>?
          </p>
        )}

        <p className="delete-warning">{warning}</p>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}