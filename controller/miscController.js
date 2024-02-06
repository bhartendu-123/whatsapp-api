"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.backupAllSessions = backupAllSessions;exports.clearSessionData = clearSessionData;exports.restoreAllSessions = restoreAllSessions;exports.setLimit = setLimit;exports.takeScreenshot = takeScreenshot;
















var _fs = _interopRequireDefault(require("fs"));

var _ = require("..");
var _config = _interopRequireDefault(require("../config"));
var _manageSession = require("../util/manageSession");
var _sessionUtil = require("../util/sessionUtil"); /*
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
 */async function backupAllSessions(req, res) {/**
     * #swagger.tags = ["Misc"]
     * #swagger.description = 'Please, open the router in your browser, in swagger this not run'
     * #swagger.produces = ['application/octet-stream']
     * #swagger.consumes = ['application/octet-stream']
       #swagger.autoBody=false
       #swagger.parameters["secretkey"] = {
          required: true,
          schema: 'THISISMYSECURETOKEN'
       }
       #swagger.responses[200] = {
        description: 'A ZIP file contaings your backup. Please, open this link in your browser',
        content: {
          "application/zip": {
            schema: {}
          }
        },
      }
     */const { secretkey } = req.params;if (secretkey !== _config.default.secretKey) {return res.status(400).json({ response: 'error', message: 'The token is incorrect' });}try {res.setHeader('Content-Type', 'application/zip');
    return res.send(await (0, _manageSession.backupSessions)(req));
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error on backup session',
      error: error
    });
  }
}

async function restoreAllSessions(req, res) {
  /**
   #swagger.tags = ["Misc"]
   #swagger.autoBody=false
    #swagger.parameters["secretkey"] = {
    required: true,
    schema: 'THISISMYSECURETOKEN'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: "string",
                format: "binary"
              }
            },
            required: ['file'],
          }
        }
      }
    }
  */
  const { secretkey } = req.params;

  if (secretkey !== _config.default.secretKey) {
    return res.status(400).json({
      response: 'error',
      message: 'The token is incorrect'
    });
  }

  try {
    const result = await (0, _manageSession.restoreSessions)(req, req.file);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error on restore session',
      error: error
    });
  }
}

async function takeScreenshot(req, res) {
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
    const result = await req.client.takeScreenshot();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error on take screenshot',
      error: error
    });
  }
}

async function clearSessionData(req, res) {
  /**
   #swagger.tags = ["Misc"]
   #swagger.autoBody=false
    #swagger.parameters["secretkey"] = {
    required: true,
    schema: 'THISISMYSECURETOKEN'
    }
    #swagger.parameters["session"] = {
    schema: 'NERDWHATS_AMERICA'
    }
  */

  try {
    const { secretkey, session } = req.params;

    if (secretkey !== _config.default.secretKey) {
      return res.status(400).json({
        response: 'error',
        message: 'The token is incorrect'
      });
    }
    if (req?.client?.page) {
      delete _sessionUtil.clientsArray[req.params.session];
      await req.client.logout();
    }
    const path = _config.default.customUserDataDir + session;
    const pathToken = __dirname + `../../../tokens/${session}.data.json`;
    if (_fs.default.existsSync(path)) {
      await _fs.default.promises.rm(path, {
        recursive: true
      });
    }
    if (_fs.default.existsSync(pathToken)) {
      await _fs.default.promises.rm(pathToken);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    _.logger.error(error);
    return res.status(500).json({
      status: false,
      message: 'Error on clear session data',
      error: error
    });
  }
}

async function setLimit(req, res) {
  /**
   #swagger.tags = ["Misc"]
   #swagger.description = 'Change limits of whatsapp web. Types value: maxMediaSize, maxFileSize, maxShare, statusVideoMaxDuration, unlimitedPin;'
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
              type: { type: 'string' },
              value: { type: 'any' },
            },
            required: ['type', 'value'],
          },
          examples: {
            'Default': {
              value: {
                type: 'maxFileSize',
                value: 104857600
              },
            },
          },
        },
      },
    }
  */

  try {
    const { type, value } = req.body;
    if (!type || !value) throw new Error('Send de type and value');

    const result = await req.client.setLimit(type, value);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error on set limit',
      error: error
    });
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl8iLCJfY29uZmlnIiwiX21hbmFnZVNlc3Npb24iLCJfc2Vzc2lvblV0aWwiLCJiYWNrdXBBbGxTZXNzaW9ucyIsInJlcSIsInJlcyIsInNlY3JldGtleSIsInBhcmFtcyIsImNvbmZpZyIsInNlY3JldEtleSIsInN0YXR1cyIsImpzb24iLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJzZXRIZWFkZXIiLCJzZW5kIiwiYmFja3VwU2Vzc2lvbnMiLCJlcnJvciIsInJlc3RvcmVBbGxTZXNzaW9ucyIsInJlc3VsdCIsInJlc3RvcmVTZXNzaW9ucyIsImZpbGUiLCJ0YWtlU2NyZWVuc2hvdCIsImNsaWVudCIsImNsZWFyU2Vzc2lvbkRhdGEiLCJzZXNzaW9uIiwicGFnZSIsImNsaWVudHNBcnJheSIsImxvZ291dCIsInBhdGgiLCJjdXN0b21Vc2VyRGF0YURpciIsInBhdGhUb2tlbiIsIl9fZGlybmFtZSIsImZzIiwiZXhpc3RzU3luYyIsInByb21pc2VzIiwicm0iLCJyZWN1cnNpdmUiLCJzdWNjZXNzIiwibG9nZ2VyIiwic2V0TGltaXQiLCJ0eXBlIiwidmFsdWUiLCJib2R5IiwiRXJyb3IiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlci9taXNjQ29udHJvbGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMjMgV1BQQ29ubmVjdCBUZWFtXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLic7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBiYWNrdXBTZXNzaW9ucywgcmVzdG9yZVNlc3Npb25zIH0gZnJvbSAnLi4vdXRpbC9tYW5hZ2VTZXNzaW9uJztcbmltcG9ydCB7IGNsaWVudHNBcnJheSB9IGZyb20gJy4uL3V0aWwvc2Vzc2lvblV0aWwnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYmFja3VwQWxsU2Vzc2lvbnMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAgICogI3N3YWdnZXIuZGVzY3JpcHRpb24gPSAnUGxlYXNlLCBvcGVuIHRoZSByb3V0ZXIgaW4geW91ciBicm93c2VyLCBpbiBzd2FnZ2VyIHRoaXMgbm90IHJ1bidcbiAgICAgKiAjc3dhZ2dlci5wcm9kdWNlcyA9IFsnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ11cbiAgICAgKiAjc3dhZ2dlci5jb25zdW1lcyA9IFsnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ11cbiAgICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZWNyZXRrZXlcIl0gPSB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgc2NoZW1hOiAnVEhJU0lTTVlTRUNVUkVUT0tFTidcbiAgICAgICB9XG4gICAgICAgI3N3YWdnZXIucmVzcG9uc2VzWzIwMF0gPSB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQSBaSVAgZmlsZSBjb250YWluZ3MgeW91ciBiYWNrdXAuIFBsZWFzZSwgb3BlbiB0aGlzIGxpbmsgaW4geW91ciBicm93c2VyJyxcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIFwiYXBwbGljYXRpb24vemlwXCI6IHtcbiAgICAgICAgICAgIHNjaGVtYToge31cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICovXG4gIGNvbnN0IHsgc2VjcmV0a2V5IH0gPSByZXEucGFyYW1zO1xuXG4gIGlmIChzZWNyZXRrZXkgIT09IGNvbmZpZy5zZWNyZXRLZXkpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgcmVzcG9uc2U6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAnVGhlIHRva2VuIGlzIGluY29ycmVjdCcsXG4gICAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi96aXAnKTtcbiAgICByZXR1cm4gcmVzLnNlbmQoYXdhaXQgYmFja3VwU2Vzc2lvbnMocmVxKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gYmFja3VwIHNlc3Npb24nLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXN0b3JlQWxsU2Vzc2lvbnMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgI3N3YWdnZXIudGFncyA9IFtcIk1pc2NcIl1cbiAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlY3JldGtleVwiXSA9IHtcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBzY2hlbWE6ICdUSElTSVNNWVNFQ1VSRVRPS0VOJ1xuICAgIH1cbiAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgY29udGVudDoge1xuICAgICAgICBcIm11bHRpcGFydC9mb3JtLWRhdGFcIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGZpbGU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogXCJiaW5hcnlcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFsnZmlsZSddLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgKi9cbiAgY29uc3QgeyBzZWNyZXRrZXkgfSA9IHJlcS5wYXJhbXM7XG5cbiAgaWYgKHNlY3JldGtleSAhPT0gY29uZmlnLnNlY3JldEtleSkge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICByZXNwb25zZTogJ2Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdUaGUgdG9rZW4gaXMgaW5jb3JyZWN0JyxcbiAgICB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzdG9yZVNlc3Npb25zKHJlcSwgcmVxLmZpbGUgYXMgYW55KTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24ocmVzdWx0KTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIHJlc3RvcmUgc2Vzc2lvbicsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRha2VTY3JlZW5zaG90KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJNaXNjXCJdXG4gICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICB9XVxuICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgIH1cbiAgKi9cblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcS5jbGllbnQudGFrZVNjcmVlbnNob3QoKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24ocmVzdWx0KTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIHRha2Ugc2NyZWVuc2hvdCcsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsZWFyU2Vzc2lvbkRhdGEocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgI3N3YWdnZXIudGFncyA9IFtcIk1pc2NcIl1cbiAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlY3JldGtleVwiXSA9IHtcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBzY2hlbWE6ICdUSElTSVNNWVNFQ1VSRVRPS0VOJ1xuICAgIH1cbiAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICB9XG4gICovXG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IHNlY3JldGtleSwgc2Vzc2lvbiB9ID0gcmVxLnBhcmFtcztcblxuICAgIGlmIChzZWNyZXRrZXkgIT09IGNvbmZpZy5zZWNyZXRLZXkpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgIHJlc3BvbnNlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiAnVGhlIHRva2VuIGlzIGluY29ycmVjdCcsXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHJlcT8uY2xpZW50Py5wYWdlKSB7XG4gICAgICBkZWxldGUgY2xpZW50c0FycmF5W3JlcS5wYXJhbXMuc2Vzc2lvbl07XG4gICAgICBhd2FpdCByZXEuY2xpZW50LmxvZ291dCgpO1xuICAgIH1cbiAgICBjb25zdCBwYXRoID0gY29uZmlnLmN1c3RvbVVzZXJEYXRhRGlyICsgc2Vzc2lvbjtcbiAgICBjb25zdCBwYXRoVG9rZW4gPSBfX2Rpcm5hbWUgKyBgLi4vLi4vLi4vdG9rZW5zLyR7c2Vzc2lvbn0uZGF0YS5qc29uYDtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoKSkge1xuICAgICAgYXdhaXQgZnMucHJvbWlzZXMucm0ocGF0aCwge1xuICAgICAgICByZWN1cnNpdmU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aFRva2VuKSkge1xuICAgICAgYXdhaXQgZnMucHJvbWlzZXMucm0ocGF0aFRva2VuKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gY2xlYXIgc2Vzc2lvbiBkYXRhJyxcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0TGltaXQocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgI3N3YWdnZXIudGFncyA9IFtcIk1pc2NcIl1cbiAgICNzd2FnZ2VyLmRlc2NyaXB0aW9uID0gJ0NoYW5nZSBsaW1pdHMgb2Ygd2hhdHNhcHAgd2ViLiBUeXBlcyB2YWx1ZTogbWF4TWVkaWFTaXplLCBtYXhGaWxlU2l6ZSwgbWF4U2hhcmUsIHN0YXR1c1ZpZGVvTWF4RHVyYXRpb24sIHVubGltaXRlZFBpbjsnXG4gICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICB9XVxuICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICB2YWx1ZTogeyB0eXBlOiAnYW55JyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3R5cGUnLCAndmFsdWUnXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICAnRGVmYXVsdCc6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbWF4RmlsZVNpemUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAxMDQ4NTc2MDBcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfVxuICAqL1xuXG4gIHRyeSB7XG4gICAgY29uc3QgeyB0eXBlLCB2YWx1ZSB9ID0gcmVxLmJvZHk7XG4gICAgaWYgKCF0eXBlIHx8ICF2YWx1ZSkgdGhyb3cgbmV3IEVycm9yKCdTZW5kIGRlIHR5cGUgYW5kIHZhbHVlJyk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LnNldExpbWl0KHR5cGUsIHZhbHVlKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24ocmVzdWx0KTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIHNldCBsaW1pdCcsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBQUEsR0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBOztBQUVBLElBQUFDLENBQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLE9BQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFHLGNBQUEsR0FBQUgsT0FBQTtB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