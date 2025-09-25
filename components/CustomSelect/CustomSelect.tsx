"use client";

import { useEffect, useRef, useState } from "react";
import css from "./CustomSelect.module.css";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CustomSelect({
  label,
  options,
  placeholder = "select one...",
  value,
  onChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setOpen(false);
  };

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={css.wrapper} ref={ref}>
      {label && <label className={css.label}>{label}</label>}

      <div
        className={`${css.control} ${open ? css.open : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedLabel}
        <span className={css.customArrow} />
      </div>

      {open && (
        <ul className={css.menu}>
          {options.map((opt) => (
            <li
              key={opt.value}
              className={css.option}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
