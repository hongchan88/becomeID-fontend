import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";

export default function Basicbutton(props) {
  return (
    <Stack spacing={2} direction="row">
      <Button type="submit" variant="contained">
        Register
      </Button>
    </Stack>
  );
}
