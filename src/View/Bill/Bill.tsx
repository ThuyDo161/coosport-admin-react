import PrintModal from "./PrintModal";
import pdf from "@react-pdf/renderer";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  confirm,
  deleteBill,
  getBills,
  billInterface,
  setLoading,
  updateBill,
} from "../../redux/reducer/bill.slice";
import numberWithCommas, {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import Roboto from "../../assets/Roboto-Regular.ttf";
import BillModal from "./BillModal";
const { Font } = pdf;

Font.register({
  family: "Roboto",
  src: Roboto,
});

const Bill = () => {
  const billStore = useAppSelector((state) => state.bill);
  const bills = billStore.allBill.map((item) => {
    let newStatus;
    switch (item.status) {
      case "0":
        newStatus = (
          <span className="badge badge-warning" data-tag="0">
            Đang chờ
          </span>
        );
        break;
      case "1":
        newStatus = (
          <span className="badge badge-primary" data-tag="1">
            Đang giao
          </span>
        );
        break;
      case "2":
        newStatus = (
          <span className="badge badge-success" data-tag="2">
            Đã giao
          </span>
        );
        break;
      case "3":
        newStatus = (
          <span className="badge badge-danger" data-tag="3">
            Hủy đơn
          </span>
        );
        break;
      default:
        newStatus = <span className="badge badge-danger">Lỗi</span>;
        break;
    }
    const newTotal = numberWithCommas(item.totalprice!);
    return {
      ...item,
      status: newStatus,
      totalprice: newTotal,
    };
  });
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [type, setType] = React.useState("");
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBills());
  }, [billStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "bill_id",
      width: "5%",
    },
    {
      Header: "Khách hàng",
      accessor: "user_name",
      width: "20%",
    },
    {
      Header: "Ngày đặt",
      accessor: "bill_date",
      width: "10%",
    },
    {
      Header: "Ngày nhận",
      accessor: "deliverytime",
      width: "10%",
    },
    {
      Header: "Tổng tiền",
      accessor: "totalprice",
    },
    {
      Header: "Trạng thái",
      accessor: "status",
    },
    {
      Header: "Ghi chú",
      accessor: "note",
      width: "15%",
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
              handleClickPrint(getbill(row.values.bill_id));
            }}
          >
            <i className="fa-solid fa-print"></i>
          </Button>
          {row.values.status.props["data-tag"] == "0" ? (
            <Button
              color="warning"
              size="small"
              variant="outlined"
              title="Nhận đơn hàng"
              onClick={() => {
                handleClickOpenEdit(
                  getbill(row.values.bill_id),
                  row.values.status.props["data-tag"]
                );
              }}
            >
              <i className="fa-solid fa-bars-progress"></i>
            </Button>
          ) : row.values.status.props["data-tag"] == "1" ? (
            <Button
              color="warning"
              size="small"
              title="Cập nhật đơn hàng"
              variant="outlined"
              onClick={() => {
                handleClickOpenEdit(
                  getbill(row.values.bill_id),
                  row.values.status.props["data-tag"]
                );
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </Button>
          ) : null}
          <Button
            size="small"
            color="error"
            title="Xóa bỏ đơn hàng"
            variant="outlined"
            onClick={() => {
              handleDelete({ bill_id: row.values.bill_id });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
    },
  ];

  const getbill = (id: any) => {
    return bills.find((item) => item.bill_id === id);
  };

  const handleClickPrint = (data: any) => {
    setData(data);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
  };
  const handleClickOpenEdit = (data: any, status: any) => {
    setType(status);
    setData(data);
    setOpenEdit(true);
  };

  const handleSubmit = (data: billInterface, type: "create" | "update") => {
    switch (type) {
      case "create":
        dispatch(confirm(data))
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
        dispatch(updateBill(data))
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
    messageConfirm("Xóa " + data.bill_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteBill(data)).unwrap();
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
  if (billStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>Danh sách các hóa đơn </p>
      <br />
      <TableData
        columnInput={header}
        dataInput={bills}
        sortDefault="bill_date"
      />
      {open ? (
        <PrintModal
          type="create"
          data={data}
          handleClose={handleClose}
          open={open}
        />
      ) : null}
      {openEdit ? (
        <BillModal
          type={type == "0" ? "create" : "update"}
          data={data}
          handleClose={handleClose}
          onSubmit={handleSubmit}
          open={openEdit}
        />
      ) : null}
    </div>
  );
};

export default Bill;
