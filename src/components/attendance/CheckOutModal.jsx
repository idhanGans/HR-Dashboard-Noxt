import { Modal } from "../Modal";
import { Button } from "../Button";

/**
 * CheckOutModal - Confirmation modal for check-out
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onConfirm - Callback when confirmed
 */
export const CheckOutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Check-out">
      <div className="space-y-4">
        <p className="text-white">
          <strong>Current Time:</strong> {new Date().toLocaleTimeString()}
        </p>
        <p className="text-lightGrey text-sm">
          Confirm your check-out for today?
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Check-out</Button>
        </div>
      </div>
    </Modal>
  );
};
