import { useState } from "react";
import { Icon, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { deleteReq } from "services/request";
import Card from "./Card";
import AddTopicDialog from "./AddTopicDialog";

function CardTopic({ data, callback }) {
  const [menu, setMenu] = useState(null);
  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => {
    setMenu(null);
  };

  const [openAddTopic, setOpenAddTopic] = useState(false);
  const [isEditTopic, setIsEditTopic] = useState(false);

  const handleEdit = async () => {
    closeMenu();
    setOpenAddTopic(true);
    setIsEditTopic(true);
  };

  const handleDelete = async (id) => {
    await deleteReq(`union/topics/delete/${id}`);
    callback();
    closeMenu();
  };

  const renderMenu = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem onClick={() => handleEdit()}>Edit</MenuItem>
      <MenuItem onClick={() => handleDelete(data.id)}>Delete</MenuItem>
    </Menu>
  );

  return (
    <>
      <AddTopicDialog
        isOpen={openAddTopic}
        isEdit={isEditTopic}
        currentTopic={data}
        onClose={() => {
          setOpenAddTopic(false);
          setIsEditTopic(false);
          callback();
        }}
      />
      <Card>
        <MDButton
          variant="text"
          color="white"
          iconOnly
          onClick={openMenu}
          style={{ position: "absolute", top: "0", right: "0" }}
        >
          <Icon>more_horiz</Icon>
        </MDButton>
        <MDTypography
          component={Link}
          fontWeight="regular"
          color="white"
          lineHeight={1}
          sx={{ cursor: "pointer", fontSize: 16 }}
          to={`/elpa/topics/${data.id}`}
        >
          {data.title}
        </MDTypography>
        <span className="total">{data.numberOfPosts} Posts</span>
      </Card>
      {renderMenu}
    </>
  );
}

CardTopic.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  callback: PropTypes.func,
};

CardTopic.defaultProps = {
  callback: () => {},
};

export default CardTopic;
