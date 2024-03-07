import pdf from "@react-pdf/renderer";
import { Button, Dialog, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import numberWithCommas from "../../utils/GlobalFunction";

const {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  PDFDownloadLink,
  View,
  Font,
} = pdf;

type printModalType = {
  type: "create" | "update";
  open: boolean;
  handleClose: () => void;
  data?: any;
};

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    marginTop: 8,
    marginLeft: 18,
    fontSize: 12,
    textAlign: "justify",
  },
  textEnd: {
    marginBottom: 10,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  time: {
    textAlign: "right",
    marginBottom: 20,
    marginTop: 20,
    fontSize: 14,
  },
  total: {
    fontSize: 18,
    margin: 20,
    textAlign: "right",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  link: {
    textDecoration: "none",
  },
  table: {
    width: "100%",
    textAlign: "center",
    fontSize: 12,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderTop: "0.5px solid black",
    paddingTop: 8,
    paddingBottom: 8,
  },
  info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTable: {
    borderTop: "none",
  },
  row1: {
    width: "10%",
  },
  row2: {
    width: "30%",
  },
  row3: {
    width: "20%",
  },
  row4: {
    width: "10%",
  },
  row5: {
    width: "27%",
  },
});

const MyDocument = ({ data }: { data: any }) => {
  const [, setState] = useState(false);
  useEffect(() => {
    setState(true);
  }, []);

  return (
    <Document title={`Hoá đơn số ${data.receipt_id}`}>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>
          ~ Hoàng Trung shop - Model is life 👌~
        </Text>
        <Text style={styles.title} fixed>
          HÓA ĐƠN NHẬP HÀNG
        </Text>
        <Text style={[styles.text, styles.time]}>
          Ngày lập hóa đơn: {data.receipt_date}.
        </Text>
        <View style={[styles.info]}>
          <View>
            <Text style={[styles.text]}>NHÀ CUNG CẤP.</Text>
            <Text style={[styles.text]}>
              Tên nhà cung cấp: {data.supplier_name}.
            </Text>
            <Text style={[styles.text]}>Liên hệ: {data.supplier_tel}.</Text>
            <Text style={[styles.text, styles.textEnd]}>
              Địa chỉ: {data.supplier_address}.
            </Text>
          </View>
          <View>
            <Text style={[styles.text]}>Cửa hàng: Hoàng Trung Shop.</Text>
            <Text style={[styles.text]}>Liên hệ: 0971.537.915.</Text>
            <Text style={[styles.text]}>Địa chỉ: Hà Nội.</Text>
            <Text style={[styles.text]}>NHÂN VIÊN LẬP HÓA ĐƠN.</Text>
            <Text style={[styles.text, styles.textEnd]}>
              Họ tên: {data.user_name}.
            </Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={[styles.row, styles.headerTable]}>
            <Text style={styles.row1}>Mã</Text>
            <Text style={styles.row2}>Tên hàng</Text>
            <Text style={styles.row3}>Đơn giá</Text>
            <Text style={styles.row4}>Số lượng</Text>
            <Text style={styles.row5}>Tổng</Text>
          </View>
          {data.items?.map((row: any, i: number) => (
            <View key={i} style={styles.row} wrap={false}>
              <Text style={styles.row1}>{row.id}</Text>
              <Text style={styles.row2}>{row.item_name}</Text>
              <Text style={styles.row3}>
                {numberWithCommas(row.item_price)} VNĐ
              </Text>
              <Text style={styles.row4}>{row.quantity}</Text>
              <Text style={styles.row5}>
                {numberWithCommas(
                  parseInt(row.quantity) * parseInt(row.item_price)
                )}{" "}
                VNĐ
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.total} fixed>
          Tổng tiền: {numberWithCommas(data.totalprice)} VNĐ
        </Text>
      </Page>
    </Document>
  );
};

const PrintModal = ({ data, type, open, handleClose }: printModalType) => {
  return (
    <Dialog
      fullScreen
      open={open}
      title={`${type === "create" ? "Thêm mới sản phẩm" : "Cập nhật sản phẩm"}`}
    >
      <Toolbar>
        <Button
          sx={{ mr: 4 }}
          size="large"
          variant="outlined"
          title="Download file"
          color="success"
          onClick={handleClose}
        >
          <PDFDownloadLink
            document={<MyDocument data={data} />}
            fileName={`${data.receipt_id + data.receipt_date}.pdf`}
            style={styles.link}
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download now!"
            }
          </PDFDownloadLink>
        </Button>
        <Button
          size="large"
          variant="outlined"
          color="error"
          title="Đóng"
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Toolbar>
      <PDFViewer width={"100%"} height={"100%"}>
        <MyDocument data={data} />
      </PDFViewer>
    </Dialog>
  );
};

export default React.memo(PrintModal);
