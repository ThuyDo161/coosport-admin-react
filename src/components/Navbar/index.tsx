import { Avatar, Box, Divider, Popover } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersModal from "../../View/Users/UsersModal";
import LogoCoosport from "../../assets/favicon/logo.jpg";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  getUser,
  logOutAccount,
  setUser,
} from "../../redux/reducer/user.slice";
import { updateUsers } from "../../redux/reducer/users.slice";
import {
  getAvatar,
  messageError,
  messageSave,
} from "../../utils/GlobalFunction";

const Navbar = () => {
  const User = useAppSelector((state) => state.user.user);
  const [opened, setOpened] = useState({ menu: false, edit: false });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeCookieName = "theme";
  const themeDark = "dark";
  const themeLight = "light";
  const body = document.getElementsByTagName("body")[0];

  const handleClose = () => {
    setOpened({ menu: false, edit: false });
  };
  const handleClickOpenEdit = () => {
    setOpened({ menu: false, edit: true });
  };

  const handleSubmit = (data: any, type: "create" | "update") => {
    switch (type) {
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
    dispatch(setUser(data));
    dispatch(getUser());
  };

  const [isHovering, setIsHovering] = useState<{ [key: string]: boolean }>({
    tag1: false,
    tag2: false,
  });

  const handleMouseEnter = (tag: string) => {
    isHovering[tag] = true;
    setIsHovering({ ...isHovering });
  };

  const handleMouseLeave = (tag: string) => {
    isHovering[tag] = false;
    setIsHovering({ ...isHovering });
  };

  useEffect(() => {
    if (!User) {
      dispatch(getUser())
        .unwrap()
        .then((res) => {
          if (!res.user) {
            navigate("/login", { replace: true });
          }
        })
        .catch(() => {
          navigate("/login", { replace: true });
        });
    }
  });

  function collapseSidebar() {
    body.classList.toggle("sidebar-expand");
  }

  function setCookie(cname: string, cvalue: string, exdays?: any) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function switchTheme(event: any) {
    event.preventDefault();
    if (body.classList.contains(themeLight)) {
      body.classList.remove(themeLight);
      body.classList.add(themeDark);
      setCookie(themeCookieName, themeDark);
    } else {
      body.classList.remove(themeDark);
      body.classList.add(themeLight);
      setCookie(themeCookieName, themeLight);
    }
  }

  return (
    <div className="navbar">
      {/* nav left */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link">
            <i className="fas fa-bars" onClick={collapseSidebar} />
          </a>
        </li>
        <li className="nav-item">
          <img
            src={LogoCoosport}
            alt="Vuorder logo"
            className="logo logo-light"
          />
        </li>
      </ul>
      {/* end nav left */}
      {/* form */}
      <form className="navbar-search">
        <input
          type="text"
          name="Search"
          className="navbar-search-input"
          placeholder="What you looking for..."
        />
        <i className="fas fa-search" />
      </form>
      {/* end form */}
      {/* nav right */}
      <ul className="navbar-nav nav-right">
        <li className="nav-item mode">
          <a className="nav-link" href="#" onClick={switchTheme}>
            <i className="fas fa-moon dark-icon" />
            <i className="fas fa-sun light-icon" />
          </a>
        </li>
        <li className="nav-item avt-wrapper">
          <div className="avt dropdown">
            <Popover
              opened={opened.menu}
              onClose={() => setOpened({ ...opened, menu: false })}
              target={
                <Box
                  onClick={() => setOpened({ ...opened, menu: !opened.menu })}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Avatar color="cyan" radius="xl" sx={{ marginRight: 4 }}>
                    {User?.name && getAvatar(User.name)}
                  </Avatar>
                  {User?.name}
                </Box>
              }
              width={260}
              position="bottom"
              withArrow
            >
              <Box
                style={{
                  padding: 5,
                  cursor: "pointer",
                  textAlign: "center",
                  color: isHovering.tag1 ? "rgba(0,0,0,.5)" : "",
                }}
                onMouseEnter={() => handleMouseEnter("tag1")}
                onMouseLeave={() => handleMouseLeave("tag1")}
                // onClick={() => navigate("/info", { replace: true })}
                onClick={async () => {
                  Object.assign(opened, false);
                  handleClickOpenEdit();
                }}
              >
                Thông tin người dùng
              </Box>
              <Divider />
              <Box
                style={{
                  padding: 5,
                  cursor: "pointer",
                  textAlign: "center",
                  color: isHovering.tag2 ? "rgba(255,0,0,.5)" : "",
                }}
                onMouseEnter={() => handleMouseEnter("tag2")}
                onMouseLeave={() => handleMouseLeave("tag2")}
                onClick={() => dispatch(logOutAccount())}
              >
                Đăng xuất
              </Box>
            </Popover>
            {opened.edit && (
              <UsersModal
                type="update"
                data={User}
                handleClose={handleClose}
                onSubmit={handleSubmit}
                open={opened.edit}
              />
            )}
          </div>
        </li>
      </ul>
      {/* end nav right */}
    </div>
  );
};

export default Navbar;
