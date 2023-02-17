/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Icon from "@mui/material/Icon";
import { ClickAwayListener } from "@mui/material";

import MDBox from "../../../components/MDBox";
import MDInput from "../../../components/MDInput";
import MDTypography from "../../../components/MDTypography";

function SelectTopic({ topics, value, onChange }) {
  const [menu, setMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [topic, setTopic] = useState(null);

  const openMenu = () => {
    setMenu(true);
  };

  const closeMenu = () => setMenu(false);

  const onChangeSearchText = (e) => setSearchText(e.target.value);

  const onSelectTopic = (item) => (e) => {
    e.stopPropagation();
    onChange(item.id);
    setTopic(item);
    closeMenu();
  };

  const renderMenu = () => {
    const topicsFiltered = topics.filter((item) => item.title.includes(searchText));
    return (
      <MDBox>
        <MDBox>
          <MDInput
            value={searchText}
            onChange={onChangeSearchText}
            fullWidth
            placeholder="Search topics"
            inputProps={{ type: "text", autoComplete: "" }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 20 },
            }}
          />
        </MDBox>
        <MDBox sx={{ maxHeight: "300px", overflowY: "auto" }}>
          {topicsFiltered.length > 0 ? (
            topicsFiltered.map((item, index) => (
              <MDBox
                key={item.id}
                sx={{
                  borderRadius: 0,
                  p: 1,
                  borderBottom: index === topicsFiltered.length - 1 ? undefined : "1px solid #ddd",
                  "&:hover": {
                    backgroundColor: "#ddd",
                    cursor: "pointer",
                  },
                }}
                onClick={onSelectTopic(item)}
              >
                <MDTypography variant="button" color="secondary" fontWeight="regular">
                  {item.title}
                </MDTypography>
              </MDBox>
            ))
          ) : (
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              No topic
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    );
  };

  useEffect(() => {
    const item = topics.find((i) => i.id === value);
    if (item) {
      setTopic(item);
    }
  }, [topics]);

  return (
    <MDBox
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      onClick={openMenu}
      sx={{
        width: "330px",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        padding: 1,
        borderRadius: 1,
        color: "#78707C",
        position: "relative",
      }}
    >
      <MDTypography variant="button" color="secondary" fontWeight="regular">
        {topic?.title || "Select topic"}
      </MDTypography>
      <Icon color="secondary" sx={{ transform: `rotate(${menu ? 180 : 0}deg)` }}>
        keyboard_arrow_down_rounded
      </Icon>
      {menu && (
        <ClickAwayListener onClickAway={closeMenu}>
          <MDBox
            sx={{
              border: "1px solid #DBD6DE",
              position: "absolute",
              top: 40,
              left: -1,
              width: "330px",
              borderRadius: 1,
              backgroundColor: "white !important",
              p: 2,
              zIndex: 1,
              overflow: "hidden",
              boxShadow:
                "0rem 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 10%), 0rem 0.125rem 0.25rem -0.0625rem rgb(0 0 0 / 6%) !important",
            }}
          >
            {renderMenu()}
          </MDBox>
        </ClickAwayListener>
      )}
    </MDBox>
  );
}

export default SelectTopic;
