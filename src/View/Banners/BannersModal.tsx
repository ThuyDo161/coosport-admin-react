import { Switch } from "@mantine/core";
import { Box, CardMedia, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import imgDefault from "../../assets/image-default.png";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch } from "../../redux/hook";
import {
  BannerInterface,
  BannerPayloadInterface,
} from "../../redux/reducer/banners.slice";

type bannerModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (
    dataEncryption: BannerPayloadInterface,
    type: "create" | "update"
  ) => void;
  data?: BannerInterface;
};

const BannersModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: bannerModalType) => {
  const [isUpload, setIsUpload] = useState(false);
  const imgFile = useRef<{ file: any; name: string; id: 1 } | null>(null);
  const dispatch = useAppDispatch();

  const [banner, setBanner] = useState<BannerInterface>({
    id: data?.id || "",
    title: data?.title || "",
    img: data?.img || "",
    is_active: data?.is_active ?? false,
  });

  const encryption = () => {
    const dataEncryption: BannerPayloadInterface = {
      title: banner.title,
      id: banner?.id || "",
      img: banner.img,
      is_active: banner.is_active,
      fileUpload: isUpload ? imgFile.current : null,
    };
    onSubmit(dataEncryption, type);
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${type === "create" ? "Thêm mới Banner" : "Cập nhật Banner"}`}
    >
      {type === "update" ? (
        <TextField
          required
          fullWidth
          value={data?.id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã banner"
          type="text"
        />
      ) : null}

      <TextField
        required
        fullWidth
        variant="outlined"
        value={banner.title}
        onChange={(e) =>
          setBanner((preState) => ({ ...preState, title: e.target.value }))
        }
        label="Tiêu đề"
        type="text"
      />
      <Switch
        checked={banner.is_active}
        label="Hiển thị trên trang chủ"
        sx={{ marginTop: 8, marginBottom: 8 }}
        onChange={(event) =>
          setBanner((preState) => ({
            ...preState,
            is_active: event.currentTarget.checked,
          }))
        }
      />
      <Switch
        checked={isUpload}
        label="Upload ảnh"
        sx={{ marginTop: 8, marginBottom: 8 }}
        onChange={(event) => setIsUpload(event.currentTarget.checked)}
      />
      {isUpload ? (
        <Box sx={{ mt: 1, mb: 2 }}>
          <input
            type="file"
            id="fileEdit"
            hidden
            onChange={(e) => {
              if (e.target.files![0].type!.split("/")[0] === "image") {
                let path = URL.createObjectURL(e.target.files![0]);
                let fileReader = new FileReader();
                fileReader.readAsDataURL(e.target.files![0]);

                fileReader.onload = (event) => {
                  imgFile.current = {
                    id: 1,
                    file: event.target?.result,
                    name: e.target.files![0]!.name,
                  };
                };
                setBanner((preState) => ({ ...preState, img: path }));
              } else {
                e.target.value = "";
              }
            }}
            accept="image/*"
          />
          <label htmlFor="fileEdit">
            <CardMedia
              component="img"
              style={{
                maxHeight: 243,
                float: "left",
                objectFit: "cover",
                width: "auto",
                maxWidth: 400,
                marginRight: 8,
              }}
              image={banner.img || imgDefault}
              alt={banner.title}
            />
          </label>
        </Box>
      ) : (
        <>
          <TextField
            required
            fullWidth
            variant="outlined"
            value={banner.img}
            onChange={(e) =>
              setBanner((preState) => ({ ...preState, img: e.target.value }))
            }
            label="Link ảnh"
            type="text"
          />
          <CardMedia
            component="img"
            style={{
              maxHeight: 243,
              float: "left",
              objectFit: "cover",
              width: "auto",
              maxWidth: 400,
              marginTop: 8,
            }}
            image={banner.img || imgDefault}
            alt={banner.title}
          />
        </>
      )}
    </Modal>
  );
};

export default React.memo(BannersModal);
