import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';
import Userlist from '../Chatpage/Users/Userlist';
import UserBadgeItem from '../Chatpage/Users/UserBadgeItem';

const Groupchatmodel = () => {
  const [groupChatname, setGroupChatname] = useState();
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setsearch] = useState('');
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);

  const { user, chats, setChats } = ChatState();
  //toast funtions
  const notifyA = (msg) => {
    toast.success(msg);
    // alert(msg);
  };

  const notifyB = (msg) => {
    toast.error(msg);
    // alert(msg);
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

      console.log(data);
      setloading(false);
      setsearchResult(data);
    } catch (error) {
      notifyB('Fail to load the users');
      return;
    }
  };
  // console.log("group",JSON.stringify(selectedUsers.map((u) => u._id)));
  const handleSubmit = async () => {
    if (!groupChatname || !selectedUsers) {
      notifyB('plase fill the details');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatname,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      // console.log('handlesubmit chatmodel', data);
      setChats([data, ...chats]);
      notifyA('Group chat Created');
    } catch (error) {
      notifyB('error in group chat creation');
      return;
    }
  };

  const handleDelete = (deluser) => {
    setselectedUsers(
      selectedUsers.filter((sel) => {
        sel._id !== deluser.id;
      })
    );
  };

  const handleGroup = (userTOadd) => {
    if (selectedUsers.includes(userTOadd)) {
      notifyA('User Already added');
      return;
    }
    setselectedUsers([...selectedUsers, userTOadd]);
  };

  return (
    <>
      <button
        className="btn btn-outline-primary d-flex justify-content-center align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <span> New Group Chat </span>
        <span className="material-symbols-outlined text-dark fs-3">
          add
        </span>{' '}
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 name" id="exampleModalLabel">
                Create Group Chat
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex flex-column justify-content-center align-items-center">
              <form className="w-100">
                <div className="mb-3">
                  <label htmlFor="groupname" className="form-label">
                    Chat Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Chat Name"
                    className="form-control"
                    id="groupname"
                    onChange={(e) => {
                      setGroupChatname(e.target.value);
                    }}
                  />
                </div>
              </form>
              <form className="w-100">
                <div className="mb-3">
                  <label htmlFor="ADDuser" className="form-label">
                    Add Users
                  </label>
                  <input
                    type="text"
                    placeholder="Add user eg: name,username"
                    className="form-control"
                    id="ADDuser"
                    onChange={(e) => {
                      handleSearch(e.target.value);
                    }}
                  />
                </div>
              </form>
              {/* selected users */}

              <div className="box d-flex w-100 flex-wrap gap-3">
                {selectedUsers.map((u) => {
                  return (
                    <UserBadgeItem
                      key={user._id}
                      user={u}
                      handleFuntion={() => {
                        handleDelete(u);
                      }}
                    />
                  );
                })}
              </div>

              {/* reder the users */}
              {loading ? (
                <div>Loading</div>
              ) : (
                searchResult.slice(0, 3).map((user) => {
                  return (
                    <Userlist
                      key={user._id}
                      user={user}
                      handleFuntion={() => {
                        handleGroup(user);
                      }}
                    />
                  );
                })
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                data-bs-dismiss="modal"
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Groupchatmodel;
