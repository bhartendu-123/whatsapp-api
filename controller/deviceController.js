"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.archiveAllChats = archiveAllChats;exports.archiveChat = archiveChat;exports.blockContact = blockContact;exports.chatWoot = chatWoot;exports.checkNumberStatus = checkNumberStatus;exports.clearAllChats = clearAllChats;exports.clearChat = clearChat;exports.deleteAllChats = deleteAllChats;exports.deleteChat = deleteChat;exports.deleteMessage = deleteMessage;exports.forwardMessages = forwardMessages;exports.getAllChats = getAllChats;exports.getAllChatsArchiveds = getAllChatsArchiveds;exports.getAllChatsWithMessages = getAllChatsWithMessages;exports.getAllContacts = getAllContacts;exports.getAllMessagesInChat = getAllMessagesInChat;exports.getAllNewMessages = getAllNewMessages;exports.getAllUnreadMessages = getAllUnreadMessages;exports.getBatteryLevel = getBatteryLevel;exports.getBlockList = getBlockList;exports.getChatById = getChatById;exports.getChatIsOnline = getChatIsOnline;exports.getContact = getContact;exports.getHostDevice = getHostDevice;exports.getLastSeen = getLastSeen;exports.getListMutes = getListMutes;exports.getMessageById = getMessageById;exports.getMessages = getMessages;exports.getNumberProfile = getNumberProfile;exports.getPhoneNumber = getPhoneNumber;exports.getPlatformFromMessage = getPlatformFromMessage;exports.getProfilePicFromServer = getProfilePicFromServer;exports.getReactions = getReactions;exports.getStatus = getStatus;exports.getUnreadMessages = getUnreadMessages;exports.getVotes = getVotes;exports.listChats = listChats;exports.loadAndGetAllMessagesInChat = loadAndGetAllMessagesInChat;exports.markUnseenMessage = markUnseenMessage;exports.pinChat = pinChat;exports.reactMessage = reactMessage;exports.rejectCall = rejectCall;exports.reply = reply;exports.sendContactVcard = sendContactVcard;exports.sendMute = sendMute;exports.sendSeen = sendSeen;exports.setChatState = setChatState;exports.setProfileName = setProfileName;exports.setProfilePic = setProfilePic;exports.setProfileStatus = setProfileStatus;exports.setRecording = setRecording;exports.setTemporaryMessages = setTemporaryMessages;exports.setTyping = setTyping;exports.showAllContacts = showAllContacts;exports.starMessage = starMessage;exports.unblockContact = unblockContact;

















var _functions = require("../util/functions");
var _sessionUtil = require("../util/sessionUtil"); /*
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function returnSucess(res, session, phone, data) {res.status(201).json({ status: 'Success', response: { message: 'Information retrieved successfully.', contact: phone, session: session, data: data } });}function returnError(req, res, session, error) {
  req.logger.error(error);
  res.status(400).json({
    status: 'Error',
    response: {
      message: 'Error retrieving information',
      session: session,
      log: error
    }
  });
}

async function setProfileName(req, res) {
  /**
   * #swagger.tags = ["Profile"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: false,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            }
          },
          examples: {
            "Default": {
              value: {
                name: "My new name",
              }
            },
          }
        }
      }
     }
   */
  const { name } = req.body;

  if (!name)
  return res.
  status(400).
  json({ status: 'error', message: 'Parameter name is required!' });

  try {
    const result = await req.client.setProfileName(name);
    return res.status(200).json({ status: 'success', response: result });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error on set profile name.',
      error: error
    });
  }
}

async function showAllContacts(req, res) {
  /**
   * #swagger.tags = ["Contacts"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const contacts = await req.client.getAllContacts();
    res.status(200).json({ status: 'success', response: contacts });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching contacts',
      error: error
    });
  }
}

async function getAllChats(req, res) {
  /**
   * #swagger.tags = ["Chat"]
   * #swagger.summary = 'Deprecated in favor of 'list-chats'
   * #swagger.deprecated = true
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const response = await req.client.getAllChats();
    return res.
    status(200).
    json({ status: 'success', response: response, mapper: 'chat' });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on get all chats' });
  }
}

async function listChats(req, res) {
  /**
   * #swagger.tags = ["Chat"]
   * #swagger.summary = 'Retrieve a list of chats'
   * #swagger.description = 'This body is not required. Not sent body to get all chats or filter.'
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: false,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string" },
              count: { type: "number" },
              direction: { type: "string" },
              onlyGroups: { type: "boolean" },
              onlyUsers: { type: "boolean" },
              onlyWithUnreadMessage: { type: "boolean" },
              withLabels: { type: "array" },
            }
          },
          examples: {
            "All options - Edit this": {
              value: {
                id: "<chatId>",
                count: 20,
                direction: "after",
                onlyGroups: false,
                onlyUsers: false,
                onlyWithUnreadMessage: false,
                withLabels: []
              }
            },
            "All chats": {
              value: {
              }
            },
            "Chats group": {
              value: {
                onlyGroups: true,
              }
            },
            "Only with unread messages": {
              value: {
                onlyWithUnreadMessage: false,
              }
            },
            "Paginated results": {
              value: {
                id: "<chatId>",
                count: 20,
                direction: "after",
              }
            },
          }
        }
      }
     }
   */
  try {
    const {
      id,
      count,
      direction,
      onlyGroups,
      onlyUsers,
      onlyWithUnreadMessage,
      withLabels
    } = req.body;

    const response = await req.client.listChats({
      id: id,
      count: count,
      direction: direction,
      onlyGroups: onlyGroups,
      onlyUsers: onlyUsers,
      onlyWithUnreadMessage: onlyWithUnreadMessage,
      withLabels: withLabels
    });

    return res.status(200).json(response);
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on get all chats' });
  }
}

async function getAllChatsWithMessages(req, res) {
  /**
   * #swagger.tags = ["Chat"]
   * #swagger.summary = 'Deprecated in favor of list-chats'
   * #swagger.deprecated = true
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const response = await req.client.getAllChatsWithMessages();
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get all chats whit messages',
      error: e
    });
  }
}
/**
 * Depreciado em favor de getMessages
 */
async function getAllMessagesInChat(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999'
     }
     #swagger.parameters["isGroup"] = {
      schema: 'false'
     }
     #swagger.parameters["includeMe"] = {
      schema: 'true'
     }
     #swagger.parameters["includeNotifications"] = {
      schema: 'true'
     }
   */
  try {
    const { phone } = req.params;
    const {
      isGroup = false,
      includeMe = true,
      includeNotifications = true
    } = req.query;

    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.getAllMessagesInChat(
        contato,
        includeMe,
        includeNotifications
      );
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get all messages in chat',
      error: e
    });
  }
}

async function getAllNewMessages(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const response = await req.client.getAllNewMessages();
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get all messages in chat',
      error: e
    });
  }
}

async function getAllUnreadMessages(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const response = await req.client.getAllUnreadMessages();
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get all messages in chat',
      error: e
    });
  }
}

async function getChatById(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999'
     }
     #swagger.parameters["isGroup"] = {
      schema: 'false'
     }
   */
  const { phone } = req.params;
  const { isGroup } = req.query;

  try {
    let result = {};
    if (isGroup) {
      result = await req.client.getChatById(`${phone}@g.us`);
    } else {
      result = await req.client.getChatById(`${phone}@c.us`);
    }

    return res.status(200).json(result);
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error changing chat by Id',
      error: e
    });
  }
}

async function getMessageById(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["messageId"] = {
      required: true,
      schema: '<message_id>'
     }
   */
  const session = req.session;
  const { messageId } = req.params;

  try {
    const result = await req.client.getMessageById(messageId);

    returnSucess(res, session, result.chatId.user, result);
  } catch (error) {
    returnError(req, res, session, error);
  }
}

async function getBatteryLevel(req, res) {
  /**
   * #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const response = await req.client.getBatteryLevel();
    return res.status(200).json({ status: 'Success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error retrieving battery status',
      error: e
    });
  }
}

async function getHostDevice(req, res) {
  /**
   * #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const response = await req.client.getHostDevice();
    const phoneNumber = await req.client.getWid();
    return res.status(200).json({
      status: 'success',
      response: { ...response, phoneNumber },
      mapper: 'device'
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao recuperar dados do telefone',
      error: e
    });
  }
}

async function getPhoneNumber(req, res) {
  /**
   * #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const phoneNumber = await req.client.getWid();
    return res.
    status(200).
    json({ status: 'success', response: phoneNumber, mapper: 'device' });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error retrieving phone number',
      error: e
    });
  }
}

async function getBlockList(req, res) {
  /**
   * #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  const response = await req.client.getBlockList();

  try {
    const blocked = response.map((contato) => {
      return { phone: contato ? contato.split('@')[0] : '' };
    });

    return res.status(200).json({ status: 'success', response: blocked });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error retrieving blocked contact list',
      error: e
    });
  }
}

async function deleteChat(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: false,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
              }
            },
          }
        }
      }
     }
   */
  const { phone } = req.body;
  const session = req.session;

  try {
    const results = {};
    for (const contato of phone) {
      results[contato] = await req.client.deleteChat(contato);
    }
    returnSucess(res, session, phone, results);
  } catch (error) {
    returnError(req, res, session, error);
  }
}
async function deleteAllChats(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const chats = await req.client.getAllChats();
    for (const chat of chats) {
      await req.client.deleteChat(chat.chatId);
    }
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on delete all chats',
      error: error
    });
  }
}

async function clearChat(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     
     #swagger.requestBody = {
      required: false,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
              }
            },
          }
        }
      }
     }
   */
  const { phone } = req.body;
  const session = req.session;

  try {
    const results = {};
    for (const contato of phone) {
      results[contato] = await req.client.clearChat(contato);
    }
    returnSucess(res, session, phone, results);
  } catch (error) {
    returnError(req, res, session, error);
  }
}

async function clearAllChats(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const chats = await req.client.getAllChats();
    for (const chat of chats) {
      await req.client.clearChat(`${chat.chatId}`);
    }
    return res.status(201).json({ status: 'success' });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on clear all chats', error: e });
  }
}

async function archiveChat(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     
     #swagger.requestBody = {
      required: false,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              value: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
                value: true,
              }
            },
          }
        }
      }
     }
   */
  const { phone, value = true } = req.body;

  try {
    const response = await req.client.archiveChat(`${phone}`, value);
    return res.status(201).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on archive chat', error: e });
  }
}

async function archiveAllChats(req, res) {
  /**
   * #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const chats = await req.client.getAllChats();
    for (const chat of chats) {
      await req.client.archiveChat(`${chat.chatId}`, true);
    }
    return res.status(201).json({ status: 'success' });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on archive all chats',
      error: e
    });
  }
}

async function getAllChatsArchiveds(req, res) {
  /**
   * #swagger.tags = ["Chat"]
   * #swagger.description = 'Retrieves all archived chats.'
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const chats = await req.client.getAllChats();
    const archived = [];
    for (const chat of chats) {
      if (chat.archive === true) {
        archived.push(chat);
      }
    }
    return res.status(201).json(archived);
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on archive all chats',
      error: e
    });
  }
}
async function deleteMessage(req, res) {
  /**
   * #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     
     #swagger.requestBody = {
      required: false,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              messageId: { type: "string" },
              onlyLocal: { type: "boolean" },
              deleteMediaInDevice: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
                messageId: "<messageId>",
              }
            },
          }
        }
      }
     }
   */
  const { phone, messageId, deleteMediaInDevice, onlyLocal } = req.body;

  try {
    const result = await req.client.deleteMessage(
      `${phone}`,
      messageId,
      onlyLocal,
      deleteMediaInDevice
    );
    if (result) {
      return res.
      status(200).
      json({ status: 'success', response: { message: 'Message deleted' } });
    }
    return res.status(401).json({
      status: 'error',
      response: { message: 'Error unknown on delete message' }
    });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on delete message', error: e });
  }
}
async function reactMessage(req, res) {
  /**
   * #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: false,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              msgId: { type: "string" },
              reaction: { type: "string" },
            }
          },
          examples: {
            "Default": {
              value: {
                msgId: "<messageId>",
                reaction: "😜",
              }
            },
          }
        }
      }
     }
   */
  const { msgId, reaction } = req.body;

  try {
    await req.client.sendReactionToMessage(msgId, reaction);

    return res.
    status(200).
    json({ status: 'success', response: { message: 'Reaction sended' } });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on send reaction to message',
      error: e
    });
  }
}

async function reply(req, res) {
  /**
   * #swagger.deprecated=true
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              messageid: { type: "string" },
              text: { type: "string" },
            }
          },
          examples: {
            "Default": {
              value: {
              phone: "5521999999999",
              isGroup: false,
              messageid: "<messageId>",
              text: "Text to reply",
              }
            },
          }
        }
      }
     }
   */
  const { phone, text, messageid } = req.body;

  try {
    const response = await req.client.reply(`${phone}@c.us`, text, messageid);
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error replying message', error: e });
  }
}

async function forwardMessages(req, res) {
  /**
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              messageId: { type: "string" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
                messageId: "<messageId>",
              }
            },
          }
        }
      }
     }
   */
  const { phone, messageId, isGroup = false } = req.body;

  try {
    let response;

    if (!isGroup) {
      response = await req.client.forwardMessage(`${phone[0]}`, messageId);
    } else {
      response = await req.client.forwardMessage(`${phone[0]}`, messageId);
    }

    return res.status(201).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error forwarding message', error: e });
  }
}

async function markUnseenMessage(req, res) {
  /**
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
              }
            },
          }
        }
      }
     }
   */
  const { phone } = req.body;

  try {
    await req.client.markUnseenMessage(`${phone}`);
    return res.
    status(200).
    json({ status: 'success', response: { message: 'unseen checked' } });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on mark unseen', error: e });
  }
}

async function blockContact(req, res) {
  /**
     #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
              phone: "5521999999999",
              isGroup: false,
              }
            },
          }
        }
      }
     }
   */
  const { phone } = req.body;

  try {
    await req.client.blockContact(`${phone}`);
    return res.
    status(200).
    json({ status: 'success', response: { message: 'Contact blocked' } });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on block contact', error: e });
  }
}

async function unblockContact(req, res) {
  /**
     #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
              phone: "5521999999999",
              isGroup: false,
              }
            },
          }
        }
      }
     }
   */
  const { phone } = req.body;

  try {
    await req.client.unblockContact(`${phone}`);
    return res.
    status(200).
    json({ status: 'success', response: { message: 'Contact UnBlocked' } });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on unlock contact', error: e });
  }
}

async function pinChat(req, res) {
  /**
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["obj"] = {
      in: 'body',
      schema: {
        $phone: '5521999999999',
        $isGroup: false,
        $state: true,
      }
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              state: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
              phone: "5521999999999",
              state: true,
              }
            },
          }
        }
      }
     }
   */
  const { phone, state } = req.body;

  try {
    for (const contato of phone) {
      await req.client.pinChat(contato, state === 'true', false);
    }

    return res.
    status(200).
    json({ status: 'success', response: { message: 'Chat fixed' } });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: e.text || 'Error on pin chat',
      error: e
    });
  }
}

async function setProfilePic(req, res) {
  /**
     #swagger.tags = ["Profile"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.consumes = ['multipart/form-data']  
      #swagger.parameters['file'] = {
          in: 'formData',
          type: 'file',
          required: 'true',
      }
   */
  if (!req.file)
  return res.
  status(400).
  json({ status: 'Error', message: 'File parameter is required!' });

  try {
    const { path: pathFile } = req.file;

    await req.client.setProfilePic(pathFile);
    await (0, _functions.unlinkAsync)(pathFile);

    return res.status(200).json({
      status: 'success',
      response: { message: 'Profile photo successfully changed' }
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error changing profile photo',
      error: e
    });
  }
}

async function getUnreadMessages(req, res) {
  /**
     #swagger.deprecated=true
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const response = await req.client.getUnreadMessages(false, false, true);
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', response: 'Error on open list', error: e });
  }
}

async function getChatIsOnline(req, res) {
  /**
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999',
     }
   */
  const { phone } = req.params;
  try {
    const response = await req.client.getChatIsOnline(`${phone}@c.us`);
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      response: 'Error on get chat is online',
      error: e
    });
  }
}

async function getLastSeen(req, res) {
  /**
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999',
     }
   */
  const { phone } = req.params;
  try {
    const response = await req.client.getLastSeen(`${phone}@c.us`);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      response: 'Error on get chat last seen',
      error: error
    });
  }
}

async function getListMutes(req, res) {
  /**
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["type"] = {
      schema: 'all',
     }
   */
  const { type = 'all' } = req.params;
  try {
    const response = await req.client.getListMutes(type);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      response: 'Error on get list mutes',
      error: error
    });
  }
}

async function loadAndGetAllMessagesInChat(req, res) {
  /**
     #swagger.deprecated=true
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999'
     }
     #swagger.parameters["includeMe"] = {
      schema: 'true'
     }
     #swagger.parameters["includeNotifications"] = {
      schema: 'false'
     }
   */
  const { phone, includeMe = true, includeNotifications = false } = req.params;
  try {
    const response = await req.client.loadAndGetAllMessagesInChat(
      `${phone}@c.us`,
      includeMe,
      includeNotifications
    );

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.
    status(500).
    json({ status: 'error', response: 'Error on open list', error: error });
  }
}
async function getMessages(req, res) {
  /**
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999@c.us'
     }
     #swagger.parameters["count"] = {
      schema: '20'
     }
     #swagger.parameters["direction"] = {
      schema: 'before'
     }
     #swagger.parameters["id"] = {
      schema: '<message_id_to_use_direction>'
     }
   */
  const { phone } = req.params;
  const { count = 20, direction = 'before', id = null } = req.query;
  try {
    const response = await req.client.getMessages(`${phone}`, {
      count: parseInt(count),
      direction: direction.toString(),
      id: id
    });
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(401).
    json({ status: 'error', response: 'Error on open list', error: e });
  }
}

async function sendContactVcard(req, res) {
  /**
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              name: { type: "string" },
              contactsId: { type: "array" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
                name: 'Name of contact',
                contactsId: ['5521999999999'],
              }
            },
          }
        }
      }
     }
   */
  const { phone, contactsId, name = null, isGroup = false } = req.body;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.sendContactVcard(
        `${contato}`,
        contactsId,
        name
      );
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on send contact vcard',
      error: error
    });
  }
}

async function sendMute(req, res) {
  /**
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
    #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              time: { type: "number" },
              type: { type: "string" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
                time: 1,
                type: 'hours',
              }
            },
          }
        }
      }
     }
   */
  const { phone, time, type = 'hours', isGroup = false } = req.body;

  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.sendMute(`${contato}`, time, type);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on send mute', error: error });
  }
}

async function sendSeen(req, res) {
  /**
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
              }
            },
          }
        }
      }
     }
   */
  const { phone } = req.body;
  const session = req.session;

  try {
    const results = [];
    for (const contato of phone) {
      results.push(await req.client.sendSeen(contato));
    }
    returnSucess(res, session, phone, results);
  } catch (error) {
    returnError(req, res, session, error);
  }
}

async function setChatState(req, res) {
  /**
     #swagger.deprecated=true
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              chatstate: { type: "string" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
                chatstate: "1",
              }
            },
          }
        }
      }
     }
   */
  const { phone, chatstate, isGroup = false } = req.body;

  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.setChatState(`${contato}`, chatstate);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on send chat state',
      error: error
    });
  }
}

async function setTemporaryMessages(req, res) {
  /**
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              value: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
                value: true,
              }
            },
          }
        }
      }
     }
   */
  const { phone, value = true, isGroup = false } = req.body;

  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.setTemporaryMessages(`${contato}`, value);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on set temporary messages',
      error: error
    });
  }
}

async function setTyping(req, res) {
  /**
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              value: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
                value: true,
              }
            },
          }
        }
      }
     }
   */
  const { phone, value = true, isGroup = false } = req.body;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      if (value) response = await req.client.startTyping(contato);else
      response = await req.client.stopTyping(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on set typing', error: error });
  }
}

async function setRecording(req, res) {
  /**
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              duration: { type: "number" },
              value: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                phone: "5521999999999",
                isGroup: false,
                duration: 5,
                value: true,
              }
            },
          }
        }
      }
     }
   */
  const { phone, value = true, duration, isGroup = false } = req.body;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      if (value) response = await req.client.startRecording(contato, duration);else
      response = await req.client.stopRecoring(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on set recording',
      error: error
    });
  }
}

async function checkNumberStatus(req, res) {
  /**
     #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999'
     }
   */
  const { phone } = req.params;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, false)) {
      response = await req.client.checkNumberStatus(`${contato}`);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on check number status',
      error: error
    });
  }
}

async function getContact(req, res) {
  /**
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999'
     }
   */
  const { phone = true } = req.params;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, false)) {
      response = await req.client.getContact(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on get contact', error: error });
  }
}

async function getAllContacts(req, res) {
  /**
   * #swagger.tags = ["Contact"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const response = await req.client.getAllContacts();

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get all constacts',
      error: error
    });
  }
}

async function getNumberProfile(req, res) {
  /**
     #swagger.deprecated=true
     #swagger.tags = ["Chat"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999'
     }
   */
  const { phone = true } = req.params;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, false)) {
      response = await req.client.getNumberProfile(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get number profile',
      error: error
    });
  }
}

async function getProfilePicFromServer(req, res) {
  /**
     #swagger.tags = ["Contact"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999'
     }
   */
  const { phone = true } = req.params;
  const { isGroup = false } = req.query;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      response = await req.client.getProfilePicFromServer(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on  get profile pic',
      error: error
    });
  }
}

async function getStatus(req, res) {
  /**
     #swagger.tags = ["Contact"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999'
     }
   */
  const { phone = true } = req.params;
  try {
    let response;
    for (const contato of (0, _functions.contactToArray)(phone, false)) {
      response = await req.client.getStatus(contato);
    }
    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on  get status', error: error });
  }
}

async function setProfileStatus(req, res) {
  /**
     #swagger.tags = ["Profile"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["obj"] = {
      in: 'body',
      schema: {
        $status: 'My new status',
      }
     }
     
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string" },
            }
          },
          examples: {
            "Default": {
              value: {
                status: "My new status",
              }
            },
          }
        }
      }
     }
   */
  const { status } = req.body;
  try {
    const response = await req.client.setProfileStatus(status);

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on set profile status' });
  }
}
async function rejectCall(req, res) {
  /**
     #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              callId: { type: "string" },
            }
          },
          examples: {
            "Default": {
              value: {
                callId: "<callid>",
              }
            },
          }
        }
      }
     }
   */
  const { callId } = req.body;
  try {
    const response = await req.client.rejectCall(callId);

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on rejectCall', error: e });
  }
}

async function starMessage(req, res) {
  /**
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              messageId: { type: "string" },
              star: { type: "boolean" },
            }
          },
          examples: {
            "Default": {
              value: {
                messageId: "5521999999999",
                star: true,
              }
            },
          }
        }
      }
     }
   */
  const { messageId, star = true } = req.body;
  try {
    const response = await req.client.starMessage(messageId, star);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on  start message',
      error: error
    });
  }
}

async function getReactions(req, res) {
  /**
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["messageId"] = {
      schema: '<messageId>'
     }
   */
  const messageId = req.params.id;
  try {
    const response = await req.client.getReactions(messageId);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get reactions',
      error: error
    });
  }
}

async function getVotes(req, res) {
  /**
     #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["messageId"] = {
      schema: '<messageId>'
     }
   */
  const messageId = req.params.id;
  try {
    const response = await req.client.getVotes(messageId);

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.
    status(500).
    json({ status: 'error', message: 'Error on get votes', error: error });
  }
}
async function chatWoot(req, res) {
  /**
     #swagger.tags = ["Misc"]
     #swagger.description = 'You can point your Chatwoot to this route so that it can perform functions.'
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              event: { type: "string" },
              private: { type: "string" },
            }
          },
          examples: {
            "Default": {
              value: {
                messageId: "conversation_status_changed",
                private: "false",
              }
            },
          }
        }
      }
     }
   */
  const { session } = req.params;
  const client = _sessionUtil.clientsArray[session];
  if (client == null || client.status !== 'CONNECTED') return;
  try {
    if (await client.isConnected()) {
      const event = req.body.event;

      if (
      event == 'conversation_status_changed' ||
      event == 'conversation_resolved' ||
      req.body.private)
      {
        return res.
        status(200).
        json({ status: 'success', message: 'Success on receive chatwoot' });
      }

      const {
        message_type,
        phone = req.body.conversation.meta.sender.phone_number.replace('+', ''),
        message = req.body.conversation.messages[0]
      } = req.body;

      if (event != 'message_created' && message_type != 'outgoing')
      return res.status(200);
      for (const contato of (0, _functions.contactToArray)(phone, false)) {
        if (message_type == 'outgoing') {
          if (message.attachments) {
            const base_url = `${
            client.config.chatWoot.baseURL
            }/${message.attachments[0].data_url.substring(
              message.attachments[0].data_url.indexOf('/rails/') + 1
            )}`;
            await client.sendFile(
              `${contato}`,
              base_url,
              'file',
              message.content
            );
          } else {
            await client.sendText(contato, message.content);
          }
        }
      }
      return res.
      status(200).
      json({ status: 'success', message: 'Success on  receive chatwoot' });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 'error',
      message: 'Error on  receive chatwoot',
      error: e
    });
  }
}
async function getPlatformFromMessage(req, res) {
  /**
   * #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["messageId"] = {
      schema: '<messageId>'
     }
   */
  try {
    const result = await req.client.getPlatformFromMessage(
      req.params.messageId
    );
    return res.status(200).json(result);
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get get platform from message',
      error: e
    });
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnVuY3Rpb25zIiwicmVxdWlyZSIsIl9zZXNzaW9uVXRpbCIsInJldHVyblN1Y2VzcyIsInJlcyIsInNlc3Npb24iLCJwaG9uZSIsImRhdGEiLCJzdGF0dXMiLCJqc29uIiwicmVzcG9uc2UiLCJtZXNzYWdlIiwiY29udGFjdCIsInJldHVybkVycm9yIiwicmVxIiwiZXJyb3IiLCJsb2dnZXIiLCJsb2ciLCJzZXRQcm9maWxlTmFtZSIsIm5hbWUiLCJib2R5IiwicmVzdWx0IiwiY2xpZW50Iiwic2hvd0FsbENvbnRhY3RzIiwiY29udGFjdHMiLCJnZXRBbGxDb250YWN0cyIsImdldEFsbENoYXRzIiwibWFwcGVyIiwiZSIsImxpc3RDaGF0cyIsImlkIiwiY291bnQiLCJkaXJlY3Rpb24iLCJvbmx5R3JvdXBzIiwib25seVVzZXJzIiwib25seVdpdGhVbnJlYWRNZXNzYWdlIiwid2l0aExhYmVscyIsImdldEFsbENoYXRzV2l0aE1lc3NhZ2VzIiwiZ2V0QWxsTWVzc2FnZXNJbkNoYXQiLCJwYXJhbXMiLCJpc0dyb3VwIiwiaW5jbHVkZU1lIiwiaW5jbHVkZU5vdGlmaWNhdGlvbnMiLCJxdWVyeSIsImNvbnRhdG8iLCJjb250YWN0VG9BcnJheSIsImdldEFsbE5ld01lc3NhZ2VzIiwiZ2V0QWxsVW5yZWFkTWVzc2FnZXMiLCJnZXRDaGF0QnlJZCIsImdldE1lc3NhZ2VCeUlkIiwibWVzc2FnZUlkIiwiY2hhdElkIiwidXNlciIsImdldEJhdHRlcnlMZXZlbCIsImdldEhvc3REZXZpY2UiLCJwaG9uZU51bWJlciIsImdldFdpZCIsImdldFBob25lTnVtYmVyIiwiZ2V0QmxvY2tMaXN0IiwiYmxvY2tlZCIsIm1hcCIsInNwbGl0IiwiZGVsZXRlQ2hhdCIsInJlc3VsdHMiLCJkZWxldGVBbGxDaGF0cyIsImNoYXRzIiwiY2hhdCIsImNsZWFyQ2hhdCIsImNsZWFyQWxsQ2hhdHMiLCJhcmNoaXZlQ2hhdCIsInZhbHVlIiwiYXJjaGl2ZUFsbENoYXRzIiwiZ2V0QWxsQ2hhdHNBcmNoaXZlZHMiLCJhcmNoaXZlZCIsImFyY2hpdmUiLCJwdXNoIiwiZGVsZXRlTWVzc2FnZSIsImRlbGV0ZU1lZGlhSW5EZXZpY2UiLCJvbmx5TG9jYWwiLCJyZWFjdE1lc3NhZ2UiLCJtc2dJZCIsInJlYWN0aW9uIiwic2VuZFJlYWN0aW9uVG9NZXNzYWdlIiwicmVwbHkiLCJ0ZXh0IiwibWVzc2FnZWlkIiwiZm9yd2FyZE1lc3NhZ2VzIiwiZm9yd2FyZE1lc3NhZ2UiLCJtYXJrVW5zZWVuTWVzc2FnZSIsImJsb2NrQ29udGFjdCIsInVuYmxvY2tDb250YWN0IiwicGluQ2hhdCIsInN0YXRlIiwic2V0UHJvZmlsZVBpYyIsImZpbGUiLCJwYXRoIiwicGF0aEZpbGUiLCJ1bmxpbmtBc3luYyIsImdldFVucmVhZE1lc3NhZ2VzIiwiZ2V0Q2hhdElzT25saW5lIiwiZ2V0TGFzdFNlZW4iLCJnZXRMaXN0TXV0ZXMiLCJ0eXBlIiwibG9hZEFuZEdldEFsbE1lc3NhZ2VzSW5DaGF0IiwiZ2V0TWVzc2FnZXMiLCJwYXJzZUludCIsInRvU3RyaW5nIiwic2VuZENvbnRhY3RWY2FyZCIsImNvbnRhY3RzSWQiLCJzZW5kTXV0ZSIsInRpbWUiLCJzZW5kU2VlbiIsInNldENoYXRTdGF0ZSIsImNoYXRzdGF0ZSIsInNldFRlbXBvcmFyeU1lc3NhZ2VzIiwic2V0VHlwaW5nIiwic3RhcnRUeXBpbmciLCJzdG9wVHlwaW5nIiwic2V0UmVjb3JkaW5nIiwiZHVyYXRpb24iLCJzdGFydFJlY29yZGluZyIsInN0b3BSZWNvcmluZyIsImNoZWNrTnVtYmVyU3RhdHVzIiwiZ2V0Q29udGFjdCIsImdldE51bWJlclByb2ZpbGUiLCJnZXRQcm9maWxlUGljRnJvbVNlcnZlciIsImdldFN0YXR1cyIsInNldFByb2ZpbGVTdGF0dXMiLCJyZWplY3RDYWxsIiwiY2FsbElkIiwic3Rhck1lc3NhZ2UiLCJzdGFyIiwiZ2V0UmVhY3Rpb25zIiwiZ2V0Vm90ZXMiLCJjaGF0V29vdCIsImNsaWVudHNBcnJheSIsImlzQ29ubmVjdGVkIiwiZXZlbnQiLCJwcml2YXRlIiwibWVzc2FnZV90eXBlIiwiY29udmVyc2F0aW9uIiwibWV0YSIsInNlbmRlciIsInBob25lX251bWJlciIsInJlcGxhY2UiLCJtZXNzYWdlcyIsImF0dGFjaG1lbnRzIiwiYmFzZV91cmwiLCJjb25maWciLCJiYXNlVVJMIiwiZGF0YV91cmwiLCJzdWJzdHJpbmciLCJpbmRleE9mIiwic2VuZEZpbGUiLCJjb250ZW50Iiwic2VuZFRleHQiLCJjb25zb2xlIiwiZ2V0UGxhdGZvcm1Gcm9tTWVzc2FnZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2RldmljZUNvbnRyb2xsZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDIxIFdQUENvbm5lY3QgVGVhbVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgQ2hhdCB9IGZyb20gJ0B3cHBjb25uZWN0LXRlYW0vd3BwY29ubmVjdCc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuXG5pbXBvcnQgeyBjb250YWN0VG9BcnJheSwgdW5saW5rQXN5bmMgfSBmcm9tICcuLi91dGlsL2Z1bmN0aW9ucyc7XG5pbXBvcnQgeyBjbGllbnRzQXJyYXkgfSBmcm9tICcuLi91dGlsL3Nlc3Npb25VdGlsJztcblxuZnVuY3Rpb24gcmV0dXJuU3VjZXNzKHJlczogYW55LCBzZXNzaW9uOiBhbnksIHBob25lOiBhbnksIGRhdGE6IGFueSkge1xuICByZXMuc3RhdHVzKDIwMSkuanNvbih7XG4gICAgc3RhdHVzOiAnU3VjY2VzcycsXG4gICAgcmVzcG9uc2U6IHtcbiAgICAgIG1lc3NhZ2U6ICdJbmZvcm1hdGlvbiByZXRyaWV2ZWQgc3VjY2Vzc2Z1bGx5LicsXG4gICAgICBjb250YWN0OiBwaG9uZSxcbiAgICAgIHNlc3Npb246IHNlc3Npb24sXG4gICAgICBkYXRhOiBkYXRhLFxuICAgIH0sXG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZXR1cm5FcnJvcihyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIHNlc3Npb246IGFueSwgZXJyb3I6IGFueSkge1xuICByZXEubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgIHN0YXR1czogJ0Vycm9yJyxcbiAgICByZXNwb25zZToge1xuICAgICAgbWVzc2FnZTogJ0Vycm9yIHJldHJpZXZpbmcgaW5mb3JtYXRpb24nLFxuICAgICAgc2Vzc2lvbjogc2Vzc2lvbixcbiAgICAgIGxvZzogZXJyb3IsXG4gICAgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRQcm9maWxlTmFtZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJQcm9maWxlXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBuYW1lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiTXkgbmV3IG5hbWVcIixcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBuYW1lIH0gPSByZXEuYm9keTtcblxuICBpZiAoIW5hbWUpXG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cyg0MDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1BhcmFtZXRlciBuYW1lIGlzIHJlcXVpcmVkIScgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LnNldFByb2ZpbGVOYW1lKG5hbWUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzdWx0IH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBzZXQgcHJvZmlsZSBuYW1lLicsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNob3dBbGxDb250YWN0cyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDb250YWN0c1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgKi9cbiAgdHJ5IHtcbiAgICBjb25zdCBjb250YWN0cyA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0QWxsQ29udGFjdHMoKTtcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogY29udGFjdHMgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIGZldGNoaW5nIGNvbnRhY3RzJyxcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWxsQ2hhdHMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2hhdFwiXVxuICAgKiAjc3dhZ2dlci5zdW1tYXJ5ID0gJ0RlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgJ2xpc3QtY2hhdHMnXG4gICAqICNzd2FnZ2VyLmRlcHJlY2F0ZWQgPSB0cnVlXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRBbGxDaGF0cygpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlLCBtYXBwZXI6ICdjaGF0JyB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cyg1MDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0Vycm9yIG9uIGdldCBhbGwgY2hhdHMnIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXN0Q2hhdHMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2hhdFwiXVxuICAgKiAjc3dhZ2dlci5zdW1tYXJ5ID0gJ1JldHJpZXZlIGEgbGlzdCBvZiBjaGF0cydcbiAgICogI3N3YWdnZXIuZGVzY3JpcHRpb24gPSAnVGhpcyBib2R5IGlzIG5vdCByZXF1aXJlZC4gTm90IHNlbnQgYm9keSB0byBnZXQgYWxsIGNoYXRzIG9yIGZpbHRlci4nXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBpZDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIGNvdW50OiB7IHR5cGU6IFwibnVtYmVyXCIgfSxcbiAgICAgICAgICAgICAgZGlyZWN0aW9uOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgb25seUdyb3VwczogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgICBvbmx5VXNlcnM6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgb25seVdpdGhVbnJlYWRNZXNzYWdlOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICAgIHdpdGhMYWJlbHM6IHsgdHlwZTogXCJhcnJheVwiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJBbGwgb3B0aW9ucyAtIEVkaXQgdGhpc1wiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgaWQ6IFwiPGNoYXRJZD5cIixcbiAgICAgICAgICAgICAgICBjb3VudDogMjAsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBcImFmdGVyXCIsXG4gICAgICAgICAgICAgICAgb25seUdyb3VwczogZmFsc2UsXG4gICAgICAgICAgICAgICAgb25seVVzZXJzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvbmx5V2l0aFVucmVhZE1lc3NhZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdpdGhMYWJlbHM6IFtdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkFsbCBjaGF0c1wiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkNoYXRzIGdyb3VwXCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBvbmx5R3JvdXBzOiB0cnVlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJPbmx5IHdpdGggdW5yZWFkIG1lc3NhZ2VzXCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBvbmx5V2l0aFVucmVhZE1lc3NhZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJQYWdpbmF0ZWQgcmVzdWx0c1wiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgaWQ6IFwiPGNoYXRJZD5cIixcbiAgICAgICAgICAgICAgICBjb3VudDogMjAsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBcImFmdGVyXCIsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgIH1cbiAgICovXG4gIHRyeSB7XG4gICAgY29uc3Qge1xuICAgICAgaWQsXG4gICAgICBjb3VudCxcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIG9ubHlHcm91cHMsXG4gICAgICBvbmx5VXNlcnMsXG4gICAgICBvbmx5V2l0aFVucmVhZE1lc3NhZ2UsXG4gICAgICB3aXRoTGFiZWxzLFxuICAgIH0gPSByZXEuYm9keTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5saXN0Q2hhdHMoe1xuICAgICAgaWQ6IGlkLFxuICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXG4gICAgICBvbmx5R3JvdXBzOiBvbmx5R3JvdXBzLFxuICAgICAgb25seVVzZXJzOiBvbmx5VXNlcnMsXG4gICAgICBvbmx5V2l0aFVucmVhZE1lc3NhZ2U6IG9ubHlXaXRoVW5yZWFkTWVzc2FnZSxcbiAgICAgIHdpdGhMYWJlbHM6IHdpdGhMYWJlbHMsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24ocmVzcG9uc2UpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDUwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IGFsbCBjaGF0cycgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFsbENoYXRzV2l0aE1lc3NhZ2VzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICogI3N3YWdnZXIuc3VtbWFyeSA9ICdEZXByZWNhdGVkIGluIGZhdm9yIG9mIGxpc3QtY2hhdHMnXG4gICAqICNzd2FnZ2VyLmRlcHJlY2F0ZWQgPSB0cnVlXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRBbGxDaGF0c1dpdGhNZXNzYWdlcygpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IGFsbCBjaGF0cyB3aGl0IG1lc3NhZ2VzJyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG4vKipcbiAqIERlcHJlY2lhZG8gZW0gZmF2b3IgZGUgZ2V0TWVzc2FnZXNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFsbE1lc3NhZ2VzSW5DaGF0KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInBob25lXCJdID0ge1xuICAgICAgc2NoZW1hOiAnNTUyMTk5OTk5OTk5OSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wiaXNHcm91cFwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ2ZhbHNlJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJpbmNsdWRlTWVcIl0gPSB7XG4gICAgICBzY2hlbWE6ICd0cnVlJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJpbmNsdWRlTm90aWZpY2F0aW9uc1wiXSA9IHtcbiAgICAgIHNjaGVtYTogJ3RydWUnXG4gICAgIH1cbiAgICovXG4gIHRyeSB7XG4gICAgY29uc3QgeyBwaG9uZSB9ID0gcmVxLnBhcmFtcztcbiAgICBjb25zdCB7XG4gICAgICBpc0dyb3VwID0gZmFsc2UsXG4gICAgICBpbmNsdWRlTWUgPSB0cnVlLFxuICAgICAgaW5jbHVkZU5vdGlmaWNhdGlvbnMgPSB0cnVlLFxuICAgIH0gPSByZXEucXVlcnk7XG5cbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIGNvbnRhY3RUb0FycmF5KHBob25lLCBpc0dyb3VwIGFzIGJvb2xlYW4pKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0QWxsTWVzc2FnZXNJbkNoYXQoXG4gICAgICAgIGNvbnRhdG8sXG4gICAgICAgIGluY2x1ZGVNZSBhcyBib29sZWFuLFxuICAgICAgICBpbmNsdWRlTm90aWZpY2F0aW9ucyBhcyBib29sZWFuXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IGFsbCBtZXNzYWdlcyBpbiBjaGF0JyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxOZXdNZXNzYWdlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDaGF0XCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRBbGxOZXdNZXNzYWdlcygpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IGFsbCBtZXNzYWdlcyBpbiBjaGF0JyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxVbnJlYWRNZXNzYWdlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDaGF0XCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRBbGxVbnJlYWRNZXNzYWdlcygpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IGFsbCBtZXNzYWdlcyBpbiBjaGF0JyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDaGF0QnlJZChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDaGF0XCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJwaG9uZVwiXSA9IHtcbiAgICAgIHNjaGVtYTogJzU1MjE5OTk5OTk5OTknXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcImlzR3JvdXBcIl0gPSB7XG4gICAgICBzY2hlbWE6ICdmYWxzZSdcbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBwaG9uZSB9ID0gcmVxLnBhcmFtcztcbiAgY29uc3QgeyBpc0dyb3VwIH0gPSByZXEucXVlcnk7XG5cbiAgdHJ5IHtcbiAgICBsZXQgcmVzdWx0ID0ge30gYXMgQ2hhdDtcbiAgICBpZiAoaXNHcm91cCkge1xuICAgICAgcmVzdWx0ID0gYXdhaXQgcmVxLmNsaWVudC5nZXRDaGF0QnlJZChgJHtwaG9uZX1AZy51c2ApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LmdldENoYXRCeUlkKGAke3Bob25lfUBjLnVzYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3VsdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3IgY2hhbmdpbmcgY2hhdCBieSBJZCcsXG4gICAgICBlcnJvcjogZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TWVzc2FnZUJ5SWQocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2hhdFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wibWVzc2FnZUlkXCJdID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBzY2hlbWE6ICc8bWVzc2FnZV9pZD4nXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHNlc3Npb24gPSByZXEuc2Vzc2lvbjtcbiAgY29uc3QgeyBtZXNzYWdlSWQgfSA9IHJlcS5wYXJhbXM7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LmdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG5cbiAgICByZXR1cm5TdWNlc3MocmVzLCBzZXNzaW9uLCAocmVzdWx0IGFzIGFueSkuY2hhdElkLnVzZXIsIHJlc3VsdCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuRXJyb3IocmVxLCByZXMsIHNlc3Npb24sIGVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QmF0dGVyeUxldmVsKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1pc2NcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICovXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LmdldEJhdHRlcnlMZXZlbCgpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ1N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3IgcmV0cmlldmluZyBiYXR0ZXJ5IHN0YXR1cycsXG4gICAgICBlcnJvcjogZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0SG9zdERldmljZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRIb3N0RGV2aWNlKCk7XG4gICAgY29uc3QgcGhvbmVOdW1iZXIgPSBhd2FpdCByZXEuY2xpZW50LmdldFdpZCgpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgIHJlc3BvbnNlOiB7IC4uLnJlc3BvbnNlLCBwaG9uZU51bWJlciB9LFxuICAgICAgbWFwcGVyOiAnZGV2aWNlJyxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvIGFvIHJlY3VwZXJhciBkYWRvcyBkbyB0ZWxlZm9uZScsXG4gICAgICBlcnJvcjogZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UGhvbmVOdW1iZXIocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiTWlzY1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgKi9cbiAgdHJ5IHtcbiAgICBjb25zdCBwaG9uZU51bWJlciA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0V2lkKCk7XG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cygyMDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcGhvbmVOdW1iZXIsIG1hcHBlcjogJ2RldmljZScgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3IgcmV0cmlldmluZyBwaG9uZSBudW1iZXInLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEJsb2NrTGlzdChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0QmxvY2tMaXN0KCk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBibG9ja2VkID0gcmVzcG9uc2UubWFwKChjb250YXRvOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiB7IHBob25lOiBjb250YXRvID8gY29udGF0by5zcGxpdCgnQCcpWzBdIDogJycgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogYmxvY2tlZCB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciByZXRyaWV2aW5nIGJsb2NrZWQgY29udGFjdCBsaXN0JyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVDaGF0KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICAgIGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lIH0gPSByZXEuYm9keTtcbiAgY29uc3Qgc2Vzc2lvbiA9IHJlcS5zZXNzaW9uO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIHBob25lKSB7XG4gICAgICByZXN1bHRzW2NvbnRhdG9dID0gYXdhaXQgcmVxLmNsaWVudC5kZWxldGVDaGF0KGNvbnRhdG8pO1xuICAgIH1cbiAgICByZXR1cm5TdWNlc3MocmVzLCBzZXNzaW9uLCBwaG9uZSwgcmVzdWx0cyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuRXJyb3IocmVxLCByZXMsIHNlc3Npb24sIGVycm9yKTtcbiAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUFsbENoYXRzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICovXG4gIHRyeSB7XG4gICAgY29uc3QgY2hhdHMgPSBhd2FpdCByZXEuY2xpZW50LmdldEFsbENoYXRzKCk7XG4gICAgZm9yIChjb25zdCBjaGF0IG9mIGNoYXRzKSB7XG4gICAgICBhd2FpdCByZXEuY2xpZW50LmRlbGV0ZUNoYXQoKGNoYXQgYXMgYW55KS5jaGF0SWQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJyB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIGRlbGV0ZSBhbGwgY2hhdHMnLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhckNoYXQocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2hhdFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICBcbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICAgIGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lIH0gPSByZXEuYm9keTtcbiAgY29uc3Qgc2Vzc2lvbiA9IHJlcS5zZXNzaW9uO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIHBob25lKSB7XG4gICAgICByZXN1bHRzW2NvbnRhdG9dID0gYXdhaXQgcmVxLmNsaWVudC5jbGVhckNoYXQoY29udGF0byk7XG4gICAgfVxuICAgIHJldHVyblN1Y2VzcyhyZXMsIHNlc3Npb24sIHBob25lLCByZXN1bHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm5FcnJvcihyZXEsIHJlcywgc2Vzc2lvbiwgZXJyb3IpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhckFsbENoYXRzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICovXG4gIHRyeSB7XG4gICAgY29uc3QgY2hhdHMgPSBhd2FpdCByZXEuY2xpZW50LmdldEFsbENoYXRzKCk7XG4gICAgZm9yIChjb25zdCBjaGF0IG9mIGNoYXRzKSB7XG4gICAgICBhd2FpdCByZXEuY2xpZW50LmNsZWFyQ2hhdChgJHsoY2hhdCBhcyBhbnkpLmNoYXRJZH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdFcnJvciBvbiBjbGVhciBhbGwgY2hhdHMnLCBlcnJvcjogZSB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXJjaGl2ZUNoYXQocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2hhdFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICBcbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgICB2YWx1ZTogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICAgIGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCB2YWx1ZSA9IHRydWUgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LmFyY2hpdmVDaGF0KGAke3Bob25lfWAsIHZhbHVlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDUwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnRXJyb3Igb24gYXJjaGl2ZSBjaGF0JywgZXJyb3I6IGUgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFyY2hpdmVBbGxDaGF0cyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDaGF0XCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGNvbnN0IGNoYXRzID0gYXdhaXQgcmVxLmNsaWVudC5nZXRBbGxDaGF0cygpO1xuICAgIGZvciAoY29uc3QgY2hhdCBvZiBjaGF0cykge1xuICAgICAgYXdhaXQgcmVxLmNsaWVudC5hcmNoaXZlQ2hhdChgJHsoY2hhdCBhcyBhbnkpLmNoYXRJZH1gLCB0cnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gYXJjaGl2ZSBhbGwgY2hhdHMnLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFsbENoYXRzQXJjaGl2ZWRzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICogI3N3YWdnZXIuZGVzY3JpcHRpb24gPSAnUmV0cmlldmVzIGFsbCBhcmNoaXZlZCBjaGF0cy4nXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGNvbnN0IGNoYXRzID0gYXdhaXQgcmVxLmNsaWVudC5nZXRBbGxDaGF0cygpO1xuICAgIGNvbnN0IGFyY2hpdmVkID0gW10gYXMgYW55O1xuICAgIGZvciAoY29uc3QgY2hhdCBvZiBjaGF0cykge1xuICAgICAgaWYgKGNoYXQuYXJjaGl2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICBhcmNoaXZlZC5wdXNoKGNoYXQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDEpLmpzb24oYXJjaGl2ZWQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIGFyY2hpdmUgYWxsIGNoYXRzJyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTWVzc2FnZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICBcbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgICBtZXNzYWdlSWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBvbmx5TG9jYWw6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgZGVsZXRlTWVkaWFJbkRldmljZTogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICAgIGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogXCI8bWVzc2FnZUlkPlwiLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCBtZXNzYWdlSWQsIGRlbGV0ZU1lZGlhSW5EZXZpY2UsIG9ubHlMb2NhbCB9ID0gcmVxLmJvZHk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LmRlbGV0ZU1lc3NhZ2UoXG4gICAgICBgJHtwaG9uZX1gLFxuICAgICAgbWVzc2FnZUlkLFxuICAgICAgb25seUxvY2FsLFxuICAgICAgZGVsZXRlTWVkaWFJbkRldmljZVxuICAgICk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIHJlc1xuICAgICAgICAuc3RhdHVzKDIwMClcbiAgICAgICAgLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHsgbWVzc2FnZTogJ01lc3NhZ2UgZGVsZXRlZCcgfSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIHJlc3BvbnNlOiB7IG1lc3NhZ2U6ICdFcnJvciB1bmtub3duIG9uIGRlbGV0ZSBtZXNzYWdlJyB9LFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDUwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnRXJyb3Igb24gZGVsZXRlIG1lc3NhZ2UnLCBlcnJvcjogZSB9KTtcbiAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWN0TWVzc2FnZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgbXNnSWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICByZWFjdGlvbjogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBtc2dJZDogXCI8bWVzc2FnZUlkPlwiLFxuICAgICAgICAgICAgICAgIHJlYWN0aW9uOiBcIvCfmJxcIixcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBtc2dJZCwgcmVhY3Rpb24gfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgcmVxLmNsaWVudC5zZW5kUmVhY3Rpb25Ub01lc3NhZ2UobXNnSWQsIHJlYWN0aW9uKTtcblxuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHsgbWVzc2FnZTogJ1JlYWN0aW9uIHNlbmRlZCcgfSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBzZW5kIHJlYWN0aW9uIHRvIG1lc3NhZ2UnLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcGx5KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIuZGVwcmVjYXRlZD10cnVlXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwaG9uZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIGlzR3JvdXA6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZWlkOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgdGV4dDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICBpc0dyb3VwOiBmYWxzZSxcbiAgICAgICAgICAgICAgbWVzc2FnZWlkOiBcIjxtZXNzYWdlSWQ+XCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiVGV4dCB0byByZXBseVwiLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCB0ZXh0LCBtZXNzYWdlaWQgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LnJlcGx5KGAke3Bob25lfUBjLnVzYCwgdGV4dCwgbWVzc2FnZWlkKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDUwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnRXJyb3IgcmVwbHlpbmcgbWVzc2FnZScsIGVycm9yOiBlIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmb3J3YXJkTWVzc2FnZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiTWVzc2FnZXNcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGhvbmU6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBpc0dyb3VwOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBwaG9uZTogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiBcIjxtZXNzYWdlSWQ+XCIsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUsIG1lc3NhZ2VJZCwgaXNHcm91cCA9IGZhbHNlIH0gPSByZXEuYm9keTtcblxuICB0cnkge1xuICAgIGxldCByZXNwb25zZTtcblxuICAgIGlmICghaXNHcm91cCkge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LmZvcndhcmRNZXNzYWdlKGAke3Bob25lWzBdfWAsIG1lc3NhZ2VJZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5mb3J3YXJkTWVzc2FnZShgJHtwaG9uZVswXX1gLCBtZXNzYWdlSWQpO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMSkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdFcnJvciBmb3J3YXJkaW5nIG1lc3NhZ2UnLCBlcnJvcjogZSB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya1Vuc2Vlbk1lc3NhZ2UocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiTWVzc2FnZXNcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGhvbmU6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBpc0dyb3VwOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBwaG9uZTogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgcmVxLmNsaWVudC5tYXJrVW5zZWVuTWVzc2FnZShgJHtwaG9uZX1gKTtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDIwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiB7IG1lc3NhZ2U6ICd1bnNlZW4gY2hlY2tlZCcgfSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cyg1MDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0Vycm9yIG9uIG1hcmsgdW5zZWVuJywgZXJyb3I6IGUgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJsb2NrQ29udGFjdChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgIHBob25lOiBcIjU1MjE5OTk5OTk5OTlcIixcbiAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgcmVxLmNsaWVudC5ibG9ja0NvbnRhY3QoYCR7cGhvbmV9YCk7XG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cygyMDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogeyBtZXNzYWdlOiAnQ29udGFjdCBibG9ja2VkJyB9IH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDUwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnRXJyb3Igb24gYmxvY2sgY29udGFjdCcsIGVycm9yOiBlIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1bmJsb2NrQ29udGFjdChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgIHBob25lOiBcIjU1MjE5OTk5OTk5OTlcIixcbiAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgcmVxLmNsaWVudC51bmJsb2NrQ29udGFjdChgJHtwaG9uZX1gKTtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDIwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiB7IG1lc3NhZ2U6ICdDb250YWN0IFVuQmxvY2tlZCcgfSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cyg1MDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0Vycm9yIG9uIHVubG9jayBjb250YWN0JywgZXJyb3I6IGUgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBpbkNoYXQocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiQ2hhdFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wib2JqXCJdID0ge1xuICAgICAgaW46ICdib2R5JyxcbiAgICAgIHNjaGVtYToge1xuICAgICAgICAkcGhvbmU6ICc1NTIxOTk5OTk5OTk5JyxcbiAgICAgICAgJGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICAkc3RhdGU6IHRydWUsXG4gICAgICB9XG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGhvbmU6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBpc0dyb3VwOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICAgIHN0YXRlOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICBzdGF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBwaG9uZSwgc3RhdGUgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIHBob25lKSB7XG4gICAgICBhd2FpdCByZXEuY2xpZW50LnBpbkNoYXQoY29udGF0bywgc3RhdGUgPT09ICd0cnVlJywgZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHsgbWVzc2FnZTogJ0NoYXQgZml4ZWQnIH0gfSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6IGUudGV4dCB8fCAnRXJyb3Igb24gcGluIGNoYXQnLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldFByb2ZpbGVQaWMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiUHJvZmlsZVwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5jb25zdW1lcyA9IFsnbXVsdGlwYXJ0L2Zvcm0tZGF0YSddICBcbiAgICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbJ2ZpbGUnXSA9IHtcbiAgICAgICAgICBpbjogJ2Zvcm1EYXRhJyxcbiAgICAgICAgICB0eXBlOiAnZmlsZScsXG4gICAgICAgICAgcmVxdWlyZWQ6ICd0cnVlJyxcbiAgICAgIH1cbiAgICovXG4gIGlmICghcmVxLmZpbGUpXG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cyg0MDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ0Vycm9yJywgbWVzc2FnZTogJ0ZpbGUgcGFyYW1ldGVyIGlzIHJlcXVpcmVkIScgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IHBhdGg6IHBhdGhGaWxlIH0gPSByZXEuZmlsZTtcblxuICAgIGF3YWl0IHJlcS5jbGllbnQuc2V0UHJvZmlsZVBpYyhwYXRoRmlsZSk7XG4gICAgYXdhaXQgdW5saW5rQXN5bmMocGF0aEZpbGUpO1xuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgcmVzcG9uc2U6IHsgbWVzc2FnZTogJ1Byb2ZpbGUgcGhvdG8gc3VjY2Vzc2Z1bGx5IGNoYW5nZWQnIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3IgY2hhbmdpbmcgcHJvZmlsZSBwaG90bycsXG4gICAgICBlcnJvcjogZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VW5yZWFkTWVzc2FnZXMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci5kZXByZWNhdGVkPXRydWVcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRVbnJlYWRNZXNzYWdlcyhmYWxzZSwgZmFsc2UsIHRydWUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIHJlc3BvbnNlOiAnRXJyb3Igb24gb3BlbiBsaXN0JywgZXJyb3I6IGUgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENoYXRJc09ubGluZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJDaGF0XCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJwaG9uZVwiXSA9IHtcbiAgICAgIHNjaGVtYTogJzU1MjE5OTk5OTk5OTknLFxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lIH0gPSByZXEucGFyYW1zO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRDaGF0SXNPbmxpbmUoYCR7cGhvbmV9QGMudXNgKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgcmVzcG9uc2U6ICdFcnJvciBvbiBnZXQgY2hhdCBpcyBvbmxpbmUnLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldExhc3RTZWVuKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInBob25lXCJdID0ge1xuICAgICAgc2NoZW1hOiAnNTUyMTk5OTk5OTk5OScsXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUgfSA9IHJlcS5wYXJhbXM7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LmdldExhc3RTZWVuKGAke3Bob25lfUBjLnVzYCk7XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICByZXNwb25zZTogJ0Vycm9yIG9uIGdldCBjaGF0IGxhc3Qgc2VlbicsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldExpc3RNdXRlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJDaGF0XCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJ0eXBlXCJdID0ge1xuICAgICAgc2NoZW1hOiAnYWxsJyxcbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyB0eXBlID0gJ2FsbCcgfSA9IHJlcS5wYXJhbXM7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LmdldExpc3RNdXRlcyh0eXBlKTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIHJlc3BvbnNlOiAnRXJyb3Igb24gZ2V0IGxpc3QgbXV0ZXMnLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkQW5kR2V0QWxsTWVzc2FnZXNJbkNoYXQocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci5kZXByZWNhdGVkPXRydWVcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInBob25lXCJdID0ge1xuICAgICAgc2NoZW1hOiAnNTUyMTk5OTk5OTk5OSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wiaW5jbHVkZU1lXCJdID0ge1xuICAgICAgc2NoZW1hOiAndHJ1ZSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wiaW5jbHVkZU5vdGlmaWNhdGlvbnNcIl0gPSB7XG4gICAgICBzY2hlbWE6ICdmYWxzZSdcbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBwaG9uZSwgaW5jbHVkZU1lID0gdHJ1ZSwgaW5jbHVkZU5vdGlmaWNhdGlvbnMgPSBmYWxzZSB9ID0gcmVxLnBhcmFtcztcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQubG9hZEFuZEdldEFsbE1lc3NhZ2VzSW5DaGF0KFxuICAgICAgYCR7cGhvbmV9QGMudXNgLFxuICAgICAgaW5jbHVkZU1lIGFzIGJvb2xlYW4sXG4gICAgICBpbmNsdWRlTm90aWZpY2F0aW9ucyBhcyBib29sZWFuXG4gICAgKTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cyg1MDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ2Vycm9yJywgcmVzcG9uc2U6ICdFcnJvciBvbiBvcGVuIGxpc3QnLCBlcnJvcjogZXJyb3IgfSk7XG4gIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRNZXNzYWdlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wicGhvbmVcIl0gPSB7XG4gICAgICBzY2hlbWE6ICc1NTIxOTk5OTk5OTk5QGMudXMnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcImNvdW50XCJdID0ge1xuICAgICAgc2NoZW1hOiAnMjAnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcImRpcmVjdGlvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ2JlZm9yZSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wiaWRcIl0gPSB7XG4gICAgICBzY2hlbWE6ICc8bWVzc2FnZV9pZF90b191c2VfZGlyZWN0aW9uPidcbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBwaG9uZSB9ID0gcmVxLnBhcmFtcztcbiAgY29uc3QgeyBjb3VudCA9IDIwLCBkaXJlY3Rpb24gPSAnYmVmb3JlJywgaWQgPSBudWxsIH0gPSByZXEucXVlcnk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LmdldE1lc3NhZ2VzKGAke3Bob25lfWAsIHtcbiAgICAgIGNvdW50OiBwYXJzZUludChjb3VudCBhcyBzdHJpbmcpLFxuICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24udG9TdHJpbmcoKSBhcyBhbnksXG4gICAgICBpZDogaWQgYXMgc3RyaW5nLFxuICAgIH0pO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNDAxKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIHJlc3BvbnNlOiAnRXJyb3Igb24gb3BlbiBsaXN0JywgZXJyb3I6IGUgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRDb250YWN0VmNhcmQocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiTWVzc2FnZXNcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGhvbmU6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBpc0dyb3VwOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICAgIG5hbWU6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBjb250YWN0c0lkOiB7IHR5cGU6IFwiYXJyYXlcIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICAgIGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdOYW1lIG9mIGNvbnRhY3QnLFxuICAgICAgICAgICAgICAgIGNvbnRhY3RzSWQ6IFsnNTUyMTk5OTk5OTk5OSddLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCBjb250YWN0c0lkLCBuYW1lID0gbnVsbCwgaXNHcm91cCA9IGZhbHNlIH0gPSByZXEuYm9keTtcbiAgdHJ5IHtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIGNvbnRhY3RUb0FycmF5KHBob25lLCBpc0dyb3VwKSkge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LnNlbmRDb250YWN0VmNhcmQoXG4gICAgICAgIGAke2NvbnRhdG99YCxcbiAgICAgICAgY29udGFjdHNJZCxcbiAgICAgICAgbmFtZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gc2VuZCBjb250YWN0IHZjYXJkJyxcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZE11dGUocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiQ2hhdFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgICB0aW1lOiB7IHR5cGU6IFwibnVtYmVyXCIgfSxcbiAgICAgICAgICAgICAgdHlwZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBwaG9uZTogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdGltZTogMSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnaG91cnMnLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCB0aW1lLCB0eXBlID0gJ2hvdXJzJywgaXNHcm91cCA9IGZhbHNlIH0gPSByZXEuYm9keTtcblxuICB0cnkge1xuICAgIGxldCByZXNwb25zZTtcbiAgICBmb3IgKGNvbnN0IGNvbnRhdG8gb2YgY29udGFjdFRvQXJyYXkocGhvbmUsIGlzR3JvdXApKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuc2VuZE11dGUoYCR7Y29udGF0b31gLCB0aW1lLCB0eXBlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdFcnJvciBvbiBzZW5kIG11dGUnLCBlcnJvcjogZXJyb3IgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRTZWVuKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGhvbmU6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBpc0dyb3VwOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBwaG9uZTogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUgfSA9IHJlcS5ib2R5O1xuICBjb25zdCBzZXNzaW9uID0gcmVxLnNlc3Npb247XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNvbnRhdG8gb2YgcGhvbmUpIHtcbiAgICAgIHJlc3VsdHMucHVzaChhd2FpdCByZXEuY2xpZW50LnNlbmRTZWVuKGNvbnRhdG8pKTtcbiAgICB9XG4gICAgcmV0dXJuU3VjZXNzKHJlcywgc2Vzc2lvbiwgcGhvbmUsIHJlc3VsdHMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybkVycm9yKHJlcSwgcmVzLCBzZXNzaW9uLCBlcnJvcik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldENoYXRTdGF0ZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLmRlcHJlY2F0ZWQ9dHJ1ZVxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiQ2hhdFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwaG9uZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIGlzR3JvdXA6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgY2hhdHN0YXRlOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIHBob25lOiBcIjU1MjE5OTk5OTk5OTlcIixcbiAgICAgICAgICAgICAgICBpc0dyb3VwOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjaGF0c3RhdGU6IFwiMVwiLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCBjaGF0c3RhdGUsIGlzR3JvdXAgPSBmYWxzZSB9ID0gcmVxLmJvZHk7XG5cbiAgdHJ5IHtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIGNvbnRhY3RUb0FycmF5KHBob25lLCBpc0dyb3VwKSkge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LnNldENoYXRTdGF0ZShgJHtjb250YXRvfWAsIGNoYXRzdGF0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIHNlbmQgY2hhdCBzdGF0ZScsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldFRlbXBvcmFyeU1lc3NhZ2VzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgICB2YWx1ZTogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICAgIGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCB2YWx1ZSA9IHRydWUsIGlzR3JvdXAgPSBmYWxzZSB9ID0gcmVxLmJvZHk7XG5cbiAgdHJ5IHtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIGNvbnRhY3RUb0FycmF5KHBob25lLCBpc0dyb3VwKSkge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LnNldFRlbXBvcmFyeU1lc3NhZ2VzKGAke2NvbnRhdG99YCwgdmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBzZXQgdGVtcG9yYXJ5IG1lc3NhZ2VzJyxcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0VHlwaW5nKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGhvbmU6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBpc0dyb3VwOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICAgIHZhbHVlOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBwaG9uZTogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUsIHZhbHVlID0gdHJ1ZSwgaXNHcm91cCA9IGZhbHNlIH0gPSByZXEuYm9keTtcbiAgdHJ5IHtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIGNvbnRhY3RUb0FycmF5KHBob25lLCBpc0dyb3VwKSkge1xuICAgICAgaWYgKHZhbHVlKSByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuc3RhcnRUeXBpbmcoY29udGF0byk7XG4gICAgICBlbHNlIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5zdG9wVHlwaW5nKGNvbnRhdG8pO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cyg1MDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0Vycm9yIG9uIHNldCB0eXBpbmcnLCBlcnJvcjogZXJyb3IgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldFJlY29yZGluZyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJDaGF0XCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgIFxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwaG9uZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIGlzR3JvdXA6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgZHVyYXRpb246IHsgdHlwZTogXCJudW1iZXJcIiB9LFxuICAgICAgICAgICAgICB2YWx1ZTogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICAgIGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1LFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCB2YWx1ZSA9IHRydWUsIGR1cmF0aW9uLCBpc0dyb3VwID0gZmFsc2UgfSA9IHJlcS5ib2R5O1xuICB0cnkge1xuICAgIGxldCByZXNwb25zZTtcbiAgICBmb3IgKGNvbnN0IGNvbnRhdG8gb2YgY29udGFjdFRvQXJyYXkocGhvbmUsIGlzR3JvdXApKSB7XG4gICAgICBpZiAodmFsdWUpIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5zdGFydFJlY29yZGluZyhjb250YXRvLCBkdXJhdGlvbik7XG4gICAgICBlbHNlIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5zdG9wUmVjb3JpbmcoY29udGF0byk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIHNldCByZWNvcmRpbmcnLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGVja051bWJlclN0YXR1cyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJwaG9uZVwiXSA9IHtcbiAgICAgIHNjaGVtYTogJzU1MjE5OTk5OTk5OTknXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUgfSA9IHJlcS5wYXJhbXM7XG4gIHRyeSB7XG4gICAgbGV0IHJlc3BvbnNlO1xuICAgIGZvciAoY29uc3QgY29udGF0byBvZiBjb250YWN0VG9BcnJheShwaG9uZSwgZmFsc2UpKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuY2hlY2tOdW1iZXJTdGF0dXMoYCR7Y29udGF0b31gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gY2hlY2sgbnVtYmVyIHN0YXR1cycsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbnRhY3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiQ2hhdFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wicGhvbmVcIl0gPSB7XG4gICAgICBzY2hlbWE6ICc1NTIxOTk5OTk5OTk5J1xuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lID0gdHJ1ZSB9ID0gcmVxLnBhcmFtcztcbiAgdHJ5IHtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIGNvbnRhY3RUb0FycmF5KHBob25lIGFzIHN0cmluZywgZmFsc2UpKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0Q29udGFjdChjb250YXRvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdFcnJvciBvbiBnZXQgY29udGFjdCcsIGVycm9yOiBlcnJvciB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWxsQ29udGFjdHMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ29udGFjdFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgKi9cbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0QWxsQ29udGFjdHMoKTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBnZXQgYWxsIGNvbnN0YWN0cycsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE51bWJlclByb2ZpbGUocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci5kZXByZWNhdGVkPXRydWVcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkNoYXRcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInBob25lXCJdID0ge1xuICAgICAgc2NoZW1hOiAnNTUyMTk5OTk5OTk5OSdcbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBwaG9uZSA9IHRydWUgfSA9IHJlcS5wYXJhbXM7XG4gIHRyeSB7XG4gICAgbGV0IHJlc3BvbnNlO1xuICAgIGZvciAoY29uc3QgY29udGF0byBvZiBjb250YWN0VG9BcnJheShwaG9uZSBhcyBzdHJpbmcsIGZhbHNlKSkge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LmdldE51bWJlclByb2ZpbGUoY29udGF0byk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIGdldCBudW1iZXIgcHJvZmlsZScsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFByb2ZpbGVQaWNGcm9tU2VydmVyKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkNvbnRhY3RcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInBob25lXCJdID0ge1xuICAgICAgc2NoZW1hOiAnNTUyMTk5OTk5OTk5OSdcbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBwaG9uZSA9IHRydWUgfSA9IHJlcS5wYXJhbXM7XG4gIGNvbnN0IHsgaXNHcm91cCA9IGZhbHNlIH0gPSByZXEucXVlcnk7XG4gIHRyeSB7XG4gICAgbGV0IHJlc3BvbnNlO1xuICAgIGZvciAoY29uc3QgY29udGF0byBvZiBjb250YWN0VG9BcnJheShwaG9uZSBhcyBzdHJpbmcsIGlzR3JvdXAgYXMgYm9vbGVhbikpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRQcm9maWxlUGljRnJvbVNlcnZlcihjb250YXRvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gIGdldCBwcm9maWxlIHBpYycsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFN0YXR1cyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJDb250YWN0XCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJwaG9uZVwiXSA9IHtcbiAgICAgIHNjaGVtYTogJzU1MjE5OTk5OTk5OTknXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUgPSB0cnVlIH0gPSByZXEucGFyYW1zO1xuICB0cnkge1xuICAgIGxldCByZXNwb25zZTtcbiAgICBmb3IgKGNvbnN0IGNvbnRhdG8gb2YgY29udGFjdFRvQXJyYXkocGhvbmUgYXMgc3RyaW5nLCBmYWxzZSkpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRTdGF0dXMoY29udGF0byk7XG4gICAgfVxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cyg1MDApXG4gICAgICAuanNvbih7IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0Vycm9yIG9uICBnZXQgc3RhdHVzJywgZXJyb3I6IGVycm9yIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRQcm9maWxlU3RhdHVzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIlByb2ZpbGVcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcIm9ialwiXSA9IHtcbiAgICAgIGluOiAnYm9keScsXG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgJHN0YXR1czogJ015IG5ldyBzdGF0dXMnLFxuICAgICAgfVxuICAgICB9XG4gICAgIFxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBzdGF0dXM6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcIk15IG5ldyBzdGF0dXNcIixcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBzdGF0dXMgfSA9IHJlcS5ib2R5O1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5zZXRQcm9maWxlU3RhdHVzKHN0YXR1cyk7XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDUwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnRXJyb3Igb24gc2V0IHByb2ZpbGUgc3RhdHVzJyB9KTtcbiAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlamVjdENhbGwocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiTWlzY1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICBcbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY2FsbElkOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIGNhbGxJZDogXCI8Y2FsbGlkPlwiLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IGNhbGxJZCB9ID0gcmVxLmJvZHk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LnJlamVjdENhbGwoY2FsbElkKTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdFcnJvciBvbiByZWplY3RDYWxsJywgZXJyb3I6IGUgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJNZXNzYWdlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIHN0YXI6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICAgICAgc3RhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBtZXNzYWdlSWQsIHN0YXIgPSB0cnVlIH0gPSByZXEuYm9keTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuc3Rhck1lc3NhZ2UobWVzc2FnZUlkLCBzdGFyKTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiAgc3RhcnQgbWVzc2FnZScsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFJlYWN0aW9ucyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wibWVzc2FnZUlkXCJdID0ge1xuICAgICAgc2NoZW1hOiAnPG1lc3NhZ2VJZD4nXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IG1lc3NhZ2VJZCA9IHJlcS5wYXJhbXMuaWQ7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LmdldFJlYWN0aW9ucyhtZXNzYWdlSWQpO1xuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIGdldCByZWFjdGlvbnMnLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRWb3RlcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wibWVzc2FnZUlkXCJdID0ge1xuICAgICAgc2NoZW1hOiAnPG1lc3NhZ2VJZD4nXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IG1lc3NhZ2VJZCA9IHJlcS5wYXJhbXMuaWQ7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LmdldFZvdGVzKG1lc3NhZ2VJZCk7XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdFcnJvciBvbiBnZXQgdm90ZXMnLCBlcnJvcjogZXJyb3IgfSk7XG4gIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGF0V29vdChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAgICNzd2FnZ2VyLmRlc2NyaXB0aW9uID0gJ1lvdSBjYW4gcG9pbnQgeW91ciBDaGF0d29vdCB0byB0aGlzIHJvdXRlIHNvIHRoYXQgaXQgY2FuIHBlcmZvcm0gZnVuY3Rpb25zLidcbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZXZlbnQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBwcml2YXRlOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogXCJjb252ZXJzYXRpb25fc3RhdHVzX2NoYW5nZWRcIixcbiAgICAgICAgICAgICAgICBwcml2YXRlOiBcImZhbHNlXCIsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgc2Vzc2lvbiB9ID0gcmVxLnBhcmFtcztcbiAgY29uc3QgY2xpZW50OiBhbnkgPSBjbGllbnRzQXJyYXlbc2Vzc2lvbl07XG4gIGlmIChjbGllbnQgPT0gbnVsbCB8fCBjbGllbnQuc3RhdHVzICE9PSAnQ09OTkVDVEVEJykgcmV0dXJuO1xuICB0cnkge1xuICAgIGlmIChhd2FpdCBjbGllbnQuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgY29uc3QgZXZlbnQgPSByZXEuYm9keS5ldmVudDtcblxuICAgICAgaWYgKFxuICAgICAgICBldmVudCA9PSAnY29udmVyc2F0aW9uX3N0YXR1c19jaGFuZ2VkJyB8fFxuICAgICAgICBldmVudCA9PSAnY29udmVyc2F0aW9uX3Jlc29sdmVkJyB8fFxuICAgICAgICByZXEuYm9keS5wcml2YXRlXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgICAgIC5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdTdWNjZXNzIG9uIHJlY2VpdmUgY2hhdHdvb3QnIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7XG4gICAgICAgIG1lc3NhZ2VfdHlwZSxcbiAgICAgICAgcGhvbmUgPSByZXEuYm9keS5jb252ZXJzYXRpb24ubWV0YS5zZW5kZXIucGhvbmVfbnVtYmVyLnJlcGxhY2UoJysnLCAnJyksXG4gICAgICAgIG1lc3NhZ2UgPSByZXEuYm9keS5jb252ZXJzYXRpb24ubWVzc2FnZXNbMF0sXG4gICAgICB9ID0gcmVxLmJvZHk7XG5cbiAgICAgIGlmIChldmVudCAhPSAnbWVzc2FnZV9jcmVhdGVkJyAmJiBtZXNzYWdlX3R5cGUgIT0gJ291dGdvaW5nJylcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgIGZvciAoY29uc3QgY29udGF0byBvZiBjb250YWN0VG9BcnJheShwaG9uZSwgZmFsc2UpKSB7XG4gICAgICAgIGlmIChtZXNzYWdlX3R5cGUgPT0gJ291dGdvaW5nJykge1xuICAgICAgICAgIGlmIChtZXNzYWdlLmF0dGFjaG1lbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlX3VybCA9IGAke1xuICAgICAgICAgICAgICBjbGllbnQuY29uZmlnLmNoYXRXb290LmJhc2VVUkxcbiAgICAgICAgICAgIH0vJHttZXNzYWdlLmF0dGFjaG1lbnRzWzBdLmRhdGFfdXJsLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgbWVzc2FnZS5hdHRhY2htZW50c1swXS5kYXRhX3VybC5pbmRleE9mKCcvcmFpbHMvJykgKyAxXG4gICAgICAgICAgICApfWA7XG4gICAgICAgICAgICBhd2FpdCBjbGllbnQuc2VuZEZpbGUoXG4gICAgICAgICAgICAgIGAke2NvbnRhdG99YCxcbiAgICAgICAgICAgICAgYmFzZV91cmwsXG4gICAgICAgICAgICAgICdmaWxlJyxcbiAgICAgICAgICAgICAgbWVzc2FnZS5jb250ZW50XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCBjbGllbnQuc2VuZFRleHQoY29udGF0bywgbWVzc2FnZS5jb250ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNcbiAgICAgICAgLnN0YXR1cygyMDApXG4gICAgICAgIC5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdTdWNjZXNzIG9uICByZWNlaXZlIGNoYXR3b290JyB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uICByZWNlaXZlIGNoYXR3b290JyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UGxhdGZvcm1Gcm9tTWVzc2FnZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJtZXNzYWdlSWRcIl0gPSB7XG4gICAgICBzY2hlbWE6ICc8bWVzc2FnZUlkPidcbiAgICAgfVxuICAgKi9cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LmdldFBsYXRmb3JtRnJvbU1lc3NhZ2UoXG4gICAgICByZXEucGFyYW1zLm1lc3NhZ2VJZFxuICAgICk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3VsdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IGdldCBwbGF0Zm9ybSBmcm9tIG1lc3NhZ2UnLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLElBQUFBLFVBQUEsR0FBQUMsT0FBQTtBQUNBLElBQUFDLFlBQUEsR0FBQUQsT0FBQSx3QkFBbUQsQ0FuQm5EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQU9BLFNBQVNFLFlBQVlBLENBQUNDLEdBQVEsRUFBRUMsT0FBWSxFQUFFQyxLQUFVLEVBQUVDLElBQVMsRUFBRSxDQUNuRUgsR0FBRyxDQUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQyxFQUNuQkQsTUFBTSxFQUFFLFNBQVMsRUFDakJFLFFBQVEsRUFBRSxFQUNSQyxPQUFPLEVBQUUscUNBQXFDLEVBQzlDQyxPQUFPLEVBQUVOLEtBQUssRUFDZEQsT0FBTyxFQUFFQSxPQUFPLEVBQ2hCRSxJQUFJLEVBQUVBLElBQUksQ0FDWixDQUFDLENBQ0gsQ0FBQyxDQUFDLENBQ0osQ0FFQSxTQUFTTSxXQUFXQSxDQUFDQyxHQUFZLEVBQUVWLEdBQWEsRUFBRUMsT0FBWSxFQUFFVSxLQUFVLEVBQUU7RUFDMUVELEdBQUcsQ0FBQ0UsTUFBTSxDQUFDRCxLQUFLLENBQUNBLEtBQUssQ0FBQztFQUN2QlgsR0FBRyxDQUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQztJQUNuQkQsTUFBTSxFQUFFLE9BQU87SUFDZkUsUUFBUSxFQUFFO01BQ1JD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