import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  createSizes,
  deleteSizes,
  getSizes,
  sizeInterface,
  updateSizes,
} from "../../redux/reducer/size.slice";
import {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import SizeModal from "./SizeModal";

const Size = () => {
  const sizeStore = useAppSelector((state) => state.sizes);
  const size = sizeStore.size;
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSizes());
  }, [sizeStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "size_id",
      width: "5%",
    },
    {
      Header: "Tên kích thước",
      accessor: "sizename",
      width: "20%",
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
              handleClickOpenEdit(getSize(row.values.size_id));
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              handleDelete({ size_id: row.values.size_id });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
      width: "15%",
    },
  ];

  const getSize = (id: any) => {
    return size.find((item) => item.size_id === id);
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

  const handleSubmit = (data: sizeInterface, type: "create" | "update") => {
    switch (type) {
      case "create":
        dispatch(createSizes(data))
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
        dispatch(updateSizes(data))
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
    messageConfirm("Xóa " + data.size_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteSizes(data)).unwrap();
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
  if (sizeStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách các kích thước sản phẩm
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
            <SizeModal
              type="create"
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
            />
          ) : null}
          {openEdit ? (
            <SizeModal
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
      <TableData columnInput={header} dataInput={size} />
    </div>
  );
};

export default Size;
