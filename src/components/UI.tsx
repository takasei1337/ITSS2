import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown } from "lucide-react";

export function PageHeading({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="page-heading">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<div className="page-title-row"><div><h1>{title}</h1><p>{description}</p></div>{actions}</div></header>;
}

export function ActionBar({ backLabel = "Quay lại", nextLabel, onBack, onNext, disabled = false, extra }: { backLabel?: string; nextLabel: string; onBack: () => void; onNext: () => void; disabled?: boolean; extra?: ReactNode }) {
  return <div className="action-bar"><div>{extra}<button className="button ghost" type="button" onClick={onBack}><ArrowLeft size={18} /> {backLabel}</button></div><button className="button primary" type="button" onClick={onNext} disabled={disabled}>{nextLabel} <ArrowRight size={18} /></button></div>;
}

export function FieldError({ children }: { children?: ReactNode }) {
  return children ? <p className="field-error" role="alert">{children}</p> : null;
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><span>{icon}</span><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function DropdownSelect<T extends string>({ value, options, onChange, icon, ariaLabel }: { value: T; options: Array<{ value: T; label: string }>; onChange: (value: T) => void; icon?: ReactNode; ariaLabel: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => !rootRef.current?.contains(event.target as Node) && setOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return <div className={`dropdown-select ${open ? "open" : ""}`} ref={rootRef}><button className="dropdown-select-button" type="button" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>{icon}<span>{selectedLabel}</span><ChevronDown size={16} /></button>{open && <div className="dropdown-select-menu" role="listbox" aria-label={ariaLabel}>{options.map((option) => <button className={value === option.value ? "selected" : ""} type="button" role="option" aria-selected={value === option.value} key={option.value} onClick={() => { onChange(option.value); setOpen(false); }}><span>{option.label}</span>{value === option.value && <Check size={16} />}</button>)}</div>}</div>;
}

export function AccessibleDateField({ value = "", onChange, label }: { value?: string; onChange: (value: string) => void; label: string }) {
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const displayValue = value ? new Intl.DateTimeFormat("vi-VN").format(new Date(`${value}T00:00:00`)) : "";

  const openPicker = () => {
    const input = nativeInputRef.current;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.click();
    }
  };

  return <div className="accessible-date-field"><input className="date-display-input" type="text" value={displayValue} readOnly aria-label={label} placeholder="dd/mm/yyyy" /><input className="native-date-proxy" ref={nativeInputRef} type="date" value={value} onChange={(event) => onChange(event.target.value)} aria-hidden="true" tabIndex={-1} /><button className="date-picker-button" type="button" aria-label={`Mở lịch chọn ${label.toLowerCase()}`} title={`Mở lịch chọn ${label.toLowerCase()}`} onClick={openPicker}><CalendarDays size={17} aria-hidden="true" /></button></div>;
}
