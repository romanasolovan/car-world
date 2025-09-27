"use client";

import React from "react";
import css from "./NoResults.module.css";

interface NoResultsProps {
  message?: string;
  onReset?: () => void;
}
const NoResults: React.FC<NoResultsProps> = ({
  message = "No cars match your search criteria",
  onReset,
}) => {
  return (
    <div className={css.noResSection}>
      {/* Icon */}
      <div className={css.iconWrapper}>
        <svg
          className={css.icon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Message */}
      <div className={css.messageBlock}>
        <h3 className={css.title}>No Results Found</h3>
        <p className={css.message}>{message}</p>
      </div>

      {/* Reset button */}
      {onReset && (
        <button onClick={onReset} className={css.resetBtn}>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default NoResults;
