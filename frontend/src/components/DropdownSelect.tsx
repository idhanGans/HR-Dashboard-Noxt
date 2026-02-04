import { useMemo, useState, useEffect } from "react";
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  flip,
  shift,
  offset,
  autoUpdate,
  FloatingPortal,
  size as floatingSize,
} from "@floating-ui/react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
}

type DropdownSize = "default" | "compact";

interface DropdownSelectProps {
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string | null;
  showEmptyOption?: boolean;
  emptyOptionLabel?: string;
  noOptionsLabel?: string;
  ariaLabel?: string;
  /** Size variant: "default" for full-size, "compact" for inline/smaller use */
  size?: DropdownSize;
  className?: string;
  /** @deprecated Use size prop instead. Custom button class overrides. */
  buttonClassName?: string;
  /** @deprecated Use size prop instead. Custom menu class overrides. */
  menuClassName?: string;
  /** @deprecated Use size prop instead. Custom item class overrides. */
  itemClassName?: string;
}

const sizeStyles: Record<
  DropdownSize,
  { button: string; menu: string; item: string }
> = {
  default: {
    button: "px-4 py-3 text-base rounded-xl",
    menu: "rounded-xl",
    item: "px-4 py-3 text-base",
  },
  compact: {
    button: "px-3 py-2 text-sm rounded-lg h-9",
    menu: "rounded-lg",
    item: "px-3 py-2 text-sm",
  },
};

export const DropdownSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled,
  isLoading,
  error,
  showEmptyOption = false,
  emptyOptionLabel,
  noOptionsLabel = "No options available",
  ariaLabel,
  size = "default",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  itemClassName = "",
}: DropdownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDisabled = Boolean(disabled) || Boolean(isLoading);
  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  const styles = sizeStyles[size];

  // Close dropdown when disabled
  useEffect(() => {
    if (isDisabled && isOpen) {
      setIsOpen(false);
    }
  }, [isDisabled, isOpen]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!isDisabled) {
        setIsOpen(open);
      }
    },
    middleware: [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      floatingSize({
        padding: 16,
        apply({ rects, elements, availableWidth }) {
          // Set min-width to match trigger, but cap at available viewport width
          const minWidth = Math.min(rects.reference.width, availableWidth);
          const maxWidth = Math.min(availableWidth, 400); // Cap at 400px or viewport
          Object.assign(elements.floating.style, {
            minWidth: `${minWidth}px`,
            maxWidth: `${maxWidth}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const shouldShowEmptyOption =
    showEmptyOption && !isLoading && (!error || options.length > 0);
  const emptyLabel = emptyOptionLabel ?? placeholder;
  const hasOptions = options.length > 0;

  const buttonClasses = useMemo(
    () =>
      `w-full bg-white/5 border text-left focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-60 flex items-center justify-between gap-3 ${styles.button} ${
        isOpen ? "border-blue-500" : "border-white/10"
      } ${buttonClassName}`.trim(),
    [styles.button, isOpen, buttonClassName],
  );

  const menuClasses = useMemo(
    () =>
      `max-h-64 overflow-auto bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl ${styles.menu} ${menuClassName}`.trim(),
    [styles.menu, menuClassName],
  );

  const itemBaseClasses = `w-full text-left transition-colors truncate ${styles.item} ${itemClassName}`.trim();

  return (
    <div className={`relative ${className}`}>
      <button
        ref={refs.setReference}
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={buttonClasses}
        {...getReferenceProps()}
      >
        <span
          className={`truncate ${selectedOption ? "text-white" : "text-gray-400"}`}
          title={displayLabel}
        >
          {displayLabel}
        </span>
        <ChevronDown
          size={size === "compact" ? 16 : 18}
          className={`shrink-0 text-gray-300 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            // eslint-disable-next-line react-hooks/refs -- refs.setFloating is a callback ref, not a .current access
            ref={refs.setFloating}
            role="listbox"
            style={{ ...floatingStyles, zIndex: 9999 }}
            className={menuClasses}
            {...getFloatingProps()}
          >
            {isLoading && (
              <div className={`${itemBaseClasses} text-gray-400`}>
                Loading...
              </div>
            )}

            {!isLoading && error && (
              <div className={`${itemBaseClasses} text-red-300`}>{error}</div>
            )}

            {!isLoading && !error && shouldShowEmptyOption && (
              <button
                type="button"
                role="option"
                aria-selected={value === null}
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className={`${itemBaseClasses} ${
                  value === null
                    ? "bg-white/20 text-white"
                    : "text-gray-200 hover:bg-white/15"
                }`}
              >
                {emptyLabel}
              </button>
            )}

            {!isLoading &&
              !error &&
              hasOptions &&
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`${itemBaseClasses} ${
                    value === option.value
                      ? "bg-blue-600/40 text-white"
                      : "text-gray-200 hover:bg-white/15"
                  }`}
                >
                  {option.label}
                </button>
              ))}

            {!isLoading && !error && !hasOptions && (
              <div className={`${itemBaseClasses} text-gray-400`}>
                {noOptionsLabel}
              </div>
            )}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};
