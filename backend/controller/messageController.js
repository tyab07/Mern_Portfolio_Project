import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"; 
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { senderName, subject, message } = req.body;

    if (!senderName || !subject || !message) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    const newMessage = await Message.create({
        senderName,
        subject,
        message
    });

    res.status(201).json({
        success: true,
        message: "Message created successfully",
        data: newMessage
    });
}); 