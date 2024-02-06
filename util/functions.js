"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.autoDownload = autoDownload;exports.callWebHook = callWebHook;exports.contactToArray = contactToArray;exports.createCatalogLink = createCatalogLink;exports.createFolders = createFolders;exports.getIPAddress = getIPAddress;exports.groupNameToArray = groupNameToArray;exports.groupToArray = groupToArray;exports.setMaxListners = setMaxListners;exports.startAllSessions = startAllSessions;exports.startHelper = startHelper;exports.strToBool = strToBool;exports.unlinkAsync = void 0;














var _clientS = require("@aws-sdk/client-s3");





var _axios = _interopRequireDefault(require("axios"));
var _crypto = _interopRequireDefault(require("crypto"));

var _fs = _interopRequireDefault(require("fs"));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _os = _interopRequireDefault(require("os"));
var _path = _interopRequireDefault(require("path"));
var _util = require("util");

var _config = _interopRequireDefault(require("../config"));
var _index = require("../mapper/index");

var _bucketAlreadyExists = require("./bucketAlreadyExists"); /*
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
 */let mime, crypto; //, aws: any;
if (_config.default.webhook.uploadS3) {mime = _config.default.webhook.uploadS3 ? _mimeTypes.default : null;crypto = _config.default.webhook.uploadS3 ? _crypto.default : null;}if (_config.default?.websocket?.uploadS3) {mime = _config.default.websocket.uploadS3 ? _mimeTypes.default : null;crypto = _config.default.websocket.uploadS3 ? _crypto.default : null;}function contactToArray(number, isGroup, isNewsletter)
{
  const localArr = [];
  if (Array.isArray(number)) {
    for (let contact of number) {
      isGroup || isNewsletter ?
      contact = contact.split('@')[0] :
      contact = contact.split('@')[0]?.replace(/[^\w ]/g, '');
      if (contact !== '')
      if (isGroup) localArr.push(`${contact}@g.us`);else
      if (isNewsletter) localArr.push(`${contact}@newsletter`);else
      localArr.push(`${contact}@c.us`);
    }
  } else {
    const arrContacts = number.split(/\s*[,;]\s*/g);
    for (let contact of arrContacts) {
      isGroup || isNewsletter ?
      contact = contact.split('@')[0] :
      contact = contact.split('@')[0]?.replace(/[^\w ]/g, '');
      if (contact !== '')
      if (isGroup) localArr.push(`${contact}@g.us`);else
      if (isNewsletter) localArr.push(`${contact}@newsletter`);else
      localArr.push(`${contact}@c.us`);
    }
  }

  return localArr;
}

function groupToArray(group) {
  const localArr = [];
  if (Array.isArray(group)) {
    for (let contact of group) {
      contact = contact.split('@')[0];
      if (contact !== '') localArr.push(`${contact}@g.us`);
    }
  } else {
    const arrContacts = group.split(/\s*[,;]\s*/g);
    for (let contact of arrContacts) {
      contact = contact.split('@')[0];
      if (contact !== '') localArr.push(`${contact}@g.us`);
    }
  }

  return localArr;
}

function groupNameToArray(group) {
  const localArr = [];
  if (Array.isArray(group)) {
    for (const contact of group) {
      if (contact !== '') localArr.push(`${contact}`);
    }
  } else {
    const arrContacts = group.split(/\s*[,;]\s*/g);
    for (const contact of arrContacts) {
      if (contact !== '') localArr.push(`${contact}`);
    }
  }

  return localArr;
}

async function callWebHook(
client,
req,
event,
data)
{
  const webhook =
  client?.config.webhook || req.serverOptions.webhook.url || false;
  if (webhook) {
    if (
    req.serverOptions.webhook?.ignore && (
    req.serverOptions.webhook.ignore.includes(event) ||
    req.serverOptions.webhook.ignore.includes(data?.from) ||
    req.serverOptions.webhook.ignore.includes(data?.type)))

    return;
    if (req.serverOptions.webhook.autoDownload)
    await autoDownload(client, req, data);
    try {
      const chatId =
      data.from ||
      data.chatId || (
      data.chatId ? data.chatId._serialized : null);
      data = Object.assign({ event: event, session: client.session }, data);
      if (req.serverOptions.mapper.enable)
      data = await (0, _index.convert)(req.serverOptions.mapper.prefix, data);
      _axios.default.
      post(webhook, data).
      then(() => {
        try {
          const events = ['unreadmessages', 'onmessage'];
          if (events.includes(event) && req.serverOptions.webhook.readMessage)
          client.sendSeen(chatId);
        } catch (e) {}
      }).
      catch((e) => {
        req.logger.warn('Error calling Webhook.', e);
      });
    } catch (e) {
      req.logger.error(e);
    }
  }
}

async function autoDownload(client, req, message) {
  try {
    if (message && (message['mimetype'] || message.isMedia || message.isMMS)) {
      const buffer = await client.decryptFile(message);
      if (
      req.serverOptions.webhook.uploadS3 ||
      req.serverOptions?.websocket?.uploadS3)
      {
        const hashName = crypto.randomBytes(24).toString('hex');

        if (
        !_config.default?.aws_s3?.region ||
        !_config.default?.aws_s3?.access_key_id ||
        !_config.default?.aws_s3?.secret_key)

        throw new Error('Please, configure your aws configs');
        const s3Client = new _clientS.S3Client({
          region: _config.default?.aws_s3?.region,
          endpoint: _config.default?.aws_s3?.endpoint || undefined,
          forcePathStyle: _config.default?.aws_s3?.forcePathStyle || undefined
        });
        let bucketName = _config.default?.aws_s3?.defaultBucketName ?
        _config.default?.aws_s3?.defaultBucketName :
        client.session;
        bucketName = bucketName.
        normalize('NFD').
        replace(/[\u0300-\u036f]|[— _.,?!]/g, '').
        toLowerCase();
        bucketName =
        bucketName.length < 3 ?
        bucketName +
        `${Math.floor(Math.random() * (999 - 100 + 1)) + 100}` :
        bucketName;
        const fileName = `${
        _config.default.aws_s3.defaultBucketName ? client.session + '/' : ''
        }${hashName}.${mime.extension(message.mimetype)}`;

        if (
        !_config.default.aws_s3.defaultBucketName &&
        !(await (0, _bucketAlreadyExists.bucketAlreadyExists)(bucketName)))
        {
          await s3Client.send(
            new _clientS.CreateBucketCommand({
              Bucket: bucketName,
              ObjectOwnership: 'ObjectWriter'
            })
          );
          await s3Client.send(
            new _clientS.PutPublicAccessBlockCommand({
              Bucket: bucketName,
              PublicAccessBlockConfiguration: {
                BlockPublicAcls: false,
                IgnorePublicAcls: false,
                BlockPublicPolicy: false
              }
            })
          );
        }

        await s3Client.send(
          new _clientS.PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ContentType: message.mimetype,
            ACL: 'public-read'
          })
        );

        message.fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
      } else {
        message.body = await buffer.toString('base64');
      }
    }
  } catch (e) {
    req.logger.error(e);
  }
}

async function startAllSessions(config, logger) {
  try {
    await _axios.default.post(
      `${config.host}:${config.port}/api/${config.secretKey}/start-all`
    );
  } catch (e) {
    logger.error(e);
  }
}

async function startHelper(client, req) {
  if (req.serverOptions.webhook.allUnreadOnStart) await sendUnread(client, req);

  if (req.serverOptions.archive.enable) await archive(client, req);
}

async function sendUnread(client, req) {
  req.logger.info(`${client.session} : Inicio enviar mensagens não lidas`);

  try {
    const chats = await client.getAllChatsWithMessages(true);

    if (chats && chats.length > 0) {
      for (let i = 0; i < chats.length; i++)
      for (let j = 0; j < chats[i].msgs.length; j++) {
        callWebHook(client, req, 'unreadmessages', chats[i].msgs[j]);
      }
    }

    req.logger.info(`${client.session} : Fim enviar mensagens não lidas`);
  } catch (ex) {
    req.logger.error(ex);
  }
}

async function archive(client, req) {
  async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time * 10));
  }

  req.logger.info(`${client.session} : Inicio arquivando chats`);

  try {
    let chats = await client.getAllChats();
    if (chats && Array.isArray(chats) && chats.length > 0) {
      chats = chats.filter((c) => !c.archive);
    }
    if (chats && Array.isArray(chats) && chats.length > 0) {
      for (let i = 0; i < chats.length; i++) {
        const date = new Date(chats[i].t * 1000);

        if (DaysBetween(date) > req.serverOptions.archive.daysToArchive) {
          await client.archiveChat(
            chats[i].id.id || chats[i].id._serialized,
            true
          );
          await sleep(
            Math.floor(Math.random() * req.serverOptions.archive.waitTime + 1)
          );
        }
      }
    }
    req.logger.info(`${client.session} : Fim arquivando chats`);
  } catch (ex) {
    req.logger.error(ex);
  }
}

function DaysBetween(StartDate) {
  const endDate = new Date();
  // The number of milliseconds in all UTC days (no DST)
  const oneDay = 1000 * 60 * 60 * 24;

  // A day in UTC always lasts 24 hours (unlike in other time formats)
  const start = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  const end = Date.UTC(
    StartDate.getFullYear(),
    StartDate.getMonth(),
    StartDate.getDate()
  );

  // so it's safe to divide by 24 hours
  return (start - end) / oneDay;
}

function createFolders() {
  const __dirname = _path.default.resolve(_path.default.dirname(''));
  const dirFiles = _path.default.resolve(__dirname, 'WhatsAppImages');
  if (!_fs.default.existsSync(dirFiles)) {
    _fs.default.mkdirSync(dirFiles);
  }

  const dirUpload = _path.default.resolve(__dirname, 'uploads');
  if (!_fs.default.existsSync(dirUpload)) {
    _fs.default.mkdirSync(dirUpload);
  }
}

function strToBool(s) {
  return /^(true|1)$/i.test(s);
}

function getIPAddress() {
  const interfaces = _os.default.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
      alias.family === 'IPv4' &&
      alias.address !== '127.0.0.1' &&
      !alias.internal)

      return alias.address;
    }
  }
  return '0.0.0.0';
}

function setMaxListners(serverOptions) {
  if (serverOptions && Number.isInteger(serverOptions.maxListeners)) {
    process.setMaxListeners(serverOptions.maxListeners);
  }
}

const unlinkAsync = exports.unlinkAsync = (0, _util.promisify)(_fs.default.unlink);

function createCatalogLink(session) {
  const [wid] = session.split('@');
  return `https://wa.me/c/${wid}`;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY2xpZW50UyIsInJlcXVpcmUiLCJfYXhpb3MiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX2NyeXB0byIsIl9mcyIsIl9taW1lVHlwZXMiLCJfb3MiLCJfcGF0aCIsIl91dGlsIiwiX2NvbmZpZyIsIl9pbmRleCIsIl9idWNrZXRBbHJlYWR5RXhpc3RzIiwibWltZSIsImNyeXB0byIsImNvbmZpZyIsIndlYmhvb2siLCJ1cGxvYWRTMyIsIm1pbWV0eXBlcyIsIkNyeXB0byIsIndlYnNvY2tldCIsImNvbnRhY3RUb0FycmF5IiwibnVtYmVyIiwiaXNHcm91cCIsImlzTmV3c2xldHRlciIsImxvY2FsQXJyIiwiQXJyYXkiLCJpc0FycmF5IiwiY29udGFjdCIsInNwbGl0IiwicmVwbGFjZSIsInB1c2giLCJhcnJDb250YWN0cyIsImdyb3VwVG9BcnJheSIsImdyb3VwIiwiZ3JvdXBOYW1lVG9BcnJheSIsImNhbGxXZWJIb29rIiwiY2xpZW50IiwicmVxIiwiZXZlbnQiLCJkYXRhIiwic2VydmVyT3B0aW9ucyIsInVybCIsImlnbm9yZSIsImluY2x1ZGVzIiwiZnJvbSIsInR5cGUiLCJhdXRvRG93bmxvYWQiLCJjaGF0SWQiLCJfc2VyaWFsaXplZCIsIk9iamVjdCIsImFzc2lnbiIsInNlc3Npb24iLCJtYXBwZXIiLCJlbmFibGUiLCJjb252ZXJ0IiwicHJlZml4IiwiYXBpIiwicG9zdCIsInRoZW4iLCJldmVudHMiLCJyZWFkTWVzc2FnZSIsInNlbmRTZWVuIiwiZSIsImNhdGNoIiwibG9nZ2VyIiwid2FybiIsImVycm9yIiwibWVzc2FnZSIsImlzTWVkaWEiLCJpc01NUyIsImJ1ZmZlciIsImRlY3J5cHRGaWxlIiwiaGFzaE5hbWUiLCJyYW5kb21CeXRlcyIsInRvU3RyaW5nIiwiYXdzX3MzIiwicmVnaW9uIiwiYWNjZXNzX2tleV9pZCIsInNlY3JldF9rZXkiLCJFcnJvciIsInMzQ2xpZW50IiwiUzNDbGllbnQiLCJlbmRwb2ludCIsInVuZGVmaW5lZCIsImZvcmNlUGF0aFN0eWxlIiwiYnVja2V0TmFtZSIsImRlZmF1bHRCdWNrZXROYW1lIiwibm9ybWFsaXplIiwidG9Mb3dlckNhc2UiLCJsZW5ndGgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJmaWxlTmFtZSIsImV4dGVuc2lvbiIsIm1pbWV0eXBlIiwiYnVja2V0QWxyZWFkeUV4aXN0cyIsInNlbmQiLCJDcmVhdGVCdWNrZXRDb21tYW5kIiwiQnVja2V0IiwiT2JqZWN0T3duZXJzaGlwIiwiUHV0UHVibGljQWNjZXNzQmxvY2tDb21tYW5kIiwiUHVibGljQWNjZXNzQmxvY2tDb25maWd1cmF0aW9uIiwiQmxvY2tQdWJsaWNBY2xzIiwiSWdub3JlUHVibGljQWNscyIsIkJsb2NrUHVibGljUG9saWN5IiwiUHV0T2JqZWN0Q29tbWFuZCIsIktleSIsIkJvZHkiLCJDb250ZW50VHlwZSIsIkFDTCIsImZpbGVVcmwiLCJib2R5Iiwic3RhcnRBbGxTZXNzaW9ucyIsImhvc3QiLCJwb3J0Iiwic2VjcmV0S2V5Iiwic3RhcnRIZWxwZXIiLCJhbGxVbnJlYWRPblN0YXJ0Iiwic2VuZFVucmVhZCIsImFyY2hpdmUiLCJpbmZvIiwiY2hhdHMiLCJnZXRBbGxDaGF0c1dpdGhNZXNzYWdlcyIsImkiLCJqIiwibXNncyIsImV4Iiwic2xlZXAiLCJ0aW1lIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiZ2V0QWxsQ2hhdHMiLCJmaWx0ZXIiLCJjIiwiZGF0ZSIsIkRhdGUiLCJ0IiwiRGF5c0JldHdlZW4iLCJkYXlzVG9BcmNoaXZlIiwiYXJjaGl2ZUNoYXQiLCJpZCIsIndhaXRUaW1lIiwiU3RhcnREYXRlIiwiZW5kRGF0ZSIsIm9uZURheSIsInN0YXJ0IiwiVVRDIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJlbmQiLCJjcmVhdGVGb2xkZXJzIiwiX19kaXJuYW1lIiwicGF0aCIsImRpcm5hbWUiLCJkaXJGaWxlcyIsImZzIiwiZXhpc3RzU3luYyIsIm1rZGlyU3luYyIsImRpclVwbG9hZCIsInN0clRvQm9vbCIsInMiLCJ0ZXN0IiwiZ2V0SVBBZGRyZXNzIiwiaW50ZXJmYWNlcyIsIm9zIiwibmV0d29ya0ludGVyZmFjZXMiLCJkZXZOYW1lIiwiaWZhY2UiLCJhbGlhcyIsImZhbWlseSIsImFkZHJlc3MiLCJpbnRlcm5hbCIsInNldE1heExpc3RuZXJzIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwibWF4TGlzdGVuZXJzIiwicHJvY2VzcyIsInNldE1heExpc3RlbmVycyIsInVubGlua0FzeW5jIiwiZXhwb3J0cyIsInByb21pc2lmeSIsInVubGluayIsImNyZWF0ZUNhdGFsb2dMaW5rIiwid2lkIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvZnVuY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAyMyBXUFBDb25uZWN0IFRlYW1cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmltcG9ydCB7XG4gIENyZWF0ZUJ1Y2tldENvbW1hbmQsXG4gIFB1dE9iamVjdENvbW1hbmQsXG4gIFB1dFB1YmxpY0FjY2Vzc0Jsb2NrQ29tbWFuZCxcbiAgUzNDbGllbnQsXG59IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zMyc7XG5pbXBvcnQgYXBpIGZyb20gJ2F4aW9zJztcbmltcG9ydCBDcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgbWltZXR5cGVzIGZyb20gJ21pbWUtdHlwZXMnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IGNvbnZlcnQgfSBmcm9tICcuLi9tYXBwZXIvaW5kZXgnO1xuaW1wb3J0IHsgU2VydmVyT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL1NlcnZlck9wdGlvbnMnO1xuaW1wb3J0IHsgYnVja2V0QWxyZWFkeUV4aXN0cyB9IGZyb20gJy4vYnVja2V0QWxyZWFkeUV4aXN0cyc7XG5cbmxldCBtaW1lOiBhbnksIGNyeXB0bzogYW55OyAvLywgYXdzOiBhbnk7XG5pZiAoY29uZmlnLndlYmhvb2sudXBsb2FkUzMpIHtcbiAgbWltZSA9IGNvbmZpZy53ZWJob29rLnVwbG9hZFMzID8gbWltZXR5cGVzIDogbnVsbDtcbiAgY3J5cHRvID0gY29uZmlnLndlYmhvb2sudXBsb2FkUzMgPyBDcnlwdG8gOiBudWxsO1xufVxuaWYgKGNvbmZpZz8ud2Vic29ja2V0Py51cGxvYWRTMykge1xuICBtaW1lID0gY29uZmlnLndlYnNvY2tldC51cGxvYWRTMyA/IG1pbWV0eXBlcyA6IG51bGw7XG4gIGNyeXB0byA9IGNvbmZpZy53ZWJzb2NrZXQudXBsb2FkUzMgPyBDcnlwdG8gOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udGFjdFRvQXJyYXkoXG4gIG51bWJlcjogYW55LFxuICBpc0dyb3VwPzogYm9vbGVhbixcbiAgaXNOZXdzbGV0dGVyPzogYm9vbGVhblxuKSB7XG4gIGNvbnN0IGxvY2FsQXJyOiBhbnkgPSBbXTtcbiAgaWYgKEFycmF5LmlzQXJyYXkobnVtYmVyKSkge1xuICAgIGZvciAobGV0IGNvbnRhY3Qgb2YgbnVtYmVyKSB7XG4gICAgICBpc0dyb3VwIHx8IGlzTmV3c2xldHRlclxuICAgICAgICA/IChjb250YWN0ID0gY29udGFjdC5zcGxpdCgnQCcpWzBdKVxuICAgICAgICA6IChjb250YWN0ID0gY29udGFjdC5zcGxpdCgnQCcpWzBdPy5yZXBsYWNlKC9bXlxcdyBdL2csICcnKSk7XG4gICAgICBpZiAoY29udGFjdCAhPT0gJycpXG4gICAgICAgIGlmIChpc0dyb3VwKSAobG9jYWxBcnIgYXMgYW55KS5wdXNoKGAke2NvbnRhY3R9QGcudXNgKTtcbiAgICAgICAgZWxzZSBpZiAoaXNOZXdzbGV0dGVyKSAobG9jYWxBcnIgYXMgYW55KS5wdXNoKGAke2NvbnRhY3R9QG5ld3NsZXR0ZXJgKTtcbiAgICAgICAgZWxzZSAobG9jYWxBcnIgYXMgYW55KS5wdXNoKGAke2NvbnRhY3R9QGMudXNgKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYXJyQ29udGFjdHMgPSBudW1iZXIuc3BsaXQoL1xccypbLDtdXFxzKi9nKTtcbiAgICBmb3IgKGxldCBjb250YWN0IG9mIGFyckNvbnRhY3RzKSB7XG4gICAgICBpc0dyb3VwIHx8IGlzTmV3c2xldHRlclxuICAgICAgICA/IChjb250YWN0ID0gY29udGFjdC5zcGxpdCgnQCcpWzBdKVxuICAgICAgICA6IChjb250YWN0ID0gY29udGFjdC5zcGxpdCgnQCcpWzBdPy5yZXBsYWNlKC9bXlxcdyBdL2csICcnKSk7XG4gICAgICBpZiAoY29udGFjdCAhPT0gJycpXG4gICAgICAgIGlmIChpc0dyb3VwKSAobG9jYWxBcnIgYXMgYW55KS5wdXNoKGAke2NvbnRhY3R9QGcudXNgKTtcbiAgICAgICAgZWxzZSBpZiAoaXNOZXdzbGV0dGVyKSAobG9jYWxBcnIgYXMgYW55KS5wdXNoKGAke2NvbnRhY3R9QG5ld3NsZXR0ZXJgKTtcbiAgICAgICAgZWxzZSAobG9jYWxBcnIgYXMgYW55KS5wdXNoKGAke2NvbnRhY3R9QGMudXNgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbG9jYWxBcnI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBncm91cFRvQXJyYXkoZ3JvdXA6IGFueSkge1xuICBjb25zdCBsb2NhbEFycjogYW55ID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KGdyb3VwKSkge1xuICAgIGZvciAobGV0IGNvbnRhY3Qgb2YgZ3JvdXApIHtcbiAgICAgIGNvbnRhY3QgPSBjb250YWN0LnNwbGl0KCdAJylbMF07XG4gICAgICBpZiAoY29udGFjdCAhPT0gJycpIChsb2NhbEFyciBhcyBhbnkpLnB1c2goYCR7Y29udGFjdH1AZy51c2ApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBhcnJDb250YWN0cyA9IGdyb3VwLnNwbGl0KC9cXHMqWyw7XVxccyovZyk7XG4gICAgZm9yIChsZXQgY29udGFjdCBvZiBhcnJDb250YWN0cykge1xuICAgICAgY29udGFjdCA9IGNvbnRhY3Quc3BsaXQoJ0AnKVswXTtcbiAgICAgIGlmIChjb250YWN0ICE9PSAnJykgKGxvY2FsQXJyIGFzIGFueSkucHVzaChgJHtjb250YWN0fUBnLnVzYCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxvY2FsQXJyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBOYW1lVG9BcnJheShncm91cDogYW55KSB7XG4gIGNvbnN0IGxvY2FsQXJyOiBhbnkgPSBbXTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZ3JvdXApKSB7XG4gICAgZm9yIChjb25zdCBjb250YWN0IG9mIGdyb3VwKSB7XG4gICAgICBpZiAoY29udGFjdCAhPT0gJycpIChsb2NhbEFyciBhcyBhbnkpLnB1c2goYCR7Y29udGFjdH1gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYXJyQ29udGFjdHMgPSBncm91cC5zcGxpdCgvXFxzKlssO11cXHMqL2cpO1xuICAgIGZvciAoY29uc3QgY29udGFjdCBvZiBhcnJDb250YWN0cykge1xuICAgICAgaWYgKGNvbnRhY3QgIT09ICcnKSAobG9jYWxBcnIgYXMgYW55KS5wdXNoKGAke2NvbnRhY3R9YCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxvY2FsQXJyO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FsbFdlYkhvb2soXG4gIGNsaWVudDogYW55LFxuICByZXE6IFJlcXVlc3QsXG4gIGV2ZW50OiBhbnksXG4gIGRhdGE6IGFueVxuKSB7XG4gIGNvbnN0IHdlYmhvb2sgPVxuICAgIGNsaWVudD8uY29uZmlnLndlYmhvb2sgfHwgcmVxLnNlcnZlck9wdGlvbnMud2ViaG9vay51cmwgfHwgZmFsc2U7XG4gIGlmICh3ZWJob29rKSB7XG4gICAgaWYgKFxuICAgICAgcmVxLnNlcnZlck9wdGlvbnMud2ViaG9vaz8uaWdub3JlICYmXG4gICAgICAocmVxLnNlcnZlck9wdGlvbnMud2ViaG9vay5pZ25vcmUuaW5jbHVkZXMoZXZlbnQpIHx8XG4gICAgICAgIHJlcS5zZXJ2ZXJPcHRpb25zLndlYmhvb2suaWdub3JlLmluY2x1ZGVzKGRhdGE/LmZyb20pIHx8XG4gICAgICAgIHJlcS5zZXJ2ZXJPcHRpb25zLndlYmhvb2suaWdub3JlLmluY2x1ZGVzKGRhdGE/LnR5cGUpKVxuICAgIClcbiAgICAgIHJldHVybjtcbiAgICBpZiAocmVxLnNlcnZlck9wdGlvbnMud2ViaG9vay5hdXRvRG93bmxvYWQpXG4gICAgICBhd2FpdCBhdXRvRG93bmxvYWQoY2xpZW50LCByZXEsIGRhdGEpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjaGF0SWQgPVxuICAgICAgICBkYXRhLmZyb20gfHxcbiAgICAgICAgZGF0YS5jaGF0SWQgfHxcbiAgICAgICAgKGRhdGEuY2hhdElkID8gZGF0YS5jaGF0SWQuX3NlcmlhbGl6ZWQgOiBudWxsKTtcbiAgICAgIGRhdGEgPSBPYmplY3QuYXNzaWduKHsgZXZlbnQ6IGV2ZW50LCBzZXNzaW9uOiBjbGllbnQuc2Vzc2lvbiB9LCBkYXRhKTtcbiAgICAgIGlmIChyZXEuc2VydmVyT3B0aW9ucy5tYXBwZXIuZW5hYmxlKVxuICAgICAgICBkYXRhID0gYXdhaXQgY29udmVydChyZXEuc2VydmVyT3B0aW9ucy5tYXBwZXIucHJlZml4LCBkYXRhKTtcbiAgICAgIGFwaVxuICAgICAgICAucG9zdCh3ZWJob29rLCBkYXRhKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50cyA9IFsndW5yZWFkbWVzc2FnZXMnLCAnb25tZXNzYWdlJ107XG4gICAgICAgICAgICBpZiAoZXZlbnRzLmluY2x1ZGVzKGV2ZW50KSAmJiByZXEuc2VydmVyT3B0aW9ucy53ZWJob29rLnJlYWRNZXNzYWdlKVxuICAgICAgICAgICAgICBjbGllbnQuc2VuZFNlZW4oY2hhdElkKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICByZXEubG9nZ2VyLndhcm4oJ0Vycm9yIGNhbGxpbmcgV2ViaG9vay4nLCBlKTtcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVxLmxvZ2dlci5lcnJvcihlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGF1dG9Eb3dubG9hZChjbGllbnQ6IGFueSwgcmVxOiBhbnksIG1lc3NhZ2U6IGFueSkge1xuICB0cnkge1xuICAgIGlmIChtZXNzYWdlICYmIChtZXNzYWdlWydtaW1ldHlwZSddIHx8IG1lc3NhZ2UuaXNNZWRpYSB8fCBtZXNzYWdlLmlzTU1TKSkge1xuICAgICAgY29uc3QgYnVmZmVyID0gYXdhaXQgY2xpZW50LmRlY3J5cHRGaWxlKG1lc3NhZ2UpO1xuICAgICAgaWYgKFxuICAgICAgICByZXEuc2VydmVyT3B0aW9ucy53ZWJob29rLnVwbG9hZFMzIHx8XG4gICAgICAgIHJlcS5zZXJ2ZXJPcHRpb25zPy53ZWJzb2NrZXQ/LnVwbG9hZFMzXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgaGFzaE5hbWUgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMjQpLnRvU3RyaW5nKCdoZXgnKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgIWNvbmZpZz8uYXdzX3MzPy5yZWdpb24gfHxcbiAgICAgICAgICAhY29uZmlnPy5hd3NfczM/LmFjY2Vzc19rZXlfaWQgfHxcbiAgICAgICAgICAhY29uZmlnPy5hd3NfczM/LnNlY3JldF9rZXlcbiAgICAgICAgKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlLCBjb25maWd1cmUgeW91ciBhd3MgY29uZmlncycpO1xuICAgICAgICBjb25zdCBzM0NsaWVudCA9IG5ldyBTM0NsaWVudCh7XG4gICAgICAgICAgcmVnaW9uOiBjb25maWc/LmF3c19zMz8ucmVnaW9uLFxuICAgICAgICAgIGVuZHBvaW50OiBjb25maWc/LmF3c19zMz8uZW5kcG9pbnQgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgIGZvcmNlUGF0aFN0eWxlOiBjb25maWc/LmF3c19zMz8uZm9yY2VQYXRoU3R5bGUgfHwgdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGJ1Y2tldE5hbWUgPSBjb25maWc/LmF3c19zMz8uZGVmYXVsdEJ1Y2tldE5hbWVcbiAgICAgICAgICA/IGNvbmZpZz8uYXdzX3MzPy5kZWZhdWx0QnVja2V0TmFtZVxuICAgICAgICAgIDogY2xpZW50LnNlc3Npb247XG4gICAgICAgIGJ1Y2tldE5hbWUgPSBidWNrZXROYW1lXG4gICAgICAgICAgLm5vcm1hbGl6ZSgnTkZEJylcbiAgICAgICAgICAucmVwbGFjZSgvW1xcdTAzMDAtXFx1MDM2Zl18W+KAlCBfLiw/IV0vZywgJycpXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGJ1Y2tldE5hbWUgPVxuICAgICAgICAgIGJ1Y2tldE5hbWUubGVuZ3RoIDwgM1xuICAgICAgICAgICAgPyBidWNrZXROYW1lICtcbiAgICAgICAgICAgICAgYCR7TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDk5OSAtIDEwMCArIDEpKSArIDEwMH1gXG4gICAgICAgICAgICA6IGJ1Y2tldE5hbWU7XG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gYCR7XG4gICAgICAgICAgY29uZmlnLmF3c19zMy5kZWZhdWx0QnVja2V0TmFtZSA/IGNsaWVudC5zZXNzaW9uICsgJy8nIDogJydcbiAgICAgICAgfSR7aGFzaE5hbWV9LiR7bWltZS5leHRlbnNpb24obWVzc2FnZS5taW1ldHlwZSl9YDtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgIWNvbmZpZy5hd3NfczMuZGVmYXVsdEJ1Y2tldE5hbWUgJiZcbiAgICAgICAgICAhKGF3YWl0IGJ1Y2tldEFscmVhZHlFeGlzdHMoYnVja2V0TmFtZSkpXG4gICAgICAgICkge1xuICAgICAgICAgIGF3YWl0IHMzQ2xpZW50LnNlbmQoXG4gICAgICAgICAgICBuZXcgQ3JlYXRlQnVja2V0Q29tbWFuZCh7XG4gICAgICAgICAgICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICAgICAgICAgICAgT2JqZWN0T3duZXJzaGlwOiAnT2JqZWN0V3JpdGVyJyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgICBhd2FpdCBzM0NsaWVudC5zZW5kKFxuICAgICAgICAgICAgbmV3IFB1dFB1YmxpY0FjY2Vzc0Jsb2NrQ29tbWFuZCh7XG4gICAgICAgICAgICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICAgICAgICAgICAgUHVibGljQWNjZXNzQmxvY2tDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgQmxvY2tQdWJsaWNBY2xzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBJZ25vcmVQdWJsaWNBY2xzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBCbG9ja1B1YmxpY1BvbGljeTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBzM0NsaWVudC5zZW5kKFxuICAgICAgICAgIG5ldyBQdXRPYmplY3RDb21tYW5kKHtcbiAgICAgICAgICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICAgICAgICAgIEtleTogZmlsZU5hbWUsXG4gICAgICAgICAgICBCb2R5OiBidWZmZXIsXG4gICAgICAgICAgICBDb250ZW50VHlwZTogbWVzc2FnZS5taW1ldHlwZSxcbiAgICAgICAgICAgIEFDTDogJ3B1YmxpYy1yZWFkJyxcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIG1lc3NhZ2UuZmlsZVVybCA9IGBodHRwczovLyR7YnVja2V0TmFtZX0uczMuYW1hem9uYXdzLmNvbS8ke2ZpbGVOYW1lfWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzYWdlLmJvZHkgPSBhd2FpdCBidWZmZXIudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0QWxsU2Vzc2lvbnMoY29uZmlnOiBhbnksIGxvZ2dlcjogYW55KSB7XG4gIHRyeSB7XG4gICAgYXdhaXQgYXBpLnBvc3QoXG4gICAgICBgJHtjb25maWcuaG9zdH06JHtjb25maWcucG9ydH0vYXBpLyR7Y29uZmlnLnNlY3JldEtleX0vc3RhcnQtYWxsYFxuICAgICk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoZSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0SGVscGVyKGNsaWVudDogYW55LCByZXE6IGFueSkge1xuICBpZiAocmVxLnNlcnZlck9wdGlvbnMud2ViaG9vay5hbGxVbnJlYWRPblN0YXJ0KSBhd2FpdCBzZW5kVW5yZWFkKGNsaWVudCwgcmVxKTtcblxuICBpZiAocmVxLnNlcnZlck9wdGlvbnMuYXJjaGl2ZS5lbmFibGUpIGF3YWl0IGFyY2hpdmUoY2xpZW50LCByZXEpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZW5kVW5yZWFkKGNsaWVudDogYW55LCByZXE6IGFueSkge1xuICByZXEubG9nZ2VyLmluZm8oYCR7Y2xpZW50LnNlc3Npb259IDogSW5pY2lvIGVudmlhciBtZW5zYWdlbnMgbsOjbyBsaWRhc2ApO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgY2hhdHMgPSBhd2FpdCBjbGllbnQuZ2V0QWxsQ2hhdHNXaXRoTWVzc2FnZXModHJ1ZSk7XG5cbiAgICBpZiAoY2hhdHMgJiYgY2hhdHMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGF0cy5sZW5ndGg7IGkrKylcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaGF0c1tpXS5tc2dzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY2FsbFdlYkhvb2soY2xpZW50LCByZXEsICd1bnJlYWRtZXNzYWdlcycsIGNoYXRzW2ldLm1zZ3Nbal0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVxLmxvZ2dlci5pbmZvKGAke2NsaWVudC5zZXNzaW9ufSA6IEZpbSBlbnZpYXIgbWVuc2FnZW5zIG7Do28gbGlkYXNgKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXEubG9nZ2VyLmVycm9yKGV4KTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBhcmNoaXZlKGNsaWVudDogYW55LCByZXE6IGFueSkge1xuICBhc3luYyBmdW5jdGlvbiBzbGVlcCh0aW1lOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSAqIDEwKSk7XG4gIH1cblxuICByZXEubG9nZ2VyLmluZm8oYCR7Y2xpZW50LnNlc3Npb259IDogSW5pY2lvIGFycXVpdmFuZG8gY2hhdHNgKTtcblxuICB0cnkge1xuICAgIGxldCBjaGF0cyA9IGF3YWl0IGNsaWVudC5nZXRBbGxDaGF0cygpO1xuICAgIGlmIChjaGF0cyAmJiBBcnJheS5pc0FycmF5KGNoYXRzKSAmJiBjaGF0cy5sZW5ndGggPiAwKSB7XG4gICAgICBjaGF0cyA9IGNoYXRzLmZpbHRlcigoYykgPT4gIWMuYXJjaGl2ZSk7XG4gICAgfVxuICAgIGlmIChjaGF0cyAmJiBBcnJheS5pc0FycmF5KGNoYXRzKSAmJiBjaGF0cy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShjaGF0c1tpXS50ICogMTAwMCk7XG5cbiAgICAgICAgaWYgKERheXNCZXR3ZWVuKGRhdGUpID4gcmVxLnNlcnZlck9wdGlvbnMuYXJjaGl2ZS5kYXlzVG9BcmNoaXZlKSB7XG4gICAgICAgICAgYXdhaXQgY2xpZW50LmFyY2hpdmVDaGF0KFxuICAgICAgICAgICAgY2hhdHNbaV0uaWQuaWQgfHwgY2hhdHNbaV0uaWQuX3NlcmlhbGl6ZWQsXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgKTtcbiAgICAgICAgICBhd2FpdCBzbGVlcChcbiAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlcS5zZXJ2ZXJPcHRpb25zLmFyY2hpdmUud2FpdFRpbWUgKyAxKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmVxLmxvZ2dlci5pbmZvKGAke2NsaWVudC5zZXNzaW9ufSA6IEZpbSBhcnF1aXZhbmRvIGNoYXRzYCk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmVxLmxvZ2dlci5lcnJvcihleCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gRGF5c0JldHdlZW4oU3RhcnREYXRlOiBEYXRlKSB7XG4gIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZSgpO1xuICAvLyBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpbiBhbGwgVVRDIGRheXMgKG5vIERTVClcbiAgY29uc3Qgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcblxuICAvLyBBIGRheSBpbiBVVEMgYWx3YXlzIGxhc3RzIDI0IGhvdXJzICh1bmxpa2UgaW4gb3RoZXIgdGltZSBmb3JtYXRzKVxuICBjb25zdCBzdGFydCA9IERhdGUuVVRDKFxuICAgIGVuZERhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICBlbmREYXRlLmdldE1vbnRoKCksXG4gICAgZW5kRGF0ZS5nZXREYXRlKClcbiAgKTtcbiAgY29uc3QgZW5kID0gRGF0ZS5VVEMoXG4gICAgU3RhcnREYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgU3RhcnREYXRlLmdldE1vbnRoKCksXG4gICAgU3RhcnREYXRlLmdldERhdGUoKVxuICApO1xuXG4gIC8vIHNvIGl0J3Mgc2FmZSB0byBkaXZpZGUgYnkgMjQgaG91cnNcbiAgcmV0dXJuIChzdGFydCAtIGVuZCkgLyBvbmVEYXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGb2xkZXJzKCkge1xuICBjb25zdCBfX2Rpcm5hbWUgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKCcnKSk7XG4gIGNvbnN0IGRpckZpbGVzID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ1doYXRzQXBwSW1hZ2VzJyk7XG4gIGlmICghZnMuZXhpc3RzU3luYyhkaXJGaWxlcykpIHtcbiAgICBmcy5ta2RpclN5bmMoZGlyRmlsZXMpO1xuICB9XG5cbiAgY29uc3QgZGlyVXBsb2FkID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3VwbG9hZHMnKTtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKGRpclVwbG9hZCkpIHtcbiAgICBmcy5ta2RpclN5bmMoZGlyVXBsb2FkKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyVG9Cb29sKHM6IHN0cmluZykge1xuICByZXR1cm4gL14odHJ1ZXwxKSQvaS50ZXN0KHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SVBBZGRyZXNzKCkge1xuICBjb25zdCBpbnRlcmZhY2VzID0gb3MubmV0d29ya0ludGVyZmFjZXMoKTtcbiAgZm9yIChjb25zdCBkZXZOYW1lIGluIGludGVyZmFjZXMpIHtcbiAgICBjb25zdCBpZmFjZTogYW55ID0gaW50ZXJmYWNlc1tkZXZOYW1lXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlmYWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhbGlhcyA9IGlmYWNlW2ldO1xuICAgICAgaWYgKFxuICAgICAgICBhbGlhcy5mYW1pbHkgPT09ICdJUHY0JyAmJlxuICAgICAgICBhbGlhcy5hZGRyZXNzICE9PSAnMTI3LjAuMC4xJyAmJlxuICAgICAgICAhYWxpYXMuaW50ZXJuYWxcbiAgICAgIClcbiAgICAgICAgcmV0dXJuIGFsaWFzLmFkZHJlc3M7XG4gICAgfVxuICB9XG4gIHJldHVybiAnMC4wLjAuMCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRNYXhMaXN0bmVycyhzZXJ2ZXJPcHRpb25zOiBTZXJ2ZXJPcHRpb25zKSB7XG4gIGlmIChzZXJ2ZXJPcHRpb25zICYmIE51bWJlci5pc0ludGVnZXIoc2VydmVyT3B0aW9ucy5tYXhMaXN0ZW5lcnMpKSB7XG4gICAgcHJvY2Vzcy5zZXRNYXhMaXN0ZW5lcnMoc2VydmVyT3B0aW9ucy5tYXhMaXN0ZW5lcnMpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1bmxpbmtBc3luYyA9IHByb21pc2lmeShmcy51bmxpbmspO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2F0YWxvZ0xpbmsoc2Vzc2lvbjogYW55KSB7XG4gIGNvbnN0IFt3aWRdID0gc2Vzc2lvbi5zcGxp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