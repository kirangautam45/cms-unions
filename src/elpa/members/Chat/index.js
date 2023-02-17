// import { useEffect, useState } from "react";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import moment from "moment";

// @mui material components
import { Drawer, Divider } from "@mui/material";

import { WSS_HOST } from "lib/environment";
import loggedUser from "global/loggedUser";

// Material Dashboard 2 PRO React
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import { post } from "services/request";
import Cookie from "services/cookie";

function ChatDrawer({ member, onClose }) {
  const profileId = useRef(loggedUser.id()).current;
  const messageListRef = useRef(null);
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [error, setError] = useState("");

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const scrollToEnd = () => {
    if (messageListRef?.current) {
      messageListRef.current.scroll({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
        left: 0,
      });
    }
  };

  const onSendMessage = () => {
    const newMsg = {
      id: messageList.length,
      message,
      created: new Date().toISOString(),
      createdById: profileId,
      receivers: [member.keycloakId],
    };
    setMessageList((s) => [...s, newMsg]);
    setMessage("");
    setTimeout(scrollToEnd, 100);
  };

  const onKeyup = (e) => {
    if (e.keyCode === 13) {
      onSendMessage();
    }
  };

  const handleClose = () => {
    // stop chat socket and close drawer
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    onClose();
  };

  const onSocketError = (err) => {
    console.log("SOCKET error", err);
    setError("Can't connect socket!!!");
  };

  const onSocketNewMessage = (msg) => {
    console.log("SOCKET new message", msg);
    setMessageList((s) => [...s, msg]);
  };

  const initWebsocket = (chatId) => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket(`${WSS_HOST}/chat/socket?listen=${chatId}`, null, {
        headers: { Authorization: `Bearer ${Cookie.getCookie("token")}` },
      });
      socketRef.current.onerror = onSocketError;
      socketRef.current.onmessage = onSocketNewMessage;
      console.log({ socket: socketRef.current });
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const { data } = await post("chat/serve", { keycloakId: profileId, chatId });
      setMessageList(data);
      if (data.length) {
        setTimeout(scrollToEnd, 100);
      }
    } catch (err) {
      console.log(err);
      setError("Can't get list message!");
    }
  };

  const getChatGroupRequest = async () => {
    try {
      const { data } = await post("chat/groups", {
        keycloakId: profileId,
        connections: [member.keycloakId],
      });
      if (data[0]) {
        loadMessages(data[0].chatId);
        initWebsocket(data[0].chatId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setMessage("");

    if (member) {
      getChatGroupRequest();
    }
  }, [member]);

  return (
    <Drawer
      sx={{ "& .MuiPaper-root": { width: 480 } }}
      open={Boolean(member)}
      anchor="right"
      onClose={handleClose}
    >
      <MDBox height="100%" py={3} px={4} textAlign="center" sx={{ overflow: "hidden" }}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography component="p" variant="button" color="text" fontWeight="bold">
            {member?.firstName?.toUpperCase() || ""}
          </MDTypography>
        </MDBox>
        <Divider />
        <MDBox
          display="flex"
          flexDirection="column"
          height="calc(100% - 54px)"
          sx={{ overflow: "hidden" }}
        >
          <MDBox
            sx={{
              height: "calc(100% - 50px)",
              overflow: "auto",
              marginBottom: 2,
            }}
            ref={messageListRef}
          >
            {messageList.length === 0 ? (
              <MDTypography component="p" variant="button" color="text">
                {error || "Let's chatting"}
              </MDTypography>
            ) : (
              messageList.map((msg) => (
                <MDBox
                  key={msg.id}
                  display="flex"
                  flexDirection="column"
                  alignItems={msg.createdById === profileId ? "flex-end" : "flex-start"}
                  mt={1}
                >
                  <MDTypography
                    component="p"
                    variant="button"
                    color="text"
                    sx={{
                      backgroundColor:
                        msg.createdById === profileId ? colors.info.main : colors.primary.main,
                      color: "#fff",
                      padding: 1,
                      borderRadius: 4,
                      maxWidth: "60%",
                      minWidth: 36,
                    }}
                  >
                    {msg.message}
                  </MDTypography>
                  <MDTypography
                    component="span"
                    variant="button"
                    color="text"
                    fontWeight="light"
                    sx={{ fontSize: 10 }}
                  >
                    {moment(msg.createdAt).format("MMM DD, YYYY HH:MM")}
                  </MDTypography>
                </MDBox>
              ))
            )}
          </MDBox>
          <MDBox>
            <MDInput
              fullWidth
              onKeyUp={onKeyup}
              value={message}
              onChange={onChangeMessage}
              placeholder="Enter message..."
              inputProps={{
                type: "text",
                autoComplete: "",
              }}
            />
          </MDBox>
        </MDBox>
      </MDBox>
    </Drawer>
  );
}

ChatDrawer.defaultProps = {
  member: null,
  onClose: () => {},
};

ChatDrawer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  member: PropTypes.object,
  onClose: PropTypes.func,
};

export default ChatDrawer;
