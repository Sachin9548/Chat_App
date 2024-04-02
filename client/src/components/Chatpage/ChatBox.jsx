import { ChatState } from '../../context/ChatProvider';
import SingleChat from '../Chatpage/SingleChat';

const ChatBox = ({ fetchAgain, setfetchAgain }) => {
  const { selectedChats } = ChatState();
  return (
    <>
      <div className="ChatBox rounded d-flex justify-content-center h-100 w-100 bg-white  text-dark p-1">
        <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
      </div>
    </>
  );
};
export default ChatBox;
