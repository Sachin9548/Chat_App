import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import SideUser from '../components/Chatpage/SideUser';
import MyChats from '../components/Chatpage/MyChats';
import ChatBox from '../components/Chatpage/ChatBox';
import './pages.css';
function ChatPage() {
  const { user } = ChatState();
  const [fetchAgain, setfetchAgain] = useState(false);

  return (
    <>
      <div className="ChatPage w-100">
        {/* <SideUser /> */}
        {user && <SideUser />}
        <div className="contener-screen w-100 d-flex justify-content-between gap-4 p-2 mobile">
          <div className="left">
            {/* <MyChats /> */}
            {user && <MyChats fetchAgain={fetchAgain} />}
          </div>
          <div className="right">
            {/* <ChatBox /> */}
            {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />}
          </div>
        </div>
      </div>
    </>
  );
}
export default ChatPage;
