import React from "react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-nav">
        <li className="sidebar-nav-item">
          <NavLink to="/" className="sidebar-nav-link">
            <div>
              <i className="fa-solid fa-house-chimney"></i>
            </div>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="/products" className="sidebar-nav-link">
            <div>
              <i className="fas fa-tasks" />
            </div>
            <span>Sản phẩm</span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="/categories" className="sidebar-nav-link">
            <div>
              <i className="fa-solid fa-circle-nodes"></i>
            </div>
            <span>Loại sản phẩm</span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="/brands" className="sidebar-nav-link">
            <div>
              <i className="fab fa-accusoft" />
            </div>
            <span>Thương hiệu</span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="color-size" className="sidebar-nav-link">
            <div>
              <i className="fa-solid fa-palette"></i>
            </div>
            <span>Màu sắc &amp; kích thước</span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="/bill" className="sidebar-nav-link">
            <div>
              <i className="fas fa-book-open" />
            </div>
            <span>Hóa đơn</span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="receipt" className="sidebar-nav-link">
            <div>
              <i className="fas fa-bug" />
            </div>
            <span>Đơn nhập</span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="supplier" className="sidebar-nav-link">
            <div>
              <i className="fas fa-adjust" />
            </div>
            <span>Nhà cung cấp</span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="users" className="sidebar-nav-link">
            <div>
              <i className="fab fa-algolia" />
            </div>
            <span>Người dùng</span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink to="slide-hero" className="sidebar-nav-link">
            <div>
              <i className="fab fa-bandcamp" />
            </div>
            <span>Slides</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
