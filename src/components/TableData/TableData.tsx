import {
  Button,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { usePagination, useSortBy, useTable } from "react-table";
import "./style.css";

type TableDataType = {
  columnInput: any[];
  dataInput: any[];
  sortDefault?: string;
};

const TableData = ({ columnInput, dataInput, sortDefault }: TableDataType) => {
  const columns = React.useMemo(() => columnInput, [dataInput, columnInput]);
  const data = React.useMemo(() => dataInput, [dataInput]);
  const [pageNumb, setPageNumb] = React.useState(0);

  const {
    getTableProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: pageNumb,
        pageSize: 5,
        sortBy: sortDefault ? [{ id: sortDefault, desc: true }] : [],
      },
    },
    useSortBy,
    usePagination
  );
  return (
    <>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  align="center"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ width: column.width || "", cursor: "pointer" }}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell align="center" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="pagination">
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            gotoPage(0);
            setPageNumb(0);
          }}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </Button>{" "}
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            previousPage();
            setPageNumb(pageNumb - 1);
          }}
          disabled={!canPreviousPage}
        >
          {"<"}
        </Button>{" "}
        <Button
          variant="outlined"
          onClick={() => {
            nextPage();
            setPageNumb(pageNumb + 1);
          }}
          size="small"
          disabled={!canNextPage}
        >
          {">"}
        </Button>{" "}
        <Button
          variant="outlined"
          onClick={() => {
            gotoPage(pageCount - 1);
            setPageNumb(pageCount - 1);
          }}
          size="small"
          disabled={!canNextPage}
        >
          {">>"}
        </Button>{" "}
        <span>
          Trang{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Đi đến trang:{" "}
          <OutlinedInput
            inputProps={{ min: 1, max: pageCount }}
            size="small"
            type="number"
            maxRows={4}
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
              setPageSize(page);
            }}
            style={{ width: "100px" }}
          />
        </span>
      </div>
    </>
  );
};

export default TableData;
