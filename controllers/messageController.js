const Chat = require("../Modals/ChatModal.js");
const Message = require("../Modals/MessageModal.js");
const User = require("../Modals/UserModal.js");


const sendMessage=async(req,res)=>{
  const {content,chatId}=req.body;
  if(!content || !chatId){
    return res.status(400).json({message:"Please provide content and chatId"});
  }
    let newMessage={
      sender:req.user._id,
      content:content,
      chat:chatId,
    }
  try{
    let messageCreated=await Message.create(newMessage);
      messageCreated=await messageCreated.populate("sender","name pic");
      messageCreated=await messageCreated.populate("chat");
      messageCreated=await User.populate(messageCreated,{
        path: "chat.users",
        select: "name pic email",
      })
    await Chat.findByIdAndUpdate(req.body.chatId,{ 
      letestMessage:messageCreated,
    });
    return res.status(200).json({message:"Message Sent",messageCreated});
  }catch(error){
    res.status(500).json({error:"Failed to Send Message"});
  }
}

const allMessage=async (req,res)=>{
  try{
    const messages=await Message.find({chat:req.params.chatId})
      .populate("sender","name pic email")
      .populate("chat");
    return res.status(200).json({messages});
  }catch(error){
    res.status(500).json({error:"Failed to fetch messages"});
  }
}
module.exports={sendMessage,allMessage}