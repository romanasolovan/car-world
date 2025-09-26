"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
// import * as Yup from "yup";
import css from "./CarRentalForm.module.css";
import DateField from "../CustomDatePicker/CustomDatePicker";

// look over the validation and see what can be improved or added?

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

  //   const validationSchema = Yup.object({
  //     name: Yup.string().required("Name is required"),
  //     email: Yup.string()
  //       .email("Invalid email address")
  //       .required("Email is required"),
  //     date: Yup.date().required("Date is required"),
  //     comment: Yup.string(),
  //   });

  const handleSubmit = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    console.log("Form values:", values);
    resetForm();
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      //   validationSchema={validationSchema}
    >
      <Form className={css.form}>
        <h3 className={css.formTitle}>Book your car now</h3>
        <p className={css.formSubtitle}>
          Stay connected! We are always ready to help you.
        </p>

        <div className={css.formInputs}>
          {/* name */}
          <div className={css.formGroup}>
            <Field
              name="name"
              type="text"
              placeholder="Name*"
              className={css.input}
            />
            <ErrorMessage name="name" component="div" className={css.error} />
          </div>
          {/* email */}
          <div className={css.formGroup}>
            <Field
              name="email"
              type="email"
              placeholder="Email*"
              className={css.input}
            />
            <ErrorMessage name="email" component="div" className={css.error} />
          </div>
          {/* date */}

          <div className={css.formGroup}>
            <DateField name="date" />
          </div>
          {/* comment */}
          <div className={css.formGroup}>
            <Field
              as="textarea"
              name="comment"
              placeholder="Comment"
              className={css.textarea}
            />
          </div>
          <button type="submit" className={css.sendBtn}>
            Send
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default BookingForm;
