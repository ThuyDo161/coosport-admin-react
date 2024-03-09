import { Box, ColorSwatch, Image, Switch } from "@mantine/core";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getBrands } from "../../redux/reducer/brand.slice";
import { getCategories } from "../../redux/reducer/category.slice";
import {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import BannersModal from "./BannersModal";
import {
  BannerInterface,
  BannerPayloadInterface,
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "../../redux/reducer/banners.slice";

const Banners = () => {
  const bannerStore = useAppSelector((state) => state.banners);
  const banners = bannerStore.banner;
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [data, setData] = useState<BannerInterface | undefined>();
  const dispatch = useAppDispatch();
  const banner = banners.map((banner) => ({
    ...banner,
    customActive: (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Switch
          defaultChecked={banner.is_active}
          sx={{ marginTop: 8, marginBottom: 8 }}
          onChange={(event) => {
            dispatch(
              updateBanner({
                ...banner,
                is_active: event.currentTarget.checked,
                fileUpload: null,
              })
            )
              .unwrap()
              .then((res) => {
                if (res.code) {
                  messageSave(res.message);
                } else {
                  messageError(res.message);
                }
              });
          }}
        />
      </Box>
    ),
    customImg: (
      <Box sx={{ width: 200, marginLeft: "auto", marginRight: "auto" }}>
        <Image
          width="120"
          height="180"
          radius="md"
          src={banner.img}
          alt={banner.title}
          withPlaceholder
        />
      </Box>
    ),
  }));

  useEffect(() => {
    dispatch(getBanners());
  }, [bannerStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "id",
      width: "5%",
    },
    {
      Header: "Tiêu đề",
      accessor: "title",
      width: "20%",
    },
    {
      Header: "Hình ảnh",
      accessor: "customImg",
      width: "10%",
    },
    {
      Header: "Hiển thị",
      accessor: "customActive",
      width: "10%",
    },
    {
      Header: "Thao tác",
      accessor: "action",
      Cell: ({ row }: any) => (
        <span>
          <Button
            color="warning"
            size="small"
            variant="outlined"
            onClick={() => {
              handleClickOpenEdit(getBanner(row.values.id));
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
                id: row.values.id,
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

  const getBanner = (id: string) => {
    return banners.find((item) => item.id === id);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
  };
  const handleClickOpenEdit = (data: any) => {
    setData(data);
    setOpenEdit(true);
  };

  const handleSubmit = (
    data: BannerPayloadInterface,
    type: "create" | "update"
  ) => {
    switch (type) {
      case "create":
        dispatch(createBanner(data))
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
        dispatch(updateBanner(data))
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
          return dispatch(deleteBanner(data)).unwrap();
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
  if (bannerStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách Banner
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
            <BannersModal
              type="create"
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
            />
          ) : null}
          {openEdit ? (
            <BannersModal
              type="update"
              data={data}
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={openEdit}
            />
          ) : null}
        </span>
      </p>
      <br />
      <TableData columnInput={header} dataInput={banner} />
    </div>
  );
};

export default Banners;
