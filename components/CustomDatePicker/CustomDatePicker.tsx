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
  const { setFieldValue, setFieldTouched } =
    useFormikContext<BookingFormValues>();
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

  // Get tomorrow as the minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className={css.wrapper} ref={wrapperRef}>
      <div className={css.inputRow}>
        <input
          type="text"
          className={`${css.input} ${
            meta.touched && meta.error ? css.inputError : ""
          }`}
          placeholder="Booking Date*"
          value={displayValue}
          onFocus={() => {
            setOpen(true);
            setFieldTouched(name, true);
          }}
          onClick={() => {
            setOpen(true);
            setFieldTouched(name, true);
          }}
          onBlur={() => {
            setFieldTouched(name, true);
          }}
          readOnly
          aria-haspopup="dialog"
          aria-label="Booking date"
        />

        <button
          type="button"
          className={css.calendarToggle}
          onClick={() => {
            setOpen((s) => !s);
            setFieldTouched(name, true);
          }}
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
            disabled={{ before: tomorrow }}
            onSelect={(date) => {
              if (date) {
                const dateString = date.toISOString().split("T")[0];
                setFieldValue(name, dateString);
                setFieldTouched(name, true);
              } else {
                setFieldValue(name, "");
                setFieldTouched(name, true);
              }
              setOpen(false);
            }}
            className={css.calendar}
          />
        </div>
      )}
    </div>
  );
}
