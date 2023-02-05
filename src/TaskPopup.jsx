import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { Component } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as yup from "yup";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: "20px",
    position: "absolute",
    width: "300px",
  },
  dialogDelete: {
    padding: "20px",
    position: "absolute",
    width: "300px",
  },
  textBox: {
    width: "100%",
    padding: "5px",
    resize: "none",
    height: "70px",
    overflow: "scroll",
    fontWeight: 400,
    borderRadius: "5px",
    border: "1px solid #c4c4c4",
  },
}));

const priorityList = [1, 2, 3, 4, 5];

function TaskPopup(props) {
  const classes = useStyles();
  const { confirmDialog, setConfirmDialog, setMainData, data, setCreatedAt } =
    props;

  const validationSchema = yup.object({
    description: yup
      .string()
      .min(3, "Description must be at least 3 characters long")
      .required("Description is required"),
    priority: yup.number().required("Priority is required"),
  });

  const {
    handleSubmit,
    handleBlur,
    handleChange,
    touched,
    values,
    errors,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      description: "",
      priority: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setMainData([...data, values]);
      setCreatedAt(moment(new Date()).format("DD/MM/YYYY kk:mm"));
      setConfirmDialog({ ...confirmDialog, isOpen: false });
      resetForm();
    },
  });

  const handleClose = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    resetForm();
  };

  React.useEffect(() => {
    if (confirmDialog?.type == "edit") {
      setFieldValue("description", confirmDialog.item.description);
      setFieldValue("priority", confirmDialog.item.priority);
    } else {
      setFieldValue("description", "");
      setFieldValue("priority", "");
    }
  }, [confirmDialog]);

  return (
    <>
      {(confirmDialog?.type === "add" || confirmDialog?.type === "edit") && (
        <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
          <Box display="flex" justifyContent={"space-between"}>
            <Typography
              sx={{
                ml: 2,
                textTransform: "uppercase",
                fontWeight: "500",
                color: "#bd9cf1",
                fontSize: "18px",
              }}
            >
              {confirmDialog?.type == "add" ? "Add New Task" : "Update Task"}
            </Typography>
            <Box sx={{ textAlign: "right !important" }}>
              <CloseIcon
                sx={{ color: "#ff1493", cursor: "pointer" }}
                onClick={handleClose}
              />
            </Box>
          </Box>
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                <Typography sx={{ mb: 1 }}>Description:</Typography>
                <TextareaAutosize
                  minRows={3}
                  value={values.description}
                  placeholder="Enter description"
                  id="description"
                  name="description"
                  className={classes.textBox}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormHelperText
                  error={true}
                  style={{
                    display: "inline-block",
                    float: "left",
                  }}
                >
                  {errors.description &&
                    touched.description &&
                    errors.description}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, mt: 1 }}>Priority:</Typography>
                <FormControl sx={{ width: " 100%", mt: 2 }}>
                  <Select
                    classes={{
                      select: classes.select,
                      icon: classes.iconUp,
                      iconOpen: classes.iconOpen,
                    }}
                    id="priority"
                    name="priority"
                    fullWidth
                    displayEmpty
                    size="small"
                    value={values.priority}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      return selected ? selected : "Please Select";
                    }}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {priorityList.map((item, i) => (
                      <MenuItem
                        key={i}
                        value={item}
                        onClick={() => {
                          setFieldValue("priority", item);
                        }}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormHelperText
                  error={true}
                  style={{
                    display: "inline-block",
                    float: "left",
                  }}
                >
                  {errors.priority && touched.priority && errors.priority}
                </FormHelperText>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              type="submit"
              sx={{
                color: "white",
                background: "#bd9cf1",
                "&:hover": {
                  backgroundColor: "#bd9cf1",
                },
              }}
              onClick={() => {
                if (confirmDialog?.type == "add") {
                  handleSubmit();
                } else {
                  confirmDialog.onConfirm(values);
                }
              }}
            >
              {confirmDialog?.type == "add" ? "Add" : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {(confirmDialog?.type === "activate" ||
        confirmDialog?.type === "inactivate") && (
        <Dialog
          open={confirmDialog.isOpen}
          classes={{ paper: classes.dialogDelete }}
        >
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                <Typography sx={{ mb: 1 }}>
                  {` Are you sure you want to ${confirmDialog?.type} this task?`}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              type="submit"
              sx={{
                color: "white",
                mr: 3,
                background: "#ff1493",
                "&:hover": {
                  backgroundColor: "#ff1493",
                },
              }}
              onClick={() => confirmDialog.onConfirm()}
            >
              {confirmDialog?.type === "activate" ? "Activate" : "Inactivate"}
            </Button>
            <Button
              type="submit"
              sx={{
                color: "#ff1493",
                background: "#fff",
                border: "1px solid #ff1493",
              }}
              onClick={() => {
                setConfirmDialog({ ...confirmDialog, isOpen: false });
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default TaskPopup;
