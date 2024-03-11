import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "sweetalert2/dist/sweetalert2.css";
import "./admin.css";
// import "./assets/fontawesome-free-6.1.0-web/css/all.min.css";
import Navbar from "./components/Navbar";
import SideBar from "./components/Sidebar";
import Router from "./routes/Router";
import Login from "./View/Admin/Login";

function User() {
  const body = document.getElementsByTagName("body")[0];
  const themeCookieName = "theme";
  const themeDark = "dark";
  const themeLight = "light";

  function getCookie(cname: string) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function loadTheme() {
    var theme = getCookie(themeCookieName);
    body.classList.add("sidebar-expand");
    body.classList.add(theme === "" ? themeLight : theme);
  }
  loadTheme();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <div className="admin">
                <Navbar />
                <SideBar />
                <div className="wrapper">
                  <Router />
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

User.propTypes = {};

export default User;
