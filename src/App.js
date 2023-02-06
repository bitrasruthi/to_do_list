import * as React from "react";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { makeStyles } from "@mui/styles";
import TaskPopup from "./TaskPopup";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import TaskIcon from "@mui/icons-material/Task";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ReactExport from "react-export-excel";
import { SnackbarProvider } from "notistack";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const theme = createTheme({
  palette: {
    primary: {
      main: "#bd9cf1",
    },
    secondary: {
      main: "#bd9cf1",
    },
  },
  typography: {
    fontFamily: "Poppins ",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    background: "#c0d6e4",
    fontFamily: "Poppins !important",
    "& .main-head": {
      textTransform: "uppercase",
      fontWeight: "bold",
      color: "#bd9cf1",
      fontSize: "25px",
    },
    "& .add-btn": {
      marginRight: "20px",
      color: "white",
      background: "#bd9cf1",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#bd9cf1",
      },
    },
    "& .export-btn": {
      color: "#bd9cf1",
      border: "1px solid #bd9cf1",
      cursor: "pointer",
    },
    "& .tab-box": {
      width: "100%",
      typography: "body1",
      marginTop: "20px",
      height: "450px",
      overflow: "scroll",
    },
    "& .card-style": {
      width: "100%",
      marginTop: "10px",
      boxShadow:
        "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
    },
    "& .sub-head": {
      color: "#bd9cf1",
      fontWeight: "500",
    },
    "& .sub-text": {
      color: "#ff1493",
      paddingLeft: "10px",
    },
    "& .icons-style": {
      color: "#ff1493",
      cursor: "pointer",
      marginTop: "10px",
      marginLeft: "20px",
    },
  },
}));

function App() {
  const classes = useStyles();
  const statusList = ["New", "Active", "Dev done", "Removed"];
  const [data, setData] = React.useState([]);
  const [inactiveData, setInactiveData] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedStatus, setSelectedStatus] = React.useState(statusList[0]);
  const [createAt, setCreatedAt] = React.useState();
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
  });

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = (index) => {
    console.log(data[index]);
    let inactiveList = data[index];
    inactiveData.push(inactiveList);
    data.splice(index, 1);
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const handleActivate = (index) => {
    console.log(inactiveData[index]);
    let inactiveList = inactiveData[index];
    data.push(inactiveList);
    inactiveData.splice(index, 1);
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const handleUpdate = (index, values) => {
    data[index].description = values?.description;
    data[index].priority = values?.priority;
    setData(data);
    console.log(data);
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          maxSnack={10}
        >
          <Box className={classes.root}>
            <Paper
              elevation={1}
              sx={{
                padding: 5,
                flexGrow: 1,
              }}
            >
              <Box display={"flex"} justifyContent="space-between">
                <Typography className="main-head">To do list</Typography>
                <Box display={"flex"}>
                  <Button
                    size="large"
                    className="add-btn"
                    onClick={(e) => {
                      setConfirmDialog({
                        isOpen: true,
                        type: "add",
                      });
                    }}
                  >
                    <AddIcon />
                    Add Task
                  </Button>
                  <ExcelFile
                    element={
                      <Button size="large" className="export-btn">
                        <FileDownloadIcon />
                        Export Excel
                      </Button>
                    }
                  >
                    <ExcelSheet
                      data={tabValue == 0 ? data : inactiveData}
                      name="To Do List"
                    >
                      <ExcelColumn label="Description" value="description" />
                      <ExcelColumn label="Priority" value="priority" />
                    </ExcelSheet>
                  </ExcelFile>
                </Box>
              </Box>
              <Box className="tab-box">
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    overflow: "scroll",
                  }}
                >
                  <Tabs
                    onChange={handleChange}
                    value={tabValue}
                    aria-label="lab API tabs example"
                  >
                    <Tab label={`Active (${data?.length})`} />
                    <Tab label={`Inactive (${inactiveData?.length})`} />
                  </Tabs>
                </Box>
                {tabValue == 0 ? (
                  data?.length > 0 ? (
                    data?.map((item, index) => (
                      <Card key={index} className="card-style">
                        <CardContent>
                          <Grid container>
                            <Grid item xs={11}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.description}
                              </Typography>
                              <Box
                                sx={{ mt: 2 }}
                                display={"flex"}
                                justifyContent="space-between"
                              >
                                <Box display={"flex"}>
                                  <Typography
                                    variant="body2"
                                    className="sub-head"
                                  >
                                    Priority:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="sub-text"
                                  >
                                    {item.priority}
                                  </Typography>
                                </Box>
                                <Box display={"flex"}>
                                  <Typography
                                    variant="body2"
                                    className="sub-head"
                                  >
                                    Status:
                                  </Typography>
                                  <FormControl sx={{ width: " 100%", ml: 1 }}>
                                    <Select
                                      classes={{
                                        select: classes.select,
                                        icon: classes.iconUp,
                                        iconOpen: classes.iconOpen,
                                      }}
                                      name="status"
                                      fullWidth
                                      displayEmpty
                                      size="small"
                                      value={selectedStatus}
                                      onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                      }}
                                      input={<OutlinedInput />}
                                      renderValue={(selected) => {
                                        return selected
                                          ? selected
                                          : "Please Select";
                                      }}
                                      sx={{
                                        height: "20px",
                                      }}
                                      inputProps={{
                                        "aria-label": "Without label",
                                      }}
                                    >
                                      {statusList.map((item, i) => (
                                        <MenuItem
                                          key={i}
                                          value={item}
                                          onClick={() => {
                                            setSelectedStatus(item);
                                          }}
                                        >
                                          {item}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Box>
                                <Box display={"flex"}>
                                  <Typography
                                    variant="body2"
                                    className="sub-head"
                                  >
                                    Created at:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="sub-text"
                                  >
                                    {createAt}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={1}>
                              <Box
                                sx={{ width: "20%" }}
                                display={"flex"}
                                justifyContent="space-between"
                              >
                                <Tooltip title="Edit">
                                  <ModeEditIcon
                                    onClick={(e) => {
                                      setConfirmDialog({
                                        isOpen: true,
                                        type: "edit",
                                        item: item,
                                        onConfirm: (values) => {
                                          handleUpdate(index, values);
                                        },
                                      });
                                    }}
                                    className="icons-style"
                                  />
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <DeleteIcon
                                    onClick={(e) => {
                                      setConfirmDialog({
                                        isOpen: true,
                                        type: "inactivate",
                                        onConfirm: () => {
                                          handleDelete(index);
                                        },
                                      });
                                    }}
                                    className="icons-style"
                                  />
                                </Tooltip>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography sx={{ textAlign: "center", mt: 5 }}>
                      No tasks available
                    </Typography>
                  )
                ) : tabValue == 1 ? (
                  inactiveData?.length > 0 ? (
                    inactiveData?.map((item, index) => (
                      <Card
                        key={index}
                        sx={{ width: "100%", mt: 1 }}
                        className="card-style"
                      >
                        <CardContent>
                          <Grid container>
                            <Grid item xs={11.5}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.description}
                              </Typography>
                              <Box
                                sx={{ mt: 2 }}
                                display={"flex"}
                                justifyContent="space-between"
                              >
                                <Box display={"flex"}>
                                  <Typography
                                    variant="body2"
                                    className="sub-head"
                                  >
                                    Priority:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="sub-text"
                                  >
                                    {item.priority}
                                  </Typography>
                                </Box>
                                <Box display={"flex"}>
                                  <Typography
                                    variant="body2"
                                    className="sub-head"
                                  >
                                    Created at:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="sub-text"
                                  >
                                    {createAt}
                                  </Typography>
                                </Box>
                                <Box display={"flex"}>
                                  <Typography
                                    variant="body2"
                                    className="sub-head"
                                  >
                                    Status:
                                  </Typography>
                                  <FormControl sx={{ width: " 100%", ml: 1 }}>
                                    <Select
                                      classes={{
                                        select: classes.select,
                                        icon: classes.iconUp,
                                        iconOpen: classes.iconOpen,
                                      }}
                                      name="status"
                                      fullWidth
                                      displayEmpty
                                      size="small"
                                      value={selectedStatus}
                                      onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                      }}
                                      input={<OutlinedInput />}
                                      renderValue={(selected) => {
                                        return selected
                                          ? selected
                                          : "Please Select";
                                      }}
                                      sx={{ height: "20px" }}
                                      inputProps={{
                                        "aria-label": "Without label",
                                      }}
                                    >
                                      {statusList.map((item, i) => (
                                        <MenuItem
                                          key={i}
                                          value={item}
                                          onClick={() => {
                                            setSelectedStatus(item);
                                          }}
                                        >
                                          {item}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={0.5}>
                              <Box
                                sx={{ width: "20%" }}
                                display={"flex"}
                                justifyContent="space-between"
                              >
                                <Tooltip title="Activate">
                                  <TaskIcon
                                    onClick={(e) => {
                                      setConfirmDialog({
                                        isOpen: true,
                                        type: "activate",
                                        onConfirm: () => {
                                          handleActivate(index);
                                        },
                                      });
                                    }}
                                    className="icons-style"
                                  />
                                </Tooltip>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography sx={{ textAlign: "center", mt: 5 }}>
                      No tasks available
                    </Typography>
                  )
                ) : (
                  ""
                )}
              </Box>
            </Paper>
          </Box>
          <TaskPopup
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
            setMainData={setData}
            data={data}
            setCreatedAt={setCreatedAt}
          />
        </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
