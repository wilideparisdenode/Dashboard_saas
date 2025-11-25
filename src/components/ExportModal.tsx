 import { X } from "lucide-react";
function ExportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">Export Data</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X className="icon-sm" />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-info">Select the format for your analytics export</p>

          <div className="export-options">
            {['CSV', 'Excel (XLSX)', 'PDF Report', 'JSON'].map((format) => (
              <button key={format} className="export-option-btn">
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={onClose} className="btn-primary">Export</button>
        </div>
      </div>
    </div>
  );
}export default ExportModal;
