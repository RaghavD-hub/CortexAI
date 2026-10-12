import express from "express";
import {
  createConversation,
  getconversations,
  getMessages,
  saveMessage,
  updateConversation,
} from "../contollers/chat.controller.js";

const router = express.Router();

router.get("/create-conversation", createConversation);
router.get("/get-conversations", getconversations);
router.post("/update-conversation", updateConversation);
router.post("/save-message", saveMessage);
router.get("/get-messages/:conversationId", getMessages);

export default router;
