import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getSizes, sizeInterface } from "../../redux/reducer/size.slice";

type sizeModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (dataEncryption: sizeInterface, type: "create" | "update") => void;
  data?: any;
};

const SizeModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: sizeModalType) => {
  const [sizename, setsizename] = useState(data?.sizename || "");

  const encryption = () => {
    const dataEncryption: sizeInterface = {
      size_id: data?.size_id || "",
      sizename,
    };
    onSubmit(dataEncryption, type);
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${
        type === "create" ? "Thêm mới kích thước" : "Cập nhật kích thước"
      }`}
    >
      {type === "update" ? (
        <TextField
          required
          fullWidth
          value={data?.size_id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã kích thước"
          type="text"
        />
      ) : null}

      <TextField
        required
        fullWidth
        variant="outlined"
        value={sizename}
        onChange={(e) => setsizename(e.target.value)}
        label="Tên kích thước"
        type="text"
      />
      {type === "update" ? (
        <TextField
          required
          fullWidth
          variant="filled"
          label="Số lượng"
          value={data?.product_quantity || ""}
          InputProps={{ readOnly: true }}
          type="number"
        />
      ) : null}
    </Modal>
  );
};

export default React.memo(SizeModal);
