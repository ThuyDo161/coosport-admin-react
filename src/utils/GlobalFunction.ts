import swal from "sweetalert2";
import { productInterface } from "../redux/reducer/products.slice";
import unidecode from "unidecode";

const numberWithCommas = (num: number | string) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const getRandomProducts = (array: productInterface[], count: number) => {
  const newArr = [...array];
  const max = array.length - count;
  if (max < 0) {
    return newArr;
  }
  const min = 0;
  const start = Math.floor(Math.random() * (max - min) + min);
  return newArr.slice(start, start + count);
};

const getProductBySlug = (array: productInterface[], slug: string) => {
  return array.find((product) => slug === product.product_slug);
};

const Toast = swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", swal.stopTimer);
    toast.addEventListener("mouseleave", swal.resumeTimer);
  },
});

const messageSuccess = (message: string) =>
  Toast.fire({
    icon: "success",
    title: "<h3>" + message + "</h3>",
  });

const messageError = (message: string) =>
  swal.fire("<h2>Lỗi</h2>", "<h3>" + message + "</h3>", "error");

const messageSave = (message: string) =>
  swal.fire("<h2>Đã lưu</h2>", "<h3>" + message + "</h3>", "success");

const messageConfirm = (message: string) =>
  swal.fire({
    title: `<h3>Bạn có thật sự muốn thực hiện ${message}?</h3>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    customClass: {
      cancelButton: "size-1",
      confirmButton: "size-1",
    },
  });

const createUsername = (input: string): string => {
  let sentence = unidecode(input).toLowerCase().split(" ");

  for (var i = 0; i < sentence.length - 1; i++) {
    sentence[i] = sentence[i][0];
  }

  return sentence.join("");
};
const getAvatar = (input: string): string => {
  let sentence = input.toUpperCase().split(" ");

  for (var i = 0; i < sentence.length; i++) {
    sentence[i] = sentence[i][0];
  }

  return sentence[0] + sentence[sentence.length - 1];
};

const DEFAULT_PASSWORD = "abc123";

const LIST_COLOR_OPTION = [
  {
    label: "Blue Color",
    value: "blue",
  },
  {
    label: "Orange Color",
    value: "orange",
  },
  {
    label: "Yellow Color",
    value: "yellow",
  },
  {
    label: "Brown Color",
    value: "brown",
  },
  {
    label: "Pink Color",
    value: "pink",
  },
  {
    label: "Red Color",
    value: "red",
  },
  {
    label: "White Color",
    value: "white",
  },
  {
    label: "Black Color",
    value: "black",
  },
  {
    label: "Main Color",
    value: "main",
  },
];

export {
  DEFAULT_PASSWORD,
  LIST_COLOR_OPTION,
  getRandomProducts,
  getProductBySlug,
  messageSuccess,
  messageError,
  messageSave,
  messageConfirm,
  createUsername,
  getAvatar,
};
export default numberWithCommas;
