import Joi from "joi";

export const accessChatSchema = Joi.object({
  receiverId: Joi.string().required().messages({
    "string.empty": "Receiver ID is required",
  }),
});

export const createGroupChatSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Group name is required",
  }),
  users: Joi.string().required().messages({
    "string.empty": "Users are required",
  }),
});

export const renameGroupSchema = Joi.object({
  chatId: Joi.string().required().messages({
    "string.empty": "Chat ID is required",
  }),
  name: Joi.string().required().messages({
    "string.empty": "New name is required",
  }),
});

export const groupActionSchema = Joi.object({
  chatId: Joi.string().required().messages({
    "string.empty": "Chat ID is required",
  }),
  userId: Joi.string().required().messages({
    "string.empty": "User ID is required",
  }),
});
