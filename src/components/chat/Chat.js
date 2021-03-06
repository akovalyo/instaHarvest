import { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRequest, useForm } from "../../hooks/hooks";

import Message from "./Message";
import Spinner from "../UI/Spinner";
import { IoArrowBack } from "react-icons/io5";
import { Button, FormDanger } from "../styled/styled";

import { validation } from "../../form_validation/validation";
import { showMsg } from "../../store/modalSlice";
import { datetimeToLocal } from "../../utils/utils";
import {
  connectSocket,
  disconnectSocket,
  subscribeToChat,
  sendMessage,
  deleteMessage,
} from "../../utils/socket";

const Chat = () => {
  const { isLoading, data, error, errorNum, sendRequest } = useRequest();
  const [chatMsgs, setChatMsgs] = useState();
  const bottom = useRef();
  const location = useLocation();
  const [chatState] = useState(location.state ? { ...location.state } : null);
  const history = useHistory();
  const dispatch = useDispatch();
  const onSubmit = () => {
    sendMessage(formData, chatState.chat_id, chatState.user_id);
    setFormData({ ...formData, body: "" });
  };
  const {
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  } = useForm(
    { body: "", recipient_id: chatState && chatState.recipient_id },
    onSubmit,
    validation
  );

  const onDeleteMsg = (msgId) => {
    deleteMessage(msgId, chatState.chat_id);
  };

  useEffect(() => {
    if (!chatState) {
      history.push("/chats");
    }
    getMessages();
    connectSocket(chatState.chat_id);
    subscribeToChat(
      (err, msg) => {
        if (err) {
          return;
        }
        setChatMsgs((oldMsgs) => [...oldMsgs, msg]);
      },
      () => {
        getMessages();
      }
    );

    return () => {
      disconnectSocket(chatState.chat_id);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getMessages = () => {
    sendRequest("/api/chat/get_chat_messages", "POST", {
      chat_id: chatState.chat_id,
    });
  };

  useEffect(() => {
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          type: "error",
        })
      );
    } else if (data) {
      setFormData({ ...formData, chat_id: chatState.chat_id });
      setChatMsgs([...data.msgs]);
    }
  }, [error, errorNum, data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottom.current && bottom.current.scrollIntoView();
  }, [chatMsgs]);

  return (
    chatState && (
      <div className="chat">
        {isLoading && <Spinner />}
        <div className="chat-header">
          <h1>Chat with {chatState && chatState.recipient_name}</h1>
          <Button
            onClick={() => {
              history.goBack();
            }}
            style={{
              width: "60px",
              height: "30px",
            }}
          >
            <IoArrowBack />
          </Button>
        </div>
        <div className="chat-scroll">
          {chatMsgs &&
            chatMsgs.map((msg, i) => {
              const sender =
                parseInt(msg.sender_id) ===
                parseInt(chatState && chatState.recipient_id)
                  ? chatState && chatState.recipient_name
                  : "Me";
              return (
                <div key={i} ref={i === chatMsgs.length - 1 ? bottom : null}>
                  <Message
                    msgId={msg.msg_id}
                    onDeleteMsg={onDeleteMsg}
                    createdAt={datetimeToLocal(msg.created_at)}
                    sender={sender}
                    body={msg.body}
                    image={msg.sender_img}
                  />
                </div>
              );
            })}
        </div>
        {chatMsgs && (
          <div className="chat-footer">
            <form>
              <textarea
                rows={3}
                type="text"
                name="body"
                onChange={handleInputChange}
                value={formData.body || ""}
              ></textarea>
              <FormDanger>{formErrors.body && formErrors.body}</FormDanger>
              <Button onClick={handleSubmit}>Send</Button>
            </form>
          </div>
        )}
      </div>
    )
  );
};

export default Chat;
