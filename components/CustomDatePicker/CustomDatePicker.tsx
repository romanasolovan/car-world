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
  const popoverRef = useRef<HTMLDivElement | null>(null);

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

  // Adjust popover position to prevent overflow
  useEffect(() => {
    if (open && popoverRef.current && wrapperRef.current) {
      const popover = popoverRef.current;
      const wrapper = wrapperRef.current;
      const rect = wrapper.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();

      // Check if popover would overflow right edge
      const viewportWidth = window.innerWidth;
      if (rect.left + popoverRect.width > viewportWidth - 20) {
        popover.style.left = "auto";
        popover.style.right = "0";
      } else {
        popover.style.left = "0";
        popover.style.right = "auto";
      }

      // Check if popover would overflow bottom
      const viewportHeight = window.innerHeight;
      if (rect.bottom + popoverRect.height > viewportHeight - 20) {
        // Position above the input if not enough space below
        popover.style.top = "auto";
        popover.style.bottom = "calc(100% + 4px)";
      } else {
        popover.style.top = "calc(100% + 4px)";
        popover.style.bottom = "auto";
      }
    }
  }, [open]);

  // Get tomorrow as the minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

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
        <div
          className={css.popover}
          ref={popoverRef}
          role="dialog"
          aria-modal="false"
        >
          <DayPicker
            ISOWeek
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
            showOutsideDays
            fixedWeeks
          />
        </div>
      )}
    </div>
  );
}
