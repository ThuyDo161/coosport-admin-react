import { Box, Select } from "@mantine/core";
import React, { useEffect } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import HeaderCard from "../components/HeaderCard";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { getTurnover } from "../redux/reducer/bill.slice";
import { getSpending } from "../redux/reducer/receipt.slice";
import numberWithCommas from "../utils/GlobalFunction";

const COLORS = [
  "#980afe",
  "#6d9d96",
  "#c7a215",
  "#13f3ec",
  "#7370a1",
  "#b60786",
  "#3e0735",
  "#9bc845",
  "#a37173",
  "#105159",
  "#29031a",
  "#1e21d4",
];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    switch (payload[0]?.name) {
      case "Jan":
        payload[0]!.name = "Tháng 1";
        break;
      case "Feb":
        payload[0]!.name = "Tháng 2";
        break;
      case "Mar":
        payload[0]!.name = "Tháng 3";
        break;
      case "Apr":
        payload[0]!.name = "Tháng 4";
        break;
      case "May":
        payload[0]!.name = "Tháng 5";
        break;
      case "Jun":
        payload[0]!.name = "Tháng 6";
        break;
      case "Jul":
        payload[0]!.name = "Tháng 7";
        break;
      case "Aug":
        payload[0]!.name = "Tháng 8";
        break;
      case "Sep":
        payload[0]!.name = "Tháng 9";
        break;
      case "Oct":
        payload[0]!.name = "Tháng 10";
        break;
      case "Nov":
        payload[0]!.name = "Tháng 11";
        break;
      case "Dec":
        payload[0]!.name = "Tháng 12";
        break;
    }
    return (
      <div className="custom-tooltip">
        <p className="label">{`Tổng tiền của ${payload[0]?.name} `}</p>
        <p className="desc">{`${numberWithCommas(
          payload[0]?.value
        )} (VNĐ).`}</p>
      </div>
    );
  }

  return null;
};

const Dashboard = () => {
  const turnover = useAppSelector((state) => state.bill.turnover);
  const spending = useAppSelector((state) => state.receipt.spending);
  const dispatch = useAppDispatch();
  const data = [];
  const data2 = [];
  for (const [key, value] of Object.entries(turnover ?? {})) {
    key !== "year" && data.push({ name: key, turnover: value });
  }
  for (const [key, value] of Object.entries(spending ?? {})) {
    key !== "year" && data2.push({ name: key, spend: value });
  }

  const total = data.reduce((store, value) => {
    return (store += value.turnover);
  }, 0);
  const totalSpend = data2.reduce((store, value) => {
    return (store += value.spend);
  }, 0);

  useEffect(() => {
    dispatch(getSpending());
    dispatch(getTurnover());
  }, []);
  if (!data.length || !data2.length) {
    return <div>Loading...</div>;
  }
  return (
    <div className="dashboard content-box">
      <HeaderCard />
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Select
            label="Chọn năm xem doanh thu"
            placeholder="Chọn một năm để xem doanh thu"
            searchable
            clearable
            width="fit-content"
            style={{ width: 400, marginBottom: 10 }}
            defaultValue={turnover?.year.toString()}
            onChange={(e) => dispatch(getTurnover(Number(e)))}
            nothingFound="No options"
            data={Array.from(
              { length: 100 },
              (v, k) => k + (new Date().getFullYear() - 5)
            ).map(String)}
          />
          <h3>
            Tổng doanh thu cả năm {turnover?.year}: {numberWithCommas(total)}{" "}
            VNĐ
          </h3>

          <PieChart width={450} height={450}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={160}
              fill="#8884d8"
              dataKey="turnover"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </Box>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Select
            label="Chọn năm xem chi phí"
            placeholder="Chọn một năm để xem chi phí"
            searchable
            clearable
            width="fit-content"
            style={{ width: 400, marginBottom: 10 }}
            defaultValue={turnover?.year.toString()}
            onChange={(e) => dispatch(getTurnover(Number(e)))}
            nothingFound="No options"
            data={Array.from(
              { length: 100 },
              (v, k) => k + (new Date().getFullYear() - 5)
            ).map(String)}
          />
          <h3>
            Tổng chi phí cả năm {spending?.year}: {numberWithCommas(totalSpend)}{" "}
            VNĐ
          </h3>

          <PieChart width={450} height={450}>
            <Pie
              data={data2}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={160}
              fill="#8884d8"
              dataKey="spend"
            >
              {data2.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
