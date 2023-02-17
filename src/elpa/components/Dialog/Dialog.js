import { styled } from "@mui/material/styles";

export default styled("div")(({ open }) => ({
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  display: open ? "flex" : "none",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1201,
  backgroundColor: "rgba(255, 255, 255, 0.7)",
}));
