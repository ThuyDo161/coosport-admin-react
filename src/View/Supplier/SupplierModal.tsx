import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  supplierInterface,
  getSuppliers,
} from "../../redux/reducer/supplier.slice";

type supplierModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (
    dataEncryption: supplierInterface,
    type: "create" | "update"
  ) => void;
  data?: any;
};

const supplierModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: supplierModalType) => {
  const supplierStore = useAppSelector((state) => state.supplier);
  const dispatch = useAppDispatch();

  const [supplier_id, setSupplier_id] = useState(data?.supplier_id || "");
  const [supplier_name, setSupplier_name] = useState(data?.supplier_name || "");
  const [supplier_address, setSupplier_address] = useState(
    data?.supplier_address || ""
  );
  const [supplier_tel, setSupplier_tel] = useState(data?.supplier_tel || "");

  useEffect(() => {
    dispatch(getSuppliers());
  }, [supplierStore.loading]);

  const encryption = () => {
    const dataEncryption: supplierInterface = {
      supplier_id: data?.supplier_id || "",
      supplier_name,
      supplier_address,
      supplier_tel,
    };
    onSubmit(dataEncryption, type);
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${
        type === "create" ? "Thêm mới nhà cung cấp" : "Cập nhật nhà cung cấp"
      }`}
    >
      {type === "update" && (
        <TextField
          required
          fullWidth
          value={data?.supplier_id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã nhà cung cấp"
          type="text"
        />
      )}

      <TextField
        required
        fullWidth
        variant="outlined"
        value={supplier_name}
        onChange={(e) => setSupplier_name(e.target.value)}
        label="Tên nhà cung cấp"
        type="text"
      />
      <TextField
        required
        fullWidth
        variant="outlined"
        value={supplier_address}
        onChange={(e) => setSupplier_address(e.target.value)}
        label="Địa chỉ nhà cung cấp"
        type="text"
      />
      <TextField
        required
        fullWidth
        variant="outlined"
        value={supplier_tel}
        onChange={(e) => setSupplier_tel(e.target.value)}
        label="Số điện thoại nhà cung cấp"
        type="tel"
      />
    </Modal>
  );
};

export default React.memo(supplierModal);
