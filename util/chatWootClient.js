"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;














var _axios = _interopRequireDefault(require("axios"));
var _formData = _interopRequireDefault(require("form-data"));
var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _bufferutils = _interopRequireDefault(require("./bufferutils"));

var _sessionUtil = require("./sessionUtil"); /*
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
 */ // import bufferUtils from './bufferutils';
class chatWootClient {constructor(config, session) {this.config = config;this.mobile_name = this.config.mobile_name ? this.config.mobile_name :
    `WPPConnect`;
    this.mobile_number = this.config.mobile_number ?
    this.config.mobile_number :
    '5511999999999';
    this.sender = {
      pushname: this.mobile_name,
      id: this.mobile_number
    };
    this.account_id = this.config.account_id;
    this.inbox_id = this.config.inbox_id;
    this.api = _axios.default.create({
      baseURL: this.config.baseURL,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        api_access_token: this.config.token
      }
    });

    //assina o evento do qrcode
    _sessionUtil.eventEmitter.on(`qrcode-${session}`, (qrCode, urlCode, client) => {
      setTimeout(async () => {
        if (config?.chatwoot?.sendQrCode !== false) {
          this.sendMessage(client, {
            sender: this.sender,
            chatId: this.mobile_number + '@c.us',
            type: 'image',
            timestamp: 'qrcode',
            mimetype: 'image/png',
            caption: 'leia o qrCode',
            qrCode: qrCode.replace('data:image/png;base64,', '')
          });
        }
      }, 1000);
    });

    //assiona o evento do status
    _sessionUtil.eventEmitter.on(`status-${session}`, (client, status) => {
      if (config?.chatwoot?.sendStatus !== false) {
        this.sendMessage(client, {
          sender: this.sender,
          chatId: this.mobile_number + '@c.us',
          body: `wppconnect status: ${status} `
        });
      }
    });

    //assina o evento de mensagem
    _sessionUtil.eventEmitter.on(`mensagem-${session}`, (client, message) => {
      this.sendMessage(client, message);
    });
  }

  // async sendMessage(client: any, message: any) {
  //   if (message.isGroupMsg || message.chatId.indexOf('@broadcast') > 0) return;
  //   const contact = await this.createContact(message);
  //   const conversation = await this.createConversation(
  //     contact,
  //     message.chatId.split('@')[0]
  //   );

  //   try {
  //     if (
  //       message.type == 'image' ||
  //       message.type == 'video' ||
  //       message.type == 'in' ||
  //       message.type == 'document' ||
  //       message.type == 'ptt' ||
  //       message.type == 'audio' ||
  //       message.type == 'sticker'
  //     ) {
  //       if (message.mimetype == 'image/webp') message.mimetype = 'image/jpeg';
  //       const extension = mime.extension(message.mimetype);
  //       const filename = `${message.timestamp}.${extension}`;
  //       let b64;

  //       if (message.qrCode) b64 = message.qrCode;
  //       else {
  //         const buffer = await client.decryptFile(message);
  //         b64 = await buffer.toString('base64');
  //       }

  //       const mediaData = Buffer.from(b64, 'base64');

  //       // Create a readable stream from the Buffer
  //       const stream = new Readable();
  //       stream.push(mediaData);
  //       stream.push(null); // Signaling the end of the stream

  //       const data = new FormData();
  //       if (message.caption) {
  //         data.append('content', message.caption);
  //       }

  //       data.append('attachments[]', stream, {
  //         filename: filename,
  //         contentType: message.mimetype,
  //       });

  //       data.append('message_type', 'incoming');
  //       data.append('private', 'false');

  //       const configPost = Object.assign(
  //         {},
  //         {
  //           baseURL: this.config.baseURL,
  //           headers: {
  //             'Content-Type': 'application/json;charset=utf-8',
  //             api_access_token: this.config.token,
  //           },
  //         }
  //       );

  //       configPost.headers = { ...configPost.headers, ...data.getHeaders() };
  //       console.log('PRÉ-REQUEST');
  //       const result = await axios.post(
  //         `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`,
  //         data,
  //         configPost
  //       );
  //       console.log('POS-REQUEST');
  //       return result;
  //     } else {
  //       const body = {
  //         content: message.body,
  //         message_type: 'incoming',
  //       };
  //       const { data } = await this.api.post(
  //         `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`,
  //         body
  //       );
  //       return data;
  //     }
  //   } catch (e) {
  //     return null;
  //   }
  // }

  async sendMessage(client, message) {
    if (message.isGroupMsg || message.chatId.indexOf('@broadcast') > 0) return;

    const contact = await this.createContact(message);
    const conversation = await this.createConversation(
      contact,
      message.chatId.split('@')[0]
    );

    try {
      if (
      [
      'image',
      'video',
      'in',
      'document',
      'ptt',
      'audio',
      'sticker'].
      includes(message.type))
      {
        if (message.mimetype === 'image/webp') message.mimetype = 'image/jpeg';
        const extension = _mimeTypes.default.extension(message.mimetype);
        const filename = `${message.timestamp}.${extension}`;
        let b64;

        if (message.qrCode) {
          b64 = message.qrCode;
        } else {
          const buffer = await client.decryptFile(message);
          b64 = buffer.toString('base64');
        }

        const mediaData = Buffer.from(b64, 'base64');
        const stream = _bufferutils.default.bufferToReadableStream(mediaData);

        const data = new _formData.default();
        if (message.caption) {
          data.append('content', message.caption);
        }

        data.append('attachments[]', stream, {
          filename: filename,
          contentType: message.mimetype
        });

        data.append('message_type', 'incoming');
        data.append('private', 'false');

        const configPost = {
          baseURL: this.config.baseURL,
          headers: {
            api_access_token: this.config.token,
            ...data.getHeaders()
          }
        };
        const endpoint = `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`;

        const result = await _axios.default.post(endpoint, data, configPost);

        return result;
      } else {
        const body = {
          content: message.body,
          message_type: 'incoming'
        };
        const endpoint = `api/v1/accounts/${this.account_id}/conversations/${conversation.id}/messages`;

        const { data } = await this.api.post(endpoint, body);
        return data;
      }
    } catch (e) {
      console.error('Error sending message:', e);
      return null;
    }
  }

  async findContact(query) {
    try {
      const { data } = await this.api.get(
        `api/v1/accounts/${this.account_id}/contacts/search/?q=${query}`
      );
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async createContact(message) {
    const body = {
      inbox_id: this.inbox_id,
      name: message.sender.isMyContact ?
      message.sender.formattedName :
      message.sender.pushname || message.sender.formattedName,
      phone_number:
      typeof message.sender.id == 'object' ?
      message.sender.id.user :
      message.sender.id.split('@')[0]
    };
    body.phone_number = `+${body.phone_number}`;
    const contact = await this.findContact(body.phone_number.replace('+', ''));
    if (contact && contact.meta.count > 0) return contact.payload[0];

    try {
      const data = await this.api.post(
        `api/v1/accounts/${this.account_id}/contacts`,
        body
      );
      return data.data.payload.contact;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findConversation(contact) {
    try {
      const { data } = await this.api.get(
        `api/v1/accounts/${this.account_id}/contacts/${contact.id}/conversations`
      );
      return data.payload.find(
        (e) => e.inbox_id == this.inbox_id && e.status != 'resolved'
      );
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async createConversation(contact, source_id) {
    const conversation = await this.findConversation(contact);
    if (conversation) return conversation;

    const body = {
      source_id: source_id,
      inbox_id: this.inbox_id,
      contact_id: contact.id,
      status: 'open'
    };

    try {
      const { data } = await this.api.post(
        `api/v1/accounts/${this.account_id}/conversations`,
        body
      );
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}exports.default = chatWootClient;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXhpb3MiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9mb3JtRGF0YSIsIl9taW1lVHlwZXMiLCJfYnVmZmVydXRpbHMiLCJfc2Vzc2lvblV0aWwiLCJjaGF0V29vdENsaWVudCIsImNvbnN0cnVjdG9yIiwiY29uZmlnIiwic2Vzc2lvbiIsIm1vYmlsZV9uYW1lIiwibW9iaWxlX251bWJlciIsInNlbmRlciIsInB1c2huYW1lIiwiaWQiLCJhY2NvdW50X2lkIiwiaW5ib3hfaWQiLCJhcGkiLCJheGlvcyIsImNyZWF0ZSIsImJhc2VVUkwiLCJoZWFkZXJzIiwiYXBpX2FjY2Vzc190b2tlbiIsInRva2VuIiwiZXZlbnRFbWl0dGVyIiwib24iLCJxckNvZGUiLCJ1cmxDb2RlIiwiY2xpZW50Iiwic2V0VGltZW91dCIsImNoYXR3b290Iiwic2VuZFFyQ29kZSIsInNlbmRNZXNzYWdlIiwiY2hhdElkIiwidHlwZSIsInRpbWVzdGFtcCIsIm1pbWV0eXBlIiwiY2FwdGlvbiIsInJlcGxhY2UiLCJzdGF0dXMiLCJzZW5kU3RhdHVzIiwiYm9keSIsIm1lc3NhZ2UiLCJpc0dyb3VwTXNnIiwiaW5kZXhPZiIsImNvbnRhY3QiLCJjcmVhdGVDb250YWN0IiwiY29udmVyc2F0aW9uIiwiY3JlYXRlQ29udmVyc2F0aW9uIiwic3BsaXQiLCJpbmNsdWRlcyIsImV4dGVuc2lvbiIsIm1pbWUiLCJmaWxlbmFtZSIsImI2NCIsImJ1ZmZlciIsImRlY3J5cHRGaWxlIiwidG9TdHJpbmciLCJtZWRpYURhdGEiLCJCdWZmZXIiLCJmcm9tIiwic3RyZWFtIiwiYnVmZmVydXRpbHMiLCJidWZmZXJUb1JlYWRhYmxlU3RyZWFtIiwiZGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwiY29udGVudFR5cGUiLCJjb25maWdQb3N0IiwiZ2V0SGVhZGVycyIsImVuZHBvaW50IiwicmVzdWx0IiwicG9zdCIsImNvbnRlbnQiLCJtZXNzYWdlX3R5cGUiLCJlIiwiY29uc29sZSIsImVycm9yIiwiZmluZENvbnRhY3QiLCJxdWVyeSIsImdldCIsImxvZyIsIm5hbWUiLCJpc015Q29udGFjdCIsImZvcm1hdHRlZE5hbWUiLCJwaG9uZV9udW1iZXIiLCJ1c2VyIiwibWV0YSIsImNvdW50IiwicGF5bG9hZCIsImZpbmRDb252ZXJzYXRpb24iLCJmaW5kIiwic291cmNlX2lkIiwiY29udGFjdF9pZCIsImV4cG9ydHMiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvY2hhdFdvb3RDbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDIxIFdQUENvbm5lY3QgVGVhbVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IGF4aW9zLCB7IEF4aW9zSW5zdGFuY2UsIEF4aW9zUmVxdWVzdENvbmZpZyB9IGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IGRlZmF1bHQgYXMgRm9ybURhdGEgfSBmcm9tICdmb3JtLWRhdGEnO1xuaW1wb3J0IG1pbWUgZnJvbSAnbWltZS10eXBlcyc7XG5cbmltcG9ydCBidWZmZXJ1dGlscyBmcm9tICcuL2J1ZmZlcnV0aWxzJztcbi8vIGltcG9ydCBidWZmZXJVdGlscyBmcm9tICcuL2J1ZmZlcnV0aWxzJztcbmltcG9ydCB7IGV2ZW50RW1pdHRlciB9IGZyb20gJy4vc2Vzc2lvblV0aWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBjaGF0V29vdENsaWVudCB7XG4gIGRlY2xhcmUgY29uZmlnOiBhbnk7XG4gIGRlY2xhcmUgc2Vzc2lvbjogYW55O1xuICBkZWNsYXJlIG1vYmlsZV9uYW1lOiBhbnk7XG4gIGRlY2xhcmUgbW9iaWxlX251bWJlcjogYW55O1xuICBkZWNsYXJlIHNlbmRlcjogYW55O1xuICBkZWNsYXJlIGFjY291bnRfaWQ6IGFueTtcbiAgZGVjbGFyZSBpbmJveF9pZDogYW55O1xuICBkZWNsYXJlIGFwaTogQXhpb3NJbnN0YW5jZTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IGFueSwgc2Vzc2lvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5tb2JpbGVfbmFtZSA9IHRoaXMuY29uZmlnLm1vYmlsZV9uYW1lXG4gICAgICA/IHRoaXMuY29uZmlnLm1vYmlsZV9uYW1lXG4gICAgICA6IGBXUFBDb25uZWN0YDtcbiAgICB0aGlzLm1vYmlsZV9udW1iZXIgPSB0aGlzLmNvbmZpZy5tb2JpbGVfbnVtYmVyXG4gICAgICA/IHRoaXMuY29uZmlnLm1vYmlsZV9udW1iZXJcbiAgICAgIDogJzU1MTE5OTk5OTk5OTknO1xuICAgIHRoaXMuc2VuZGVyID0ge1xuICAgICAgcHVzaG5hbWU6IHRoaXMubW9iaWxlX25hbWUsXG4gICAgICBpZDogdGhpcy5tb2JpbGVfbnVtYmVyLFxuICAgIH07XG4gICAgdGhpcy5hY2NvdW50X2lkID0gdGhpcy5jb25maWcuYWNjb3VudF9pZDtcbiAgICB0aGlzLmluYm94X2lkID0gdGhpcy5jb25maWcuaW5ib3hfaWQ7XG4gICAgdGhpcy5hcGkgPSBheGlvcy5jcmVhdGUoe1xuICAgICAgYmFzZVVSTDogdGhpcy5jb25maWcuYmFzZVVSTCxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnLFxuICAgICAgICBhcGlfYWNjZXNzX3Rva2VuOiB0aGlzLmNvbmZpZy50b2tlbixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvL2Fzc2luYSBvIGV2ZW50byBkbyBxcmNvZGVcbiAgICBldmVudEVtaXR0ZXIub24oYHFyY29kZS0ke3Nlc3Npb259YCwgKHFyQ29kZSwgdXJsQ29kZSwgY2xpZW50KSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKGNvbmZpZz8uY2hhdHdvb3Q/LnNlbmRRckNvZGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShjbGllbnQsIHtcbiAgICAgICAgICAgIHNlbmRlcjogdGhpcy5zZW5kZXIsXG4gICAgICAgICAgICBjaGF0SWQ6IHRoaXMubW9iaWxlX251bWJlciArICdAYy51cycsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICAgICAgdGltZXN0YW1wOiAncXJjb2RlJyxcbiAgICAgICAgICAgIG1pbWV0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICdsZWlhIG8gcXJDb2RlJyxcbiAgICAgICAgICAgIHFyQ29kZTogcXJDb2RlLnJlcGxhY2UoJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwnLCAnJyksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMDApO1xuICAgIH0pO1xuXG4gICAgLy9hc3Npb25hIG8gZXZlbnRvIGRvIHN0YXR1c1xuICAgIGV2ZW50RW1pdHRlci5vbihgc3RhdHVzLSR7c2Vzc2lvbn1gLCAoY2xpZW50LCBzdGF0dXMpID0+IHtcbiAgICAgIGlmIChjb25maWc/LmNoYXR3b290Py5zZW5kU3RhdHVzICE9PSBmYWxzZSkge1xuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGNsaWVudCwge1xuICAgICAgICAgIHNlbmRlcjogdGhpcy5zZW5kZXIsXG4gICAgICAgICAgY2hhdElkOiB0aGlzLm1vYmlsZV9udW1iZXIgKyAnQGMudXMnLFxuICAgICAgICAgIGJvZHk6IGB3cHBjb25uZWN0IHN0YXR1czogJHtzdGF0dXN9IGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9hc3NpbmEgbyBldmVudG8gZGUgbWVuc2FnZW1cbiAgICBldmVudEVtaXR0ZXIub24oYG1lbnNhZ2VtLSR7c2Vzc2lvbn1gLCAoY2xpZW50LCBtZXNzYWdlKSA9PiB7XG4gICAgICB0aGlzLnNlbmRNZXNzYWdlKGNsaWVudCwgbWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBhc3luYyBzZW5kTWVzc2FnZShjbGllbnQ6IGFueSwgbWVzc2FnZTogYW55KSB7XG4gIC8vICAgaWYgKG1lc3NhZ2UuaXNHcm91cE1zZyB8fCBtZXNzYWdlLmNoYXRJZC5pbmRleE9mKCdAYnJvYWRjYXN0JykgPiAwKSByZXR1cm47XG4gIC8vICAgY29uc3QgY29udGFjdCA9IGF3YWl0IHRoaXMuY3JlYXRlQ29udGFjdChtZXNzYWdlKTtcbiAgLy8gICBjb25zdCBjb252ZXJzYXRpb24gPSBhd2FpdCB0aGlzLmNyZWF0ZUNvbnZlcnNhdGlvbihcbiAgLy8gICAgIGNvbnRhY3QsXG4gIC8vICAgICBtZXNzYWdlLmNoYXRJZC5zcGxpdCgnQCcpWzBdXG4gIC8vICAgKTtcblxuICAvLyAgIHRyeSB7XG4gIC8vICAgICBpZiAoXG4gIC8vICAgICAgIG1lc3NhZ2UudHlwZSA9PSAnaW1hZ2UnIHx8XG4gIC8vICAgICAgIG1lc3NhZ2UudHlwZSA9PSAndmlkZW8nIHx8XG4gIC8vICAgICAgIG1lc3NhZ2UudHlwZSA9PSAnaW4nIHx8XG4gIC8vICAgICAgIG1lc3NhZ2UudHlwZSA9PSAnZG9jdW1lbnQnIHx8XG4gIC8vICAgICAgIG1lc3NhZ2UudHlwZSA9PSAncHR0JyB8fFxuICAvLyAgICAgICBtZXNzYWdlLnR5cGUgPT0gJ2F1ZGlvJyB8fFxuICAvLyAgICAgICBtZXNzYWdlLnR5cGUgPT0gJ3N0aWNrZXInXG4gIC8vICAgICApIHtcbiAgLy8gICAgICAgaWYgKG1lc3NhZ2UubWltZXR5cGUgPT0gJ2ltYWdlL3dlYnAnKSBtZXNzYWdlLm1pbWV0eXBlID0gJ2ltYWdlL2pwZWcnO1xuICAvLyAgICAgICBjb25zdCBleHRlbnNpb24gPSBtaW1lLmV4dGVuc2lvbihtZXNzYWdlLm1pbWV0eXBlKTtcbiAgLy8gICAgICAgY29uc3QgZmlsZW5hbWUgPSBgJHttZXNzYWdlLnRpbWVzdGFtcH0uJHtleHRlbnNpb259YDtcbiAgLy8gICAgICAgbGV0IGI2NDtcblxuICAvLyAgICAgICBpZiAobWVzc2FnZS5xckNvZGUpIGI2NCA9IG1lc3NhZ2UucXJDb2RlO1xuICAvLyAgICAgICBlbHNlIHtcbiAgLy8gICAgICAgICBjb25zdCBidWZmZXIgPSBhd2FpdCBjbGllbnQuZGVjcnlwdEZpbGUobWVzc2FnZSk7XG4gIC8vICAgICAgICAgYjY0ID0gYXdhaXQgYnVmZmVyLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgLy8gICAgICAgfVxuXG4gIC8vICAgICAgIGNvbnN0IG1lZGlhRGF0YSA9IEJ1ZmZlci5mcm9tKGI2NCwgJ2Jhc2U2NCcpO1xuXG4gIC8vICAgICAgIC8vIENyZWF0ZSBhIHJlYWRhYmxlIHN0cmVhbSBmcm9tIHRoZSBCdWZmZXJcbiAgLy8gICAgICAgY29uc3Qgc3RyZWFtID0gbmV3IFJlYWRhYmxlKCk7XG4gIC8vICAgICAgIHN0cmVhbS5wdXNoKG1lZGlhRGF0YSk7XG4gIC8vICAgICAgIHN0cmVhbS5wdXNoKG51bGwpOyAvLyBTaWduYWxpbmcgdGhlIGVuZCBvZiB0aGUgc3RyZWFtXG5cbiAgLy8gICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAvLyAgICAgICBpZiAobWVzc2FnZS5jYXB0aW9uKSB7XG4gIC8vICAgICAgICAgZGF0YS5hcHBlbmQoJ2NvbnRlbnQnLCBtZXNzYWdlLmNhcHRpb24pO1xuICAvLyAgICAgICB9XG5cbiAgLy8gICAgICAgZGF0YS5hcHBlbmQoJ2F0dGFjaG1lbnRzW10nLCBzdHJlYW0sIHtcbiAgLy8gICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWUsXG4gIC8vICAgICAgICAgY29udGVudFR5cGU6IG1lc3NhZ2UubWltZXR5cGUsXG4gIC8vICAgICAgIH0pO1xuXG4gIC8vICAgICAgIGRhdGEuYXBwZW5kKCdtZXNzYWdlX3R5cGUnLCAnaW5jb21pbmcnKTtcbiAgLy8gICAgICAgZGF0YS5hcHBlbmQoJ3ByaXZhdGUnLCAnZmFsc2UnKTtcblxuICAvLyAgICAgICBjb25zdCBjb25maWdQb3N0ID0gT2JqZWN0LmFzc2lnbihcbiAgLy8gICAgICAgICB7fSxcbiAgLy8gICAgICAgICB7XG4gIC8vICAgICAgICAgICBiYXNlVVJMOiB0aGlzLmNvbmZpZy5iYXNlVVJMLFxuICAvLyAgICAgICAgICAgaGVhZGVyczoge1xuICAvLyAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcsXG4gIC8vICAgICAgICAgICAgIGFwaV9hY2Nlc3NfdG9rZW46IHRoaXMuY29uZmlnLnRva2VuLFxuICAvLyAgICAgICAgICAgfSxcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgICk7XG5cbiAgLy8gICAgICAgY29uZmlnUG9zdC5oZWFkZXJzID0geyAuLi5jb25maWdQb3N0LmhlYWRlcnMsIC4uLmRhdGEuZ2V0SGVhZGVycygpIH07XG4gIC8vICAgICAgIGNvbnNvbGUubG9nKCdQUsOJLVJFUVVFU1QnKTtcbiAgLy8gICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXhpb3MucG9zdChcbiAgLy8gICAgICAgICBgYXBpL3YxL2FjY291bnRzLyR7dGhpcy5hY2NvdW50X2lkfS9jb252ZXJzYXRpb25zLyR7Y29udmVyc2F0aW9uLmlkfS9tZXNzYWdlc2AsXG4gIC8vICAgICAgICAgZGF0YSxcbiAgLy8gICAgICAgICBjb25maWdQb3N0XG4gIC8vICAgICAgICk7XG4gIC8vICAgICAgIGNvbnNvbGUubG9nKCdQT1MtUkVRVUVTVCcpO1xuICAvLyAgICAgICByZXR1cm4gcmVzdWx0O1xuICAvLyAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgY29uc3QgYm9keSA9IHtcbiAgLy8gICAgICAgICBjb250ZW50OiBtZXNzYWdlLmJvZHksXG4gIC8vICAgICAgICAgbWVzc2FnZV90eXBlOiAnaW5jb21pbmcnLFxuICAvLyAgICAgICB9O1xuICAvLyAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuYXBpLnBvc3QoXG4gIC8vICAgICAgICAgYGFwaS92MS9hY2NvdW50cy8ke3RoaXMuYWNjb3VudF9pZH0vY29udmVyc2F0aW9ucy8ke2NvbnZlcnNhdGlvbi5pZH0vbWVzc2FnZXNgLFxuICAvLyAgICAgICAgIGJvZHlcbiAgLy8gICAgICAgKTtcbiAgLy8gICAgICAgcmV0dXJuIGRhdGE7XG4gIC8vICAgICB9XG4gIC8vICAgfSBjYXRjaCAoZSkge1xuICAvLyAgICAgcmV0dXJuIG51bGw7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgYXN5bmMgc2VuZE1lc3NhZ2UoY2xpZW50OiBhbnksIG1lc3NhZ2U6IGFueSkge1xuICAgIGlmIChtZXNzYWdlLmlzR3JvdXBNc2cgfHwgbWVzc2FnZS5jaGF0SWQuaW5kZXhPZignQGJyb2FkY2FzdCcpID4gMCkgcmV0dXJuO1xuXG4gICAgY29uc3QgY29udGFjdCA9IGF3YWl0IHRoaXMuY3JlYXRlQ29udGFjdChtZXNzYWdlKTtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBhd2FpdCB0aGlzLmNyZWF0ZUNvbnZlcnNhdGlvbihcbiAgICAgIGNvbnRhY3QsXG4gICAgICBtZXNzYWdlLmNoYXRJZC5zcGxpdCgnQCcpWzBdXG4gICAgKTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAoXG4gICAgICAgIFtcbiAgICAgICAgICAnaW1hZ2UnLFxuICAgICAgICAgICd2aWRlbycsXG4gICAgICAgICAgJ2luJyxcbiAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICdwdHQnLFxuICAgICAgICAgICdhdWRpbycsXG4gICAgICAgICAgJ3N0aWNrZXInLFxuICAgICAgICBdLmluY2x1ZGVzKG1lc3NhZ2UudHlwZSlcbiAgICAgICkge1xuICAgICAgICBpZiAobWVzc2FnZS5taW1ldHlwZSA9PT0gJ2ltYWdlL3dlYnAnKSBtZXNzYWdlLm1pbWV0eXBlID0gJ2ltYWdlL2pwZWcnO1xuICAgICAgICBjb25zdCBleHRlbnNpb24gPSBtaW1lLmV4dGVuc2lvbihtZXNzYWdlLm1pbWV0eXBlKTtcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBgJHttZXNzYWdlLnRpbWVzdGFtcH0uJHtleHRlbnNpb259YDtcbiAgICAgICAgbGV0IGI2NDtcblxuICAgICAgICBpZiAobWVzc2FnZS5xckNvZGUpIHtcbiAgICAgICAgICBiNjQgPSBtZXNzYWdlLnFyQ29kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBidWZmZXIgPSBhd2FpdCBjbGllbnQuZGVjcnlwdEZpbGUobWVzc2FnZSk7XG4gICAgICAgICAgYjY0ID0gYnVmZmVyLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1lZGlhRGF0YSA9IEJ1ZmZlci5mcm9tKGI2NCwgJ2Jhc2U2NCcpO1xuICAgICAgICBjb25zdCBzdHJlYW0gPSBidWZmZXJ1dGlscy5idWZmZXJUb1JlYWRhYmxlU3RyZWFtKG1lZGlhRGF0YSk7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICBpZiAobWVzc2FnZS5jYXB0aW9uKSB7XG4gICAgICAgICAgZGF0YS5hcHBlbmQoJ2NvbnRlbnQnLCBtZXNzYWdlLmNhcHRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YS5hcHBlbmQoJ2F0dGFjaG1lbnRzW10nLCBzdHJlYW0sIHtcbiAgICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWUsXG4gICAgICAgICAgY29udGVudFR5cGU6IG1lc3NhZ2UubWltZXR5cGUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRhdGEuYXBwZW5kKCdtZXNzYWdlX3R5cGUnLCAnaW5jb21pbmcnKTtcbiAgICAgICAgZGF0YS5hcHBlbmQoJ3ByaXZhdGUnLCAnZmFsc2UnKTtcblxuICAgICAgICBjb25zdCBjb25maWdQb3N0OiBBeGlvc1JlcXVlc3RDb25maWcgPSB7XG4gICAgICAgICAgYmFzZVVSTDogdGhpcy5jb25maWcuYmFzZVVSTCxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBhcGlfYWNjZXNzX3Rva2VuOiB0aGlzLmNvbmZpZy50b2tlbixcbiAgICAgICAgICAgIC4uLmRhdGEuZ2V0SGVhZGVycygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVuZHBvaW50ID0gYGFwaS92MS9hY2NvdW50cy8ke3RoaXMuYWNjb3VudF9pZH0vY29udmVyc2F0aW9ucy8ke2NvbnZlcnNhdGlvbi5pZH0vbWVzc2FnZXNgO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGF4aW9zLnBvc3QoZW5kcG9pbnQsIGRhdGEsIGNvbmZpZ1Bvc3QpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBib2R5ID0ge1xuICAgICAgICAgIGNvbnRlbnQ6IG1lc3NhZ2UuYm9keSxcbiAgICAgICAgICBtZXNzYWdlX3R5cGU6ICdpbmNvbWluZycsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVuZHBvaW50ID0gYGFwaS92MS9hY2NvdW50cy8ke3RoaXMuYWNjb3VudF9pZH0vY29udmVyc2F0aW9ucy8ke2NvbnZlcnNhdGlvbi5pZH0vbWVzc2FnZXNgO1xuXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGkucG9zdChlbmRwb2ludCwgYm9keSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNlbmRpbmcgbWVzc2FnZTonLCBlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmRDb250YWN0KHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLmFwaS5nZXQoXG4gICAgICAgIGBhcGkvdjEvYWNjb3VudHMvJHt0aGlzLmFjY291bnRfaWR9L2NvbnRhY3RzL3NlYXJjaC8/cT0ke3F1ZXJ5fWBcbiAgICAgICk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUNvbnRhY3QobWVzc2FnZTogYW55KSB7XG4gICAgY29uc3QgYm9keSA9IHtcbiAgICAgIGluYm94X2lkOiB0aGlzLmluYm94X2lkLFxuICAgICAgbmFtZTogbWVzc2FnZS5zZW5kZXIuaXNNeUNvbnRhY3RcbiAgICAgICAgPyBtZXNzYWdlLnNlbmRlci5mb3JtYXR0ZWROYW1lXG4gICAgICAgIDogbWVzc2FnZS5zZW5kZXIucHVzaG5hbWUgfHwgbWVzc2FnZS5zZW5kZXIuZm9ybWF0dGVkTmFtZSxcbiAgICAgIHBob25lX251bWJlcjpcbiAgICAgICAgdHlwZW9mIG1lc3NhZ2Uuc2VuZGVyLmlkID09ICdvYmplY3QnXG4gICAgICAgICAgPyBtZXNzYWdlLnNlbmRlci5pZC51c2VyXG4gICAgICAgICAgOiBtZXNzYWdlLnNlbmRlci5pZC5zcGxpdCgnQCcpWzBdLFxuICAgIH07XG4gICAgYm9keS5waG9uZV9udW1iZXIgPSBgKyR7Ym9keS5waG9uZV9udW1iZXJ9YDtcbiAgICBjb25zdCBjb250YWN0ID0gYXdhaXQgdGhpcy5maW5kQ29udGFjdChib2R5LnBob25lX251bWJlci5yZXBsYWNlKCcrJywgJycpKTtcbiAgICBpZiAoY29udGFjdCAmJiBjb250YWN0Lm1ldGEuY291bnQgPiAwKSByZXR1cm4gY29udGFjdC5wYXlsb2FkWzBdO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmFwaS5wb3N0KFxuICAgICAgICBgYXBpL3YxL2FjY291bnRzLyR7dGhpcy5hY2NvdW50X2lkfS9jb250YWN0c2AsXG4gICAgICAgIGJvZHlcbiAgICAgICk7XG4gICAgICByZXR1cm4gZGF0YS5kYXRhLnBheWxvYWQuY29udGFjdDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmRDb252ZXJzYXRpb24oY29udGFjdDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGkuZ2V0KFxuICAgICAgICBgYXBpL3YxL2FjY291bnRzLyR7dGhpcy5hY2NvdW50X2lkfS9jb250YWN0cy8ke2NvbnRhY3QuaWR9L2NvbnZlcnNhdGlvbnNgXG4gICAgICApO1xuICAgICAgcmV0dXJuIGRhdGEucGF5bG9hZC5maW5kKFxuICAgICAgICAoZTogYW55KSA9PiBlLmluYm94X2lkID09IHRoaXMuaW5ib3hfaWQgJiYgZS5zdGF0dXMgIT0gJ3Jlc29sdmVkJ1xuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUNvbnZlcnNhdGlvbihjb250YWN0OiBhbnksIHNvdXJjZV9pZDogYW55KSB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gYXdhaXQgdGhpcy5maW5kQ29udmVyc2F0aW9uKGNvbnRhY3QpO1xuICAgIGlmIChjb252ZXJzYXRpb24pIHJldHVybiBjb252ZXJzYXRpb247XG5cbiAgICBjb25zdCBib2R5ID0ge1xuICAgICAgc291cmNlX2lkOiBzb3VyY2VfaWQsXG4gICAgICBpbmJveF9pZDogdGhpcy5pbmJveF9pZCxcbiAgICAgIGNvbnRhY3RfaWQ6IGNvbnRhY3QuaWQsXG4gICAgICBzdGF0dXM6ICdvcGVuJyxcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGkucG9zdChcbiAgICAgICAgYGFwaS92MS9hY2NvdW50cy8ke3RoaXMuYWNjb3VudF9pZH0vY29udmVyc2F0aW9uc2AsXG4gICAgICAgIGJvZHlcbiAgICAgICk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxTQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxVQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7O0FBRUEsSUFBQUcsWUFBQSxHQUFBSixzQkFBQSxDQUFBQyxPQUFBOztBQUVBLElBQUFJLFlBQUEsR0FBQUosT0FBQSxrQkFBNkMsQ0FyQjdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQWRBLENBb0JBO0FBR2UsTUFBTUssY0FBYyxDQUFDLENBVWxDQyxXQUFXQSxDQUFDQyxNQUFXLEVBQUVDLE9B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