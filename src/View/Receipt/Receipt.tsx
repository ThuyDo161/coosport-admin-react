import { Button } from "@mui/material";
import pdf from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import Roboto from "../../assets/Roboto-Regular.ttf";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  createReceipt,
  deleteReceipt,
  getReceipts,
  receiptInterface,
  updateReceipt,
} from "../../redux/reducer/receipt.slice";
import numberWithCommas, {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import PrintModal from "./PrintModal";
import ReceiptModal from "./ReceiptModal";
const { Font } = pdf;

Font.register({
  family: "Roboto",
  src: Roboto,
});

const receipt = () => {
  const receiptStore = useAppSelector((state) => state.receipt);
  const receipts = receiptStore.allReceipt;
  const [open, setOpen] = React.useState(false);
  const [openPrint, setOpenPrint] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getReceipts());
  }, [receiptStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "receipt_id",
      width: "5%",
    },
    {
      Header: "Nhân viên",
      accessor: "user_name",
      width: "20%",
    },
    {
      Header: "Ngày nhập",
      accessor: "receipt_date",
      width: "15%",
    },
    {
      Header: "Nhà cung cấp",
      accessor: "supplier_name",
    },
    {
      Header: "Tổng tiền",
      accessor: "totalprice",
    },
    {
      Header: "Thao tác",
      accessor: "action",
      width: "16%",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <span>
          <Button
            color="success"
            size="small"
            variant="outlined"
            title="In hóa đơn"
            onClick={() => {
              handleClickPrint(getReceipt(row.values.receipt_id));
            }}
          >
            <i className="fa-solid fa-print"></i>
          </Button>
          <Button
            color="warning"
            size="small"
            variant="outlined"
            onClick={() => {
              handleClickOpenEdit(getReceipt(row.values.receipt_id));
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            title="Hủy bỏ đơn hàng"
            variant="outlined"
            onClick={() => {
              handleDelete({ receipt_id: row.values.receipt_id });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
    },
  ];

  const getReceipt = (id: any) => {
    return receipts.find((item) => item.receipt_id === id);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenPrint = () => {
    setOpenPrint(true);
  };

  const handleClickPrint = (data: any) => {
    setData(data);
    setOpenPrint(true);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenPrint(false);
    setOpenEdit(false);
  };
  const handleClickOpenEdit = (data: any) => {
    setData(data);
    setOpenEdit(true);
  };

  const handleSubmit = (
    dataSend: receiptInterface,
    type: "create" | "update"
  ) => {
    switch (type) {
      case "create":
        dispatch(createReceipt(dataSend))
          .unwrap()
          .then((res) => {
            if (res.code === 200) {
              messageSave(res.success);
            } else {
              messageError(res.error);
            }
          });
        break;
      case "update":
        if (JSON.stringify(dataSend.items) === JSON.stringify(data.items)) {
          dataSend.items = null;
        }
        dispatch(updateReceipt(dataSend))
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
    messageConfirm("Xóa " + data.receipt_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteReceipt(data)).unwrap();
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
  if (receiptStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách các hóa đơn nhập
        <span>
          <Button
            variant="contained"
            sx={{ ml: 4 }}
            color="success"
            onClick={handleClickOpen}
          >
            <i className="fa-solid fa-plus"></i>
          </Button>
        </span>
      </p>
      <br />
      <TableData
        columnInput={header}
        dataInput={receipts}
        sortDefault="receipt_date"
      />
      {openPrint && (
        <PrintModal
          type="create"
          data={data}
          handleClose={handleClose}
          open={openPrint}
        />
      )}
      {openEdit && (
        <ReceiptModal
          type={"update"}
          data={data}
          handleClose={handleClose}
          onSubmit={handleSubmit}
          open={openEdit}
        />
      )}
      {open && (
        <ReceiptModal
          type={"create"}
          handleClose={handleClose}
          onSubmit={handleSubmit}
          open={open}
        />
      )}
    </div>
  );
};

export default receipt;
