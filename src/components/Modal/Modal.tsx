import { Modal as ModalMantine } from "@mantine/core";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

type ModalType = {
  open: boolean;
  handleClose: () => void;
  children: any;
  onSubmit?: () => void;
  title?: string;
  size?: number | string;
};

const Modal = ({
  open,
  handleClose,
  children,
  onSubmit,
  title,
  size,
}: ModalType) => {
  return (
    <ModalMantine
      opened={open}
      centered
      size={size ?? "50vw"}
      transition="slide-up"
      transitionDuration={600}
      transitionTimingFunction="ease"
      onClose={handleClose}
      title={title}
    >
      <DialogContent>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { mt: 1 },
            "& .MuiOutlinedInput-root": { mt: 2 },
          }}
          noValidate={false}
          autoComplete="on"
        >
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        {onSubmit && <Button onClick={onSubmit}>Submit</Button>}
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </ModalMantine>
  );
};

export default Modal;
