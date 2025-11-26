import { X } from "lucide-react";
import { useState } from "react";
import "../pages/Analytics.css";

function ExportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [selectedFormat, setSelectedFormat] = useState('');

  function chooseFormat(format: string) {
    setSelectedFormat(format);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {/* HEADER */}
        <div className="modal-header">
          <h2 className="modal-title">Export Data</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X className="icon-sm" />
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          <p className="modal-info">Select the format for your analytics export</p>

          <div className="export-options">
            {['CSV', 'Excel (XLSX)', 'PDF Report', 'JSON'].map((format) => (
              <button
                key={format}
                onClick={() => chooseFormat(format)}
                className={`export-option-btn ${selectedFormat === format ? 'active-format' : ''}`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={onClose} className="btn-primary">Export</button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
