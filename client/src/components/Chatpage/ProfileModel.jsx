import './SideUser.css';

const ProfileModel = ({ user }) => {
  // console.log("model",user);
  return (
    <>
      {/* <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
     My Profile
      </button> */}
      <button
        class="btn btn-primary w-100"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal1"
      >
        Profile
      </button> 

      <div
        class="modal fade"
        id="exampleModal1"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5 name" id="exampleModalLabel">
                {user.name}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body d-flex flex-column justify-content-center align-items-center">
              <img className="userpic" src={user.pic} alt={user.name} />
              <h4 className="p-2">Email: {user.email}</h4>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {/* <button type="button" class="btn btn-primary">
                Save changes
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileModel;
