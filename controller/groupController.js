"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.addParticipant = addParticipant;exports.changePrivacyGroup = changePrivacyGroup;exports.createGroup = createGroup;exports.demoteParticipant = demoteParticipant;exports.getAllBroadcastList = getAllBroadcastList;exports.getAllGroups = getAllGroups;exports.getCommonGroups = getCommonGroups;exports.getGroupAdmins = getGroupAdmins;exports.getGroupInfoFromInviteLink = getGroupInfoFromInviteLink;exports.getGroupInviteLink = getGroupInviteLink;exports.getGroupMembers = getGroupMembers;exports.getGroupMembersIds = getGroupMembersIds;exports.joinGroupByCode = joinGroupByCode;exports.leaveGroup = leaveGroup;exports.promoteParticipant = promoteParticipant;exports.removeParticipant = removeParticipant;exports.revokeGroupInviteLink = revokeGroupInviteLink;exports.setGroupDescription = setGroupDescription;exports.setGroupProfilePic = setGroupProfilePic;exports.setGroupProperty = setGroupProperty;exports.setGroupSubject = setGroupSubject;exports.setMessagesAdminsOnly = setMessagesAdminsOnly;
















var _functions = require("../util/functions"); /*
 * Copyright 2023 WPPConnect Team
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
 */async function getAllGroups(req, res) {/**
     #swagger.tags = ["Group"]
     #swagger.deprecated = true
     #swagger.summary = 'Deprecated in favor of 'list-chats'
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */try {const response = await req.client.getAllGroups();return res.status(200).json({ status: 'success', response: response });} catch (e) {req.logger.error(e);res.
    status(500).
    json({ status: 'error', message: 'Error fetching groups', error: e });
  }
}

async function joinGroupByCode(req, res) {
  /**
     #swagger.tags = ["Group"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              inviteCode: {
                type: "string"
              }
            },
            required: ["inviteCode"]
          },
          examples: {
            "Default": {
              value: {
                inviteCode: "5644444"
              }
            }
          }
        }
      }
    }
   */
  const { inviteCode } = req.body;

  if (!inviteCode)
  return res.status(400).send({ message: 'Invitation Code is required' });

  try {
    await req.client.joinGroup(inviteCode);
    res.status(201).json({
      status: 'success',
      response: {
        message: 'The informed contact(s) entered the group successfully',
        contact: inviteCode
      }
    });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'The informed contact(s) did not join the group successfully',
      error: error
    });
  }
}

async function createGroup(req, res) {
  /**
     #swagger.tags = ["Group"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              participants: {
                type: "array",
                items: {
                  type: "string"
                }
              },
              name: {
                type: "string"
              }
            },
            required: ["participants", "name"]
          },
          examples: {
            "Default": {
              value: {
                participants: ["5521999999999"],
                name: "Group name"
              }
            }
          }
        }
      }
    }
   */
  const { participants, name } = req.body;

  try {
    let response = {};
    const infoGroup = [];

    for (const group of (0, _functions.groupNameToArray)(name)) {
      response = await req.client.createGroup(
        group,
        (0, _functions.contactToArray)(participants)
      );
      infoGroup.push({
        name: group,
        id: response.gid.user,
        participants: response.participants
      });
    }

    return res.status(201).json({
      status: 'success',
      response: {
        message: 'Group(s) created successfully',
        group: name,
        groupInfo: infoGroup
      }
    });
  } catch (e) {
    req.logger.error(e);
    return res.
    status(500).
    json({ status: 'error', message: 'Error creating group(s)', error: e });
  }
}

async function leaveGroup(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              groupId: { type: "string" }
            },
            required: ["groupId"]
          }
        }
      }
    }
   */
  const { groupId } = req.body;

  try {
    for (const group of (0, _functions.groupToArray)(groupId)) {
      await req.client.leaveGroup(group);
    }

    return res.status(200).json({
      status: 'success',
      response: { messages: 'Você saiu do grupo com sucesso', group: groupId }
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao sair do(s) grupo(s)',
      error: e
    });
  }
}

async function getGroupMembers(req, res) {
  /**
     #swagger.tags = ["Group"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  const { groupId } = req.params;

  try {
    let response = {};
    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.getGroupMembers(group);
    }
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get group members',
      error: e
    });
  }
}

async function addParticipant(req, res) {
  /**
     #swagger.tags = ["Group"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              groupId: { type: "string" },
              phone: { type: "string" }
            },
            required: ["groupId", "phone"]
          },
          examples: {
            "Default": {
              value: {
                groupId: "<groupId>",
                phone: "5521999999999"
              }
            }
          }
        }
      }
    }
   */
  const { groupId, phone } = req.body;

  try {
    let response = {};
    const arrayGroups = [];

    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.addParticipant(group, (0, _functions.contactToArray)(phone));
      arrayGroups.push(response);
    }

    return res.status(201).json({
      status: 'success',
      response: {
        message: 'Addition to group attempted.',
        participants: phone,
        groups: (0, _functions.groupToArray)(groupId),
        result: arrayGroups
      }
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error adding participant(s)',
      error: e
    });
  }
}

async function removeParticipant(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              "groupId": { type: "string" },
              "phone": { type: "string" }
            },
            required: ["groupId", "phone"]
          },
          examples: {
            "Default": {
              value: {
                "groupId": "<groupId>",
                "phone": "5521999999999"
              }
            }
          }
        }
      }
    }
   */
  const { groupId, phone } = req.body;

  try {
    let response = {};
    const arrayGroups = [];

    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.removeParticipant(
        group,
        (0, _functions.contactToArray)(phone)
      );
      arrayGroups.push(response);
    }

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'Participant(s) removed successfully',
        participants: phone,
        groups: arrayGroups
      }
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error removing participant(s)',
      error: e
    });
  }
}

async function promoteParticipant(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              "groupId": { type: "string" },
              "phone": { type: "string" }
            },
            required: ["groupId", "phone"]
          },
          examples: {
            "Default": {
              value: {
                "groupId": "<groupId>",
                "phone": "5521999999999"
              }
            }
          }
        }
      }
    }
   */
  const { groupId, phone } = req.body;

  try {
    const arrayGroups = [];
    for (const group of (0, _functions.groupToArray)(groupId)) {
      await req.client.promoteParticipant(group, (0, _functions.contactToArray)(phone));
      arrayGroups.push(group);
    }

    return res.status(201).json({
      status: 'success',
      response: {
        message: 'Successful promoted participant(s)',
        participants: phone,
        groups: arrayGroups
      }
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error promoting participant(s)',
      error: e
    });
  }
}

async function demoteParticipant(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              "groupId": { type: "string" },
              "phone": { type: "string" }
            },
            required: ["groupId", "phone"]
          },
          examples: {
            "Default": {
              value: {
                "groupId": "<groupId>",
                "phone": "5521999999999"
              }
            }
          }
        }
      }
    }
   */
  const { groupId, phone } = req.body;

  try {
    const arrayGroups = [];
    for (const group of (0, _functions.groupToArray)(groupId)) {
      await req.client.demoteParticipant(group, (0, _functions.contactToArray)(phone));
      arrayGroups.push(group);
    }

    return res.status(201).json({
      status: 'success',
      response: {
        message: 'Admin of participant(s) revoked successfully',
        participants: phone,
        groups: arrayGroups
      }
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: "Error revoking participant's admin(s)",
      error: e
    });
  }
}

async function getGroupAdmins(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              "groupId": { type: "string" }
            },
            required: ["groupId"]
          },
          examples: {
            "Default": {
              value: {
                "groupId": "<groupId>"
              }
            }
          }
        }
      }
    }
   */
  const { groupId } = req.params;

  try {
    let response = {};
    const arrayGroups = [];

    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.getGroupAdmins(group);
      arrayGroups.push(response);
    }

    return res.status(200).json({ status: 'success', response: arrayGroups });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error retrieving group admin(s)',
      error: e
    });
  }
}

async function getGroupInviteLink(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              groupId: { type: "string" }
            }
          }
        }
      }
    }
   */
  const { groupId } = req.params;
  try {
    let response = {};
    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.getGroupInviteLink(group);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get group invite link',
      error: e
    });
  }
}

async function revokeGroupInviteLink(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              $groupId: { type: "string" }
            }
          }
        }
      }
    }
   */
  const { groupId } = req.params;

  let response = {};

  try {
    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.revokeGroupInviteLink(group);
    }

    return res.status(200).json({
      status: 'Success',
      response: response
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(400).json({
      status: 'error',
      message: 'Error on revoke group invite link',
      error: e
    });
  }
}

async function getAllBroadcastList(req, res) {
  /**
     #swagger.tags = ["Misc"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const response = await req.client.getAllBroadcastList();
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get all broad cast list',
      error: e
    });
  }
}

async function getGroupInfoFromInviteLink(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              $invitecode: { type: "string" }
            }
          }
        }
      }
    }
   */
  try {
    const { invitecode } = req.body;
    const response = await req.client.getGroupInfoFromInviteLink(invitecode);
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get group info from invite link',
      error: e
    });
  }
}

async function getGroupMembersIds(req, res) {
  /**
     #swagger.tags = ["Group"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["groupId"] = {
      schema: '<groupId>'
     }
   */
  const { groupId } = req.params;
  let response = {};
  try {
    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.getGroupMembersIds(group);
    }
    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get group members ids',
      error: e
    });
  }
}

async function setGroupDescription(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              $groupId: { type: "string" },
              $description: { type: "string" }
            }
          }
        }
      }
    }
   */
  const { groupId, description } = req.body;

  let response = {};

  try {
    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.setGroupDescription(group, description);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on set group description',
      error: e
    });
  }
}

async function setGroupProperty(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              $groupId: { type: "string" },
              $property: { type: "string" },
              $value: { type: "boolean" }
            }
          }
        }
      }
    }
   */
  const { groupId, property, value = true } = req.body;

  let response = {};

  try {
    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.setGroupProperty(group, property, value);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on set group property',
      error: e
    });
  }
}

async function setGroupSubject(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              $groupId: { type: "string" },
              $title: { type: "string" }
            }
          }
        }
      }
    }
   */
  const { groupId, title } = req.body;

  let response = {};

  try {
    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.setGroupSubject(group, title);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on set group subject',
      error: e
    });
  }
}

async function setMessagesAdminsOnly(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              $groupId: { type: "string" },
              $value: { type: "boolean" }
            }
          }
        }
      }
    }
   */
  const { groupId, value = true } = req.body;

  let response = {};

  try {
    for (const group of (0, _functions.groupToArray)(groupId)) {
      response = await req.client.setMessagesAdminsOnly(group, value);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on set messages admins only',
      error: e
    });
  }
}

async function changePrivacyGroup(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              $groupId: { type: "string" },
              $status: { type: "boolean" }
            }
          }
        }
      }
    }
   */
  const { groupId, status } = req.body;

  try {
    for (const group of (0, _functions.contactToArray)(groupId)) {
      await req.client.setGroupProperty(
        group,
        'restrict',
        status === 'true'
      );
    }

    return res.status(200).json({
      status: 'success',
      response: { message: 'Group privacy changed successfully' }
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error changing group privacy',
      error: e
    });
  }
}

async function setGroupProfilePic(req, res) {
  /**
     #swagger.tags = ["Group"]
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
              $groupId: { type: "string" },
              $path: { type: "string" }
            }
          }
        }
      }
    }
   */
  const { groupId, path } = req.body;

  if (!path && !req.file)
  return res.status(401).send({
    message: 'Sending the image is mandatory'
  });

  const pathFile = path || req.file?.path;

  try {
    for (const contact of (0, _functions.contactToArray)(groupId, true)) {
      await req.client.setGroupIcon(contact, pathFile);
    }

    return res.status(201).json({
      status: 'success',
      response: { message: 'Group profile photo successfully changed' }
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error changing group photo',
      error: e
    });
  }
}

async function getCommonGroups(req, res) {
  /**
     #swagger.tags = ["Group"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["wid"] = {
      schema: '5521999999999@c.us'
     }
   */
  const { wid } = req.params;
  try {
    return res.status(200).json(await req.client.getCommonGroups(wid));
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({
      status: 'error',
      message: 'Error on get common groups',
      error: e
    });
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnVuY3Rpb25zIiwicmVxdWlyZSIsImdldEFsbEdyb3VwcyIsInJlcSIsInJlcyIsInJlc3BvbnNlIiwiY2xpZW50Iiwic3RhdHVzIiwianNvbiIsImUiLCJsb2dnZXIiLCJlcnJvciIsIm1lc3NhZ2UiLCJqb2luR3JvdXBCeUNvZGUiLCJpbnZpdGVDb2RlIiwiYm9keSIsInNlbmQiLCJqb2luR3JvdXAiLCJjb250YWN0IiwiY3JlYXRlR3JvdXAiLCJwYXJ0aWNpcGFudHMiLCJuYW1lIiwiaW5mb0dyb3VwIiwiZ3JvdXAiLCJncm91cE5hbWVUb0FycmF5IiwiY29udGFjdFRvQXJyYXkiLCJwdXNoIiwiaWQiLCJnaWQiLCJ1c2VyIiwiZ3JvdXBJbmZvIiwibGVhdmVHcm91cCIsImdyb3VwSWQiLCJncm91cFRvQXJyYXkiLCJtZXNzYWdlcyIsImdldEdyb3VwTWVtYmVycyIsInBhcmFtcyIsImFkZFBhcnRpY2lwYW50IiwicGhvbmUiLCJhcnJheUdyb3VwcyIsImdyb3VwcyIsInJlc3VsdCIsInJlbW92ZVBhcnRpY2lwYW50IiwicHJvbW90ZVBhcnRpY2lwYW50IiwiZGVtb3RlUGFydGljaXBhbnQiLCJnZXRHcm91cEFkbWlucyIsImdldEdyb3VwSW52aXRlTGluayIsInJldm9rZUdyb3VwSW52aXRlTGluayIsImdldEFsbEJyb2FkY2FzdExpc3QiLCJnZXRHcm91cEluZm9Gcm9tSW52aXRlTGluayIsImludml0ZWNvZGUiLCJnZXRHcm91cE1lbWJlcnNJZHMiLCJzZXRHcm91cERlc2NyaXB0aW9uIiwiZGVzY3JpcHRpb24iLCJzZXRHcm91cFByb3BlcnR5IiwicHJvcGVydHkiLCJ2YWx1ZSIsInNldEdyb3VwU3ViamVjdCIsInRpdGxlIiwic2V0TWVzc2FnZXNBZG1pbnNPbmx5IiwiY2hhbmdlUHJpdmFjeUdyb3VwIiwic2V0R3JvdXBQcm9maWxlUGljIiwicGF0aCIsImZpbGUiLCJwYXRoRmlsZSIsInNldEdyb3VwSWNvbiIsImdldENvbW1vbkdyb3VwcyIsIndpZCJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVyL2dyb3VwQ29udHJvbGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMjMgV1BQQ29ubmVjdCBUZWFtXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuXG5pbXBvcnQge1xuICBjb250YWN0VG9BcnJheSxcbiAgZ3JvdXBOYW1lVG9BcnJheSxcbiAgZ3JvdXBUb0FycmF5LFxufSBmcm9tICcuLi91dGlsL2Z1bmN0aW9ucyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxHcm91cHMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiR3JvdXBcIl1cbiAgICAgI3N3YWdnZXIuZGVwcmVjYXRlZCA9IHRydWVcbiAgICAgI3N3YWdnZXIuc3VtbWFyeSA9ICdEZXByZWNhdGVkIGluIGZhdm9yIG9mICdsaXN0LWNoYXRzJ1xuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgKi9cbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0QWxsR3JvdXBzKCk7XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdFcnJvciBmZXRjaGluZyBncm91cHMnLCBlcnJvcjogZSB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gam9pbkdyb3VwQnlDb2RlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkdyb3VwXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBpbnZpdGVDb2RlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFtcImludml0ZUNvZGVcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIGludml0ZUNvZGU6IFwiNTY0NDQ0NFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IGludml0ZUNvZGUgfSA9IHJlcS5ib2R5O1xuXG4gIGlmICghaW52aXRlQ29kZSlcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBtZXNzYWdlOiAnSW52aXRhdGlvbiBDb2RlIGlzIHJlcXVpcmVkJyB9KTtcblxuICB0cnkge1xuICAgIGF3YWl0IHJlcS5jbGllbnQuam9pbkdyb3VwKGludml0ZUNvZGUpO1xuICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgbWVzc2FnZTogJ1RoZSBpbmZvcm1lZCBjb250YWN0KHMpIGVudGVyZWQgdGhlIGdyb3VwIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgIGNvbnRhY3Q6IGludml0ZUNvZGUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdUaGUgaW5mb3JtZWQgY29udGFjdChzKSBkaWQgbm90IGpvaW4gdGhlIGdyb3VwIHN1Y2Nlc3NmdWxseScsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUdyb3VwKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkdyb3VwXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwYXJ0aWNpcGFudHM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1aXJlZDogW1wicGFydGljaXBhbnRzXCIsIFwibmFtZVwiXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGFydGljaXBhbnRzOiBbXCI1NTIxOTk5OTk5OTk5XCJdLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiR3JvdXAgbmFtZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IHBhcnRpY2lwYW50cywgbmFtZSB9ID0gcmVxLmJvZHk7XG5cbiAgdHJ5IHtcbiAgICBsZXQgcmVzcG9uc2UgPSB7fTtcbiAgICBjb25zdCBpbmZvR3JvdXA6IGFueSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cE5hbWVUb0FycmF5KG5hbWUpKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuY3JlYXRlR3JvdXAoXG4gICAgICAgIGdyb3VwLFxuICAgICAgICBjb250YWN0VG9BcnJheShwYXJ0aWNpcGFudHMpXG4gICAgICApO1xuICAgICAgaW5mb0dyb3VwLnB1c2goe1xuICAgICAgICBuYW1lOiBncm91cCxcbiAgICAgICAgaWQ6IChyZXNwb25zZSBhcyBhbnkpLmdpZC51c2VyLFxuICAgICAgICBwYXJ0aWNpcGFudHM6IChyZXNwb25zZSBhcyBhbnkpLnBhcnRpY2lwYW50cyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMSkuanNvbih7XG4gICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgIG1lc3NhZ2U6ICdHcm91cChzKSBjcmVhdGVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgIGdyb3VwOiBuYW1lLFxuICAgICAgICBncm91cEluZm86IGluZm9Hcm91cCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdFcnJvciBjcmVhdGluZyBncm91cChzKScsIGVycm9yOiBlIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsZWF2ZUdyb3VwKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkdyb3VwXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGdyb3VwSWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFtcImdyb3VwSWRcIl1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IGdyb3VwSWQgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cFRvQXJyYXkoZ3JvdXBJZCkpIHtcbiAgICAgIGF3YWl0IHJlcS5jbGllbnQubGVhdmVHcm91cChncm91cCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgcmVzcG9uc2U6IHsgbWVzc2FnZXM6ICdWb2PDqiBzYWl1IGRvIGdydXBvIGNvbSBzdWNlc3NvJywgZ3JvdXA6IGdyb3VwSWQgfSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvIGFvIHNhaXIgZG8ocykgZ3J1cG8ocyknLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdyb3VwTWVtYmVycyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJHcm91cFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBncm91cElkIH0gPSByZXEucGFyYW1zO1xuXG4gIHRyeSB7XG4gICAgbGV0IHJlc3BvbnNlID0ge307XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cFRvQXJyYXkoZ3JvdXBJZCkpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRHcm91cE1lbWJlcnMoZ3JvdXApO1xuICAgIH1cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIGdldCBncm91cCBtZW1iZXJzJyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRQYXJ0aWNpcGFudChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJHcm91cFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgY29udGVudDoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZ3JvdXBJZDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbXCJncm91cElkXCIsIFwicGhvbmVcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIGdyb3VwSWQ6IFwiPGdyb3VwSWQ+XCIsXG4gICAgICAgICAgICAgICAgcGhvbmU6IFwiNTUyMTk5OTk5OTk5OVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IGdyb3VwSWQsIHBob25lIH0gPSByZXEuYm9keTtcblxuICB0cnkge1xuICAgIGxldCByZXNwb25zZSA9IHt9O1xuICAgIGNvbnN0IGFycmF5R3JvdXBzOiBhbnkgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgZ3JvdXBUb0FycmF5KGdyb3VwSWQpKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuYWRkUGFydGljaXBhbnQoZ3JvdXAsIGNvbnRhY3RUb0FycmF5KHBob25lKSk7XG4gICAgICBhcnJheUdyb3Vwcy5wdXNoKHJlc3BvbnNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDEpLmpzb24oe1xuICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICByZXNwb25zZToge1xuICAgICAgICBtZXNzYWdlOiAnQWRkaXRpb24gdG8gZ3JvdXAgYXR0ZW1wdGVkLicsXG4gICAgICAgIHBhcnRpY2lwYW50czogcGhvbmUsXG4gICAgICAgIGdyb3VwczogZ3JvdXBUb0FycmF5KGdyb3VwSWQpLFxuICAgICAgICByZXN1bHQ6IGFycmF5R3JvdXBzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBhZGRpbmcgcGFydGljaXBhbnQocyknLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbW92ZVBhcnRpY2lwYW50KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkdyb3VwXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIFwiZ3JvdXBJZFwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgXCJwaG9uZVwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbXCJncm91cElkXCIsIFwicGhvbmVcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIFwiZ3JvdXBJZFwiOiBcIjxncm91cElkPlwiLFxuICAgICAgICAgICAgICAgIFwicGhvbmVcIjogXCI1NTIxOTk5OTk5OTk5XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgZ3JvdXBJZCwgcGhvbmUgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgbGV0IHJlc3BvbnNlID0ge307XG4gICAgY29uc3QgYXJyYXlHcm91cHM6IGFueSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cFRvQXJyYXkoZ3JvdXBJZCkpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5yZW1vdmVQYXJ0aWNpcGFudChcbiAgICAgICAgZ3JvdXAsXG4gICAgICAgIGNvbnRhY3RUb0FycmF5KHBob25lKVxuICAgICAgKTtcbiAgICAgIGFycmF5R3JvdXBzLnB1c2gocmVzcG9uc2UpO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgIHJlc3BvbnNlOiB7XG4gICAgICAgIG1lc3NhZ2U6ICdQYXJ0aWNpcGFudChzKSByZW1vdmVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgIHBhcnRpY2lwYW50czogcGhvbmUsXG4gICAgICAgIGdyb3VwczogYXJyYXlHcm91cHMsXG4gICAgICB9LFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIHJlbW92aW5nIHBhcnRpY2lwYW50KHMpJyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcm9tb3RlUGFydGljaXBhbnQocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiR3JvdXBcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgXCJncm91cElkXCI6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBcInBob25lXCI6IHsgdHlwZTogXCJzdHJpbmdcIiB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFtcImdyb3VwSWRcIiwgXCJwaG9uZVwiXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgXCJncm91cElkXCI6IFwiPGdyb3VwSWQ+XCIsXG4gICAgICAgICAgICAgICAgXCJwaG9uZVwiOiBcIjU1MjE5OTk5OTk5OTlcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBncm91cElkLCBwaG9uZSB9ID0gcmVxLmJvZHk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBhcnJheUdyb3VwczogYW55ID0gW107XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cFRvQXJyYXkoZ3JvdXBJZCkpIHtcbiAgICAgIGF3YWl0IHJlcS5jbGllbnQucHJvbW90ZVBhcnRpY2lwYW50KGdyb3VwLCBjb250YWN0VG9BcnJheShwaG9uZSkpO1xuICAgICAgYXJyYXlHcm91cHMucHVzaChncm91cCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAxKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgbWVzc2FnZTogJ1N1Y2Nlc3NmdWwgcHJvbW90ZWQgcGFydGljaXBhbnQocyknLFxuICAgICAgICBwYXJ0aWNpcGFudHM6IHBob25lLFxuICAgICAgICBncm91cHM6IGFycmF5R3JvdXBzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBwcm9tb3RpbmcgcGFydGljaXBhbnQocyknLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbW90ZVBhcnRpY2lwYW50KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkdyb3VwXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIFwiZ3JvdXBJZFwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgXCJwaG9uZVwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbXCJncm91cElkXCIsIFwicGhvbmVcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIFwiZ3JvdXBJZFwiOiBcIjxncm91cElkPlwiLFxuICAgICAgICAgICAgICAgIFwicGhvbmVcIjogXCI1NTIxOTk5OTk5OTk5XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgZ3JvdXBJZCwgcGhvbmUgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgYXJyYXlHcm91cHM6IGFueSA9IFtdO1xuICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgZ3JvdXBUb0FycmF5KGdyb3VwSWQpKSB7XG4gICAgICBhd2FpdCByZXEuY2xpZW50LmRlbW90ZVBhcnRpY2lwYW50KGdyb3VwLCBjb250YWN0VG9BcnJheShwaG9uZSkpO1xuICAgICAgYXJyYXlHcm91cHMucHVzaChncm91cCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAxKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgbWVzc2FnZTogJ0FkbWluIG9mIHBhcnRpY2lwYW50KHMpIHJldm9rZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgcGFydGljaXBhbnRzOiBwaG9uZSxcbiAgICAgICAgZ3JvdXBzOiBhcnJheUdyb3VwcyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiBcIkVycm9yIHJldm9raW5nIHBhcnRpY2lwYW50J3MgYWRtaW4ocylcIixcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHcm91cEFkbWlucyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJHcm91cFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBcImdyb3VwSWRcIjogeyB0eXBlOiBcInN0cmluZ1wiIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1aXJlZDogW1wiZ3JvdXBJZFwiXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgXCJncm91cElkXCI6IFwiPGdyb3VwSWQ+XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgZ3JvdXBJZCB9ID0gcmVxLnBhcmFtcztcblxuICB0cnkge1xuICAgIGxldCByZXNwb25zZSA9IHt9O1xuICAgIGNvbnN0IGFycmF5R3JvdXBzOiBhbnkgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgZ3JvdXBUb0FycmF5KGdyb3VwSWQpKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0R3JvdXBBZG1pbnMoZ3JvdXApO1xuICAgICAgYXJyYXlHcm91cHMucHVzaChyZXNwb25zZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiBhcnJheUdyb3VwcyB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciByZXRyaWV2aW5nIGdyb3VwIGFkbWluKHMpJyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHcm91cEludml0ZUxpbmsocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiR3JvdXBcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZ3JvdXBJZDogeyB0eXBlOiBcInN0cmluZ1wiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IGdyb3VwSWQgfSA9IHJlcS5wYXJhbXM7XG4gIHRyeSB7XG4gICAgbGV0IHJlc3BvbnNlID0ge307XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cFRvQXJyYXkoZ3JvdXBJZCkpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRHcm91cEludml0ZUxpbmsoZ3JvdXApO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IGdyb3VwIGludml0ZSBsaW5rJyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXZva2VHcm91cEludml0ZUxpbmsocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiR3JvdXBcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgJGdyb3VwSWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBncm91cElkIH0gPSByZXEucGFyYW1zO1xuXG4gIGxldCByZXNwb25zZSA9IHt9O1xuXG4gIHRyeSB7XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cFRvQXJyYXkoZ3JvdXBJZCkpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5yZXZva2VHcm91cEludml0ZUxpbmsoZ3JvdXApO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdTdWNjZXNzJyxcbiAgICAgIHJlc3BvbnNlOiByZXNwb25zZSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiByZXZva2UgZ3JvdXAgaW52aXRlIGxpbmsnLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFsbEJyb2FkY2FzdExpc3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiTWlzY1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgKi9cbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0QWxsQnJvYWRjYXN0TGlzdCgpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IGFsbCBicm9hZCBjYXN0IGxpc3QnLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdyb3VwSW5mb0Zyb21JbnZpdGVMaW5rKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkdyb3VwXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICRpbnZpdGVjb2RlOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICovXG4gIHRyeSB7XG4gICAgY29uc3QgeyBpbnZpdGVjb2RlIH0gPSByZXEuYm9keTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0R3JvdXBJbmZvRnJvbUludml0ZUxpbmsoaW52aXRlY29kZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBnZXQgZ3JvdXAgaW5mbyBmcm9tIGludml0ZSBsaW5rJyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHcm91cE1lbWJlcnNJZHMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiR3JvdXBcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcImdyb3VwSWRcIl0gPSB7XG4gICAgICBzY2hlbWE6ICc8Z3JvdXBJZD4nXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgZ3JvdXBJZCB9ID0gcmVxLnBhcmFtcztcbiAgbGV0IHJlc3BvbnNlID0ge307XG4gIHRyeSB7XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cFRvQXJyYXkoZ3JvdXBJZCkpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5nZXRHcm91cE1lbWJlcnNJZHMoZ3JvdXApO1xuICAgIH1cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIGdldCBncm91cCBtZW1iZXJzIGlkcycsXG4gICAgICBlcnJvcjogZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0R3JvdXBEZXNjcmlwdGlvbihyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJHcm91cFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAkZ3JvdXBJZDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICRkZXNjcmlwdGlvbjogeyB0eXBlOiBcInN0cmluZ1wiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IGdyb3VwSWQsIGRlc2NyaXB0aW9uIH0gPSByZXEuYm9keTtcblxuICBsZXQgcmVzcG9uc2UgPSB7fTtcblxuICB0cnkge1xuICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgZ3JvdXBUb0FycmF5KGdyb3VwSWQpKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuc2V0R3JvdXBEZXNjcmlwdGlvbihncm91cCwgZGVzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gc2V0IGdyb3VwIGRlc2NyaXB0aW9uJyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRHcm91cFByb3BlcnR5KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkdyb3VwXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICRncm91cElkOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgJHByb3BlcnR5OiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgJHZhbHVlOiB7IHR5cGU6IFwiYm9vbGVhblwiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IGdyb3VwSWQsIHByb3BlcnR5LCB2YWx1ZSA9IHRydWUgfSA9IHJlcS5ib2R5O1xuXG4gIGxldCByZXNwb25zZSA9IHt9O1xuXG4gIHRyeSB7XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cFRvQXJyYXkoZ3JvdXBJZCkpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5zZXRHcm91cFByb3BlcnR5KGdyb3VwLCBwcm9wZXJ0eSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gc2V0IGdyb3VwIHByb3BlcnR5JyxcbiAgICAgIGVycm9yOiBlLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRHcm91cFN1YmplY3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiR3JvdXBcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgJGdyb3VwSWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAkdGl0bGU6IHsgdHlwZTogXCJzdHJpbmdcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBncm91cElkLCB0aXRsZSB9ID0gcmVxLmJvZHk7XG5cbiAgbGV0IHJlc3BvbnNlID0ge307XG5cbiAgdHJ5IHtcbiAgICBmb3IgKGNvbnN0IGdyb3VwIG9mIGdyb3VwVG9BcnJheShncm91cElkKSkge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCByZXEuY2xpZW50LnNldEdyb3VwU3ViamVjdChncm91cCwgdGl0bGUpO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzcG9uc2UgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gc2V0IGdyb3VwIHN1YmplY3QnLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldE1lc3NhZ2VzQWRtaW5zT25seShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJHcm91cFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAkZ3JvdXBJZDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICR2YWx1ZTogeyB0eXBlOiBcImJvb2xlYW5cIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBncm91cElkLCB2YWx1ZSA9IHRydWUgfSA9IHJlcS5ib2R5O1xuXG4gIGxldCByZXNwb25zZSA9IHt9O1xuXG4gIHRyeSB7XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cFRvQXJyYXkoZ3JvdXBJZCkpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVxLmNsaWVudC5zZXRNZXNzYWdlc0FkbWluc09ubHkoZ3JvdXAsIHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIHNldCBtZXNzYWdlcyBhZG1pbnMgb25seScsXG4gICAgICBlcnJvcjogZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hhbmdlUHJpdmFjeUdyb3VwKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkdyb3VwXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICRncm91cElkOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgJHN0YXR1czogeyB0eXBlOiBcImJvb2xlYW5cIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBncm91cElkLCBzdGF0dXMgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBjb250YWN0VG9BcnJheShncm91cElkKSkge1xuICAgICAgYXdhaXQgcmVxLmNsaWVudC5zZXRHcm91cFByb3BlcnR5KFxuICAgICAgICBncm91cCxcbiAgICAgICAgJ3Jlc3RyaWN0JyBhcyBhbnksXG4gICAgICAgIHN0YXR1cyA9PT0gJ3RydWUnXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgIHJlc3BvbnNlOiB7IG1lc3NhZ2U6ICdHcm91cCBwcml2YWN5IGNoYW5nZWQgc3VjY2Vzc2Z1bGx5JyB9LFxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIGNoYW5naW5nIGdyb3VwIHByaXZhY3knLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEdyb3VwUHJvZmlsZVBpYyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJHcm91cFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAkZ3JvdXBJZDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICRwYXRoOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgZ3JvdXBJZCwgcGF0aCB9ID0gcmVxLmJvZHk7XG5cbiAgaWYgKCFwYXRoICYmICFyZXEuZmlsZSlcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xuICAgICAgbWVzc2FnZTogJ1NlbmRpbmcgdGhlIGltYWdlIGlzIG1hbmRhdG9yeScsXG4gICAgfSk7XG5cbiAgY29uc3QgcGF0aEZpbGUgPSBwYXRoIHx8IHJlcS5maWxlPy5wYXRoO1xuXG4gIHRyeSB7XG4gICAgZm9yIChjb25zdCBjb250YWN0IG9mIGNvbnRhY3RUb0FycmF5KGdyb3VwSWQsIHRydWUpKSB7XG4gICAgICBhd2FpdCByZXEuY2xpZW50LnNldEdyb3VwSWNvbihjb250YWN0LCBwYXRoRmlsZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAxKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgcmVzcG9uc2U6IHsgbWVzc2FnZTogJ0dyb3VwIHByb2ZpbGUgcGhvdG8gc3VjY2Vzc2Z1bGx5IGNoYW5nZWQnIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3IgY2hhbmdpbmcgZ3JvdXAgcGhvdG8nLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbW1vbkdyb3VwcyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJHcm91cFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wid2lkXCJdID0ge1xuICAgICAgc2NoZW1hOiAnNTUyMTk5OTk5OTk5OUBjLnVzJ1xuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHdpZCB9ID0gcmVxLnBhcmFtcztcbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oYXdhaXQgKHJlcS5jbGllbnQgYXMgYW55KS5nZXRDb21tb25Hcm91cHMod2lkKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGUpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IGNvbW1vbiBncm91cHMnLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBQUEsVUFBQSxHQUFBQyxPQUFBLHNCQUkyQixDQXJCM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBU08sZUFBZUMsWUFBWUEsQ0FBQ0MsR0FBWSxFQUFFQyxHQUFhLEVBQUUsQ0FDOUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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