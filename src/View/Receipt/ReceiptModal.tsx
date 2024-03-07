import { NumberInput, Select } from "@mantine/core";
import {
  Box,
  Button,
  MenuItem,
  Select as SelectMui,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Column } from "react-table";
import Modal from "../../components/Modal/Modal";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getAllProducts } from "../../redux/reducer/products.slice";
import { receiptInterface } from "../../redux/reducer/receipt.slice";
import { getSuppliers } from "../../redux/reducer/supplier.slice";
import { getUser } from "../../redux/reducer/user.slice";
import { messageError } from "../../utils/GlobalFunction";
import numberWithCommas from "../../utils/GlobalFunction";

type receiptModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (
    dataEncryption: receiptInterface,
    type: "create" | "update"
  ) => void;
  data?: any;
};

const receiptModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: receiptModalType) => {
  const userStore = useAppSelector((state) => state.user);
  const supplierStore = useAppSelector((state) => state.supplier);
  const productStore = useAppSelector((state) => state.productModal);
  const dispatch = useAppDispatch();

  const [userName, setUserName] = useState<string>(userStore.user?.name || "");
  const [receipt_date] = useState(data?.receipt_date || "");
  const [totalPrice] = useState(data?.totalPrice || "0");
  let [items, setItems] = useState(data?.items || []);
  let [quantityItem, setQuantityItem] = useState(0);
  let [item, setItem] = useState("");
  const [supplier_id, setSupplier_id] = useState(data?.supplier_id || "");

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "id",
      width: "10%",
    },
    {
      Header: "Tên sản phẩm",
      accessor: "item_name",
      width: "30%",
    },
    {
      Header: "Giá",
      accessor: "item_price",
      width: "15%",
    },
    {
      Header: "Số lượng",
      accessor: "quantity",
    },
    {
      Header: "Thành tiền",
      Cell: ({ row }: any) => (
        <div>
          {numberWithCommas(
            Number(row.values?.item_price) * Number(row.values?.quantity)
          )}
        </div>
      ),
    },
    {
      Header: "Thao tác",
      accessor: "action",
      width: "16%",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <span>
          <Button
            color="warning"
            size="small"
            variant="outlined"
            onClick={() => {
              editItemHandler(row.values?.id);
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            title="Hủy bỏ item"
            variant="outlined"
            onClick={() => {
              deleteItemHandler(row.values?.id);
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getUser());
    dispatch(getSuppliers());
    dispatch(getAllProducts());
  }, [userStore.loading, supplierStore.loading]);

  const encryption = () => {
    if (type === "create" && !supplier_id) {
      messageError("Bạn phải chọn nhà cung cấp");
      return;
    } else if (type === "update" && !receipt_date) {
      messageError("Bạn phải ghi ngày lấy hàng đơn hàng");
      return;
    } else {
      const dataEncryption: receiptInterface = {
        receipt_id: data?.receipt_id || "",
        receipt_date,
        user_id: userStore.user?.user_id || "1",
        supplier_id,
        items,
      };
      onSubmit(dataEncryption, type);
    }
  };

  const addItemHandler = () => {
    let product = productStore.allProduct.find((i) => i.product_id === item);
    if (items.find((i: any) => i.id === item)) {
      let index = items.findIndex((i: any) => i.id === item);
      let newItems = items.map((i: any) => ({ ...i }));
      newItems[index].quantity = Number(quantityItem);
      items = [...newItems];
    } else {
      items = [
        ...items,
        {
          id: product?.product_id,
          item_name: product?.productname,
          item_price: product?.priceentry,
          quantity: quantityItem,
        },
      ];
    }

    setItems(items);
    setItem("");
    setQuantityItem(0);
  };

  const deleteItemHandler = (item: any) => {
    let it = items.findIndex((i: any) => i.id === item);
    let newItems = items.map((i: any) => ({ ...i }));
    newItems.splice(it, 1);
    setItems([...newItems]);
  };
  const editItemHandler = useCallback(
    (item: any) => {
      let it = items.find((i: any) => i.id === item);
      setItem(it.id);
      setQuantityItem(Number(it.quantity));
    },
    [items]
  );

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${type === "create" ? "Xác nhận hóa đơn" : "Cập nhật hóa đơn"}`}
    >
      {type === "update" && (
        <TextField
          required
          fullWidth
          value={data?.receipt_id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã hóa đơn"
          type="text"
        />
      )}

      <TextField
        required
        fullWidth
        variant="outlined"
        value={userName}
        InputProps={{ readOnly: true }}
        label="Tên nhân viên"
        type="text"
      />
      {type === "update" && (
        <TextField
          required
          fullWidth
          variant="outlined"
          value={receipt_date}
          InputProps={{ readOnly: true }}
          label="Ngày nhập"
          type="text"
        />
      )}
      <SelectMui
        required
        fullWidth
        labelId="size"
        value={supplier_id || ""}
        onChange={(e) => setSupplier_id(e.target.value)}
        defaultValue=""
        displayEmpty
      >
        <MenuItem value="">Nhà cung cấp</MenuItem>
        {supplierStore.supplier.map((item) => (
          <MenuItem key={item.supplier_id} value={item.supplier_id}>
            {item.supplier_name}
          </MenuItem>
        ))}
      </SelectMui>
      <Box sx={{ fontSize: 18, mt: 2, mb: 2, fontWeight: 600 }}>Chi tiết</Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Select
          label="Sản phẩm"
          size="lg"
          value={item}
          searchable
          nothingFound="Không tìm thấy sản phẩm"
          onChange={(e) => {
            e && setItem(e);
          }}
          sx={{ marginRight: 4, minWidth: 300 }}
          placeholder="Chọn sản phẩm"
          data={productStore.allProduct.map((item) => ({
            value: item.product_id,
            label: item.productname,
          }))}
          required
        />
        <NumberInput
          size="lg"
          value={quantityItem}
          onChange={(e) => {
            e && setQuantityItem(e);
          }}
          placeholder="Số lượng"
          label="Số lượng"
          min={1}
          required
        />
        <Button
          variant="contained"
          color="success"
          disabled={!item || !quantityItem}
          onClick={() => {
            addItemHandler();
          }}
          sx={{ maxHeight: 30, ml: 4, mt: 4 }}
        >
          <i className="fa-solid fa-plus"></i>
        </Button>
      </Box>
      <TableData columnInput={header} dataInput={items} />
      <Box sx={{ fontSize: 18, mt: 2, mb: 2, fontWeight: 600 }}>
        Tổng tiền {}
        {numberWithCommas(
          items?.reduce(
            (t: number, i: any) =>
              t + Number(i.item_price) * Number(i.quantity),
            0
          )
        )}
      </Box>
    </Modal>
  );
};

export default React.memo(receiptModal);
