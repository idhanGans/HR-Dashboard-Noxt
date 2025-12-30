import { Modal } from "../Modal";
import { Button } from "../Button";

/**
 * CheckInModal - Confirmation modal for check-in
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onConfirm - Callback when confirmed
 */
export const CheckInModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Check-in">
      <div className="space-y-4">
        <p className="text-white">
          <strong>Current Time:</strong> {new Date().toLocaleTimeString()}
        </p>
        <p className="text-lightGrey text-sm">
          Confirm your check-in for today?
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Check-in</Button>
        </div>
      </div>
    </Modal>
  );
};
