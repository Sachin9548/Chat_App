import { ChatState } from '../../context/ChatProvider';
import './message.css';
import ScrollableFeed from 'react-scrollable-feed';
const Messagedata = ({ messages }) => {
  // const isSameSender = (messages, m, i, userId) => {
  //   return (
  //     i < messages.length - 1 &&
  //     (messages[i + 1].sender._id !== m.sender._id ||
  //       messages[i + 1].sender._id === undefined) &&
  //     messages[i].sender._id !== userId
  //   );
  // };

  const isSameSender = (messages, m, i, userId) => {
    const nextMessage = messages[i + 1];
    const currentSender = m?.sender?._id;
    const nextSender = nextMessage?.sender?._id;
    return (
      i < messages.length - 1 &&
      (nextSender !== currentSender || nextSender === undefined) &&
      currentSender !== userId
    );
  };

  // const isLastMessage = (messages, i, userId) => {
  //   return (
  //     i === messages.length - 1 &&
  //     messages[messages.length - 1].sender._id !== userId &&
  //     messages[messages.length - 1].sender._id
  //   );
  // };

  const isLastMessage = (messages, i, userId) => {
    const lastSender = messages[messages.length - 1]?.sender?._id;
    return i === messages.length - 1 && lastSender !== userId;
  };

  const isSameSenderMargin = (messages, m, i, userId) => {
    const currentSender = m?.sender?._id;
    if (i < messages.length - 1) {
      const nextSender = messages[i + 1]?.sender?._id;
      if (nextSender === currentSender && m?.sender?._id !== userId) {
        return 33;
      } else if (
        (nextSender !== currentSender && m.sender._id !== userId) ||
        (i === messages.length - 1 && m.sender._id !== userId)
      ) {
        return 0;
      }
    }
    return 'auto';
  };

  // const isSameSenderMargin = (messages, m, i, userId) => {
  //   if (
  //     i < messages.length - 1 &&
  //     messages[i + 1].sender._id === m.sender._id &&
  //     messages[i].sender._id !== userId
  //   )
  //     return 33;
  //   else if (
  //     (i < messages.length - 1 &&
  //       messages[i + 1].sender._id !== m.sender._id &&
  //       messages[i].sender._id !== userId) ||
  //     (i === messages.length - 1 && messages[i].sender._id !== userId)
  //   )
  //     return 0;
  //   else return 'auto';
  // };

  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1]?.sender?._id === m?.sender?._id;
  };

  const { user } = ChatState();

  return (
    <>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: 'flex' }} key={m?._id}>
              {(isSameSender(messages, m, i, user.data._id) ||
                isLastMessage(messages, i, user.data._id)) && (
                <div className="msg">
                  <div className="datamsg">
                    <img src={m?.sender?.pic} alt="usersimg" />
                    <p className="fw-bold">{m?.sender?.name}</p>
                  </div>
                  {/* use the marin left/top by funtions */}
                </div>
              )}

              <span
                style={{
                  backgroundColor: `${
                    m?.sender?._id === user.data._id ? '#BEE3F8' : '#B9F5D0'
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user.data._id),
                  marginTop: isSameUser(messages, m, i, user.data._id) ? 3 : 10,
                  borderRadius: '20px',
                  padding: '5px 15px',
                  maxWidth: '75%',
                }}
                className="message5"
              >
                {m?.content}
              </span>
            </div>
          ))}
      </ScrollableFeed>
    </>
  );
};
export default Messagedata;
