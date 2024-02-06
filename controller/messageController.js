"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.editMessage = editMessage;exports.replyMessage = replyMessage;exports.sendButtons = sendButtons;exports.sendFile = sendFile;exports.sendImageAsSticker = sendImageAsSticker;exports.sendImageAsStickerGif = sendImageAsStickerGif;exports.sendLinkPreview = sendLinkPreview;exports.sendListMessage = sendListMessage;exports.sendLocation = sendLocation;exports.sendMentioned = sendMentioned;exports.sendMessage = sendMessage;exports.sendOrderMessage = sendOrderMessage;exports.sendPollMessage = sendPollMessage;exports.sendStatusText = sendStatusText;exports.sendVoice = sendVoice;exports.sendVoice64 = sendVoice64;

















var _functions = require("../util/functions"); /*
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
 */function returnError(req, res, error) {req.logger.error(error);res.status(500).json({ status: 'Error', message: 'Erro ao enviar a mensagem.', error: error });}async function returnSucess(res, data) {res.status(201).json({ status: 'success', response: data, mapper: 'return' });}
async function sendMessage(req, res) {
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
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              isNewsletter: { type: "boolean" },
              message: { type: "string" },
              options: { type: "object" },
            }
          },
          examples: {
            "Send message to contact": {
              value: { 
                phone: '5521999999999',
                isGroup: false,
                isNewsletter: false,
                message: 'Hi from WPPConnect',
              }
            },
            "Send message to group": {
              value: {
                phone: '8865623215244578',
                isGroup: true,
                message: 'Hi from WPPConnect',
              }
            },
          }
        }
      }
     }
   */
  const { phone, message } = req.body;

  const options = req.body.options || {};

  try {
    const results = [];
    for (const contato of phone) {
      results.push(await req.client.sendText(contato, message, options));
    }

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    req.io.emit('mensagem-enviada', results);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function editMessage(req, res) {
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
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string" },
              newText: { type: "string" },
              options: { type: "object" },
            }
          },
          examples: {
            "Edit a message": {
              value: { 
                id: 'true_5521999999999@c.us_3EB04FCAA1527EB6D9DEC8',
                newText: 'New text for message'
              }
            },
          }
        }
      }
     }
   */
  const { id, newText } = req.body;

  const options = req.body.options || {};
  try {
    const edited = await req.client.editMessage(id, newText, options);

    req.io.emit('edited-message', edited);
    returnSucess(res, edited);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendFile(req, res) {
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
      required: true,
      "@content": {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    "phone": { type: "string" },
                    "isGroup": { type: "boolean" },
                    "isNewsletter": { type: "boolean" },
                    "filename": { type: "string" },
                    "caption": { type: "string" },
                    "base64": { type: "string" }
                }
            },
            examples: {
                "Default": {
                    value: {
                        "phone": "5521999999999",
                        "isGroup": false,
                        "isNewsletter": false,
                        "filename": "file name lol",
                        "caption": "caption for my file",
                        "base64": "<base64> string"
                    }
                }
            }
        }
      }
    }
   */
  const {
    phone,
    path,
    base64,
    filename = 'file',
    message,
    caption,
    quotedMessageId
  } = req.body;

  const options = req.body.options || {};

  if (!path && !req.file && !base64)
  return res.status(401).send({
    message: 'Sending the file is mandatory'
  });

  const pathFile = path || base64 || req.file?.path;
  const msg = message || caption;

  try {
    const results = [];
    for (const contact of phone) {
      results.push(
        await req.client.sendFile(contact, pathFile, {
          filename: filename,
          caption: msg,
          quotedMsg: quotedMessageId,
          ...options
        })
      );
    }

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    if (req.file) await (0, _functions.unlinkAsync)(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendVoice(req, res) {
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
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        "phone": { type: "string" },
                        "isGroup": { type: "boolean" },
                        "path": { type: "string" },
                        "quotedMessageId": { type: "string" }
                    }
                },
                examples: {
                    "Default": {
                        value: {
                            "phone": "5521999999999",
                            "isGroup": false,
                            "path": "<path_file>",
                            "quotedMessageId": "message Id"
                        }
                    }
                }
            }
        }
    }
   */
  const {
    phone,
    path,
    filename = 'Voice Audio',
    message,
    quotedMessageId
  } = req.body;

  try {
    const results = [];
    for (const contato of phone) {
      results.push(
        await req.client.sendPtt(
          contato,
          path,
          filename,
          message,
          quotedMessageId
        )
      );
    }

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendVoice64(req, res) {
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
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        "phone": { type: "string" },
                        "isGroup": { type: "boolean" },
                        "base64Ptt": { type: "string" }
                    }
                },
                examples: {
                    "Default": {
                        value: {
                            "phone": "5521999999999",
                            "isGroup": false,
                            "base64Ptt": "<base64_string>"
                        }
                    }
                }
            }
        }
    }
   */
  const { phone, base64Ptt, quotedMessageId } = req.body;

  try {
    const results = [];
    for (const contato of phone) {
      results.push(
        await req.client.sendPttFromBase64(
          contato,
          base64Ptt,
          'Voice Audio',
          '',
          quotedMessageId
        )
      );
    }

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendLinkPreview(req, res) {
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
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        "phone": { type: "string" },
                        "isGroup": { type: "boolean" },
                        "url": { type: "string" },
                        "caption": { type: "string" }
                    }
                },
                examples: {
                    "Default": {
                        value: {
                            "phone": "5521999999999",
                            "isGroup": false,
                            "url": "http://www.link.com",
                            "caption": "Text for describe link"
                        }
                    }
                }
            }
        }
    }
   */
  const { phone, url, caption } = req.body;

  try {
    const results = [];
    for (const contato of phone) {
      results.push(
        await req.client.sendLinkPreview(`${contato}`, url, caption)
      );
    }

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendLocation(req, res) {
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
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        "phone": { type: "string" },
                        "isGroup": { type: "boolean" },
                        "lat": { type: "string" },
                        "lng": { type: "string" },
                        "title": { type: "string" },
                        "address": { type: "string" }
                    }
                },
                examples: {
                    "Default": {
                        value: {
                            "phone": "5521999999999",
                            "isGroup": false,
                            "lat": "-89898322",
                            "lng": "-545454",
                            "title": "Rio de Janeiro",
                            "address": "Av. N. S. de Copacabana, 25, Copacabana"
                        }
                    }
                }
            }
        }
    }
   */
  const { phone, lat, lng, title, address } = req.body;

  try {
    const results = [];
    for (const contato of phone) {
      results.push(
        await req.client.sendLocation(contato, {
          lat: lat,
          lng: lng,
          address: address,
          name: title
        })
      );
    }

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendButtons(req, res) {
  /**
   * #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA',
     }
     #swagger.deprecated=true
   */
  const { phone, message, options } = req.body;

  try {
    const results = [];

    for (const contact of phone) {
      results.push(await req.client.sendText(contact, message, options));
    }

    if (results.length === 0)
    return returnError(req, res, 'Error sending message with buttons');

    returnSucess(res, phone);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendListMessage(req, res) {
  /**
   * #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA',
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
              description: { type: "string" },
              sections: { type: "array" },
              buttonText: { type: "string" },
            }
          },
          examples: {
            "Send list message": {
              value: { 
                phone: '5521999999999',
                isGroup: false,
                description: 'Desc for list',
                buttonText: 'Select a option',
                sections: [
                  {
                    title: 'Section 1',
                    rows: [
                      {
                        rowId: 'my_custom_id',
                        title: 'Test 1',
                        description: 'Description 1',
                      },
                      {
                        rowId: '2',
                        title: 'Test 2',
                        description: 'Description 2',
                      },
                    ],
                  },
                ],
              }
            },
          }
        }
      }
     }
   */
  const {
    phone,
    description = '',
    sections,
    buttonText = 'SELECIONE UMA OPÇÃO'
  } = req.body;

  try {
    const results = [];

    for (const contact of phone) {
      results.push(
        await req.client.sendListMessage(contact, {
          buttonText: buttonText,
          description: description,
          sections: sections
        })
      );
    }

    if (results.length === 0)
    return returnError(req, res, 'Error sending list buttons');

    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendOrderMessage(req, res) {
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
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              phone: { type: "string" },
              isGroup: { type: "boolean" },
              items: { type: "object" },
              options: { type: "object" },
            }
          },
          examples: {
            "Send with custom items": {
              value: { 
                phone: '5521999999999',
                isGroup: false,
                items: [
                  {
                    type: 'custom',
                    name: 'Item test',
                    price: 120000,
                    qnt: 2,
                  },
                  {
                    type: 'custom',
                    name: 'Item test 2',
                    price: 145000,
                    qnt: 2,
                  },
                ],
              }
            },
            "Send with product items": {
              value: { 
                phone: '5521999999999',
                isGroup: false,
                items: [
                  {
                    type: 'product',
                    id: '37878774457',
                    price: 148000,
                    qnt: 2,
                  },
                ],
              }
            },
            "Send with custom items and options": {
              value: { 
                phone: '5521999999999',
                isGroup: false,
                items: [
                  {
                    type: 'custom',
                    name: 'Item test',
                    price: 120000,
                    qnt: 2,
                  },
                ],
                options: {
                  tax: 10000,
                  shipping: 4000,
                  discount: 10000,
                }
              }
            },
          }
        }
      }
     }
   */
  const { phone, items } = req.body;

  const options = req.body.options || {};

  try {
    const results = [];
    for (const contato of phone) {
      results.push(await req.client.sendOrderMessage(contato, items, options));
    }

    if (results.length === 0)
    return res.status(400).json('Error sending order message');
    req.io.emit('mensagem-enviada', results);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendPollMessage(req, res) {
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
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        phone: { type: "string" },
                        isGroup: { type: "boolean" },
                        name: { type: "string" },
                        choices: { type: "array" },
                        options: { type: "object" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          phone: '5521999999999',
                          isGroup: false,
                          name: 'Poll name',
                          choices: ['Option 1', 'Option 2', 'Option 3'],
                          options: {
                            selectableCount: 1,
                          }
                        }
                    },
                }
            }
        }
    }
   */
  const { phone, name, choices, options } = req.body;

  try {
    const results = [];

    for (const contact of phone) {
      results.push(
        await req.client.sendPollMessage(contact, name, choices, options)
      );
    }

    if (results.length === 0)
    return returnError(req, res, 'Error sending poll message');

    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendStatusText(req, res) {
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
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              phone: { type: 'string' },
              isGroup: { type: 'boolean' },
              message: { type: 'string' },
              messageId: { type: 'string' }
            },
            required: ['phone', 'isGroup', 'message']
          },
          examples: {
            Default: {
              value: {
                phone: '5521999999999',
                isGroup: false,
                message: 'Reply to message',
                messageId: '<id_message>'
              }
            }
          }
        }
      }
    }
   */
  const { message } = req.body;

  try {
    const results = [];
    results.push(await req.client.sendText('status@broadcast', message));

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function replyMessage(req, res) {
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
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              "phone": { type: "string" },
              "isGroup": { type: "boolean" },
              "message": { type: "string" },
              "messageId": { type: "string" }
            }
          },
          examples: {
            "Default": {
              value: {
                "phone": "5521999999999",
                "isGroup": false,
                "message": "Reply to message",
                "messageId": "<id_message>"
              }
            }
          }
        }
      }
    }
   */
  const { phone, message, messageId } = req.body;

  try {
    const results = [];
    for (const contato of phone) {
      results.push(await req.client.reply(contato, message, messageId));
    }

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    req.io.emit('mensagem-enviada', { message: message, to: phone });
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendMentioned(req, res) {
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
  required: true,
  "@content": {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          "phone": { type: "string" },
          "isGroup": { type: "boolean" },
          "message": { type: "string" },
          "mentioned": { type: "array", items: { type: "string" } }
        },
        required: ["phone", "message", "mentioned"]
      },
      examples: {
        "Default": {
          value: {
            "phone": "5521999999999",
            "isGroup": true,
            "message": "Your text message",
            "mentioned": ["@556593077171@c.us"]
          }
        }
      }
    }
  }
  }
   */
  const { phone, message, mentioned } = req.body;

  try {
    let response;
    for (const contato of phone) {
      response = await req.client.sendMentioned(
        `${contato}`,
        message,
        mentioned
      );
    }

    return res.status(201).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Error on send message mentioned',
      error: error
    });
  }
}
async function sendImageAsSticker(req, res) {
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
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              "phone": { type: "string" },
              "isGroup": { type: "boolean" },
              "path": { type: "string" }
            },
            required: ["phone", "path"]
          },
          examples: {
            "Default": {
              value: {
                "phone": "5521999999999",
                "isGroup": true,
                "path": "<path_file>"
              }
            }
          }
        }
      }
    }
   */
  const { phone, path } = req.body;

  if (!path && !req.file)
  return res.status(401).send({
    message: 'Sending the file is mandatory'
  });

  const pathFile = path || req.file?.path;

  try {
    const results = [];
    for (const contato of phone) {
      results.push(await req.client.sendImageAsSticker(contato, pathFile));
    }

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    if (req.file) await (0, _functions.unlinkAsync)(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}
async function sendImageAsStickerGif(req, res) {
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
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              phone: { type: 'string' },
              isGroup: { type: 'boolean' },
              path: { type: 'string' },
            },
            required: ['phone', 'path'],
          },
          examples: {
            'Default': {
              value: {
                phone: '5521999999999',
                isGroup: true,
                path: '<path_file>',
              },
            },
          },
        },
      },
    }
   */
  const { phone, path } = req.body;

  if (!path && !req.file)
  return res.status(401).send({
    message: 'Sending the file is mandatory'
  });

  const pathFile = path || req.file?.path;

  try {
    const results = [];
    for (const contato of phone) {
      results.push(await req.client.sendImageAsStickerGif(contato, pathFile));
    }

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    if (req.file) await (0, _functions.unlinkAsync)(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnVuY3Rpb25zIiwicmVxdWlyZSIsInJldHVybkVycm9yIiwicmVxIiwicmVzIiwiZXJyb3IiLCJsb2dnZXIiLCJzdGF0dXMiLCJqc29uIiwibWVzc2FnZSIsInJldHVyblN1Y2VzcyIsImRhdGEiLCJyZXNwb25zZSIsIm1hcHBlciIsInNlbmRNZXNzYWdlIiwicGhvbmUiLCJib2R5Iiwib3B0aW9ucyIsInJlc3VsdHMiLCJjb250YXRvIiwicHVzaCIsImNsaWVudCIsInNlbmRUZXh0IiwibGVuZ3RoIiwiaW8iLCJlbWl0IiwiZWRpdE1lc3NhZ2UiLCJpZCIsIm5ld1RleHQiLCJlZGl0ZWQiLCJzZW5kRmlsZSIsInBhdGgiLCJiYXNlNjQiLCJmaWxlbmFtZSIsImNhcHRpb24iLCJxdW90ZWRNZXNzYWdlSWQiLCJmaWxlIiwic2VuZCIsInBhdGhGaWxlIiwibXNnIiwiY29udGFjdCIsInF1b3RlZE1zZyIsInVubGlua0FzeW5jIiwic2VuZFZvaWNlIiwic2VuZFB0dCIsInNlbmRWb2ljZTY0IiwiYmFzZTY0UHR0Iiwic2VuZFB0dEZyb21CYXNlNjQiLCJzZW5kTGlua1ByZXZpZXciLCJ1cmwiLCJzZW5kTG9jYXRpb24iLCJsYXQiLCJsbmciLCJ0aXRsZSIsImFkZHJlc3MiLCJuYW1lIiwic2VuZEJ1dHRvbnMiLCJzZW5kTGlzdE1lc3NhZ2UiLCJkZXNjcmlwdGlvbiIsInNlY3Rpb25zIiwiYnV0dG9uVGV4dCIsInNlbmRPcmRlck1lc3NhZ2UiLCJpdGVtcyIsInNlbmRQb2xsTWVzc2FnZSIsImNob2ljZXMiLCJzZW5kU3RhdHVzVGV4dCIsInJlcGx5TWVzc2FnZSIsIm1lc3NhZ2VJZCIsInJlcGx5IiwidG8iLCJzZW5kTWVudGlvbmVkIiwibWVudGlvbmVkIiwic2VuZEltYWdlQXNTdGlja2VyIiwic2VuZEltYWdlQXNTdGlja2VyR2lmIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXIvbWVzc2FnZUNvbnRyb2xsZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDIxIFdQUENvbm5lY3QgVGVhbVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuXG5pbXBvcnQgeyB1bmxpbmtBc3luYyB9IGZyb20gJy4uL3V0aWwvZnVuY3Rpb25zJztcblxuZnVuY3Rpb24gcmV0dXJuRXJyb3IocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBlcnJvcjogYW55KSB7XG4gIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgc3RhdHVzOiAnRXJyb3InLFxuICAgIG1lc3NhZ2U6ICdFcnJvIGFvIGVudmlhciBhIG1lbnNhZ2VtLicsXG4gICAgZXJyb3I6IGVycm9yLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmV0dXJuU3VjZXNzKHJlczogYW55LCBkYXRhOiBhbnkpIHtcbiAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IGRhdGEsIG1hcHBlcjogJ3JldHVybicgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kTWVzc2FnZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgICBpc05ld3NsZXR0ZXI6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsgdHlwZTogXCJvYmplY3RcIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiU2VuZCBtZXNzYWdlIHRvIGNvbnRhY3RcIjoge1xuICAgICAgICAgICAgICB2YWx1ZTogeyBcbiAgICAgICAgICAgICAgICBwaG9uZTogJzU1MjE5OTk5OTk5OTknLFxuICAgICAgICAgICAgICAgIGlzR3JvdXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzTmV3c2xldHRlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ0hpIGZyb20gV1BQQ29ubmVjdCcsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIlNlbmQgbWVzc2FnZSB0byBncm91cFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGhvbmU6ICc4ODY1NjIzMjE1MjQ0NTc4JyxcbiAgICAgICAgICAgICAgICBpc0dyb3VwOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdIaSBmcm9tIFdQUENvbm5lY3QnLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCBtZXNzYWdlIH0gPSByZXEuYm9keTtcblxuICBjb25zdCBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucyB8fCB7fTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IFtdO1xuICAgIGZvciAoY29uc3QgY29udGF0byBvZiBwaG9uZSkge1xuICAgICAgcmVzdWx0cy5wdXNoKGF3YWl0IHJlcS5jbGllbnQuc2VuZFRleHQoY29udGF0bywgbWVzc2FnZSwgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbignRXJyb3Igc2VuZGluZyBtZXNzYWdlJyk7XG4gICAgcmVxLmlvLmVtaXQoJ21lbnNhZ2VtLWVudmlhZGEnLCByZXN1bHRzKTtcbiAgICByZXR1cm5TdWNlc3MocmVzLCByZXN1bHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm5FcnJvcihyZXEsIHJlcywgZXJyb3IpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0TWVzc2FnZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGlkOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgbmV3VGV4dDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsgdHlwZTogXCJvYmplY3RcIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRWRpdCBhIG1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgICB2YWx1ZTogeyBcbiAgICAgICAgICAgICAgICBpZDogJ3RydWVfNTUyMTk5OTk5OTk5OUBjLnVzXzNFQjA0RkNBQTE1MjdFQjZEOURFQzgnLFxuICAgICAgICAgICAgICAgIG5ld1RleHQ6ICdOZXcgdGV4dCBmb3IgbWVzc2FnZSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBpZCwgbmV3VGV4dCB9ID0gcmVxLmJvZHk7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnMgfHwge307XG4gIHRyeSB7XG4gICAgY29uc3QgZWRpdGVkID0gYXdhaXQgKHJlcS5jbGllbnQgYXMgYW55KS5lZGl0TWVzc2FnZShpZCwgbmV3VGV4dCwgb3B0aW9ucyk7XG5cbiAgICByZXEuaW8uZW1pdCgnZWRpdGVkLW1lc3NhZ2UnLCBlZGl0ZWQpO1xuICAgIHJldHVyblN1Y2VzcyhyZXMsIGVkaXRlZCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuRXJyb3IocmVxLCByZXMsIGVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZEZpbGUocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiTWVzc2FnZXNcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwicGhvbmVcIjogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiaXNHcm91cFwiOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiaXNOZXdzbGV0dGVyXCI6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJmaWxlbmFtZVwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJjYXB0aW9uXCI6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICBcImJhc2U2NFwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInBob25lXCI6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0dyb3VwXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpc05ld3NsZXR0ZXJcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZpbGVuYW1lXCI6IFwiZmlsZSBuYW1lIGxvbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjYXB0aW9uXCI6IFwiY2FwdGlvbiBmb3IgbXkgZmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiYXNlNjRcIjogXCI8YmFzZTY0PiBzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3Qge1xuICAgIHBob25lLFxuICAgIHBhdGgsXG4gICAgYmFzZTY0LFxuICAgIGZpbGVuYW1lID0gJ2ZpbGUnLFxuICAgIG1lc3NhZ2UsXG4gICAgY2FwdGlvbixcbiAgICBxdW90ZWRNZXNzYWdlSWQsXG4gIH0gPSByZXEuYm9keTtcblxuICBjb25zdCBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucyB8fCB7fTtcblxuICBpZiAoIXBhdGggJiYgIXJlcS5maWxlICYmICFiYXNlNjQpXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgIG1lc3NhZ2U6ICdTZW5kaW5nIHRoZSBmaWxlIGlzIG1hbmRhdG9yeScsXG4gICAgfSk7XG5cbiAgY29uc3QgcGF0aEZpbGUgPSBwYXRoIHx8IGJhc2U2NCB8fCByZXEuZmlsZT8ucGF0aDtcbiAgY29uc3QgbXNnID0gbWVzc2FnZSB8fCBjYXB0aW9uO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gW107XG4gICAgZm9yIChjb25zdCBjb250YWN0IG9mIHBob25lKSB7XG4gICAgICByZXN1bHRzLnB1c2goXG4gICAgICAgIGF3YWl0IHJlcS5jbGllbnQuc2VuZEZpbGUoY29udGFjdCwgcGF0aEZpbGUsIHtcbiAgICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWUsXG4gICAgICAgICAgY2FwdGlvbjogbXNnLFxuICAgICAgICAgIHF1b3RlZE1zZzogcXVvdGVkTWVzc2FnZUlkLFxuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbignRXJyb3Igc2VuZGluZyBtZXNzYWdlJyk7XG4gICAgaWYgKHJlcS5maWxlKSBhd2FpdCB1bmxpbmtBc3luYyhwYXRoRmlsZSk7XG4gICAgcmV0dXJuU3VjZXNzKHJlcywgcmVzdWx0cyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuRXJyb3IocmVxLCByZXMsIGVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFZvaWNlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInBob25lXCI6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0dyb3VwXCI6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGF0aFwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicXVvdGVkTWVzc2FnZUlkXCI6IHsgdHlwZTogXCJzdHJpbmdcIiB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGhvbmVcIjogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0dyb3VwXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGF0aFwiOiBcIjxwYXRoX2ZpbGU+XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdW90ZWRNZXNzYWdlSWRcIjogXCJtZXNzYWdlIElkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHtcbiAgICBwaG9uZSxcbiAgICBwYXRoLFxuICAgIGZpbGVuYW1lID0gJ1ZvaWNlIEF1ZGlvJyxcbiAgICBtZXNzYWdlLFxuICAgIHF1b3RlZE1lc3NhZ2VJZCxcbiAgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gW107XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIHBob25lKSB7XG4gICAgICByZXN1bHRzLnB1c2goXG4gICAgICAgIGF3YWl0IHJlcS5jbGllbnQuc2VuZFB0dChcbiAgICAgICAgICBjb250YXRvLFxuICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICBxdW90ZWRNZXNzYWdlSWRcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oJ0Vycm9yIHNlbmRpbmcgbWVzc2FnZScpO1xuICAgIHJldHVyblN1Y2VzcyhyZXMsIHJlc3VsdHMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybkVycm9yKHJlcSwgcmVzLCBlcnJvcik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRWb2ljZTY0KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInBob25lXCI6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0dyb3VwXCI6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFzZTY0UHR0XCI6IHsgdHlwZTogXCJzdHJpbmdcIiB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGhvbmVcIjogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0dyb3VwXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFzZTY0UHR0XCI6IFwiPGJhc2U2NF9zdHJpbmc+XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUsIGJhc2U2NFB0dCwgcXVvdGVkTWVzc2FnZUlkIH0gPSByZXEuYm9keTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IFtdO1xuICAgIGZvciAoY29uc3QgY29udGF0byBvZiBwaG9uZSkge1xuICAgICAgcmVzdWx0cy5wdXNoKFxuICAgICAgICBhd2FpdCByZXEuY2xpZW50LnNlbmRQdHRGcm9tQmFzZTY0KFxuICAgICAgICAgIGNvbnRhdG8sXG4gICAgICAgICAgYmFzZTY0UHR0LFxuICAgICAgICAgICdWb2ljZSBBdWRpbycsXG4gICAgICAgICAgJycsXG4gICAgICAgICAgcXVvdGVkTWVzc2FnZUlkXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKCdFcnJvciBzZW5kaW5nIG1lc3NhZ2UnKTtcbiAgICByZXR1cm5TdWNlc3MocmVzLCByZXN1bHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm5FcnJvcihyZXEsIHJlcywgZXJyb3IpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kTGlua1ByZXZpZXcocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiTWVzc2FnZXNcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGhvbmVcIjogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlzR3JvdXBcIjogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNhcHRpb25cIjogeyB0eXBlOiBcInN0cmluZ1wiIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwaG9uZVwiOiBcIjU1MjE5OTk5OTk5OTlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzR3JvdXBcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJodHRwOi8vd3d3LmxpbmsuY29tXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjYXB0aW9uXCI6IFwiVGV4dCBmb3IgZGVzY3JpYmUgbGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCB1cmwsIGNhcHRpb24gfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gW107XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIHBob25lKSB7XG4gICAgICByZXN1bHRzLnB1c2goXG4gICAgICAgIGF3YWl0IHJlcS5jbGllbnQuc2VuZExpbmtQcmV2aWV3KGAke2NvbnRhdG99YCwgdXJsLCBjYXB0aW9uKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oJ0Vycm9yIHNlbmRpbmcgbWVzc2FnZScpO1xuICAgIHJldHVyblN1Y2VzcyhyZXMsIHJlc3VsdHMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybkVycm9yKHJlcSwgcmVzLCBlcnJvcik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRMb2NhdGlvbihyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwaG9uZVwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNHcm91cFwiOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhdFwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibG5nXCI6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWRkcmVzc1wiOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBob25lXCI6IFwiNTUyMTk5OTk5OTk5OVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNHcm91cFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxhdFwiOiBcIi04OTg5ODMyMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibG5nXCI6IFwiLTU0NTQ1NFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJSaW8gZGUgSmFuZWlyb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWRkcmVzc1wiOiBcIkF2LiBOLiBTLiBkZSBDb3BhY2FiYW5hLCAyNSwgQ29wYWNhYmFuYVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCBsYXQsIGxuZywgdGl0bGUsIGFkZHJlc3MgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gW107XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIHBob25lKSB7XG4gICAgICByZXN1bHRzLnB1c2goXG4gICAgICAgIGF3YWl0IHJlcS5jbGllbnQuc2VuZExvY2F0aW9uKGNvbnRhdG8sIHtcbiAgICAgICAgICBsYXQ6IGxhdCxcbiAgICAgICAgICBsbmc6IGxuZyxcbiAgICAgICAgICBhZGRyZXNzOiBhZGRyZXNzLFxuICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oJ0Vycm9yIHNlbmRpbmcgbWVzc2FnZScpO1xuICAgIHJldHVyblN1Y2VzcyhyZXMsIHJlc3VsdHMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybkVycm9yKHJlcSwgcmVzLCBlcnJvcik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRCdXR0b25zKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJyxcbiAgICAgfVxuICAgICAjc3dhZ2dlci5kZXByZWNhdGVkPXRydWVcbiAgICovXG4gIGNvbnN0IHsgcGhvbmUsIG1lc3NhZ2UsIG9wdGlvbnMgfSA9IHJlcS5ib2R5O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGNvbnRhY3Qgb2YgcGhvbmUpIHtcbiAgICAgIHJlc3VsdHMucHVzaChhd2FpdCByZXEuY2xpZW50LnNlbmRUZXh0KGNvbnRhY3QsIG1lc3NhZ2UsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gcmV0dXJuRXJyb3IocmVxLCByZXMsICdFcnJvciBzZW5kaW5nIG1lc3NhZ2Ugd2l0aCBidXR0b25zJyk7XG5cbiAgICByZXR1cm5TdWNlc3MocmVzLCBwaG9uZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuRXJyb3IocmVxLCByZXMsIGVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZExpc3RNZXNzYWdlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJyxcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwaG9uZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIGlzR3JvdXA6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBzZWN0aW9uczogeyB0eXBlOiBcImFycmF5XCIgfSxcbiAgICAgICAgICAgICAgYnV0dG9uVGV4dDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgXCJTZW5kIGxpc3QgbWVzc2FnZVwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7IFxuICAgICAgICAgICAgICAgIHBob25lOiAnNTUyMTk5OTk5OTk5OScsXG4gICAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEZXNjIGZvciBsaXN0JyxcbiAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnU2VsZWN0IGEgb3B0aW9uJyxcbiAgICAgICAgICAgICAgICBzZWN0aW9uczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NlY3Rpb24gMScsXG4gICAgICAgICAgICAgICAgICAgIHJvd3M6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dJZDogJ215X2N1c3RvbV9pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Rlc3QgMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uIDEnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93SWQ6ICcyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVGVzdCAyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgfVxuICAgKi9cbiAgY29uc3Qge1xuICAgIHBob25lLFxuICAgIGRlc2NyaXB0aW9uID0gJycsXG4gICAgc2VjdGlvbnMsXG4gICAgYnV0dG9uVGV4dCA9ICdTRUxFQ0lPTkUgVU1BIE9Qw4fDg08nLFxuICB9ID0gcmVxLmJvZHk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBbXTtcblxuICAgIGZvciAoY29uc3QgY29udGFjdCBvZiBwaG9uZSkge1xuICAgICAgcmVzdWx0cy5wdXNoKFxuICAgICAgICBhd2FpdCByZXEuY2xpZW50LnNlbmRMaXN0TWVzc2FnZShjb250YWN0LCB7XG4gICAgICAgICAgYnV0dG9uVGV4dDogYnV0dG9uVGV4dCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgICAgICAgc2VjdGlvbnM6IHNlY3Rpb25zLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gcmV0dXJuRXJyb3IocmVxLCByZXMsICdFcnJvciBzZW5kaW5nIGxpc3QgYnV0dG9ucycpO1xuXG4gICAgcmV0dXJuU3VjZXNzKHJlcywgcmVzdWx0cyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuRXJyb3IocmVxLCByZXMsIGVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZE9yZGVyTWVzc2FnZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgaXNHcm91cDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgICBpdGVtczogeyB0eXBlOiBcIm9iamVjdFwiIH0sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsgdHlwZTogXCJvYmplY3RcIiB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiU2VuZCB3aXRoIGN1c3RvbSBpdGVtc1wiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7IFxuICAgICAgICAgICAgICAgIHBob25lOiAnNTUyMTk5OTk5OTk5OScsXG4gICAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2N1c3RvbScsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdJdGVtIHRlc3QnLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogMTIwMDAwLFxuICAgICAgICAgICAgICAgICAgICBxbnQ6IDIsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0l0ZW0gdGVzdCAyJyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IDE0NTAwMCxcbiAgICAgICAgICAgICAgICAgICAgcW50OiAyLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJTZW5kIHdpdGggcHJvZHVjdCBpdGVtc1wiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7IFxuICAgICAgICAgICAgICAgIHBob25lOiAnNTUyMTk5OTk5OTk5OScsXG4gICAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Byb2R1Y3QnLFxuICAgICAgICAgICAgICAgICAgICBpZDogJzM3ODc4Nzc0NDU3JyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IDE0ODAwMCxcbiAgICAgICAgICAgICAgICAgICAgcW50OiAyLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJTZW5kIHdpdGggY3VzdG9tIGl0ZW1zIGFuZCBvcHRpb25zXCI6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHsgXG4gICAgICAgICAgICAgICAgcGhvbmU6ICc1NTIxOTk5OTk5OTk5JyxcbiAgICAgICAgICAgICAgICBpc0dyb3VwOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0l0ZW0gdGVzdCcsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiAxMjAwMDAsXG4gICAgICAgICAgICAgICAgICAgIHFudDogMixcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICB0YXg6IDEwMDAwLFxuICAgICAgICAgICAgICAgICAgc2hpcHBpbmc6IDQwMDAsXG4gICAgICAgICAgICAgICAgICBkaXNjb3VudDogMTAwMDAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCBpdGVtcyB9ID0gcmVxLmJvZHk7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnMgfHwge307XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNvbnRhdG8gb2YgcGhvbmUpIHtcbiAgICAgIHJlc3VsdHMucHVzaChhd2FpdCByZXEuY2xpZW50LnNlbmRPcmRlck1lc3NhZ2UoY29udGF0bywgaXRlbXMsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oJ0Vycm9yIHNlbmRpbmcgb3JkZXIgbWVzc2FnZScpO1xuICAgIHJlcS5pby5lbWl0KCdtZW5zYWdlbS1lbnZpYWRhJywgcmVzdWx0cyk7XG4gICAgcmV0dXJuU3VjZXNzKHJlcywgcmVzdWx0cyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuRXJyb3IocmVxLCByZXMsIGVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFBvbGxNZXNzYWdlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBob25lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzR3JvdXA6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hvaWNlczogeyB0eXBlOiBcImFycmF5XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHsgdHlwZTogXCJvYmplY3RcIiB9LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmU6ICc1NTIxOTk5OTk5OTk5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdQb2xsIG5hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2VzOiBbJ09wdGlvbiAxJywgJ09wdGlvbiAyJywgJ09wdGlvbiAzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RhYmxlQ291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCBuYW1lLCBjaG9pY2VzLCBvcHRpb25zIH0gPSByZXEuYm9keTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBjb250YWN0IG9mIHBob25lKSB7XG4gICAgICByZXN1bHRzLnB1c2goXG4gICAgICAgIGF3YWl0IHJlcS5jbGllbnQuc2VuZFBvbGxNZXNzYWdlKGNvbnRhY3QsIG5hbWUsIGNob2ljZXMsIG9wdGlvbnMpXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiByZXR1cm5FcnJvcihyZXEsIHJlcywgJ0Vycm9yIHNlbmRpbmcgcG9sbCBtZXNzYWdlJyk7XG5cbiAgICByZXR1cm5TdWNlc3MocmVzLCByZXN1bHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm5FcnJvcihyZXEsIHJlcywgZXJyb3IpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kU3RhdHVzVGV4dChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgY29udGVudDoge1xuICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwaG9uZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICBpc0dyb3VwOiB7IHR5cGU6ICdib29sZWFuJyB9LFxuICAgICAgICAgICAgICBtZXNzYWdlOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogeyB0eXBlOiAnc3RyaW5nJyB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFsncGhvbmUnLCAnaXNHcm91cCcsICdtZXNzYWdlJ11cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBEZWZhdWx0OiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGhvbmU6ICc1NTIxOTk5OTk5OTk5JyxcbiAgICAgICAgICAgICAgICBpc0dyb3VwOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnUmVwbHkgdG8gbWVzc2FnZScsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAnPGlkX21lc3NhZ2U+J1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBtZXNzYWdlIH0gPSByZXEuYm9keTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IFtdO1xuICAgIHJlc3VsdHMucHVzaChhd2FpdCByZXEuY2xpZW50LnNlbmRUZXh0KCdzdGF0dXNAYnJvYWRjYXN0JywgbWVzc2FnZSkpO1xuXG4gICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKCdFcnJvciBzZW5kaW5nIG1lc3NhZ2UnKTtcbiAgICByZXR1cm5TdWNlc3MocmVzLCByZXN1bHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm5FcnJvcihyZXEsIHJlcywgZXJyb3IpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXBseU1lc3NhZ2UocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiTWVzc2FnZXNcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgXCJwaG9uZVwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgXCJpc0dyb3VwXCI6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBcIm1lc3NhZ2VJZFwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgXCJwaG9uZVwiOiBcIjU1MjE5OTk5OTk5OTlcIixcbiAgICAgICAgICAgICAgICBcImlzR3JvdXBcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwiUmVwbHkgdG8gbWVzc2FnZVwiLFxuICAgICAgICAgICAgICAgIFwibWVzc2FnZUlkXCI6IFwiPGlkX21lc3NhZ2U+XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUsIG1lc3NhZ2UsIG1lc3NhZ2VJZCB9ID0gcmVxLmJvZHk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNvbnRhdG8gb2YgcGhvbmUpIHtcbiAgICAgIHJlc3VsdHMucHVzaChhd2FpdCByZXEuY2xpZW50LnJlcGx5KGNvbnRhdG8sIG1lc3NhZ2UsIG1lc3NhZ2VJZCkpO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbignRXJyb3Igc2VuZGluZyBtZXNzYWdlJyk7XG4gICAgcmVxLmlvLmVtaXQoJ21lbnNhZ2VtLWVudmlhZGEnLCB7IG1lc3NhZ2U6IG1lc3NhZ2UsIHRvOiBwaG9uZSB9KTtcbiAgICByZXR1cm5TdWNlc3MocmVzLCByZXN1bHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm5FcnJvcihyZXEsIHJlcywgZXJyb3IpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kTWVudGlvbmVkKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICByZXF1aXJlZDogdHJ1ZSxcbiAgXCJAY29udGVudFwiOiB7XG4gICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgXCJwaG9uZVwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICBcImlzR3JvdXBcIjogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgIFwibWVzc2FnZVwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICBcIm1lbnRpb25lZFwiOiB7IHR5cGU6IFwiYXJyYXlcIiwgaXRlbXM6IHsgdHlwZTogXCJzdHJpbmdcIiB9IH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZWQ6IFtcInBob25lXCIsIFwibWVzc2FnZVwiLCBcIm1lbnRpb25lZFwiXVxuICAgICAgfSxcbiAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIFwicGhvbmVcIjogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICBcImlzR3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIllvdXIgdGV4dCBtZXNzYWdlXCIsXG4gICAgICAgICAgICBcIm1lbnRpb25lZFwiOiBbXCJANTU2NTkzMDc3MTcxQGMudXNcIl1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUsIG1lc3NhZ2UsIG1lbnRpb25lZCB9ID0gcmVxLmJvZHk7XG5cbiAgdHJ5IHtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgZm9yIChjb25zdCBjb250YXRvIG9mIHBob25lKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHJlcS5jbGllbnQuc2VuZE1lbnRpb25lZChcbiAgICAgICAgYCR7Y29udGF0b31gLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBtZW50aW9uZWRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIHNlbmQgbWVzc2FnZSBtZW50aW9uZWQnLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZEltYWdlQXNTdGlja2VyKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIFwicGhvbmVcIjogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIFwiaXNHcm91cFwiOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICAgIFwicGF0aFwiOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbXCJwaG9uZVwiLCBcInBhdGhcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIFwicGhvbmVcIjogXCI1NTIxOTk5OTk5OTk5XCIsXG4gICAgICAgICAgICAgICAgXCJpc0dyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJwYXRoXCI6IFwiPHBhdGhfZmlsZT5cIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBwaG9uZSwgcGF0aCB9ID0gcmVxLmJvZHk7XG5cbiAgaWYgKCFwYXRoICYmICFyZXEuZmlsZSlcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xuICAgICAgbWVzc2FnZTogJ1NlbmRpbmcgdGhlIGZpbGUgaXMgbWFuZGF0b3J5JyxcbiAgICB9KTtcblxuICBjb25zdCBwYXRoRmlsZSA9IHBhdGggfHwgcmVxLmZpbGU/LnBhdGg7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNvbnRhdG8gb2YgcGhvbmUpIHtcbiAgICAgIHJlc3VsdHMucHVzaChhd2FpdCByZXEuY2xpZW50LnNlbmRJbWFnZUFzU3RpY2tlcihjb250YXRvLCBwYXRoRmlsZSkpO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbignRXJyb3Igc2VuZGluZyBtZXNzYWdlJyk7XG4gICAgaWYgKHJlcS5maWxlKSBhd2FpdCB1bmxpbmtBc3luYyhwYXRoRmlsZSk7XG4gICAgcmV0dXJuU3VjZXNzKHJlcywgcmVzdWx0cyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuRXJyb3IocmVxLCByZXMsIGVycm9yKTtcbiAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRJbWFnZUFzU3RpY2tlckdpZihyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNZXNzYWdlc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgY29udGVudDoge1xuICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwaG9uZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICBpc0dyb3VwOiB7IHR5cGU6ICdib29sZWFuJyB9LFxuICAgICAgICAgICAgICBwYXRoOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFsncGhvbmUnLCAncGF0aCddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgICdEZWZhdWx0Jzoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIHBob25lOiAnNTUyMTk5OTk5OTk5OScsXG4gICAgICAgICAgICAgICAgaXNHcm91cDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwYXRoOiAnPHBhdGhfZmlsZT4nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG4gICAqL1xuICBjb25zdCB7IHBob25lLCBwYXRoIH0gPSByZXEuYm9keTtcblxuICBpZiAoIXBhdGggJiYgIXJlcS5maWxlKVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOiAnU2VuZGluZyB0aGUgZmlsZSBpcyBtYW5kYXRvcnknLFxuICAgIH0pO1xuXG4gIGNvbnN0IHBhdGhGaWxlID0gcGF0aCB8fCByZXEuZmlsZT8ucGF0aDtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdHM6IGFueSA9IFtdO1xuICAgIGZvciAoY29uc3QgY29udGF0byBvZiBwaG9uZSkge1xuICAgICAgcmVzdWx0cy5wdXNoKGF3YWl0IHJlcS5jbGllbnQuc2VuZEltYWdlQXNTdGlja2VyR2lmKGNvbnRhdG8sIHBhdGhGaWxlKSk7XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKCdFcnJvciBzZW5kaW5nIG1lc3NhZ2UnKTtcbiAgICBpZiAocmVxLmZpbGUpIGF3YWl0IHVubGlua0FzeW5jKHBhdGhGaWxlKTtcbiAgICByZXR1cm5TdWNlc3MocmVzLCByZXN1bHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm5FcnJvcihyZXEsIHJlcywgZXJyb3IpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxJQUFBQSxVQUFBLEdBQUFDLE9BQUEsc0JBQWdELENBbEJoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FNQSxTQUFTQyxXQUFXQSxDQUFDQyxHQUFZLEVBQUVDLEdBQWEsRUFBRUMsS0FBVSxFQUFFLENBQzVERixHQUFHLENBQUNHLE1BQU0sQ0FBQ0QsS0FBSyxDQUFDQSxLQUFLLENBQUMsQ0FDdkJELEdBQUcsQ0FBQ0csTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUMsRUFDbkJELE1BQU0sRUFBRSxPQUFPLEVBQ2ZFLE9BQU8sRUFBRSw0QkFBNEIsRUFDckNKLEtBQUssRUFBRUEsS0FBSyxDQUNkLENBQUMsQ0FBQyxDQUNKLENBRUEsZUFBZUssWUFBWUEsQ0FBQ04sR0FBUSxFQUFFTyxJQUFTLEVBQUUsQ0FDL0NQLEdBQUcsQ0FBQ0csTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUMsRUFBRUQsTUFBTSxFQUFFLFNBQVMsRUFBRUssUUFBUSxFQUFFRCxJQUFJLEVBQUVFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQy9FO0FBRU8sZUFBZUMsV0FBV0EsQ0FBQ1gsR0FBWSxFQUFFQyxHQUFhLEVBQUU7RUFDN0Q7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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