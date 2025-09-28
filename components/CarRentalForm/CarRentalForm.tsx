"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import * as Yup from "yup";
import css from "./CarRentalForm.module.css";
import DateField from "../CustomDatePicker/CustomDatePicker";

export interface FormValues {
  name: string;
  email: string;
  date: string;
  comment: string;
}

const BookingForm = () => {
  const initialValues: FormValues = {
    name: "",
    email: "",
    date: "",
    comment: "",
  };

  // Enhanced validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Minimum 2 characters!")
      .max(20, "Maximum 20 characters!")
      .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces!")
      .required("Name is required!"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must contain @ and be a valid email address!"
      )
      .required("Email is required!"),
    date: Yup.string()
      .required("Booking date is required!")
      .test("is-future-date", "Date must be in the future!", function (value) {
        if (!value) return false;
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Set to end of today
        return selectedDate > today;
      }),
    comment: Yup.string().max(500, "Comment cannot exceed 500 characters!"),
  });

  const handleSubmit = (
    values: FormValues,
    { resetForm, setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log("Form values:", values);
    // Simulate API call
    setTimeout(() => {
      alert("Booking submitted successfully!");
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={css.form}>
          <h3 className={css.formTitle}>Book your car now</h3>
          <p className={css.formSubtitle}>
            Stay connected! We are always ready to help you.
          </p>

          <div className={css.formInputs}>
            {/* Name Field */}
            <div className={css.formGroup}>
              <Field
                name="name"
                type="text"
                placeholder="Name*"
                className={`${css.input} ${
                  errors.name && touched.name ? css.inputError : ""
                }`}
              />
              <ErrorMessage name="name" component="div" className={css.error} />
            </div>

            {/* Email Field */}
            <div className={css.formGroup}>
              <Field
                name="email"
                type="email"
                placeholder="Email*"
                className={`${css.input} ${
                  errors.email && touched.email ? css.inputError : ""
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className={css.error}
              />
            </div>

            {/* Date Field */}
            <div className={css.formGroup}>
              <DateField name="date" />
              <ErrorMessage name="date" component="div" className={css.error} />
            </div>

            {/* Comment Field */}
            <div className={css.formGroup}>
              <Field
                as="textarea"
                name="comment"
                placeholder="Comment"
                className={`${css.textarea} ${
                  errors.comment && touched.comment ? css.inputError : ""
                }`}
              />
              <ErrorMessage
                name="comment"
                component="div"
                className={css.error}
              />
            </div>

            <button
              type="submit"
              className={css.sendBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BookingForm;
