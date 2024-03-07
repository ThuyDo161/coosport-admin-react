import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getBills } from "../../redux/reducer/bill.slice";
import { getBrands } from "../../redux/reducer/brand.slice";
import { getCategories } from "../../redux/reducer/category.slice";
import { getProducts } from "../../redux/reducer/products.slice";
import { getUsers } from "../../redux/reducer/users.slice";

const HeaderCard = () => {
  const productStore = useAppSelector((state) => state.productModal.allProduct);
  const categoryStore = useAppSelector((state) => state.category.category);
  const BrandStore = useAppSelector((state) => state.brands.brand);
  const userStore = useAppSelector((state) => state.users.users);
  const billStore = useAppSelector((state) => state.bill.allBill);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
    dispatch(getBrands());
    dispatch(getUsers());
    dispatch(getBills());
  }, []);
  return (
    <div className="row">
      <div className="col-3 col-m-6 col-sm-6">
        <div className="counter bg-primary">
          <p>
            <i className="fas fa-tasks" />
          </p>
          <h3>{productStore.length}</h3>
          <p>Sản phẩm trưng bày</p>
        </div>
      </div>
      <div className="col-3 col-m-6 col-sm-6">
        <div className="counter bg-warning">
          <p>
            <i className="fas fa-spinner" />
          </p>
          <h3>{billStore.length}</h3>
          <p>Đơn hàng</p>
        </div>
      </div>
      <div className="col-3 col-m-6 col-sm-6">
        <div className="counter bg-success">
          <p>
            <i className="fas fa-check-circle" />
          </p>
          <h3>{categoryStore.length + BrandStore.length}</h3>
          <p>Thương hiệu và loại hàng</p>
        </div>
      </div>
      <div className="col-3 col-m-6 col-sm-6">
        <div className="counter bg-danger">
          <p>
            <i className="fa-solid fa-users"></i>
          </p>
          <h3>{userStore.length}</h3>
          <p>Khách hàng</p>
        </div>
      </div>
    </div>
  );
};

export default HeaderCard;
