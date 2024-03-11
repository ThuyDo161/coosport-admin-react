import { CardMedia, MenuItem, Select, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import imgDefault from "../../assets/image-default.png";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getBrands } from "../../redux/reducer/brand.slice";
import { getCategories } from "../../redux/reducer/category.slice";
import { getColors } from "../../redux/reducer/color.slice";
import { productInterface } from "../../redux/reducer/products.slice";
import { getSizes } from "../../redux/reducer/size.slice";

type ProductModalType = {
  type: "create" | "update" | "createChild";
  open: boolean;
  handleClose: () => void;
  onSubmit: (
    dataEncryption: productInterface,
    type: "create" | "update" | "createChild"
  ) => void;
  data?: any;
};

const ProductModal = ({
  data,
  type,
  open,
  handleClose,
  onSubmit,
}: ProductModalType) => {
  const categoryStore = useAppSelector((state) => state.category);
  const productStore = useAppSelector((state) => state.productModal.allProduct);
  const brandStore = useAppSelector((state) => state.brands);
  const colorStore = useAppSelector((state) => state.colors);
  const sizeStore = useAppSelector((state) => state.sizes);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const parent = productStore.find((item) => item.product_id === id);

  const [productname, setProductname] = useState(
    (id ? parent?.productname : data?.productname) || ""
  );
  const [category_id, setCategory_id] = useState(
    data?.category_id || parent?.category_id || ""
  );
  const [brand_id, setBrand_id] = useState(
    data?.brand_id || parent?.brand_id || ""
  );
  const [pricesell, setPricesell] = useState(
    data?.pricesell || parent?.pricesell || ""
  );
  const [priceentry, setPriceentry] = useState(
    data?.priceentry || parent?.priceentry || ""
  );
  const [color, setColor] = useState(data?.color || "");
  const [size, setSize] = useState(data?.size || "");
  const [count, setCount] = useState(data?.count || "");
  const [description, setDescription] = useState(
    data?.description || parent?.description || ""
  );
  const [parent_id] = useState(data?.parent_id || id || "");
  const [img1, setImg1] = useState<string>(data?.img[0] || "");
  const imgFile1 = useRef<{ file: any; name: string; id: 1 } | null>(null);
  const [img2, setImg2] = useState<string>(data?.img[1] || "");
  const imgFile2 = useRef<{ file: any; name: string; id: 2 } | null>(null);

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
    const imgArray = [];
    imgFile1.current ? imgArray.push(imgFile1.current) : null;
    imgFile2.current ? imgArray.push(imgFile2.current) : null;
    const dataEncryption: productInterface = {
      product_id: data?.product_id || "",
      productname: parent_id
        ? `${productname}-${
            colorStore.color.find((c) => c.color_id === color)?.colorname
          }-${sizeStore.size.find((s) => s.size_id === size)?.sizename}`
        : productname,
      category_id,
      brand_id,
      pricesell,
      priceentry,
      color,
      size,
      description,
      img: imgArray,
      parent_id,
      count: Number(count),
      product_slug: parent_id ? "" : slugify(productname.toLowerCase(), "_"),
    };
    onSubmit(dataEncryption, type);
  };

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      onSubmit={encryption}
      title={`${type === "create" ? "Thêm mới sản phẩm" : "Cập nhật sản phẩm"}`}
    >
      {type === "update" ? (
        <TextField
          required
          fullWidth
          value={data?.product_id || ""}
          variant="filled"
          InputProps={{ readOnly: true }}
          label="Mã sản phẩm"
          type="text"
        />
      ) : null}
      {!parent_id && (
        <TextField
          required
          fullWidth
          variant="outlined"
          value={productname}
          onChange={(e) => setProductname(e.target.value)}
          label="Tên sản phẩm"
          type="text"
        />
      )}
      {!parent_id && (
        <Select
          required
          fullWidth
          labelId="brand"
          value={brand_id}
          onChange={(e) => setBrand_id(e.target.value)}
          defaultValue=""
          displayEmpty
        >
          <MenuItem value="">Thương hiệu</MenuItem>
          {brandStore.brand.map((item) => (
            <MenuItem key={item.brand_id} value={item.brand_id}>
              {item.brandname}
            </MenuItem>
          ))}
        </Select>
      )}
      {!parent_id && (
        <Select
          required
          fullWidth
          labelId="category"
          value={category_id}
          onChange={(e) => setCategory_id(e.target.value)}
          defaultValue=""
          displayEmpty
        >
          <MenuItem value="">Loại sản phẩm</MenuItem>
          {categoryStore.category.map((item) => (
            <MenuItem key={item.category_id} value={item.category_id}>
              {item.categoryname}
            </MenuItem>
          ))}
        </Select>
      )}
      {!parent_id && (
        <TextField
          required
          fullWidth
          variant="outlined"
          value={Number(priceentry)}
          inputProps={{
            min: 0,
            step: 500,
          }}
          onChange={(e) => setPriceentry(e.target.value)}
          label="Giá nhập"
          type="number"
        />
      )}
      {!parent_id && (
        <TextField
          required
          fullWidth
          variant="outlined"
          inputProps={{
            min: 0,
            step: 500,
          }}
          value={Number(pricesell)}
          onChange={(e) => setPricesell(e.target.value)}
          label="Giá bán"
          type="number"
        />
      )}
      <Select
        required
        fullWidth
        labelId="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        defaultValue=""
        displayEmpty
      >
        <MenuItem value="">Màu sắc</MenuItem>
        {colorStore.color.map((item) => (
          <MenuItem key={item.color_id} value={item.color_id}>
            <span
              style={{
                background: item.color_code,
                border: "1px solid #e0e0e0",
                marginRight: 8,
                width: 30,
                height: 20,
              }}
            ></span>
            {item.colorname.toLocaleUpperCase()}{" "}
          </MenuItem>
        ))}
      </Select>
      <Select
        required
        fullWidth
        labelId="size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        defaultValue=""
        displayEmpty
      >
        <MenuItem value="">Kích cỡ</MenuItem>
        {sizeStore.size.map((item) => (
          <MenuItem key={item.size_id} value={item.size_id}>
            {item.sizename}
          </MenuItem>
        ))}
      </Select>
      <TextField
        required
        fullWidth
        variant="outlined"
        label="Số lượng"
        value={Number(count)}
        inputProps={{ min: 0 }}
        type="number"
        onChange={(e) => setCount(e.target.value)}
      />
      {parent_id || type === "createChild" ? null : (
        <Box sx={{ mt: 1, mb: 2 }}>
          <input
            type="file"
            id="fileEdit"
            hidden
            onChange={(e) => {
              if (e.target.files![0].type!.split("/")[0] === "image") {
                let path = URL.createObjectURL(e.target.files![0]);
                let fileReader = new FileReader();
                fileReader.readAsDataURL(e.target.files![0]);

                fileReader.onload = (event) => {
                  imgFile1.current = {
                    id: 1,
                    file: event.target?.result,
                    name: e.target.files![0]!.name,
                  };
                };
                setImg1(path);
              } else {
                e.target.value = "";
              }
            }}
            accept="image/*"
          />
          <label htmlFor="fileEdit">
            <CardMedia
              component="img"
              style={{
                maxHeight: 243,
                float: "left",
                objectFit: "cover",
                width: "auto",
                maxWidth: 400,
                marginRight: 8,
              }}
              image={img1 || imgDefault}
              alt={productname + img1}
            />
          </label>
          <input
            type="file"
            id="fileEdit2"
            hidden
            onChange={(e) => {
              if (e.target.files![0].type!.split("/")[0] === "image") {
                let path = URL.createObjectURL(e.target.files![0]);
                let fileReader = new FileReader();
                fileReader.readAsDataURL(e.target.files![0]);

                fileReader.onload = (event) => {
                  imgFile2.current = {
                    id: 2,
                    file: event.target?.result,
                    name: e.target.files![0]!.name,
                  };
                };
                setImg2(path);
              } else {
                e.target.value = "";
              }
            }}
            accept="image/*"
          />
          <label htmlFor="fileEdit2">
            <CardMedia
              component="img"
              style={{
                maxHeight: 243,
                float: "left",
                objectFit: "cover",
                width: "auto",
                maxWidth: 400,
                marginRight: 8,
              }}
              image={img2 || imgDefault}
              alt={productname + img2}
            />
          </label>
        </Box>
      )}

      {!parent_id && (
        <TextField
          required
          fullWidth
          variant="outlined"
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          multiline
          maxRows={5}
        />
      )}
    </Modal>
  );
};

export default React.memo(ProductModal);
