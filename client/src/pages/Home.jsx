import React, { useEffect } from 'react';
import Login from '../components/Authentication/Login/Login';
import SignUp from '../components/Authentication/SignUp/SignUp';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userinfo) {
      navigate('/chats');
    }
  }, [navigate]);
  return (
    <>
      <div className="container">
        <div className="box1">
          <h1 className="title">Chat-Ingo</h1>
        </div>
        <div className="box2">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active lsbtn"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Login
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link lsbtn"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Sign Up
              </button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <Login />
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <SignUp />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
