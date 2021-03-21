import { useEffect } from "react";
import { useRequest } from "../../hooks/hooks";
import { useHistory } from "react-router-dom";
import "./chat.css";
import { useDispatch } from "react-redux";
import { showMsg } from "../../store/modalSlice";

const UserChatsPage = () => {
  const [, data, error, errorNum, sendRequest] = useRequest();
  const dispatch = useDispatch();
  const history = useHistory();
  const openChat = (recipientId, recipientName, recipientImg) => {
    history.push({
      pathname: `/chats/${recipientName}`,
      state: {
        recipientId: recipientId,
        recipientName: recipientName,
        recipientImg: recipientImg,
      },
    });
  };

  useEffect(() => {
    sendRequest("/api/chat/get_user_chats", "POST", {}, true);
  }, []);

  useEffect(() => {
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    }
  }, [data, error, errorNum]);

  return (
    <>
      {data &&
        data.chats.map((chat, i) => {
          return (
            <div
              key={i}
              className="chat-user-chats"
              onClick={() =>
                openChat(
                  chat.recipient_id,
                  chat.recipient_name,
                  chat.recipient_img
                )
              }
            >
              <img className="chat-img" src={chat.recipient_img} />
              <div className="chat-last-msg">
                <b>{chat.recipient_name}</b>
                <p>
                  <i>{chat.last_message}</i>
                </p>
                <p>{chat.last_date}</p>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default UserChatsPage;
