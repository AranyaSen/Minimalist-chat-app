import Joi from "joi";

export const updateMessageReactionSchema = Joi.object({
  reaction: Joi.array().items(
    Joi.object({
      userId: Joi.string().required(),
      type: Joi.string().required(),
    })
  ).required().messages({
    "any.required": "Reaction is required",
  }),
});
export const createMessageSchema = Joi.object({
  chatId: Joi.string().required().messages({
    "string.empty": "Chat ID is required",
  }),
  content: Joi.string().required().messages({
    "string.empty": "Message content is required",
  }),
  receiverId: Joi.string().required().messages({
    "string.empty": "Receiver ID is required",
  }),
});
