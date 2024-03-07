import { Box, ColorSwatch, Image } from "@mantine/core";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getBrands } from "../../redux/reducer/brand.slice";
import { getCategories } from "../../redux/reducer/category.slice";
import { deleteColors } from "../../redux/reducer/color.slice";
import {
  createSlide,
  deleteSlide,
  getSlides,
  slideInterface,
  slidePayloadInterface,
  updateSlide,
} from "../../redux/reducer/hero-slide.slice";
import {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import SlideModal from "./SlideModal";
import SlidePreviewModal from "./SlidePreviewModal";

const Slide = () => {
  const slideStore = useAppSelector((state) => state.heroSlideData);
  const slides = slideStore.slide;
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [data, setData] = useState<slideInterface | undefined>();
  const dispatch = useAppDispatch();
  const heroSlide = slides.map((prod) => ({
    ...prod,
    customImg: (
      <Box sx={{ width: 120, marginLeft: "auto", marginRight: "auto" }}>
        <Image
          width="120"
          height="180"
          radius="md"
          src={prod.img}
          alt={prod.title}
          withPlaceholder
        />
      </Box>
    ),
  }));

  useEffect(() => {
    dispatch(getSlides());
    dispatch(getCategories());
    dispatch(getBrands());
  }, [slideStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "slide_id",
      width: "5%",
    },
    {
      Header: "Tên màu sắc",
      accessor: "title",
      width: "20%",
    },
    {
      Header: "Mã màu sắc",
      accessor: "color",
      width: "15%",

      Cell: (row) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ColorSwatch size={40} color={row?.value} />
        </Box>
      ),
    },
    {
      Header: "Hình ảnh",
      accessor: "customImg",
      width: "10%",
    },
    {
      Header: "Thao tác",
      accessor: "action",
      Cell: ({ row }: any) => (
        <span>
          <Button
            color="info"
            size="small"
            variant="outlined"
            onClick={() => {
              handleClickOpenPreview(getSlide(row.values.slide_id));
            }}
          >
            <i className="fa-solid fa-eye"></i>
          </Button>
          <Button
            color="warning"
            size="small"
            variant="outlined"
            onClick={() => {
              handleClickOpenEdit(getSlide(row.values.slide_id));
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              handleDelete({
                slide_id: row.values.slide_id,
                title: row.values.title,
              });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
      width: "15%",
    },
  ];

  const getSlide = (id: string) => {
    return slides.find((item) => item.slide_id === id);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
    setOpenPreview(false);
  };
  const handleClickOpenEdit = (data: any) => {
    setData(data);
    setOpenEdit(true);
  };
  const handleClickOpenPreview = (data?: slideInterface) => {
    setData(data);
    setOpenPreview(true);
  };

  const handleSubmit = (
    data: slidePayloadInterface,
    type: "create" | "update"
  ) => {
    switch (type) {
      case "create":
        dispatch(createSlide(data))
          .unwrap()
          .then((res) => {
            if (res.code) {
              messageSave(res.message);
            } else {
              messageError(res.message);
            }
          });
        break;
      case "update":
        dispatch(updateSlide(data))
          .unwrap()
          .then((res) => {
            if (res.code) {
              messageSave(res.message);
            } else {
              messageError(res.message);
            }
          });
        break;
      default:
        break;
    }
    handleClose();
  };

  const handleDelete = (data: any) => {
    messageConfirm("Xóa " + data.title)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteSlide(data)).unwrap();
        } else {
          return Promise.reject();
        }
      })
      .then((res) => {
        if (res.code) {
          messageSave(res.message);
        } else {
          messageError(res.message);
        }
      });
  };
  if (slideStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách hero slide
        <span>
          <Button
            variant="contained"
            sx={{ ml: 4 }}
            color="success"
            onClick={handleClickOpen}
          >
            <i className="fa-solid fa-plus"></i>
          </Button>
          {open ? (
            <SlideModal
              type="create"
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
            />
          ) : null}
          {openEdit ? (
            <SlideModal
              type="update"
              data={data}
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={openEdit}
            />
          ) : null}
          <SlidePreviewModal
            data={data}
            handleClose={handleClose}
            open={openPreview}
          />
        </span>
      </p>
      <br />
      <TableData columnInput={header} dataInput={heroSlide} />
    </div>
  );
};

export default Slide;
