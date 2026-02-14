import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '24rem' }}>
                <div className="modal-header border-b-0 pb-0">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <AlertTriangle className="text-yellow-500" size={24} />
                        {title}
                    </h3>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body text-slate-600 dark:text-slate-300">
                    {message}
                </div>

                <div className="modal-footer border-t-0 pt-0">
                    <button onClick={onClose} className="btn btn-outline">Cancel</button>
                    <button onClick={onConfirm} className="btn">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
