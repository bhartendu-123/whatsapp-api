"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.checkConnectionSession = checkConnectionSession;exports.closeSession = closeSession;exports.download = download;exports.downloadMediaByMessage = downloadMediaByMessage;exports.editBusinessProfile = editBusinessProfile;exports.getMediaByMessage = getMediaByMessage;exports.getQrCode = getQrCode;exports.getSessionState = getSessionState;exports.killServiceWorker = killServiceWorker;exports.logOutSession = logOutSession;exports.restartService = restartService;exports.showAllSessions = showAllSessions;exports.startAllSessions = startAllSessions;exports.startSession = startSession;exports.subscribePresence = subscribePresence;
















var _fs = _interopRequireDefault(require("fs"));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _qrcode = _interopRequireDefault(require("qrcode"));


var _package = require("../../package.json");
var _config = _interopRequireDefault(require("../config"));
var _createSessionUtil = _interopRequireDefault(require("../util/createSessionUtil"));
var _functions = require("../util/functions");
var _getAllTokens = _interopRequireDefault(require("../util/getAllTokens"));
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
 * See the License for the specific language governing permclearSessionissions and
 * limitations under the License.
 */const SessionUtil = new _createSessionUtil.default();async function downloadFileFunction(message, client, logger) {try {const buffer = await client.decryptFile(message);const filename = `./WhatsAppImages/file${message.t}`;if (!_fs.default.existsSync(filename)) {let result = '';
      if (message.type === 'ptt') {
        result = `${filename}.oga`;
      } else {
        result = `${filename}.${_mimeTypes.default.extension(message.mimetype)}`;
      }

      await _fs.default.writeFile(result, buffer, (err) => {
        if (err) {
          logger.error(err);
        }
      });

      return result;
    } else {
      return `${filename}.${_mimeTypes.default.extension(message.mimetype)}`;
    }
  } catch (e) {
    logger.error(e);
    logger.warn(
      'Erro ao descriptografar a midia, tentando fazer o download direto...'
    );
    try {
      const buffer = await client.downloadMedia(message);
      const filename = `./WhatsAppImages/file${message.t}`;
      if (!_fs.default.existsSync(filename)) {
        let result = '';
        if (message.type === 'ptt') {
          result = `${filename}.oga`;
        } else {
          result = `${filename}.${_mimeTypes.default.extension(message.mimetype)}`;
        }

        await _fs.default.writeFile(result, buffer, (err) => {
          if (err) {
            logger.error(err);
          }
        });

        return result;
      } else {
        return `${filename}.${_mimeTypes.default.extension(message.mimetype)}`;
      }
    } catch (e) {
      logger.error(e);
      logger.warn('Não foi possível baixar a mídia...');
    }
  }
}

async function download(message, client, logger) {
  try {
    const path = await downloadFileFunction(message, client, logger);
    return path?.replace('./', '');
  } catch (e) {
    logger.error(e);
  }
}

async function startAllSessions(req, res) {
  /**
   * #swagger.tags = ["Auth"]
     #swagger.autoBody=false
     #swagger.operationId = 'startAllSessions'
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["secretkey"] = {
      schema: 'THISISMYSECURECODE'
     }
   */
  const { secretkey } = req.params;
  const { authorization: token } = req.headers;

  let tokenDecrypt = '';

  if (secretkey === undefined) {
    tokenDecrypt = token.split(' ')[0];
  } else {
    tokenDecrypt = secretkey;
  }

  const allSessions = await (0, _getAllTokens.default)(req);

  if (tokenDecrypt !== req.serverOptions.secretKey) {
    return res.status(400).json({
      response: 'error',
      message: 'The token is incorrect'
    });
  }

  allSessions.map(async (session) => {
    const util = new _createSessionUtil.default();
    await util.opendata(req, session);
  });

  return await res.
  status(201).
  json({ status: 'success', message: 'Starting all sessions' });
}

async function showAllSessions(req, res) {
  /**
   * #swagger.tags = ["Auth"]
     #swagger.autoBody=false
     #swagger.operationId = 'showAllSessions'
     #swagger.autoQuery=false
     #swagger.autoHeaders=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["secretkey"] = {
      schema: 'THISISMYSECURETOKEN'
     }
   */
  const { secretkey } = req.params;
  const { authorization: token } = req.headers;

  let tokenDecrypt = '';

  if (secretkey === undefined) {
    tokenDecrypt = token?.split(' ')[0];
  } else {
    tokenDecrypt = secretkey;
  }

  const arr = [];

  if (tokenDecrypt !== req.serverOptions.secretKey) {
    return res.status(400).json({
      response: false,
      message: 'The token is incorrect'
    });
  }

  Object.keys(_sessionUtil.clientsArray).forEach((item) => {
    arr.push({ session: item });
  });

  return res.status(200).json({ response: await (0, _getAllTokens.default)(req) });
}

async function startSession(req, res) {
  /**
   * #swagger.tags = ["Auth"]
     #swagger.autoBody=false
     #swagger.operationId = 'startSession'
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
              webhook: { type: "string" },
              waitQrCode: { type: "boolean" },
            }
          },
          example: {
            webhook: "",
            waitQrCode: false,
          }
        }
      }
     }
   */
  const session = req.session;
  const { waitQrCode = false } = req.body;

  await getSessionState(req, res);
  await SessionUtil.opendata(req, session, waitQrCode ? res : null);
}

async function closeSession(req, res) {
  /**
   * #swagger.tags = ["Auth"]
     #swagger.operationId = 'closeSession'
     #swagger.autoBody=true
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  const session = req.session;
  try {
    if (_sessionUtil.clientsArray[session].status === null) {
      return await res.
      status(200).
      json({ status: true, message: 'Session successfully closed' });
    } else {
      _sessionUtil.clientsArray[session] = { status: null };

      await req.client.close();
      req.io.emit('whatsapp-status', false);
      (0, _functions.callWebHook)(req.client, req, 'closesession', {
        message: `Session: ${session} disconnected`,
        connected: false
      });

      return await res.
      status(200).
      json({ status: true, message: 'Session successfully closed' });
    }
  } catch (error) {
    req.logger.error(error);
    return await res.
    status(500).
    json({ status: false, message: 'Error closing session', error });
  }
}

async function logOutSession(req, res) {
  /**
   * #swagger.tags = ["Auth"]
     #swagger.operationId = 'logoutSession'
   * #swagger.description = 'This route logout and delete session data'
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const session = req.session;
    await req.client.logout();
    (0, _sessionUtil.deleteSessionOnArray)(req.session);

    setTimeout(async () => {
      const pathUserData = _config.default.customUserDataDir + req.session;
      const pathTokens = __dirname + `../../../tokens/${req.session}.data.json`;

      if (_fs.default.existsSync(pathUserData)) {
        await _fs.default.promises.rm(pathUserData, {
          recursive: true,
          maxRetries: 5,
          force: true,
          retryDelay: 1000
        });
      }
      if (_fs.default.existsSync(pathTokens)) {
        await _fs.default.promises.rm(pathTokens, {
          recursive: true,
          maxRetries: 5,
          force: true,
          retryDelay: 1000
        });
      }

      req.io.emit('whatsapp-status', false);
      (0, _functions.callWebHook)(req.client, req, 'logoutsession', {
        message: `Session: ${session} logged out`,
        connected: false
      });

      return await res.
      status(200).
      json({ status: true, message: 'Session successfully closed' });
    }, 500);
    /*try {
      await req.client.close();
    } catch (error) {}*/
  } catch (error) {
    req.logger.error(error);
    return await res.
    status(500).
    json({ status: false, message: 'Error closing session', error });
  }
}

async function checkConnectionSession(req, res) {
  /**
   * #swagger.tags = ["Auth"]
     #swagger.operationId = 'CheckConnectionState'
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    await req.client.isConnected();

    return res.status(200).json({ status: true, message: 'Connected' });
  } catch (error) {
    return res.status(200).json({ status: false, message: 'Disconnected' });
  }
}

async function downloadMediaByMessage(req, res) {
  /**
   * #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.operationId = 'downloadMediabyMessage'
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
            }
          },
          example: {
            messageId: '<messageId>'
          }
        }
      }
     }
   */
  const client = req.client;
  const { messageId } = req.body;

  let message;

  try {
    if (!messageId.isMedia || !messageId.type) {
      message = await client.getMessageById(messageId);
    } else {
      message = messageId;
    }

    if (!message)
    return res.status(400).json({
      status: 'error',
      message: 'Message not found'
    });

    if (!(message['mimetype'] || message.isMedia || message.isMMS))
    return res.status(400).json({
      status: 'error',
      message: 'Message does not contain media'
    });

    const buffer = await client.decryptFile(message);

    return res.
    status(200).
    json({ base64: buffer.toString('base64'), mimetype: message.mimetype });
  } catch (e) {
    req.logger.error(e);
    return res.status(400).json({
      status: 'error',
      message: 'Decrypt file error',
      error: e
    });
  }
}

async function getMediaByMessage(req, res) {
  /**
   * #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.operationId = 'getMediaByMessage'
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["session"] = {
      schema: 'messageId'
     }
   */
  const client = req.client;
  const { messageId } = req.params;

  try {
    const message = await client.getMessageById(messageId);

    if (!message)
    return res.status(400).json({
      status: 'error',
      message: 'Message not found'
    });

    if (!(message['mimetype'] || message.isMedia || message.isMMS))
    return res.status(400).json({
      status: 'error',
      message: 'Message does not contain media'
    });

    const buffer = await client.decryptFile(message);

    return res.
    status(200).
    json({ base64: buffer.toString('base64'), mimetype: message.mimetype });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({
      status: 'error',
      message: 'The session is not active',
      error: ex
    });
  }
}

async function getSessionState(req, res) {
  /**
     #swagger.tags = ["Auth"]
     #swagger.operationId = 'getSessionState'
     #swagger.summary = 'Retrieve status of a session'
     #swagger.autoBody = false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    const { waitQrCode = false } = req.body;
    const client = req.client;
    const qr =
    client?.urlcode != null && client?.urlcode != '' ?
    await _qrcode.default.toDataURL(client.urlcode) :
    null;

    if ((client == null || client.status == null) && !waitQrCode)
    return res.status(200).json({ status: 'CLOSED', qrcode: null });else
    if (client != null)
    return res.status(200).json({
      status: client.status,
      qrcode: qr,
      urlcode: client.urlcode,
      version: _package.version
    });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({
      status: 'error',
      message: 'The session is not active',
      error: ex
    });
  }
}

async function getQrCode(req, res) {
  /**
   * #swagger.tags = ["Auth"]
     #swagger.autoBody=false
     #swagger.operationId = 'getQrCode'
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    if (req?.client?.urlcode) {
      const qr = req.client.urlcode ?
      await _qrcode.default.toDataURL(req.client.urlcode) :
      null;
      const img = Buffer.from(
        qr.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
        'base64'
      );

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      res.end(img);
    } else if (typeof req.client === 'undefined') {
      return res.status(200).json({
        status: null,
        message:
        'Session not started. Please, use the /start-session route, for initialization your session'
      });
    } else {
      return res.status(200).json({
        status: req.client.status,
        message: 'QRCode is not available...'
      });
    }
  } catch (ex) {
    req.logger.error(ex);
    return res.
    status(500).
    json({ status: 'error', message: 'Error retrieving QRCode', error: ex });
  }
}

async function killServiceWorker(req, res) {
  /**
   * #swagger.ignore=true
   * #swagger.tags = ["Messages"]
     #swagger.operationId = 'killServiceWorkier'
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    return res.
    status(200).
    json({ status: 'error', response: 'Not implemented yet' });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({
      status: 'error',
      message: 'The session is not active',
      error: ex
    });
  }
}

async function restartService(req, res) {
  /**
   * #swagger.ignore=true
   * #swagger.tags = ["Messages"]
     #swagger.operationId = 'restartService'
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
   */
  try {
    return res.
    status(200).
    json({ status: 'error', response: 'Not implemented yet' });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({
      status: 'error',
      response: { message: 'The session is not active', error: ex }
    });
  }
}

async function subscribePresence(req, res) {
  /**
   * #swagger.tags = ["Misc"]
     #swagger.operationId = 'subscribePresence'
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
              all: { type: "boolean" },
            }
          },
          example: {
            phone: '5521999999999',
            isGroup: false,
            all: false,
          }
        }
      }
     }
   */
  try {
    const { phone, isGroup = false, all = false } = req.body;

    if (all) {
      let contacts;
      if (isGroup) {
        const groups = await req.client.getAllGroups(false);
        contacts = groups.map((p) => p.id._serialized);
      } else {
        const chats = await req.client.getAllContacts();
        contacts = chats.map((c) => c.id._serialized);
      }
      await req.client.subscribePresence(contacts);
    } else
    for (const contato of (0, _functions.contactToArray)(phone, isGroup)) {
      await req.client.subscribePresence(contato);
    }

    return await res.status(200).json({
      status: 'success',
      response: { message: 'Subscribe presence executed' }
    });
  } catch (error) {
    return await res.status(500).json({
      status: 'error',
      message: 'Error on subscribe presence',
      error: error
    });
  }
}

async function editBusinessProfile(req, res) {
  /**
   * #swagger.tags = ["Profile"]
     #swagger.operationId = 'editBusinessProfile'
   * #swagger.description = 'Edit your bussiness profile'
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
        $adress: 'Av. Nossa Senhora de Copacabana, 315',
        $email: 'test@test.com.br',
        $categories: {
          $id: "133436743388217",
          $localized_display_name: "Artes e entretenimento",
          $not_a_biz: false,
        },
        $website: [
          "https://www.wppconnect.io",
          "https://www.teste2.com.br",
        ],
      }
     }
     
     #swagger.requestBody = {
      required: true,
      "@content": {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              adress: { type: "string" },
              email: { type: "string" },
              categories: { type: "object" },
              websites: { type: "array" },
            }
          },
          example: {
            adress: 'Av. Nossa Senhora de Copacabana, 315',
            email: 'test@test.com.br',
            categories: {
              $id: "133436743388217",
              $localized_display_name: "Artes e entretenimento",
              $not_a_biz: false,
            },
            website: [
              "https://www.wppconnect.io",
              "https://www.teste2.com.br",
            ],
          }
        }
      }
     }
   */
  try {
    return res.status(200).json(await req.client.editBusinessProfile(req.body));
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error on edit business profile',
      error: error
    });
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9taW1lVHlwZXMiLCJfcXJjb2RlIiwiX3BhY2thZ2UiLCJfY29uZmlnIiwiX2NyZWF0ZVNlc3Npb25VdGlsIiwiX2Z1bmN0aW9ucyIsIl9nZXRBbGxUb2tlbnMiLCJfc2Vzc2lvblV0aWwiLCJTZXNzaW9uVXRpbCIsIkNyZWF0ZVNlc3Npb25VdGlsIiwiZG93bmxvYWRGaWxlRnVuY3Rpb24iLCJtZXNzYWdlIiwiY2xpZW50IiwibG9nZ2VyIiwiYnVmZmVyIiwiZGVjcnlwdEZpbGUiLCJmaWxlbmFtZSIsInQiLCJmcyIsImV4aXN0c1N5bmMiLCJyZXN1bHQiLCJ0eXBlIiwibWltZSIsImV4dGVuc2lvbiIsIm1pbWV0eXBlIiwid3JpdGVGaWxlIiwiZXJyIiwiZXJyb3IiLCJlIiwid2FybiIsImRvd25sb2FkTWVkaWEiLCJkb3dubG9hZCIsInBhdGgiLCJyZXBsYWNlIiwic3RhcnRBbGxTZXNzaW9ucyIsInJlcSIsInJlcyIsInNlY3JldGtleSIsInBhcmFtcyIsImF1dGhvcml6YXRpb24iLCJ0b2tlbiIsImhlYWRlcnMiLCJ0b2tlbkRlY3J5cHQiLCJ1bmRlZmluZWQiLCJzcGxpdCIsImFsbFNlc3Npb25zIiwiZ2V0QWxsVG9rZW5zIiwic2VydmVyT3B0aW9ucyIsInNlY3JldEtleSIsInN0YXR1cyIsImpzb24iLCJyZXNwb25zZSIsIm1hcCIsInNlc3Npb24iLCJ1dGlsIiwib3BlbmRhdGEiLCJzaG93QWxsU2Vzc2lvbnMiLCJhcnIiLCJPYmplY3QiLCJrZXlzIiwiY2xpZW50c0FycmF5IiwiZm9yRWFjaCIsIml0ZW0iLCJwdXNoIiwic3RhcnRTZXNzaW9uIiwid2FpdFFyQ29kZSIsImJvZHkiLCJnZXRTZXNzaW9uU3RhdGUiLCJjbG9zZVNlc3Npb24iLCJjbG9zZSIsImlvIiwiZW1pdCIsImNhbGxXZWJIb29rIiwiY29ubmVjdGVkIiwibG9nT3V0U2Vzc2lvbiIsImxvZ291dCIsImRlbGV0ZVNlc3Npb25PbkFycmF5Iiwic2V0VGltZW91dCIsInBhdGhVc2VyRGF0YSIsImNvbmZpZyIsImN1c3RvbVVzZXJEYXRhRGlyIiwicGF0aFRva2VucyIsIl9fZGlybmFtZSIsInByb21pc2VzIiwicm0iLCJyZWN1cnNpdmUiLCJtYXhSZXRyaWVzIiwiZm9yY2UiLCJyZXRyeURlbGF5IiwiY2hlY2tDb25uZWN0aW9uU2Vzc2lvbiIsImlzQ29ubmVjdGVkIiwiZG93bmxvYWRNZWRpYUJ5TWVzc2FnZSIsIm1lc3NhZ2VJZCIsImlzTWVkaWEiLCJnZXRNZXNzYWdlQnlJZCIsImlzTU1TIiwiYmFzZTY0IiwidG9TdHJpbmciLCJnZXRNZWRpYUJ5TWVzc2FnZSIsImV4IiwicXIiLCJ1cmxjb2RlIiwiUVJDb2RlIiwidG9EYXRhVVJMIiwicXJjb2RlIiwidmVyc2lvbiIsImdldFFyQ29kZSIsImltZyIsIkJ1ZmZlciIsImZyb20iLCJ3cml0ZUhlYWQiLCJsZW5ndGgiLCJlbmQiLCJraWxsU2VydmljZVdvcmtlciIsInJlc3RhcnRTZXJ2aWNlIiwic3Vic2NyaWJlUHJlc2VuY2UiLCJwaG9uZSIsImlzR3JvdXAiLCJhbGwiLCJjb250YWN0cyIsImdyb3VwcyIsImdldEFsbEdyb3VwcyIsInAiLCJpZCIsIl9zZXJpYWxpemVkIiwiY2hhdHMiLCJnZXRBbGxDb250YWN0cyIsImMiLCJjb250YXRvIiwiY29udGFjdFRvQXJyYXkiLCJlZGl0QnVzaW5lc3NQcm9maWxlIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXIvc2Vzc2lvbkNvbnRyb2xsZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDIxIFdQUENvbm5lY3QgVGVhbVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWNsZWFyU2Vzc2lvbmlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgTWVzc2FnZSwgV2hhdHNhcHAgfSBmcm9tICdAd3BwY29ubmVjdC10ZWFtL3dwcGNvbm5lY3QnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgbWltZSBmcm9tICdtaW1lLXR5cGVzJztcbmltcG9ydCBRUkNvZGUgZnJvbSAncXJjb2RlJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJ3dpbnN0b24nO1xuXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi4vLi4vcGFja2FnZS5qc29uJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCBDcmVhdGVTZXNzaW9uVXRpbCBmcm9tICcuLi91dGlsL2NyZWF0ZVNlc3Npb25VdGlsJztcbmltcG9ydCB7IGNhbGxXZWJIb29rLCBjb250YWN0VG9BcnJheSB9IGZyb20gJy4uL3V0aWwvZnVuY3Rpb25zJztcbmltcG9ydCBnZXRBbGxUb2tlbnMgZnJvbSAnLi4vdXRpbC9nZXRBbGxUb2tlbnMnO1xuaW1wb3J0IHsgY2xpZW50c0FycmF5LCBkZWxldGVTZXNzaW9uT25BcnJheSB9IGZyb20gJy4uL3V0aWwvc2Vzc2lvblV0aWwnO1xuXG5jb25zdCBTZXNzaW9uVXRpbCA9IG5ldyBDcmVhdGVTZXNzaW9uVXRpbCgpO1xuXG5hc3luYyBmdW5jdGlvbiBkb3dubG9hZEZpbGVGdW5jdGlvbihcbiAgbWVzc2FnZTogTWVzc2FnZSxcbiAgY2xpZW50OiBXaGF0c2FwcCxcbiAgbG9nZ2VyOiBMb2dnZXJcbikge1xuICB0cnkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IGNsaWVudC5kZWNyeXB0RmlsZShtZXNzYWdlKTtcblxuICAgIGNvbnN0IGZpbGVuYW1lID0gYC4vV2hhdHNBcHBJbWFnZXMvZmlsZSR7bWVzc2FnZS50fWA7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVuYW1lKSkge1xuICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3B0dCcpIHtcbiAgICAgICAgcmVzdWx0ID0gYCR7ZmlsZW5hbWV9Lm9nYWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBgJHtmaWxlbmFtZX0uJHttaW1lLmV4dGVuc2lvbihtZXNzYWdlLm1pbWV0eXBlKX1gO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBmcy53cml0ZUZpbGUocmVzdWx0LCBidWZmZXIsIChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2ZpbGVuYW1lfS4ke21pbWUuZXh0ZW5zaW9uKG1lc3NhZ2UubWltZXR5cGUpfWA7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgIGxvZ2dlci53YXJuKFxuICAgICAgJ0Vycm8gYW8gZGVzY3JpcHRvZ3JhZmFyIGEgbWlkaWEsIHRlbnRhbmRvIGZhemVyIG8gZG93bmxvYWQgZGlyZXRvLi4uJ1xuICAgICk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IGNsaWVudC5kb3dubG9hZE1lZGlhKG1lc3NhZ2UpO1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSBgLi9XaGF0c0FwcEltYWdlcy9maWxlJHttZXNzYWdlLnR9YDtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlbmFtZSkpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBpZiAobWVzc2FnZS50eXBlID09PSAncHR0Jykge1xuICAgICAgICAgIHJlc3VsdCA9IGAke2ZpbGVuYW1lfS5vZ2FgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IGAke2ZpbGVuYW1lfS4ke21pbWUuZXh0ZW5zaW9uKG1lc3NhZ2UubWltZXR5cGUpfWA7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBmcy53cml0ZUZpbGUocmVzdWx0LCBidWZmZXIsIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYCR7ZmlsZW5hbWV9LiR7bWltZS5leHRlbnNpb24obWVzc2FnZS5taW1ldHlwZSl9YDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgICBsb2dnZXIud2FybignTsOjbyBmb2kgcG9zc8OtdmVsIGJhaXhhciBhIG3DrWRpYS4uLicpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZG93bmxvYWQobWVzc2FnZTogYW55LCBjbGllbnQ6IGFueSwgbG9nZ2VyOiBhbnkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXRoID0gYXdhaXQgZG93bmxvYWRGaWxlRnVuY3Rpb24obWVzc2FnZSwgY2xpZW50LCBsb2dnZXIpO1xuICAgIHJldHVybiBwYXRoPy5yZXBsYWNlKCcuLycsICcnKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRBbGxTZXNzaW9ucyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJBdXRoXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLm9wZXJhdGlvbklkID0gJ3N0YXJ0QWxsU2Vzc2lvbnMnXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZWNyZXRrZXlcIl0gPSB7XG4gICAgICBzY2hlbWE6ICdUSElTSVNNWVNFQ1VSRUNPREUnXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgc2VjcmV0a2V5IH0gPSByZXEucGFyYW1zO1xuICBjb25zdCB7IGF1dGhvcml6YXRpb246IHRva2VuIH0gPSByZXEuaGVhZGVycztcblxuICBsZXQgdG9rZW5EZWNyeXB0ID0gJyc7XG5cbiAgaWYgKHNlY3JldGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdG9rZW5EZWNyeXB0ID0gKHRva2VuIGFzIGFueSkuc3BsaXQoJyAnKVswXTtcbiAgfSBlbHNlIHtcbiAgICB0b2tlbkRlY3J5cHQgPSBzZWNyZXRrZXk7XG4gIH1cblxuICBjb25zdCBhbGxTZXNzaW9ucyA9IGF3YWl0IGdldEFsbFRva2VucyhyZXEpO1xuXG4gIGlmICh0b2tlbkRlY3J5cHQgIT09IHJlcS5zZXJ2ZXJPcHRpb25zLnNlY3JldEtleSkge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICByZXNwb25zZTogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdUaGUgdG9rZW4gaXMgaW5jb3JyZWN0JyxcbiAgICB9KTtcbiAgfVxuXG4gIGFsbFNlc3Npb25zLm1hcChhc3luYyAoc2Vzc2lvbjogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgdXRpbCA9IG5ldyBDcmVhdGVTZXNzaW9uVXRpbCgpO1xuICAgIGF3YWl0IHV0aWwub3BlbmRhdGEocmVxLCBzZXNzaW9uKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGF3YWl0IHJlc1xuICAgIC5zdGF0dXMoMjAxKVxuICAgIC5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdTdGFydGluZyBhbGwgc2Vzc2lvbnMnIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hvd0FsbFNlc3Npb25zKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkF1dGhcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIub3BlcmF0aW9uSWQgPSAnc2hvd0FsbFNlc3Npb25zJ1xuICAgICAjc3dhZ2dlci5hdXRvUXVlcnk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuYXV0b0hlYWRlcnM9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZWNyZXRrZXlcIl0gPSB7XG4gICAgICBzY2hlbWE6ICdUSElTSVNNWVNFQ1VSRVRPS0VOJ1xuICAgICB9XG4gICAqL1xuICBjb25zdCB7IHNlY3JldGtleSB9ID0gcmVxLnBhcmFtcztcbiAgY29uc3QgeyBhdXRob3JpemF0aW9uOiB0b2tlbiB9ID0gcmVxLmhlYWRlcnM7XG5cbiAgbGV0IHRva2VuRGVjcnlwdDogYW55ID0gJyc7XG5cbiAgaWYgKHNlY3JldGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdG9rZW5EZWNyeXB0ID0gdG9rZW4/LnNwbGl0KCcgJylbMF07XG4gIH0gZWxzZSB7XG4gICAgdG9rZW5EZWNyeXB0ID0gc2VjcmV0a2V5O1xuICB9XG5cbiAgY29uc3QgYXJyOiBhbnkgPSBbXTtcblxuICBpZiAodG9rZW5EZWNyeXB0ICE9PSByZXEuc2VydmVyT3B0aW9ucy5zZWNyZXRLZXkpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgcmVzcG9uc2U6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogJ1RoZSB0b2tlbiBpcyBpbmNvcnJlY3QnLFxuICAgIH0pO1xuICB9XG5cbiAgT2JqZWN0LmtleXMoY2xpZW50c0FycmF5KS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgYXJyLnB1c2goeyBzZXNzaW9uOiBpdGVtIH0pO1xuICB9KTtcblxuICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyByZXNwb25zZTogYXdhaXQgZ2V0QWxsVG9rZW5zKHJlcSkgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdGFydFNlc3Npb24ocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQXV0aFwiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5vcGVyYXRpb25JZCA9ICdzdGFydFNlc3Npb24nXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIHdlYmhvb2s6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICB3YWl0UXJDb2RlOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlOiB7XG4gICAgICAgICAgICB3ZWJob29rOiBcIlwiLFxuICAgICAgICAgICAgd2FpdFFyQ29kZTogZmFsc2UsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHNlc3Npb24gPSByZXEuc2Vzc2lvbjtcbiAgY29uc3QgeyB3YWl0UXJDb2RlID0gZmFsc2UgfSA9IHJlcS5ib2R5O1xuXG4gIGF3YWl0IGdldFNlc3Npb25TdGF0ZShyZXEsIHJlcyk7XG4gIGF3YWl0IFNlc3Npb25VdGlsLm9wZW5kYXRhKHJlcSwgc2Vzc2lvbiwgd2FpdFFyQ29kZSA/IHJlcyA6IG51bGwpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xvc2VTZXNzaW9uKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkF1dGhcIl1cbiAgICAgI3N3YWdnZXIub3BlcmF0aW9uSWQgPSAnY2xvc2VTZXNzaW9uJ1xuICAgICAjc3dhZ2dlci5hdXRvQm9keT10cnVlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICBjb25zdCBzZXNzaW9uID0gcmVxLnNlc3Npb247XG4gIHRyeSB7XG4gICAgaWYgKChjbGllbnRzQXJyYXkgYXMgYW55KVtzZXNzaW9uXS5zdGF0dXMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBhd2FpdCByZXNcbiAgICAgICAgLnN0YXR1cygyMDApXG4gICAgICAgIC5qc29uKHsgc3RhdHVzOiB0cnVlLCBtZXNzYWdlOiAnU2Vzc2lvbiBzdWNjZXNzZnVsbHkgY2xvc2VkJyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgKGNsaWVudHNBcnJheSBhcyBhbnkpW3Nlc3Npb25dID0geyBzdGF0dXM6IG51bGwgfTtcblxuICAgICAgYXdhaXQgcmVxLmNsaWVudC5jbG9zZSgpO1xuICAgICAgcmVxLmlvLmVtaXQoJ3doYXRzYXBwLXN0YXR1cycsIGZhbHNlKTtcbiAgICAgIGNhbGxXZWJIb29rKHJlcS5jbGllbnQsIHJlcSwgJ2Nsb3Nlc2Vzc2lvbicsIHtcbiAgICAgICAgbWVzc2FnZTogYFNlc3Npb246ICR7c2Vzc2lvbn0gZGlzY29ubmVjdGVkYCxcbiAgICAgICAgY29ubmVjdGVkOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYXdhaXQgcmVzXG4gICAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgICAuanNvbih7IHN0YXR1czogdHJ1ZSwgbWVzc2FnZTogJ1Nlc3Npb24gc3VjY2Vzc2Z1bGx5IGNsb3NlZCcgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiBhd2FpdCByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6IGZhbHNlLCBtZXNzYWdlOiAnRXJyb3IgY2xvc2luZyBzZXNzaW9uJywgZXJyb3IgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ091dFNlc3Npb24ocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQXV0aFwiXVxuICAgICAjc3dhZ2dlci5vcGVyYXRpb25JZCA9ICdsb2dvdXRTZXNzaW9uJ1xuICAgKiAjc3dhZ2dlci5kZXNjcmlwdGlvbiA9ICdUaGlzIHJvdXRlIGxvZ291dCBhbmQgZGVsZXRlIHNlc3Npb24gZGF0YSdcbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICovXG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IHJlcS5zZXNzaW9uO1xuICAgIGF3YWl0IHJlcS5jbGllbnQubG9nb3V0KCk7XG4gICAgZGVsZXRlU2Vzc2lvbk9uQXJyYXkocmVxLnNlc3Npb24pO1xuXG4gICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwYXRoVXNlckRhdGEgPSBjb25maWcuY3VzdG9tVXNlckRhdGFEaXIgKyByZXEuc2Vzc2lvbjtcbiAgICAgIGNvbnN0IHBhdGhUb2tlbnMgPSBfX2Rpcm5hbWUgKyBgLi4vLi4vLi4vdG9rZW5zLyR7cmVxLnNlc3Npb259LmRhdGEuanNvbmA7XG5cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGhVc2VyRGF0YSkpIHtcbiAgICAgICAgYXdhaXQgZnMucHJvbWlzZXMucm0ocGF0aFVzZXJEYXRhLCB7XG4gICAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgICAgICAgIG1heFJldHJpZXM6IDUsXG4gICAgICAgICAgZm9yY2U6IHRydWUsXG4gICAgICAgICAgcmV0cnlEZWxheTogMTAwMCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoVG9rZW5zKSkge1xuICAgICAgICBhd2FpdCBmcy5wcm9taXNlcy5ybShwYXRoVG9rZW5zLCB7XG4gICAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgICAgICAgIG1heFJldHJpZXM6IDUsXG4gICAgICAgICAgZm9yY2U6IHRydWUsXG4gICAgICAgICAgcmV0cnlEZWxheTogMTAwMCxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJlcS5pby5lbWl0KCd3aGF0c2FwcC1zdGF0dXMnLCBmYWxzZSk7XG4gICAgICBjYWxsV2ViSG9vayhyZXEuY2xpZW50LCByZXEsICdsb2dvdXRzZXNzaW9uJywge1xuICAgICAgICBtZXNzYWdlOiBgU2Vzc2lvbjogJHtzZXNzaW9ufSBsb2dnZWQgb3V0YCxcbiAgICAgICAgY29ubmVjdGVkOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYXdhaXQgcmVzXG4gICAgICAgIC5zdGF0dXMoMjAwKVxuICAgICAgICAuanNvbih7IHN0YXR1czogdHJ1ZSwgbWVzc2FnZTogJ1Nlc3Npb24gc3VjY2Vzc2Z1bGx5IGNsb3NlZCcgfSk7XG4gICAgfSwgNTAwKTtcbiAgICAvKnRyeSB7XG4gICAgICBhd2FpdCByZXEuY2xpZW50LmNsb3NlKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9Ki9cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICByZXR1cm4gYXdhaXQgcmVzXG4gICAgICAuc3RhdHVzKDUwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiBmYWxzZSwgbWVzc2FnZTogJ0Vycm9yIGNsb3Npbmcgc2Vzc2lvbicsIGVycm9yIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGVja0Nvbm5lY3Rpb25TZXNzaW9uKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkF1dGhcIl1cbiAgICAgI3N3YWdnZXIub3BlcmF0aW9uSWQgPSAnQ2hlY2tDb25uZWN0aW9uU3RhdGUnXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGF3YWl0IHJlcS5jbGllbnQuaXNDb25uZWN0ZWQoKTtcblxuICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN0YXR1czogdHJ1ZSwgbWVzc2FnZTogJ0Nvbm5lY3RlZCcgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzOiBmYWxzZSwgbWVzc2FnZTogJ0Rpc2Nvbm5lY3RlZCcgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkTWVkaWFCeU1lc3NhZ2UocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiTWVzc2FnZXNcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIub3BlcmF0aW9uSWQgPSAnZG93bmxvYWRNZWRpYWJ5TWVzc2FnZSdcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgbWVzc2FnZUlkOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2VJZDogJzxtZXNzYWdlSWQ+J1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICBjb25zdCBjbGllbnQgPSByZXEuY2xpZW50O1xuICBjb25zdCB7IG1lc3NhZ2VJZCB9ID0gcmVxLmJvZHk7XG5cbiAgbGV0IG1lc3NhZ2U7XG5cbiAgdHJ5IHtcbiAgICBpZiAoIW1lc3NhZ2VJZC5pc01lZGlhIHx8ICFtZXNzYWdlSWQudHlwZSkge1xuICAgICAgbWVzc2FnZSA9IGF3YWl0IGNsaWVudC5nZXRNZXNzYWdlQnlJZChtZXNzYWdlSWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlID0gbWVzc2FnZUlkO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZSlcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ01lc3NhZ2Ugbm90IGZvdW5kJyxcbiAgICAgIH0pO1xuXG4gICAgaWYgKCEobWVzc2FnZVsnbWltZXR5cGUnXSB8fCBtZXNzYWdlLmlzTWVkaWEgfHwgbWVzc2FnZS5pc01NUykpXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdNZXNzYWdlIGRvZXMgbm90IGNvbnRhaW4gbWVkaWEnLFxuICAgICAgfSk7XG5cbiAgICBjb25zdCBidWZmZXIgPSBhd2FpdCBjbGllbnQuZGVjcnlwdEZpbGUobWVzc2FnZSk7XG5cbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDIwMClcbiAgICAgIC5qc29uKHsgYmFzZTY0OiBidWZmZXIudG9TdHJpbmcoJ2Jhc2U2NCcpLCBtaW1ldHlwZTogbWVzc2FnZS5taW1ldHlwZSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdEZWNyeXB0IGZpbGUgZXJyb3InLFxuICAgICAgZXJyb3I6IGUsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE1lZGlhQnlNZXNzYWdlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLm9wZXJhdGlvbklkID0gJ2dldE1lZGlhQnlNZXNzYWdlJ1xuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ21lc3NhZ2VJZCdcbiAgICAgfVxuICAgKi9cbiAgY29uc3QgY2xpZW50ID0gcmVxLmNsaWVudDtcbiAgY29uc3QgeyBtZXNzYWdlSWQgfSA9IHJlcS5wYXJhbXM7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgY2xpZW50LmdldE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG5cbiAgICBpZiAoIW1lc3NhZ2UpXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdNZXNzYWdlIG5vdCBmb3VuZCcsXG4gICAgICB9KTtcblxuICAgIGlmICghKG1lc3NhZ2VbJ21pbWV0eXBlJ10gfHwgbWVzc2FnZS5pc01lZGlhIHx8IG1lc3NhZ2UuaXNNTVMpKVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcbiAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiAnTWVzc2FnZSBkb2VzIG5vdCBjb250YWluIG1lZGlhJyxcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgYnVmZmVyID0gYXdhaXQgY2xpZW50LmRlY3J5cHRGaWxlKG1lc3NhZ2UpO1xuXG4gICAgcmV0dXJuIHJlc1xuICAgICAgLnN0YXR1cygyMDApXG4gICAgICAuanNvbih7IGJhc2U2NDogYnVmZmVyLnRvU3RyaW5nKCdiYXNlNjQnKSwgbWltZXR5cGU6IG1lc3NhZ2UubWltZXR5cGUgfSk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihleCk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdUaGUgc2Vzc2lvbiBpcyBub3QgYWN0aXZlJyxcbiAgICAgIGVycm9yOiBleCxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2Vzc2lvblN0YXRlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIkF1dGhcIl1cbiAgICAgI3N3YWdnZXIub3BlcmF0aW9uSWQgPSAnZ2V0U2Vzc2lvblN0YXRlJ1xuICAgICAjc3dhZ2dlci5zdW1tYXJ5ID0gJ1JldHJpZXZlIHN0YXR1cyBvZiBhIHNlc3Npb24nXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5ID0gZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICovXG4gIHRyeSB7XG4gICAgY29uc3QgeyB3YWl0UXJDb2RlID0gZmFsc2UgfSA9IHJlcS5ib2R5O1xuICAgIGNvbnN0IGNsaWVudCA9IHJlcS5jbGllbnQ7XG4gICAgY29uc3QgcXIgPVxuICAgICAgY2xpZW50Py51cmxjb2RlICE9IG51bGwgJiYgY2xpZW50Py51cmxjb2RlICE9ICcnXG4gICAgICAgID8gYXdhaXQgUVJDb2RlLnRvRGF0YVVSTChjbGllbnQudXJsY29kZSlcbiAgICAgICAgOiBudWxsO1xuXG4gICAgaWYgKChjbGllbnQgPT0gbnVsbCB8fCBjbGllbnQuc3RhdHVzID09IG51bGwpICYmICF3YWl0UXJDb2RlKVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzOiAnQ0xPU0VEJywgcXJjb2RlOiBudWxsIH0pO1xuICAgIGVsc2UgaWYgKGNsaWVudCAhPSBudWxsKVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgc3RhdHVzOiBjbGllbnQuc3RhdHVzLFxuICAgICAgICBxcmNvZGU6IHFyLFxuICAgICAgICB1cmxjb2RlOiBjbGllbnQudXJsY29kZSxcbiAgICAgICAgdmVyc2lvbjogdmVyc2lvbixcbiAgICAgIH0pO1xuICB9IGNhdGNoIChleCkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXgpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnVGhlIHNlc3Npb24gaXMgbm90IGFjdGl2ZScsXG4gICAgICBlcnJvcjogZXgsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFFyQ29kZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJBdXRoXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLm9wZXJhdGlvbklkID0gJ2dldFFyQ29kZSdcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICovXG4gIHRyeSB7XG4gICAgaWYgKHJlcT8uY2xpZW50Py51cmxjb2RlKSB7XG4gICAgICBjb25zdCBxciA9IHJlcS5jbGllbnQudXJsY29kZVxuICAgICAgICA/IGF3YWl0IFFSQ29kZS50b0RhdGFVUkwocmVxLmNsaWVudC51cmxjb2RlKVxuICAgICAgICA6IG51bGw7XG4gICAgICBjb25zdCBpbWcgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgKHFyIGFzIGFueSkucmVwbGFjZSgvXmRhdGE6aW1hZ2VcXC8ocG5nfGpwZWd8anBnKTtiYXNlNjQsLywgJycpLFxuICAgICAgICAnYmFzZTY0J1xuICAgICAgKTtcblxuICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdpbWFnZS9wbmcnLFxuICAgICAgICAnQ29udGVudC1MZW5ndGgnOiBpbWcubGVuZ3RoLFxuICAgICAgfSk7XG4gICAgICByZXMuZW5kKGltZyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxLmNsaWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgIHN0YXR1czogbnVsbCxcbiAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICAnU2Vzc2lvbiBub3Qgc3RhcnRlZC4gUGxlYXNlLCB1c2UgdGhlIC9zdGFydC1zZXNzaW9uIHJvdXRlLCBmb3IgaW5pdGlhbGl6YXRpb24geW91ciBzZXNzaW9uJyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICBzdGF0dXM6IHJlcS5jbGllbnQuc3RhdHVzLFxuICAgICAgICBtZXNzYWdlOiAnUVJDb2RlIGlzIG5vdCBhdmFpbGFibGUuLi4nLFxuICAgICAgfSk7XG4gICAgfVxuICB9IGNhdGNoIChleCkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXgpO1xuICAgIHJldHVybiByZXNcbiAgICAgIC5zdGF0dXMoNTAwKVxuICAgICAgLmpzb24oeyBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdFcnJvciByZXRyaWV2aW5nIFFSQ29kZScsIGVycm9yOiBleCB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24ga2lsbFNlcnZpY2VXb3JrZXIocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci5pZ25vcmU9dHJ1ZVxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiTWVzc2FnZXNcIl1cbiAgICAgI3N3YWdnZXIub3BlcmF0aW9uSWQgPSAna2lsbFNlcnZpY2VXb3JraWVyJ1xuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgKi9cbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDIwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnZXJyb3InLCByZXNwb25zZTogJ05vdCBpbXBsZW1lbnRlZCB5ZXQnIH0pO1xuICB9IGNhdGNoIChleCkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXgpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnVGhlIHNlc3Npb24gaXMgbm90IGFjdGl2ZScsXG4gICAgICBlcnJvcjogZXgsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc3RhcnRTZXJ2aWNlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIuaWdub3JlPXRydWVcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLm9wZXJhdGlvbklkID0gJ3Jlc3RhcnRTZXJ2aWNlJ1xuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgKi9cbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVzXG4gICAgICAuc3RhdHVzKDIwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnZXJyb3InLCByZXNwb25zZTogJ05vdCBpbXBsZW1lbnRlZCB5ZXQnIH0pO1xuICB9IGNhdGNoIChleCkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXgpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICByZXNwb25zZTogeyBtZXNzYWdlOiAnVGhlIHNlc3Npb24gaXMgbm90IGFjdGl2ZScsIGVycm9yOiBleCB9LFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdWJzY3JpYmVQcmVzZW5jZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAgICNzd2FnZ2VyLm9wZXJhdGlvbklkID0gJ3N1YnNjcmliZVByZXNlbmNlJ1xuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBwaG9uZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgIGlzR3JvdXA6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgYWxsOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlOiB7XG4gICAgICAgICAgICBwaG9uZTogJzU1MjE5OTk5OTk5OTknLFxuICAgICAgICAgICAgaXNHcm91cDogZmFsc2UsXG4gICAgICAgICAgICBhbGw6IGZhbHNlLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICB9XG4gICAqL1xuICB0cnkge1xuICAgIGNvbnN0IHsgcGhvbmUsIGlzR3JvdXAgPSBmYWxzZSwgYWxsID0gZmFsc2UgfSA9IHJlcS5ib2R5O1xuXG4gICAgaWYgKGFsbCkge1xuICAgICAgbGV0IGNvbnRhY3RzO1xuICAgICAgaWYgKGlzR3JvdXApIHtcbiAgICAgICAgY29uc3QgZ3JvdXBzID0gYXdhaXQgcmVxLmNsaWVudC5nZXRBbGxHcm91cHMoZmFsc2UpO1xuICAgICAgICBjb250YWN0cyA9IGdyb3Vwcy5tYXAoKHA6IGFueSkgPT4gcC5pZC5fc2VyaWFsaXplZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBjaGF0cyA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0QWxsQ29udGFjdHMoKTtcbiAgICAgICAgY29udGFjdHMgPSBjaGF0cy5tYXAoKGM6IGFueSkgPT4gYy5pZC5fc2VyaWFsaXplZCk7XG4gICAgICB9XG4gICAgICBhd2FpdCByZXEuY2xpZW50LnN1YnNjcmliZVByZXNlbmNlKGNvbnRhY3RzKTtcbiAgICB9IGVsc2VcbiAgICAgIGZvciAoY29uc3QgY29udGF0byBvZiBjb250YWN0VG9BcnJheShwaG9uZSwgaXNHcm91cCkpIHtcbiAgICAgICAgYXdhaXQgcmVxLmNsaWVudC5zdWJzY3JpYmVQcmVzZW5jZShjb250YXRvKTtcbiAgICAgIH1cblxuICAgIHJldHVybiBhd2FpdCByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgIHJlc3BvbnNlOiB7IG1lc3NhZ2U6ICdTdWJzY3JpYmUgcHJlc2VuY2UgZXhlY3V0ZWQnIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGF3YWl0IHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBzdWJzY3JpYmUgcHJlc2VuY2UnLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0QnVzaW5lc3NQcm9maWxlKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIlByb2ZpbGVcIl1cbiAgICAgI3N3YWdnZXIub3BlcmF0aW9uSWQgPSAnZWRpdEJ1c2luZXNzUHJvZmlsZSdcbiAgICogI3N3YWdnZXIuZGVzY3JpcHRpb24gPSAnRWRpdCB5b3VyIGJ1c3NpbmVzcyBwcm9maWxlJ1xuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wib2JqXCJdID0ge1xuICAgICAgaW46ICdib2R5JyxcbiAgICAgIHNjaGVtYToge1xuICAgICAgICAkYWRyZXNzOiAnQXYuIE5vc3NhIFNlbmhvcmEgZGUgQ29wYWNhYmFuYSwgMzE1JyxcbiAgICAgICAgJGVtYWlsOiAndGVzdEB0ZXN0LmNvbS5icicsXG4gICAgICAgICRjYXRlZ29yaWVzOiB7XG4gICAgICAgICAgJGlkOiBcIjEzMzQzNjc0MzM4ODIxN1wiLFxuICAgICAgICAgICRsb2NhbGl6ZWRfZGlzcGxheV9uYW1lOiBcIkFydGVzIGUgZW50cmV0ZW5pbWVudG9cIixcbiAgICAgICAgICAkbm90X2FfYml6OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgJHdlYnNpdGU6IFtcbiAgICAgICAgICBcImh0dHBzOi8vd3d3LndwcGNvbm5lY3QuaW9cIixcbiAgICAgICAgICBcImh0dHBzOi8vd3d3LnRlc3RlMi5jb20uYnJcIixcbiAgICAgICAgXSxcbiAgICAgIH1cbiAgICAgfVxuICAgICBcbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgYWRyZXNzOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgZW1haWw6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICBjYXRlZ29yaWVzOiB7IHR5cGU6IFwib2JqZWN0XCIgfSxcbiAgICAgICAgICAgICAgd2Vic2l0ZXM6IHsgdHlwZTogXCJhcnJheVwiIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBleGFtcGxlOiB7XG4gICAgICAgICAgICBhZHJlc3M6ICdBdi4gTm9zc2EgU2VuaG9yYSBkZSBDb3BhY2FiYW5hLCAzMTUnLFxuICAgICAgICAgICAgZW1haWw6ICd0ZXN0QHRlc3QuY29tLmJyJyxcbiAgICAgICAgICAgIGNhdGVnb3JpZXM6IHtcbiAgICAgICAgICAgICAgJGlkOiBcIjEzMzQzNjc0MzM4ODIxN1wiLFxuICAgICAgICAgICAgICAkbG9jYWxpemVkX2Rpc3BsYXlfbmFtZTogXCJBcnRlcyBlIGVudHJldGVuaW1lbnRvXCIsXG4gICAgICAgICAgICAgICRub3RfYV9iaXo6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdlYnNpdGU6IFtcbiAgICAgICAgICAgICAgXCJodHRwczovL3d3dy53cHBjb25uZWN0LmlvXCIsXG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly93d3cudGVzdGUyLmNvbS5iclwiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgfVxuICAgKi9cbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oYXdhaXQgcmVxLmNsaWVudC5lZGl0QnVzaW5lc3NQcm9maWxlKHJlcS5ib2R5KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBlZGl0IGJ1c2luZXNzIHByb2ZpbGUnLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLElBQUFBLEdBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLE9BQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTs7O0FBR0EsSUFBQUcsUUFBQSxHQUFBSCxPQUFBO0FBQ0EsSUFBQUksT0FBQSxHQUFBTCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUssa0JBQUEsR0FBQU4sc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFNLFVBQUEsR0FBQU4sT0FBQTtBQUNBLElBQUFPLGFBQUEsR0FBQVIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFRLFlBQUEsR0FBQVIsT0FBQSx3QkFBeUUsQ0EzQnpFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQWVBLE1BQU1TLFdBQVcsR0FBRyxJQUFJQywwQkFBaUIsQ0FBQyxDQUFDLENBRTNDLGVBQWVDLG9CQUFvQkEsQ0FDakNDLE9BQWdCLEVBQ2hCQyxNQUFnQixFQUNoQkMsTUFBYyxFQUNkLENBQ0Es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