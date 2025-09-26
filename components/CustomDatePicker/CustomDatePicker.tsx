"use client";

import React, { useEffect, useRef, useState } from "react";
import { useField, useFormikContext } from "formik";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import css from "./CustomDatePicker.module.css";

export type BookingFormValues = {
  name: string;
  email: string;
  date: string;
  comment?: string;
};

type Props = {
  name: keyof BookingFormValues;
};

export default function DateField({ name }: Props) {
  const { setFieldValue } = useFormikContext<BookingFormValues>();
  const [field, meta] = useField<string>({ name: name as string });
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedDate = field.value ? new Date(field.value) : undefined;

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className={css.wrapper} ref={wrapperRef}>
      <div className={css.inputRow}>
        <input
          type="text"
          className={css.input}
          placeholder="Booking Date"
          value={displayValue}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          readOnly // prevents keyboard typing, enforces picking from calendar?????
          aria-haspopup="dialog"
          aria-label="Booking date"
        />

        <button
          type="button"
          className={css.calendarToggle}
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle calendar"
        >
          📅
        </button>
      </div>

      {open && (
        <div className={css.popover} role="dialog" aria-modal="false">
          <DayPicker
            ISOWeek
            navLayout="around"
            showOutsideDays
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setFieldValue(name, date ? date.toISOString() : "");
              setOpen(false);
            }}
            className={css.calendar}
          />
        </div>
      )}

      {meta.touched && meta.error && (
        <div className={css.error}>{meta.error}</div>
      )}
    </div>
  );
}
