import { X,Calendar } from "lucide-react";
 import "../pages/Analytics.css"
interface FilterModalType{
  isOpen:boolean;
  onClose:()=> void; currentRange:string; onSelectRange:(range:string)=>void;
}
function FilterModal({ isOpen, onClose, currentRange, onSelectRange }:FilterModalType) {
  if (!isOpen) return null;

  const ranges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year', 'Custom range'];

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">Date Range</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X className="icon-sm" />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-info">Select a date range for your analytics</p>

          <div className="range-list">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => {
                  onSelectRange(range);
                  onClose();
                }}
                className={`range-item ${currentRange === range ? 'active' : ''}`}
              >
                <Calendar className="icon-sm" />
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}export default FilterModal;
