import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <div className="page-title-row">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {actions}
      </div>
    </header>
  );
}

export function ActionBar({
  backLabel = "Quay lại",
  nextLabel,
  onBack,
  onNext,
  disabled = false,
  extra,
}: {
  backLabel?: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  disabled?: boolean;
  extra?: ReactNode;
}) {
  return (
    <div className="action-bar">
      <div>
        {extra}
        <button className="button ghost" type="button" onClick={onBack}>
          <ArrowLeft size={18} /> {backLabel}
        </button>
      </div>
      <button className="button primary" type="button" onClick={onNext} disabled={disabled}>
        {nextLabel} <ArrowRight size={18} />
      </button>
    </div>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  return children ? (
    <p className="field-error" role="alert">
      {children}
    </p>
  ) : null;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
};

function computePopoverStyle(
  triggerEl: HTMLElement,
  estimatedHeight: number,
  options?: { matchWidth?: boolean; minWidth?: number; fixedWidth?: number }
): CSSProperties {
  const rect = triggerEl.getBoundingClientRect();
  const viewportH = window.innerHeight;
  const viewportW = window.innerWidth;
  const spaceBelow = viewportH - rect.bottom;
  const spaceAbove = rect.top;
  const openUpward = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

  const targetWidth =
    options?.fixedWidth ??
    (options?.matchWidth
      ? rect.width
      : options?.minWidth
        ? Math.max(rect.width, options.minWidth)
        : rect.width);

  const clampedLeft = Math.max(8, Math.min(rect.left, viewportW - targetWidth - 8));

  const style: CSSProperties = {
    position: "fixed",
    left: `${clampedLeft}px`,
    zIndex: 9999,
  };

  if (options?.fixedWidth) {
    style.width = `${options.fixedWidth}px`;
  } else if (options?.matchWidth) {
    style.width = `${rect.width}px`;
  } else {
    style.minWidth = `${targetWidth}px`;
    style.width = "max-content";
    style.maxWidth = `${Math.min(320, viewportW - 16)}px`;
  }

  if (openUpward) {
    style.bottom = `${viewportH - rect.top + 6}px`;
    style.maxHeight = `${Math.max(140, spaceAbove - 14)}px`;
  } else {
    style.top = `${rect.bottom + 6}px`;
    style.maxHeight = `${Math.max(140, spaceBelow - 14)}px`;
  }

  return style;
}

export function DropdownSelect<T extends string>({
  value,
  options,
  onChange,
  icon,
  ariaLabel,
  placeholder = "Chọn...",
  size = "md",
  fullWidth = false,
  minMenuWidth,
  className = "",
  disabled = false,
}: {
  value: T;
  options: Array<DropdownOption<T>>;
  onChange: (value: T) => void;
  icon?: ReactNode;
  ariaLabel: string;
  placeholder?: string;
  size?: "md" | "compact";
  fullWidth?: boolean;
  minMenuWidth?: number;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((option) => option.value === value)?.label ?? placeholder;

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const estimatedHeight = Math.min(280, options.length * 40 + 16);
    setMenuStyle(
      computePopoverStyle(buttonRef.current, estimatedHeight, {
        matchWidth: !minMenuWidth,
        minWidth: minMenuWidth,
      })
    );
  }, [minMenuWidth, options.length]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const handleReposition = () => updatePosition();

    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, updatePosition]);

  return (
    <div
      className={`dropdown-select ${size === "compact" ? "is-compact" : ""} ${fullWidth ? "is-full" : ""} ${open ? "open" : ""} ${className}`}
      ref={rootRef}
    >
      <button
        ref={buttonRef}
        className={`dropdown-select-button ${icon ? "has-icon" : "no-icon"}`}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen((current) => !current)}
      >
        {icon && <span className="dropdown-select-icon">{icon}</span>}
        <span className="dropdown-select-label">{selectedLabel}</span>
        <ChevronDown size={size === "compact" ? 15 : 16} className="dropdown-select-chevron" />
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="dropdown-select-menu dropdown-select-portal"
            role="listbox"
            aria-label={ariaLabel}
            style={menuStyle}
          >
            {options.map((option) => (
              <button
                className={value === option.value ? "selected" : ""}
                type="button"
                role="option"
                aria-selected={value === option.value}
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={16} />}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export function AccessibleDateField({
  value = "",
  onChange,
  label,
  placeholder = "dd/mm/yyyy",
  disabled = false,
}: {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const parsedDate = useMemo(() => {
    if (!value) return null;
    const parts = value.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        return new Date(y, m, d);
      }
    }
    return null;
  }, [value]);

  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => parsedDate || today);

  useEffect(() => {
    if (parsedDate) {
      setViewDate(parsedDate);
    }
  }, [parsedDate]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const updatePosition = useCallback(() => {
    if (!rootRef.current) return;
    setPopoverStyle(computePopoverStyle(rootRef.current, 325, { fixedWidth: 276 }));
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const handleReposition = () => updatePosition();

    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, updatePosition]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const calendarCells = useMemo(() => {
    const cells: Array<{ day: number; iso: string; isCurrentMonth: boolean }> = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(viewYear, viewMonth - 1, day);
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, iso, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, iso, isCurrentMonth: true });
    }
    const targetLength = cells.length > 35 ? 42 : 35;
    let nextDay = 1;
    while (cells.length < targetLength) {
      const date = new Date(viewYear, viewMonth + 1, nextDay);
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`;
      cells.push({ day: nextDay, iso, isCurrentMonth: false });
      nextDay++;
    }
    return cells;
  }, [viewYear, viewMonth, firstDayOfWeek, daysInMonth, daysInPrevMonth]);

  const displayValue = useMemo(() => {
    if (!value) return "";
    const parts = value.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
  }, [value]);

  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  return (
    <div className={`accessible-date-field ${open ? "active-picker" : ""}`} ref={rootRef}>
      <input
        className="date-display-input"
        type="text"
        value={displayValue}
        readOnly
        aria-label={label}
        placeholder={placeholder}
        onClick={toggleOpen}
      />
      <button
        className="date-picker-button"
        type="button"
        aria-label={`Mở lịch chọn ${label.toLowerCase()}`}
        title={`Mở lịch chọn ${label.toLowerCase()}`}
        aria-expanded={open}
        onClick={toggleOpen}
        disabled={disabled}
      >
        <CalendarDays size={17} aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="custom-calendar-popover"
            role="dialog"
            aria-modal="true"
            aria-label={`Lịch chọn ${label.toLowerCase()}`}
            style={popoverStyle}
          >
            <div className="calendar-header">
              <button
                type="button"
                className="cal-nav-btn"
                onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                aria-label="Tháng trước"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="cal-month-title">
                Tháng {viewMonth + 1}, {viewYear}
              </span>
              <button
                type="button"
                className="cal-nav-btn"
                onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                aria-label="Tháng sau"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="calendar-weekdays">
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
              <span>CN</span>
            </div>
            <div className="calendar-grid">
              {calendarCells.map((cell) => {
                const isSelected = cell.iso === value;
                const isTodayCell = cell.iso === todayIso;
                return (
                  <button
                    key={cell.iso}
                    type="button"
                    className={`calendar-day-btn ${!cell.isCurrentMonth ? "other-month" : ""} ${isSelected ? "selected" : ""} ${isTodayCell ? "today" : ""}`}
                    onClick={() => {
                      onChange(cell.iso);
                      setOpen(false);
                    }}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
            <div className="calendar-footer">
              <button
                type="button"
                className="cal-action-btn clear-btn"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                Xóa
              </button>
              <button
                type="button"
                className="cal-action-btn today-btn"
                onClick={() => {
                  onChange(todayIso);
                  setOpen(false);
                }}
              >
                Hôm nay
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
