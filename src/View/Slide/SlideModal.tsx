import { Switch } from "@mantine/core";
import { Box, CardMedia, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import imgDefault from "../../assets/image-default.png";
import Modal from "../../components/Modal/Modal";
import Select from "../../components/Select/Select";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  slideInterface,
  slidePayloadInterface,
} from "../../redux/reducer/hero-slide.slice";
import { LIST_COLOR_OPTION } from "../../utils/GlobalFunction";

type slideModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (
    dataEncryption: slidePayloadInterface,
    type: "create" | "update"
  ) => void;
  data?: slideInterface;
};

const SlideModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: slideModalType) => {
  const categoryStore = useAppSelector((state) => state.category);
  const brandStore = useAppSelector((state) => state.brands);
  const [isUpload, setIsUpload] = useState(false);
  const imgFile = useRef<{ file: any; name: string; id: 1 } | null>(null);
  const dispatch = useAppDispatch();

  const [slide, setSlide] = useState<slideInterface>({
    slide_id: data?.slide_id || "",
    title: data?.title || "",
    description: data?.description || "",
    color: data?.color || "",
    img: data?.img || "",
    path: data?.path || "",
  });

  const categoriesOptions = categoryStore.category.map((item) => ({
    label: item.categoryname,
    value: item.category_slug,
  }));
  const brandsOptions = brandStore.brand.map((item) => ({
    label: item.brandname,
    value: item.brand_slug,
  }));

  const optionPaths = categoriesOptions.concat(brandsOptions);

  const encryption = () => {
    const dataEncryption: slidePayloadInterface = {
      title: slide.title,
      slide_id: slide?.slide_id || "",
      description: slide.description,
      color: slide.color,
      path: slide.path,
      img: slide.img,
      fileUpload: isUpload ? imgFile.current : null,
    };
    onSubmit(dataEncryption, type);
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${type === "create" ? "Thêm mới slide" : "Cập nhật slide"}`}
    >
      {type === "update" ? (
        <TextField
          required
          fullWidth
          value={data?.slide_id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã slide"
          type="text"
        />
      ) : null}

      <TextField
        required
        fullWidth
        variant="outlined"
        value={slide.title}
        onChange={(e) =>
          setSlide((preState) => ({ ...preState, title: e.target.value }))
        }
        label="Tiêu đề"
        type="text"
      />
      <TextField
        required
        fullWidth
        variant="outlined"
        value={slide.description}
        onChange={(e) =>
          setSlide((preState) => ({ ...preState, description: e.target.value }))
        }
        label="Mô tả"
        type="text"
        multiline
        maxRows={5}
      />
      <Select
        label="Chọn màu chủ đạo"
        placeholder="Pick one"
        required
        hasColor
        data={LIST_COLOR_OPTION}
        value={slide.color}
        onChange={(e) =>
          setSlide((preState) => ({ ...preState, color: e ?? "" }))
        }
      />
      <Select
        label="Chọn path"
        placeholder="Pick one"
        required
        data={optionPaths}
        value={slide.path}
        onChange={(e) =>
          setSlide((preState) => ({ ...preState, path: e ?? "" }))
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
                setSlide((preState) => ({ ...preState, img: path }));
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
              image={slide.img || imgDefault}
              alt={slide.title}
            />
          </label>
        </Box>
      ) : (
        <>
          <TextField
            required
            fullWidth
            variant="outlined"
            value={slide.img}
            onChange={(e) =>
              setSlide((preState) => ({ ...preState, img: e.target.value }))
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
            image={slide.img || imgDefault}
            alt={slide.title}
          />
        </>
      )}
    </Modal>
  );
};

export default React.memo(SlideModal);
