"use client";

import { PuffLoader } from "react-spinners";
import css from "./Loader.module.css";

// loader must have better visibility

function Loader({ loading = true }) {
  return (
    <div className={css.loaderWrapper}>
      <PuffLoader
        color="#528391"
        size={90}
        speedMultiplier={2}
        loading={true}
      />
      {loading && <p className={css.text}>Loading vehicles, please wait...</p>}
    </div>
  );
}
export default Loader;
