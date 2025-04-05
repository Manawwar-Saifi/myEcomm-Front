import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  Paper,
} from "@mui/material";

const data = [
  { id: 1, name: "John Doe", age: 25, city: "New York" },
  { id: 2, name: "Jane Smith", age: 30, city: "Los Angeles" },
  { id: 3, name: "Alice Brown", age: 22, city: "Chicago" },
  { id: 4, name: "Bob Johnson", age: 27, city: "Houston" },
  { id: 5, name: "Emma Wilson", age: 35, city: "Phoenix" },
  { id: 6, name: "Olivia Davis", age: 28, city: "San Francisco" },
  { id: 7, name: "Liam Miller", age: 31, city: "Seattle" },
  { id: 8, name: "Noah Garcia", age: 29, city: "Miami" },
  { id: 9, name: "Sophia Lee", age: 23, city: "Dallas" },
  { id: 10, name: "Ava Martinez", age: 26, city: "Denver" },
];

const Test = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0); // Reset to the first page when filter changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(filter.toLowerCase()) ||
      row.city.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ padding: 2 }}>
      <TextField
        label="Filter by name or city"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={handleFilterChange}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleSort("id")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "age"}
                  direction={orderBy === "age" ? order : "asc"}
                  onClick={() => handleSort("age")}
                >
                  Age
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "city"}
                  direction={orderBy === "city" ? order : "asc"}
                  onClick={() => handleSort("city")}
                >
                  City
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.city}</TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5,8,10,15,20]}
      />
    </Paper>
  );
};

export default Test;
