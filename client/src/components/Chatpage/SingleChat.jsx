import { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from '../Chatpage/ProfileModel';
import './SideUser.css';
import './message.css';
import UpdateGroupChatModel from '../Chatpage/UpdateGroupChatModel';
import axios from 'axios';
import { toast } from 'react-toastify';
import Messagedata from '../Chatpage/Messagedata';
import io from 'socket.io-client';

const ENDPOINT =
  '/';

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const [messages, setmessages] = useState([]);
  const [newmessage, setnewmessage] = useState('');
  const [loading, setloading] = useState(false);
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, settyping] = useState(false);
  const [istyping, setistyping] = useState(false);

  const {
    user,
    selectedChats,
    setSelectedChats,
    notification,
    setnotification,
  } = ChatState();

  // console.log(messages.messages);
  // const getSender = (loggedUser, users) => {
  //   return users[0]._id !== loggedUser._id ? users[1].name : users[0].name;
  // };
  // const getSenderFull = (loggedUser, users) => {
  //   return users[0]._id !== loggedUser._id ? users[1] : users[0];
  // };

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  //toast funtions
  const notifyA = (msg) => {
    toast.success(msg);
    // alert(msg);
  };

  const notifyB = (msg) => {
    toast.error(msg);
    // alert(msg);
  };

  const fetchMessages = async () => {
    if (!selectedChats) {
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChats._id}`,
        config
      );
      setmessages(data.messages);
      setloading(false);
      socket.emit('join chat', selectedChats._id);
    } catch (error) {
      notifyB('error in fetchMessages');
      return;
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user.data);
    socket.on('connected', () => {
      setsocketConnected(true);
    });
    socket.on('typing', () => {
      setistyping(true);
    });
    socket.on('stop typing', () => {
      setistyping(false);
    });
  }, []);

  const sendMessage = async () => {
    if (newmessage) {
      socket.emit('stop typing', selectedChats._id);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.data.token}`,
          },
        };
        setnewmessage('');

        const { data } = await axios.post(
          `/api/message`,
          {
            content: newmessage,
            chatId: selectedChats._id,
          },
          config
        );
        socket.emit('new message', data.messageCreated);
        setmessages([...messages, data.messages]);
        fetchMessages();
      } catch (error) {
        console.log('send message', error);
        notifyB('error in send message');
        return;
      }
    } else {
      notifyB('Please type message');
      return;
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChats;
  }, [selectedChats]);

  // console.log(notification, '...............');
  useEffect(() => {
    socket.on('message recieved', (newmessageResivied) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newmessageResivied.chat._id
      ) {
        //give notofication
        // console.log('newmessageResivied', newmessageResivied);
        if (!notification.includes(newmessageResivied)) {
          setnotification([newmessageResivied, ...notification]);
          setfetchAgain(!fetchAgain);
        }
      } else {
        setmessages([...messages, newmessageResivied]);
      }
    });
  });

  const typingHandler = (e) => {
    setnewmessage(e.target.value);

    //typing indicater
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      settyping(true);
      socket.emit('typing', selectedChats._id);
    }
    let lastytpingTime = new Date().getTime();
    let timerlength = 3000;
    setTimeout(() => {
      let timenow = new Date().getTime();
      let timediff = timenow - lastytpingTime;

      if (timediff >= timerlength && typing) {
        socket.emit('stop typing', selectedChats._id);
        settyping(false);
      }
    }, timerlength);
  };

  // console.log('selectedChats', selectedChats);
  // console.log('getfull', getSenderFull(user, selectedChats.users));

  return (
    <>
      <div className="SingleChat p-2 w-100">
        {selectedChats ? (
          <>
            {!selectedChats.isGroupChat ? (
              <div className="w-100 p-2 d-flex justify-content-between">
                {getSender(user.data, selectedChats.users)}
                <div className="detail">
                  <ProfileModel
                    user={getSenderFull(user.data, selectedChats.users)}
                  />
                </div>
              </div>
            ) : (
              <div className="w-100 d-flex justify-content-between align-items-center ">
                {selectedChats.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setfetchAgain={setfetchAgain}
                  fetchMessages={fetchMessages}
                />
              </div>
            )}
            {/* message */}
            <div className="Message chats d-flex flex-column justify-content-end p-2 w-100 ">
              {loading ? (
                <p class="card-text placeholder-glow m-auto align-self-center">
                  <span class="placeholder col-7"></span>
                  <span class="placeholder col-1"></span>
                  <span class="placeholder col-4"></span>
                  <span class="placeholder col-6"></span>
                  <span class="placeholder col-8"></span>
                </p>
              ) : (
                <div className="MessageBox">
                  <Messagedata messages={messages} />
                </div>
              )}

              <form>
                {istyping ? <div>typing...</div> : <></>}
                <div class="mt-3 w-100 p-2 d-flex gap-3 justify-content-center align-items-center">
                  <div className="box w-100 ">
                    <input
                      type="text"
                      placeholder="Enter Your message"
                      class="form-control w-100"
                      onChange={typingHandler}
                      value={newmessage}
                    />
                  </div>

                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="start  d-flex justify-content-center align-items-center h-100 fs-4 fw-bold">
            Click on user to start the Chatting
          </div>
        )}
      </div>
    </>
  );
};
export default SingleChat;
