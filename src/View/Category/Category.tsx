import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  CategoryInterface,
  createCategories,
  deleteCategories,
  getCategories,
  updateCategories,
} from "../../redux/reducer/category.slice";
import {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import CategoryModal from "./CategoryModal";

const Category = () => {
  const categoryStore = useAppSelector((state) => state.category);
  const category = categoryStore.category;
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, [categoryStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "category_id",
      width: "5%",
    },
    {
      Header: "Tên loại sản phẩm",
      accessor: "categoryname",
      width: "20%",
    },
    {
      Header: "Slug loại sản phẩm",
      accessor: "category_slug",
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
              handleClickOpenEdit(getCategory(row.values.category_id));
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              handleDelete({ category_id: row.values.category_id });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
      width: "15%",
    },
  ];

  const getCategory = (id: any) => {
    return category.find((item) => item.category_id === id);
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

  const handleSubmit = (data: CategoryInterface, type: "create" | "update") => {
    switch (type) {
      case "create":
        dispatch(createCategories(data))
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
        dispatch(updateCategories(data))
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
    messageConfirm("Xóa " + data.category_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteCategories(data)).unwrap();
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
  if (categoryStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách các loại sản phẩm
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
            <CategoryModal
              type="create"
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
            />
          ) : null}
          {openEdit ? (
            <CategoryModal
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
      <TableData columnInput={header} dataInput={category} />
    </div>
  );
};

export default Category;
