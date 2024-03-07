import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { BrandInterface, getBrands } from "../../redux/reducer/brand.slice";

type brandModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (dataEncryption: BrandInterface, type: "create" | "update") => void;
  data?: any;
};

const BrandModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: brandModalType) => {
  const brandStore = useAppSelector((state) => state.brands);
  const dispatch = useAppDispatch();

  const [brandname, setbrandname] = useState(data?.brandname || "");
  const [brand_slug, setbrand_slug] = useState(data?.brand_slug || "");

  useEffect(() => {
    dispatch(getBrands());
  }, [brandStore.loading]);

  const encryption = () => {
    const dataEncryption: BrandInterface = {
      brand_id: data?.brand_id || "",
      brandname,
      brand_slug: slugify(brandname.toLowerCase(), "_"),
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
          value={data?.brand_id || ""}
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
        value={brandname}
        onChange={(e) => setbrandname(e.target.value)}
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

export default React.memo(BrandModal);
