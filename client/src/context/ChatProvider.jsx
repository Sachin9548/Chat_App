import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [user, setuser] = useState();
  const [selectedChats, setSelectedChats] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setnotification] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem('userInfo'));
    setuser(userinfo);
    if (!userinfo) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setuser,
        selectedChats,
        setSelectedChats,
        chats,
        setChats,
        notification,
        setnotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
