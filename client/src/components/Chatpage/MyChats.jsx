import { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { toast } from 'react-toastify';
import axios from 'axios';
import './SideUser.css';
import Groupchatmodel from '../Chatpage/Groupchatmodel';

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChats, setSelectedChats, chats, setChats } =
    ChatState();

  const [loggedUser, setLoggedUser] = useState();

  //toast funtions
  const notifyA = (msg) => {
    toast.success(msg);
    // alert(msg);
  };

  // console.log("selectedChats",selectedChats)

  const notifyB = (msg) => {
    toast.error(msg);
    // alert(msg);
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.get(
        '/api/chat',
        config
      );
      console.log(data);
      setChats(data);
    } catch (error) {
      notifyB('error occus to fetch the Chats');
      return;
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  const getSender = (loggedUser, users) => {
    // console.log("mychat getsender",loggedUser,users);
    // console.log("mychat getsender",users[0].name,users[1].name);
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  return (
    <>
      <div className="MyChats h-100 w-100 bg-white  text-dark p-1">
        <div className="header d-flex  justify-content-between p-1">
          <h3 className="fw-800">My Chats</h3>

          <Groupchatmodel />

          {/* <button class="btn btn-outline-primary d-flex justify-content-center align-items-center">
            <span> New Group Chat </span>
            <span className="material-symbols-outlined text-dark fs-3">
              add
            </span>{' '}
          </button> */}
        </div>

        <div className="chats">
          {chats ? (
            <div className="chat d-flex justify-content-center align-items-center flex-column gap-3 p-3 mt-2">
              {chats.map((chat) => {
                return (
                  <div
                    className="chatItem w-100"
                    onClick={() => setSelectedChats(chat)
                    
                    }
                    key={chat._id}
                  >
                    <span className="btn btn-outline-info w-100 text-dark text-capitalize fs-5 fw-semibold">
                      {!chat.isGroupChat
                        ? getSender(loggedUser.data, chat.users)
                        : chat.chatName}
                    </span>
                    {/* <h1 className="bg-dark text-white">{chat}</h1> */}
                  </div>
                );
              })}
            </div>
          ) : (
            <p class="card-text placeholder-glow">
              <span class="placeholder col-7"></span>
              <span class="placeholder col-4"></span>
              <span class="placeholder col-4"></span>
              <span class="placeholder col-6"></span>
              <span class="placeholder col-8"></span>
              <span class="placeholder col-4"></span>
              <span class="placeholder col-6"></span>
              <span class="placeholder col-8"></span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};
export default MyChats;
