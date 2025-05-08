import { useDispatch, useSelector } from "react-redux";
import { clearAnswer, setClear, updateChatHistory, setChatID, addAnswer } from "../store/chatSlice";
import './Homepage.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import { useEffect } from "react";
import axios from "axios";
import { ENDPOINTS } from "../service/endpoint";
import { getUrlParams } from "../service/getUrlParams";

function NewChatHistory() {
  const { userName, baseURL, customerID } = getUrlParams();
  const dispatch = useDispatch();
  const { answer, chatHistory, chatID, token } = useSelector((state) => state.chat);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const newChat = async () => {
    await getchatId();
    dispatch(clearAnswer());
    dispatch(setClear(true));
  };

  const addChats = async () => {
    try {
      const formattedAnswer = answer.map((item) => ({
        content: item.content,
        time: item.time || new Date().toLocaleTimeString(),
        type: item.type,
        id: item.id || null,
        pdfpath: item.pdfpath || '',
        duration: item.duration || null,
      }));

      const json = JSON.stringify(formattedAnswer);

      await axios.post(`${ENDPOINTS}/insert/chat_history`, {
        chat_content: json,
        chat_id: chatID,
        company_id: 1,
        client_id: 1,
        username: userName || "cpro@sphinxworldbiz.co",
      }, authHeader);
    } catch (error) {
      console.error("Insert chat error:", error);
    }
  };

  const getChats = async () => {
    try {
      const resp = await axios.post(`${ENDPOINTS}/get/chat_history`, {
        company_id: 1,
        client_id: 1,
        username: userName || "cpro@sphinxworldbiz.co",
      }, authHeader);

      if (!resp.data.error && Array.isArray(resp.data.data)) {
        const jsonArray = resp.data.data.map((val) => ({
          id: val.chatid,
          chat: val.chat.map((msg) => ({
            content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
            time: msg.time || new Date().toLocaleTimeString(),
            type: msg.type,
            id: msg.id || null,
            pdfpath: msg.pdfpath || '',
            duration: msg.duration || null,
          })),
        }));

        dispatch(updateChatHistory(jsonArray));
      } else {
        dispatch(updateChatHistory([]));
      }
    } catch (err) {
      console.error("Get chat error:", err);
    }
  };

  const getchatId = async () => {
    try {
      const resp = await axios.post(`${ENDPOINTS}/get/new_chat_id`, {
        company_id: 1,
        client_id: 1,
        username: userName || "cpro@sphinxworldbiz.co",
      }, authHeader);

      const newId = resp?.data?.data?.new_chat_id;
      if (newId) {
        dispatch(setChatID(newId));
      }
    } catch (err) {
      console.log("Get new chat ID error:", err);
    }
  };
  useEffect(() => {
    getchatId();
  }, [])

  useEffect(() => {
    if (answer.length > 0)
      addChats();

    getChats();
  }, [answer])


  const updateChat = (chat) => {
    dispatch(clearAnswer());
    dispatch(setChatID(chat.id));
    dispatch(setClear(false));

    chat.chat.forEach((element) => {
      dispatch(addAnswer(element));
    });
  };

  const deleteChat = async (id) => {
    try {
      await axios.post(`${ENDPOINTS}/chat/delete`, {
        username: userName || "cpro@sphinxworldbiz.co",
        company_id: 1,
        client_id: 1,
        chat_id: id,
      }, authHeader);

      await getChats();
      if (chatHistory.length === 1) {
        dispatch(updateChatHistory([]));
        await newChat();
      }
    } catch (err) {
      console.log("Error deleting single chat:", err);
    }
  };

  const deleteAllChat = async () => {
    try {
      await axios.post(`${ENDPOINTS}/chats/delete`, {
        username: userName || "cpro@sphinxworldbiz.co",
        company_id: 1,
        client_id: 1,
      }, authHeader);

      await newChat();
      dispatch(updateChatHistory([]));
    } catch (err) {
      console.log("Error deleting all chats:", err);
    }
  };



  return (
    <div className="sidebar">
      <div className="chats">
        <button className="btn btn-primary" onClick={newChat}>
          <i className="fa fa-plus-circle"></i> New Chat
        </button>
      </div>

      <div className="previous-chat">
        <h1>History</h1>
        <ul>
          {chatHistory.length > 0 ? (
            chatHistory.map((chats, i) => {
              const firstMessage = chats.chat.length > 0
                ? (typeof chats.chat[0].content === 'string'
                  ? chats.chat[0].content
                  : JSON.stringify(chats.chat[0].content))
                : "No content";

              return (
                <li key={chats.id}>
                  <div onClick={() => updateChat(chats)}>
                    <strong>Chat {i + 1}:</strong> {firstMessage}
                  </div>
                  <button onClick={() => deleteChat(chats.id)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                </li>
              );
            })
          ) : (
            <p>No chat history found.</p>
          )}
        </ul>

        {chatHistory.length > 0 && (
          <div className="delete-all-button mt-3">
            <button className="btn btn-danger" onClick={deleteAllChat}>
              <i className="fa fa-trash"></i> Delete All
            </button>
          </div>
        )}
      </div>

      <div className="profile">
        <button className="tab" data-call="upgrade">
          Upgrade to Premium
        </button>
        <button className="tab">mail@sphinxworldbiz.com</button>
      </div>
    </div>
  );
}

export default NewChatHistory;
