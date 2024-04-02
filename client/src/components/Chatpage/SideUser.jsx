import { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { toast } from 'react-toastify';
import './SideUser.css';
import ProfileModel from '../Chatpage/ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Userlist from '../Chatpage/Users/Userlist';
const SideUser = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    setSelectedChats,
    chats,
    setChats,
    notification,
    setnotification,
  } = ChatState();
  //toast funtions
  const notifyA = (msg) => {
    toast.success(msg);
    // alert(msg);
  };

  const notifyB = (msg) => {
    toast.error(msg);
    // alert(msg);
  };

  const logoutHandler = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggle = () => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      notifyB('Enter the name or email');
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user?search=${search}`,
        config
      );
      setSearchResult(data);
      // console.log('serch', data);
      setLoading(false);
    } catch (error) {
      notifyB('error occurs in search the user');
      return;
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/chat',
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChats(data);
      // console.log('accesschat', data);
      setLoadingChat(false);
    } catch (error) {
      notifyA('error occurs in accessChat');
      return;
    }
  };

  // console.log('user', user);
  return (
    <>
      <div className="SideUser d-flex bg-white text-dark justify-content-between align-items-center ">
        <button
          type="button"
          className="btn btn-secondary d-flex align-items-center m-2"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Search User to Connect"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          <span className="material-symbols-outlined">search</span>
          Search User
        </button>

        <h2>Chat-Info</h2>

        <div className="items  d-flex justify-content-between align-items-center">
          {/* <div className="notification d-flex">
            <span className="material-symbols-outlined notify">
              notifications
            </span>
          </div> */}
          <div class=" position-relative m-2">
            <span
              className="material-symbols-outlined fs-2 cp"
              onClick={() => {
                setnotification([]);
              }}
            >
              notifications
            </span>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {notification.length}
              <span class="visually-hidden">unread messages</span>
            </span>
          </div>
          <img
            // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZarNDR7NeKoYVpsQzK-9YWc3w0VFe6oUbKg&usqp=CAU"
            src={user.data.pic}
            className="rounded-circle profileImg"
            alt="user.pic"
            onClick={() => toggle()}
          />
          {show && (
            <>
              <ul class="list-group list bg-info">
                {/* <ProfileModel>
                  <li class="list-group-item list-group-item-action list-group-item-info font-weight-900">
                    My Profile
                  </li>
                </ProfileModel> */}

                <li className="p-2 w-100" onClick={() => toggle()}>
                  <ProfileModel user={user.data} />
                </li>

                <li class="list-group-item list-group-item-action list-group-item-info">
                  <button
                    class="btn btn-danger"
                    onClick={() => {
                      logoutHandler();
                    }}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="drawer">
        {/* <button
          class="btn btn-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          Button with data-bs-target
        </button> */}
        <div
          class="offcanvas offcanvas-start"
          tabindex="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">
              Search Users
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <button
                class="btn btn-outline-primary"
                type="button"
                id="button-addon2"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            <div>
              {/* <div>
                <button className="user w-100 p-2 pt-2 m-2 boader-info d-flex justify-content-around btn btn-outline-primary">
                  <img
                    className="rounded-circle profileImg"
                    src={user.data.pic}
                    alt=""
                  />
                  <div className="details">
                    <h3 className="name">{user.data.name}</h3>
                    <p>Email: {user.data.email}</p>
                  </div>
                </button>
              </div> */}
              {loading ? (
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
              ) : (
                searchResult.map((user) => {
                  return (
                    <Userlist
                      key={user._id}
                      user={user}
                      handleFuntion={() => {
                        accessChat(user._id);
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SideUser;
