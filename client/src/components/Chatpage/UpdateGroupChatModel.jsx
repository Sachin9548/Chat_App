import { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { toast } from 'react-toastify';
import './SideUser.css';
import UserBadgeItem from '../Chatpage/Users/UserBadgeItem';
import axios from 'axios';
import Userlist from '../Chatpage/Users/Userlist';

const UpdateGroupChatModel = ({ fetchAgain, setfetchAgain ,fetchMessages}) => {
  const [groupChatname, setGroupChatname] = useState();
  const [search, setsearch] = useState('');
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameLoding, setrenameLoding] = useState(false);

  const { user, selectedChats, setSelectedChats } = ChatState();

  //toast funtions
  const notifyA = (msg) => {
    toast.success(msg);
    // alert(msg);
  };

  const notifyB = (msg) => {
    toast.error(msg);
    // alert(msg);
  };

  // console.log("selectedChats",selectedChats.groupAdmin._id)
  // console.log("user",user.data._id)

  // console.log('sele', selectedChats.users);
  const handleRemove = async (userTOadd) => {
    if (
      selectedChats.groupAdmin._id !== user.data._id &&
      userTOadd._id !== user.data._id
    ) {
      notifyA('User admin can remove only');
      return;
    }

    try {
      setloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChats._id,
          userId: userTOadd._id,
        },
        config
      );
      // console.log('remove to group', data);
      userTOadd._id === user.data._id ? setSelectedChats() : setSelectedChats(data);
      if( userTOadd._id === user.data._id){
        notifyA('chat is close');
      }
      setfetchAgain(!fetchAgain);
      fetchMessages();
      setloading(false);
    } catch (error) {
      notifyB('error in adding to group');
      setloading(false);

      return;
    }
  };
  const handleAddUser = async (userTOadd) => {
    if (
      selectedChats.users.find((u) => {
        u._id === userTOadd._id;
      })
    ) {
      notifyB('User Already added');
      return;
    }

    console.log("selectedChats",selectedChats)

    if (selectedChats.groupAdmin._id !== user.data._id) {
      notifyB('User admin can added only');
      return;
    }
    try {
      setloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChats._id,
          userId: userTOadd._id,
        },
        config
      );
      console.log('add to group', data);
      setSelectedChats(data);
      setfetchAgain(!fetchAgain);
      setloading(false);
      notifyA('User added successfully');
    } catch (error) {
      notifyB('error in adding to group');
      setloading(false);
      return;
    }
  };

  const handleRename = async () => {
    if (!groupChatname) {
      return;
    }
    try {
      setrenameLoding(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChats._id,
          chatName: groupChatname,
        },
        config
      );
      console.log('renamegroup', data);
      setSelectedChats(data);
      setfetchAgain(!fetchAgain);
      setrenameLoding(false);
      notifyA('group name updated');
    } catch (error) {
      notifyB('error in rename');
      setrenameLoding(false);
      return;
    }
    setGroupChatname('');
  };
  const handleSearch = async (query) => {
    setsearch(query);
    if (!query) {
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
        `/api/user?search=${search}`,
        config
      );

      // console.log(data);
      setloading(false);
      setsearchResult(data);
    } catch (error) {
      notifyB('Fail to load the users');
      return;
    }
  };
  return (
    <>
      <div className="UpdateGroupChatModel">
        <span
          class="pointer d-flex justify-content-center align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalGroup"
        >
          <span className="material-symbols-outlined text-dark fs-3">
            update
          </span>{' '}
        </span>
        <div
          class="modal fade"
          id="exampleModalGroup"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 name" id="exampleModalLabel">
                  {selectedChats.chatName}
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body d-flex gap-3 justify-content-center align-items-center">
                {selectedChats.users.map((u) => {
                  return (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFuntion={() => {
                        handleRemove(u);
                      }}
                    />
                  );
                })}
              </div>
              <div className="formcontroler p-1 ">
                <form className=" ">
                  <div class="mt-3 w-100 p-2 d-flex gap-3 justify-content-center align-items-center">
                    <div className="box w-100 ">
                      <input
                        type="text"
                        placeholder="Update Chat Name"
                        class="form-control w-100"
                        onChange={(e) => {
                          setGroupChatname(e.target.value);
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={handleRename}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Update
                    </button>
                  </div>
                </form>

                <form className="w-100 p-2">
                  <div class="mb-3">
                    <input
                      type="text"
                      placeholder="Add user eg: name,username"
                      class="form-control"
                      id="ADDuser"
                      onChange={(e) => {
                        handleSearch(e.target.value);
                      }}
                    />
                  </div>
                </form>
                {/* selected users */}
                <div className="box p-2 d-flex gap-3 justify-content-center align-items-center flex-column">
                {loading ? (
                  <div>Loading</div>
                ) : (
                  searchResult?.slice(0, 3).map((user) => {
                    return (
                      <Userlist
                        key={user._id}
                        user={user}
                        handleFuntion={() => {
                          handleAddUser(user);
                        }}
                      />
                    );
                  })
                )}
                </div>

              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRemove(user.data);
                  }}
                  class="btn btn-danger"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UpdateGroupChatModel;
