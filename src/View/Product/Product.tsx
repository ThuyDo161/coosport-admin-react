import { Image } from "@mantine/core";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  createProduct,
  deleteProduct,
  getProducts,
  productInterface,
  setLoading,
  updateProduct,
} from "../../redux/reducer/products.slice";
import {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import ProductModal from "./ProductModal";

const Product = () => {
  const productStore = useAppSelector((state) => state.productModal);
  const products: any = productStore.allProduct.map((prod) => ({
    ...prod,
    customImg: (
      <div style={{ width: 120, marginLeft: "auto", marginRight: "auto" }}>
        <Image
          width="120"
          height="180"
          radius="md"
          src={prod.img ? prod.img[0] : null}
          alt={prod.productname}
          withPlaceholder
        />
      </div>
    ),
  }));
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProducts());
  }, [productStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "product_id",
      width: "5%",
    },
    {
      Header: "Tên sản phẩm",
      accessor: "productname",
      width: "20%",
    },
    {
      Header: "Hình ảnh",
      accessor: "customImg",
      width: "10%",
    },
    {
      Header: "Loại sản phẩm",
      accessor: "categoryname",
      width: "15%",
    },
    {
      Header: "Thương hiệu",
      accessor: "brandname",
      width: "15%",
    },
    {
      Header: "Giá nhập",
      accessor: "priceentry",
    },
    {
      Header: "Giá bán",
      accessor: "pricesell",
    },
    {
      Header: "Số lượng",
      accessor: "count",
    },
    {
      Header: "Thao tác",
      Cell: ({ row }: any) => (
        <span>
          <Button
            color="info"
            size="small"
            variant="outlined"
            onClick={() => {
              navigate(row.values.product_id);
            }}
          >
            <i className="fa-solid fa-eye"></i>
          </Button>
          <Button
            color="warning"
            size="small"
            variant="outlined"
            onClick={() => {
              console.log(row.values);

              handleClickOpenEdit(getProduct(row.values.product_id));
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              handleDelete({ product_id: row.values.product_id });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
      width: "15%",
    },
  ];

  const getProduct = (id: any) => {
    return products.find((item: any) => item.product_id === id);
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
    data: productInterface,
    type: "create" | "update" | "createChild"
  ) => {
    switch (type) {
      case "create":
      case "createChild":
        dispatch(createProduct(data))
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
        dispatch(updateProduct(data))
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
    messageConfirm("Xóa " + data.product_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteProduct(data)).unwrap();
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
  if (productStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách các sản phẩm
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
            <ProductModal
              type="create"
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
            />
          ) : null}
          {openEdit ? (
            <ProductModal
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
      <TableData columnInput={header} dataInput={products} />
    </div>
  );
};

export default Product;
