"use client";

import { Alert, Snackbar } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ErrorToast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(true);

  if (searchParams.get("error")) {
    return (
      <Snackbar
        open={show}
        onClose={() => setShow(false)}
        autoHideDuration={3000}
      >
        <Alert severity="error" variant="filled" onClose={() => setShow(false)}>
          {searchParams.get("error")}
        </Alert>
      </Snackbar>
    );
  } else {
    return <></>;
  }
}
