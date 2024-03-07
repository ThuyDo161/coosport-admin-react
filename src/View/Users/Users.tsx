import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Column } from "react-table";
import TableData from "../../components/TableData/TableData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  createUsers,
  deleteUsers,
  getUsers,
  resetUser,
  updateUsers,
} from "../../redux/reducer/users.slice";
import { usersInterface } from "../../redux/reducer/users.slice";
import {
  messageConfirm,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";
import UsersModal from "./UsersModal";

const Users = () => {
  const usersStore = useAppSelector((state) => state.users);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();

  const users = usersStore.users.map((item) => {
    let newStatus;
    switch (item.status) {
      case "1":
        newStatus = (
          <span className="badge badge-primary" data-tag="1">
            Hoạt động
          </span>
        );
        break;
      default:
        newStatus = <span className="badge badge-danger">Khóa</span>;
        break;
    }
    return {
      ...item,
      status: newStatus,
    };
  });
  const staff = usersStore.staff.map((item) => {
    let newStatus;
    switch (item.status) {
      case "1":
        newStatus = (
          <span className="badge badge-primary" data-tag="1">
            Hoạt động
          </span>
        );
        break;
      default:
        newStatus = <span className="badge badge-danger">Khóa</span>;
        break;
    }
    return {
      ...item,
      status: newStatus,
    };
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [usersStore.loading]);

  const header: Column<any>[] = [
    {
      Header: "ID",
      accessor: "users_id",
      width: "5%",
    },
    {
      Header: "Username",
      accessor: "username",
      width: "5%",
    },
    {
      Header: "Tên người dùng",
      accessor: "name",
      width: "15%",
    },
    {
      Header: "Địa chỉ",
      accessor: "address",
      width: "30%",
    },
    {
      Header: "Liên hệ",
      accessor: "user_tel",
    },
    {
      Header: "Chức vụ",
      accessor: "role_name",
    },
    {
      Header: "Trạng thái",
      accessor: "status",
    },
    {
      Header: "Thao tác",
      accessor: "action",
      Cell: ({ row }: any) => (
        <span>
          <Button
            color="primary"
            size="small"
            variant="outlined"
            title="Reset mật khẩu người dùng"
            onClick={() => {
              handleReset({ users_id: row.values.users_id });
            }}
          >
            <i className="fa-solid fa-gears"></i>
          </Button>
          <Button
            color="warning"
            size="small"
            variant="outlined"
            onClick={() => {
              handleClickOpenEdit(getUser(row.values.users_id));
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              handleDelete({ users_id: row.values.users_id });
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </span>
      ),
      width: "15%",
    },
  ];

  const getUser = (id: any) => {
    return usersStore.allUsers.find((item) => item.users_id === id);
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

  const handleSubmit = (data: usersInterface, type: "create" | "update") => {
    switch (type) {
      case "create":
        dispatch(createUsers(data))
          .unwrap()
          .then((res) => {
            if (res.code === 200) {
              messageSave(res.message);
            } else {
              messageError(res.message);
            }
          });
        break;
      case "update":
        dispatch(updateUsers(data))
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
    messageConfirm("Xóa " + data.users_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(deleteUsers(data)).unwrap();
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
  const handleReset = (data: any) => {
    messageConfirm("Xác nhận reset mật khẩu của " + data.users_id)
      .then((result) => {
        if (result.isConfirmed) {
          return dispatch(resetUser(data)).unwrap();
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
  if (usersStore.loading !== "succeeded") {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-box">
      <p>
        Danh sách các người dùng
        <span>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 4 }}
            onClick={handleClickOpen}
          >
            <i className="fa-solid fa-plus"></i>
          </Button>
          {open && (
            <UsersModal
              type="create"
              handleClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
            />
          )}
          {openEdit && (
            <UsersModal
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
      <TableData columnInput={header} dataInput={users} />
      <p>Danh sách nhân viên</p>
      <TableData columnInput={header} dataInput={staff} />
    </div>
  );
};

export default Users;
