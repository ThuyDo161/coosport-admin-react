import React from "react";
import { Route, Routes } from "react-router-dom";

const Dashboard = React.lazy(() => import("../View/Dashboard"));
const Product = React.lazy(() => import("../View/Product/Product"));
const Category = React.lazy(() => import("../View/Category/Category"));
const Brand = React.lazy(() => import("../View/Brand/Brand"));
const Bill = React.lazy(() => import("../View/Bill/Bill"));
const Receipt = React.lazy(() => import("../View/Receipt/Receipt"));
const ColorAndSize = React.lazy(() => import("../View/ColorAndSize"));
const Supplier = React.lazy(() => import("../View/Supplier/Supplier"));
const Users = React.lazy(() => import("../View/Users/Users"));
const ProductDetail = React.lazy(() => import("../View/Product/ProductDetail"));
const Slide = React.lazy(() => import("../View/Slide/Slide"));
const Banners = React.lazy(() => import("../View/Banners/Banners"));

const router = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: "/products",
    element: <Product />,
  },
  {
    path: "/categories",
    element: <Category />,
  },
  {
    path: "/brands",
    element: <Brand />,
  },
  {
    path: "/bill",
    element: <Bill />,
  },
  {
    path: "/receipt",
    element: <Receipt />,
  },
  {
    path: "/supplier",
    element: <Supplier />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
  {
    path: "/color-size",
    element: <ColorAndSize />,
  },
  {
    path: "/products/:id",
    element: <ProductDetail />,
  },
  {
    path: "/slide-hero",
    element: <Slide />,
  },
  {
    path: "/banners",
    element: <Banners />,
  },
];

const Router = () => {
  return (
    <Routes>
      {router.map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </Routes>
  );
};

export default Router;
