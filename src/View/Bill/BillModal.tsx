import { Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { billInterface } from "../../redux/reducer/bill.slice";
import { getBrands } from "../../redux/reducer/brand.slice";
import { getCategories } from "../../redux/reducer/category.slice";
import { getColors } from "../../redux/reducer/color.slice";
import { getSizes } from "../../redux/reducer/size.slice";
import { messageError } from "../../utils/GlobalFunction";

type billModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (dataEncryption: billInterface, type: "create" | "update") => void;
  data?: any;
};

const billModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: billModalType) => {
  const categoryStore = useAppSelector((state) => state.category);
  const brandStore = useAppSelector((state) => state.brands);
  const colorStore = useAppSelector((state) => state.colors);
  const sizeStore = useAppSelector((state) => state.sizes);
  const dispatch = useAppDispatch();

  const [user_name, setUserName] = useState<string>(data?.user_name || "");
  const [user_tel, setUserTel] = useState(data?.user_tel || "");
  const [address, setAddress] = useState(data?.address || "");
  const [status, setStatus] = useState(data?.status.props["data-tag"] || "");
  const [totalprice, setTotalPrice] = useState(data?.totalprice || "");
  const [note, setNote] = useState(data?.note || "");
  const [deliverytime, setDeliverytime] = useState(data?.deliverytime || "");
  const [items, setItems] = useState(data?.items || "");
  const [bill_id] = useState(data?.bill_id || "");
  const [bill_date] = useState(data?.bill_date || "");

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBrands());
    dispatch(getColors());
    dispatch(getSizes());
  }, [
    categoryStore.loading,
    brandStore.loading,
    sizeStore.loading,
    colorStore.loading,
  ]);

  const encryption = () => {
    if (type === "create" && !deliverytime) {
      messageError("Bạn phải hẹn ngày lấy hàng");
      return;
    } else if (type === "update" && (!deliverytime || !status)) {
      messageError("Bạn phải hẹn ngày lấy hàng và đặt trạng thái đơn hàng");
      return;
    } else {
      const dataEncryption: billInterface = {
        bill_id: data?.bill_id || "",
        deliverytime,
        status: type === "create" ? "1" : status,
        bill_date: "",
        user_id: "",
        items: [],
      };
      onSubmit(dataEncryption, type);
    }
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${type === "create" ? "Xác nhận hóa đơn" : "Cập nhật hóa đơn"}`}
    >
      {type === "update" ? (
        <TextField
          required
          fullWidth
          value={data?.bill_id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã hóa đơn"
          type="text"
        />
      ) : null}

      <TextField
        required
        fullWidth
        variant="outlined"
        value={user_name}
        InputProps={{ readOnly: true }}
        label="Tên khách hàng"
        type="text"
      />
      <TextField
        required
        fullWidth
        variant="outlined"
        value={bill_date}
        InputProps={{ readOnly: true }}
        label="Ngày đặt"
        type="text"
      />
      {type === "create" ? (
        <>
          <DatePicker
            size="lg"
            label="Ngày lấy hàng"
            onChange={(e) => setDeliverytime(dayjs(e).format("YYYY-MM-DD"))}
            inputFormat="YYYY-MM-DD"
            defaultValue={new Date()}
            minDate={dayjs(new Date()).toDate()}
          />
        </>
      ) : (
        <>
          <Select
            size="lg"
            label="Trạng thái đơn hàng"
            placeholder="Chọn trạng thái"
            data={[
              { value: "0", label: "Chờ xử lý" },
              { value: "1", label: "Đang vận chuyển" },
              { value: "2", label: "Đã giao" },
              { value: "3", label: "Lỗi" },
            ]}
            value={status}
            onChange={setStatus}
          />
          <DatePicker
            size="lg"
            label="Ngày lấy hàng"
            value={new Date(dayjs(deliverytime).format("YYYY-MM-DD"))}
            onChange={(e) => setDeliverytime(dayjs(e).format("YYYY-MM-DD"))}
            inputFormat="YYYY-MM-DD"
            minDate={dayjs(new Date()).toDate()}
          />
        </>
      )}
    </Modal>
  );
};

export default React.memo(billModal);
