import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  CategoryInterface,
  getCategories,
} from "../../redux/reducer/category.slice";

type categoryModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (
    dataEncryption: CategoryInterface,
    type: "create" | "update"
  ) => void;
  data?: any;
};

const categoryModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: categoryModalType) => {
  const categoryStore = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();

  const [categoryname, setcategoryname] = useState(data?.categoryname || "");
  const [category_slug, setCategory_slug] = useState(data?.category_slug || "");

  useEffect(() => {
    dispatch(getCategories());
  }, [categoryStore.loading]);

  const encryption = () => {
    const dataEncryption: CategoryInterface = {
      category_id: data?.category_id || "",
      categoryname,
      category_slug: slugify(categoryname.toLowerCase(), "_"),
    };
    onSubmit(dataEncryption, type);
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${
        type === "create" ? "Thêm mới loại sản phẩm" : "Cập nhật loại sản phẩm"
      }`}
    >
      {type === "update" ? (
        <TextField
          required
          fullWidth
          value={data?.category_id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã loại sản phẩm"
          type="text"
        />
      ) : null}

      <TextField
        required
        fullWidth
        variant="outlined"
        value={categoryname}
        onChange={(e) => setcategoryname(e.target.value)}
        label="Tên loại sản phẩm"
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

export default React.memo(categoryModal);
