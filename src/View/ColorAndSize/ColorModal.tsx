import { ColorPicker } from "@mantine/core";
import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { colorInterface, getColors } from "../../redux/reducer/color.slice";

type colorModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (dataEncryption: colorInterface, type: "create" | "update") => void;
  data?: any;
};

const ColorModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: colorModalType) => {
  const colorStore = useAppSelector((state) => state.colors);
  const dispatch = useAppDispatch();

  const [colorname, setcolorname] = useState(data?.colorname || "");
  const [color_code, setColor_code] = useState(data?.color_code || "");

  useEffect(() => {
    dispatch(getColors());
  }, [colorStore.loading]);

  const encryption = () => {
    const dataEncryption: colorInterface = {
      color_id: data?.color_id || "",
      colorname,
      color_code,
    };
    onSubmit(dataEncryption, type);
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${type === "create" ? "Thêm mới màu sắc" : "Cập nhật màu sắc"}`}
    >
      {type === "update" ? (
        <TextField
          required
          fullWidth
          value={data?.color_id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã màu sắc"
          type="text"
        />
      ) : null}

      <TextField
        required
        fullWidth
        variant="outlined"
        value={colorname}
        onChange={(e) => setcolorname(e.target.value)}
        label="Tên màu sắc"
        type="text"
      />
      <Box sx={{ m: 1 }}>Chọn mã màu</Box>
      <ColorPicker
        size="xl"
        value={color_code}
        hueLabel="Mã màu"
        onChange={(e) => setColor_code(e)}
        format="hex"
        swatches={[
          "#25262b",
          "#868e96",
          "#fa5252",
          "#e64980",
          "#be4bdb",
          "#7950f2",
          "#4c6ef5",
          "#228be6",
          "#15aabf",
          "#12b886",
          "#40c057",
          "#82c91e",
          "#fab005",
          "#fd7e14",
        ]}
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

export default React.memo(ColorModal);
