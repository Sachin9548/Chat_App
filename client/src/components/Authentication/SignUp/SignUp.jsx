import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [conformpassword, setConformpassword] = useState();
  const [pic, setPic] = useState();
  const [showp, setShowp] = useState(false);
  const [loading, setloading] = useState(false);

  //toast funtions
  const notifyA = (msg) => {
    toast.success(msg);
    // alert(msg);
  };

  const notifyB = (msg) => {
    toast.error(msg);
    // alert(msg);
  };

  const navigate = useNavigate();
  const handleClick = () => {
    setShowp(!showp);
  };
  const postDetails = (pics) => {
    setloading(true);
    // console.log('data', pics);
    const data = new FormData();
    data.append('file', pics);
    data.append('upload_preset', 'instaclone');
    data.append('cloud_name', 'clouddatasachin');
    fetch('https://api.cloudinary.com/v1_1/clouddatasachin/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPic(data.url);
        console.log(data.url);
        setloading(false);
        notifyA('image Sucessfully uploaded');
      })
      .catch((error) => {
        console.log(error);
        notifyB('error occurs in image upload try again');
      });
  };

  const submitHandle = async () => {
    if (loading) {
      notifyB('please wait image is uploading');
      return;
    }
    if (!name || !email || !password | !conformpassword) {
      // popup
      notifyB('please fill all details');
      return;
    }
    if (password !== conformpassword) {
      //popup
      notifyB('please fill password properly');
      return;
    }
    try {
      const data = await axios.post(
        '/api/user/',
        { name, email, password, pic }
      );
      // console.log('signup page data', data);
      notifyA('User Sucessfully Registed, please login');
      window.location.reload();
    } catch (error) {
      notifyB(error.responce.data);
      return;
    }
  };

  return (
    <>
      <div>
        <form>
          <div className="form-group mb-2">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              className="form-control f"
              id="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control f"
              id="exampleInputEmail1"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <div className="inline">
              <input
                type={showp ? 'text' : 'password'}
                className="form-control f"
                id="exampleInputPassword1"
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
          <div className="form-group">
            <label htmlFor="conformP">Conform Password</label>
            <div className="inline">
              <input
                type={showp ? 'text' : 'password'}
                className="form-control f"
                id="conformP"
                value={conformpassword}
                placeholder="Conform Password"
                onChange={(e) => setConformpassword(e.target.value)}
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

          <div className="form-group mt-1 d-flex justify-content-between">
            <label htmlFor="exampleFormControlFile1">Upload Your Picture</label>
            <input
              type="file"
              className="form-control-file"
              id="exampleFormControlFile1"
              accept="image/*"
              onChange={(e) => {
                postDetails(e.target.files[0]);
              }}
            />
          </div>
          <div className="display">
            <button
              type="button"
              className="btn btn-primary mt"
              onClick={submitHandle}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default SignUp;
