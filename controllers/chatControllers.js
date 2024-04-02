const Chat = require('../Modals/ChatModal.js');
const User = require('../Modals/UserModal.js');

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    // console.log('userid not send');
    return res.status(400).json("userid not send");
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('letestMessage');

  isChat = await User.populate(isChat, {
    path: 'letestMessage.sender',
    select: 'name pic email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = { 
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    
    try {
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('letestMessage')
      .sort({ updateAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'letestMessage.sender',
          select: 'name pic email',
        });
        res.status(200).json(results);
      });
  } catch (error) {
    res.status(500).send(error);
  } 
};

const createGroupChat = async (req, res) => {
  if (!req.body.name || !req.body.users) {
    return res.status(400).send('fill all details');
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(401).send('fill more than 2 user.');
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(500).send(error);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updateChat) {
    return res.status(401).send('chat not found');
  } else {
    res.status(200).json(updateChat);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    return res.status(401).send('chat not found');
  } else {
    res.status(200).json(added);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    return res.status(401).send('chat not found');
  } else {
    res.status(200).json(removed);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
};
