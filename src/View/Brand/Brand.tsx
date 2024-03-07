import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  BrandInterface,
  createBrands,
  deleteBrands,
  getBrands,
  updateBrands,
} from "../../redux/reducer/brand.slice";
import {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import BrandModal from "./BrandModal";
import brandModal from "./BrandModal";

const Brand = () => {
  const brandStore = useAppSelector((state) => state.brands);
  const brand = brandStore.brand;
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands());
  }, [brandStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "brand_id",
      width: "5%",
    },
    {
      Header: "Tên thương hiệu",
      accessor: "brandname",
      width: "20%",
    },
    {
      Header: "Slug thương hiệu",
      accessor: "brand_slug",
      width: "15%",
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
              handleClickOpenEdit(getbrand(row.values.brand_id));
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              handleDelete({ brand_id: row.values.brand_id });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
      width: "15%",
    },
  ];

  const getbrand = (id: any) => {
    return brand.find((item) => item.brand_id === id);
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

  const handleSubmit = (data: BrandInterface, type: "create" | "update") => {
    switch (type) {
      case "create":
        dispatch(createBrands(data))
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
        dispatch(updateBrands(data))
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
    messageConfirm("Xóa " + data.brand_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteBrands(data)).unwrap();
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
  if (brandStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách các thương hiệu sản phẩm
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
            <BrandModal
              type="create"
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
            />
          ) : null}
          {openEdit ? (
            <BrandModal
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
      <TableData columnInput={header} dataInput={brand} />
    </div>
  );
};

export default Brand;
