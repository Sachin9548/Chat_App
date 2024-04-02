import { ChatState } from '../../../context/ChatProvider';
import '../SideUser.css';

const Userlist = ({ user, handleFuntion }) => {
  // console.log("userlist",user,handleFuntion)
  return (
    <>
      <div className="Userlist w-100">
        <button
          className="user w-100 p-2 m-2 boader-info d-flex justify-content-between btn btn-outline-primary"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={handleFuntion}
        >
          <img className="rounded-circle profileImg" src={user.pic} alt="" />
          <div className="details">
            <h3 className="name">{user.name}</h3>
            <p>Email: {user.email}</p>
          </div>
        </button>
      </div>
    </>
  );
};
export default Userlist;
