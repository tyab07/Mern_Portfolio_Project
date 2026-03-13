import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderName:{
    type: String,
    minLength:[2,'Name must be at least 2 characters long'],
    maxLength:[50,'Name cannot exceed 50 characters'],

  },
  subject:
{
   type:String,
   minLength:[2,'Subject must be at least 2 characters long'],
   maxLength:[100,'Subject cannot exceed 100 characters'],
},
message:{
    type:String,
    
},
createdAt:{
    type: Date,
    default: Date.now 
}
});  


export const Message = mongoose.model("Message", messageSchema);