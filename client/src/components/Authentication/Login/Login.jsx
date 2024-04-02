import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showp, setShowp] = useState(false);

  //toast funtions
  const notifyA = (msg) => {
    toast.success(msg);
  };
  const notifyB = (msg) => {
    toast.error(msg);
  };

  const navigate = useNavigate();

  const handleClick = () => {
    setShowp(!showp);
  };
  const submitHandle = async () => {
    if (!email || !password) {
      notifyB('please fill all details');
      return;
    }
    try {
      const data = await axios.post(
        '/api/user/login',
        { email, password }
      );
      // console.log("login data",data);
      notifyA('User Login Sucessfully');
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/chats');
    } catch (error) {
      console.log(error.response.data);
      notifyB(error.response.data);
    }
  };

  return (
    <>
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control f"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <small id="emailHelp" className="form-text text-muted">
              <p className="w">
                We'll never share your email with anyone else.
              </p>
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="Password1">Password</label>
            <div className="inline">
              <input
                type={showp ? 'text' : 'password'}
                className="form-control f"
                id="Password1"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-warning btnshow m-3"
                onClick={handleClick}
              >
                {showp ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="display">
            <button
              type="button"
              className="btn btn-primary mt"
              onClick={submitHandle}
            >
              Login
            </button>

            <button
              type="button"
              className="btn btn-danger mt"
              onClick={() => {
                setEmail('guist@gmail.com');
                setPassword('123');
              }}
            >
              Guest User
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;
