const UserBadgeItem = ({ user, handleFuntion }) => {
  return (
    <>
      <div className="UserBadgeItem">
        <button type="button" class="btn btn-info position-relative" onClick={handleFuntion}>
          {user.name}
          <span class="position-absolute top-0 start-100 translate-middle d-flex justify-content-center bg-danger border border-light rounded-circle">
          <span className="material-symbols-outlined">close</span>
          </span>
        </button>
      </div>
    </>
  );
};
export default UserBadgeItem;
