import { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatProvider from './context/ChatProvider';

function App() {
  return (
    <>
      <div className="App">
        <ChatProvider>
          <Routes>
            <Route path="/" Component={Home} exact />
            <Route path="/chats" Component={ChatPage} />
          </Routes>
        </ChatProvider>
        <ToastContainer theme="dark" />
      </div>
    </>
  );
}

export default App;
