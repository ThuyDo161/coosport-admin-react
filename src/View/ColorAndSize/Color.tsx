import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  colorInterface,
  createColors,
  deleteColors,
  getColors,
  updateColors,
} from "../../redux/reducer/color.slice";
import {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import ColorModal from "./ColorModal";
import { Box, ColorSwatch } from "@mantine/core";

const Color = () => {
  const colorStore = useAppSelector((state) => state.colors);
  const color = colorStore.color;
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getColors());
  }, [colorStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "color_id",
      width: "5%",
    },
    {
      Header: "Tên màu sắc",
      accessor: "colorname",
      width: "20%",
    },
    {
      Header: "Mã màu sắc",
      accessor: "color_code",
      width: "15%",

      Cell: (row) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ColorSwatch color={row?.value} />
        </Box>
      ),
    },
    {
      Header: "Số lượng sản phẩm",
      accessor: "product_quantity",
    },
    {
      Header: "Ngày tạo",
      accessor: "createddate",
      width: "15%",
    },
    {
      Header: "Ngày cập nhật",
      accessor: "modifieddate",
      width: "15%",
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
              handleClickOpenEdit(getColor(row.values.color_id));
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              handleDelete({ color_id: row.values.color_id });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
      width: "15%",
    },
  ];

  const getColor = (id: any) => {
    return color.find((item) => item.color_id === id);
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

  const handleSubmit = (data: colorInterface, type: "create" | "update") => {
    switch (type) {
      case "create":
        dispatch(createColors(data))
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
        dispatch(updateColors(data))
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
    messageConfirm("Xóa " + data.color_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteColors(data)).unwrap();
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
  if (colorStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách các màu sắc sản phẩm
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
            <ColorModal
              type="create"
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
            />
          ) : null}
          {openEdit ? (
            <ColorModal
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
      <TableData columnInput={header} dataInput={color} />
    </div>
  );
};

export default Color;
