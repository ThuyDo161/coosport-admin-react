import { Select, Text } from "@mantine/core";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { userInterface } from "../../redux/reducer/user.slice";
import { usersInterface, getUsers } from "../../redux/reducer/users.slice";
import { createUsername, DEFAULT_PASSWORD } from "../../utils/GlobalFunction";

type usersModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  onSubmit: (dataEncryption: usersInterface, type: "create" | "update") => void;
  data?: any;
};

const UsersModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: usersModalType) => {
  const usersStore = useAppSelector((state) => state.users);
  const User = useAppSelector((state) => state.user.user);
  const roleStore = useAppSelector((state) => state.users.roles);
  const dispatch = useAppDispatch();

  const [name, setName] = useState(data?.name || "");
  const [address, setAddress] = useState(data?.address || "");
  const [user_tel, setUser_tel] = useState(data?.user_tel || "");
  const [role_id, setRole] = useState(data?.role_id || "");
  const [status, setStatus] = useState(data?.status || "");

  useEffect(() => {
    return () => {
      dispatch(getUsers());
    };
  }, [usersStore.loading]);

  const encryption = () => {
    let dataEncryption: usersInterface = {
      users_id: data?.users_id || "",
      name,
      address,
      user_tel,
      role_id,
      status,
      username: data?.username,
      password: data?.password,
    };
    if (type === "create") {
      dataEncryption = {
        name,
        address,
        user_tel,
        role_id,
        username: createUsername(name),
        password: DEFAULT_PASSWORD,
      };
    }
    onSubmit(dataEncryption, type);
  };
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${
        type === "create" ? "Thêm mới một nhân viên" : "Cập nhật nhân viên"
      }`}
    >
      {type === "create" && (
        <Text color="red" size="md">
          *Username và password sẽ được tự động tạo <br />
          (password: mặc định là 'abc123', username: được tạo dựa trên tên người
          dùng. VD: Đỗ Hoàng Trung &rarr; dhtrung)
        </Text>
      )}
      {type === "update" && (
        <TextField
          required
          fullWidth
          value={data?.users_id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã người dùng"
          type="text"
        />
      )}

      <TextField
        required
        fullWidth
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Tên người dùng"
        type="text"
      />
      <TextField
        required
        fullWidth
        variant="outlined"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        label="Địa chỉ người dùng"
        type="text"
      />
      <TextField
        required
        fullWidth
        variant="outlined"
        value={user_tel}
        onChange={(e) => setUser_tel(e.target.value)}
        label="Số điện thoại người dùng"
        type="tel"
      />
      {type !== "create" && (
        <Select
          label="Trạng thái"
          size="lg"
          value={status}
          onChange={(e) => {
            e && setStatus(e);
          }}
          sx={{ marginRight: 4, minWidth: 300 }}
          placeholder="Chọn trạng thái người dùng"
          data={[
            {
              value: "1",
              label: "Hoạt động",
            },
            {
              value: "2",
              label: "Khóa",
            },
          ]}
          required
        />
      )}
      {User?.role_id === "1" && (
        <Select
          label="Quyền hạn"
          size="lg"
          value={role_id}
          onChange={(e) => {
            e && setRole(e);
          }}
          sx={{ marginRight: 4, minWidth: 300 }}
          placeholder="Chọn quyền hạn cho người dùng"
          data={roleStore.map((item) => ({
            value: item.role_id,
            label: item.rolename,
          }))}
          required
        />
      )}
    </Modal>
  );
};

export default React.memo(UsersModal);
