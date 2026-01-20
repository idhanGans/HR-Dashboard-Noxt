import { useState } from "react";

// Reusable Modal component
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-lightGrey hover:text-white transition-all"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 pr-2">{children}</div>
      </div>
    </div>
  );
};
