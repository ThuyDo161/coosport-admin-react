import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  createSuppliers,
  deleteSuppliers,
  getSuppliers,
  updateSuppliers,
} from "../../redux/reducer/supplier.slice";
import { supplierInterface } from "../../redux/reducer/supplier.slice";
import {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import SupplierModal from "./SupplierModal";

const Supplier = () => {
  const supplierStore = useAppSelector((state) => state.supplier);
  const supplier = supplierStore.supplier;
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSuppliers());
  }, [supplierStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "supplier_id",
      width: "5%",
    },
    {
      Header: "Tên nhà cung cấp",
      accessor: "supplier_name",
      width: "30%",
    },
    {
      Header: "Địa chỉ",
      accessor: "supplier_address",
      width: "20%",
    },
    {
      Header: "Liên hệ",
      accessor: "supplier_tel",
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
              handleClickOpenEdit(getsupplier(row.values.supplier_id));
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              handleDelete({ supplier_id: row.values.supplier_id });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
      width: "15%",
    },
  ];

  const getsupplier = (id: any) => {
    return supplier.find((item) => item.supplier_id === id);
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

  const handleSubmit = (data: supplierInterface, type: "create" | "update") => {
    switch (type) {
      case "create":
        dispatch(createSuppliers(data))
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
        dispatch(updateSuppliers(data))
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
    messageConfirm("Xóa " + data.supplier_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteSuppliers(data)).unwrap();
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
  if (supplierStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách các nhà cung cấp
        <span>
          <Button
            variant="contained"
            sx={{ ml: 4 }}
            color="success"
            onClick={handleClickOpen}
          >
            <i className="fa-solid fa-plus"></i>
          </Button>
          {open && (
            <SupplierModal
              type="create"
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
            />
          )}
          {openEdit && (
            <SupplierModal
              type="update"
              data={data}
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={openEdit}
            />
          )}
        </span>
      </p>
      <br />
      <TableData columnInput={header} dataInput={supplier} />
    </div>
  );
};

export default Supplier;
