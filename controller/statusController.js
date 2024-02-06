"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.sendImageStorie = sendImageStorie;exports.sendTextStorie = sendTextStorie;exports.sendVideoStorie = sendVideoStorie;

var _functions = require("../util/functions");

function returnError(req, res, error) {
  req.logger.error(error);
  res.
  status(500).
  json({ status: 'Error', message: 'Erro ao enviar status.', error: error });
}

async function returnSucess(res, data) {
  res.status(201).json({ status: 'success', response: data, mapper: 'return' });
}

async function sendTextStorie(req, res) {
  /**
     #swagger.tags = ["Status Stories"]
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
        text: 'My new storie',
        options: { backgroundColor: '#0275d8', font: 2},
      }
     }
     #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              options: { type: 'object' },
            },
            required: ['text'],
          },
          examples: {
            'Default': {
              value: {
                text: 'My new storie',
                options: { backgroundColor: '#0275d8', font: 2},
              },
            },
          },
        },
      },
    }
   */
  const { text, options } = req.body;

  if (!text)
  return res.status(401).send({
    message: 'Text was not informed'
  });

  try {
    const results = [];
    results.push(await req.client.sendTextStatus(text, options));

    if (results.length === 0)
    return res.status(400).json('Error sending the text of stories');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendImageStorie(req, res) {
  /**
     #swagger.tags = ["Status Stories"]
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
              path: { type: 'string' },
            },
            required: ['path'],
          },
          examples: {
            'Default': {
              value: {
                path: 'Path of your image',
              },
            },
          },
        },
      },
    }
   */
  const { path } = req.body;

  if (!path && !req.file)
  return res.status(401).send({
    message: 'Sending the image is mandatory'
  });

  const pathFile = path || req.file?.path;

  try {
    const results = [];
    results.push(await req.client.sendImageStatus(pathFile));

    if (results.length === 0)
    return res.status(400).json('Error sending the image of stories');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

async function sendVideoStorie(req, res) {
  /**
     #swagger.tags = ["Status Stories"]
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
              path: { type: "string" }
            },
            required: ["path"]
          },
          examples: {
            "Default": {
              value: {
                path: "Path of your video"
              }
            }
          }
        }
      }
    }
   */
  const { path } = req.body;

  if (!path && !req.file)
  return res.status(401).send({
    message: 'Sending the Video is mandatory'
  });

  const pathFile = path || req.file?.path;

  try {
    const results = [];

    results.push(await req.client.sendVideoStatus(pathFile));

    if (results.length === 0)
    return res.status(400).json('Error sending message');
    if (req.file) await (0, _functions.unlinkAsync)(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnVuY3Rpb25zIiwicmVxdWlyZSIsInJldHVybkVycm9yIiwicmVxIiwicmVzIiwiZXJyb3IiLCJsb2dnZXIiLCJzdGF0dXMiLCJqc29uIiwibWVzc2FnZSIsInJldHVyblN1Y2VzcyIsImRhdGEiLCJyZXNwb25zZSIsIm1hcHBlciIsInNlbmRUZXh0U3RvcmllIiwidGV4dCIsIm9wdGlvbnMiLCJib2R5Iiwic2VuZCIsInJlc3VsdHMiLCJwdXNoIiwiY2xpZW50Iiwic2VuZFRleHRTdGF0dXMiLCJsZW5ndGgiLCJzZW5kSW1hZ2VTdG9yaWUiLCJwYXRoIiwiZmlsZSIsInBhdGhGaWxlIiwic2VuZEltYWdlU3RhdHVzIiwic2VuZFZpZGVvU3RvcmllIiwic2VuZFZpZGVvU3RhdHVzIiwidW5saW5rQXN5bmMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlci9zdGF0dXNDb250cm9sbGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5cbmltcG9ydCB7IHVubGlua0FzeW5jIH0gZnJvbSAnLi4vdXRpbC9mdW5jdGlvbnMnO1xuXG5mdW5jdGlvbiByZXR1cm5FcnJvcihyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIGVycm9yOiBhbnkpIHtcbiAgcmVxLmxvZ2dlci5lcnJvcihlcnJvcik7XG4gIHJlc1xuICAgIC5zdGF0dXMoNTAwKVxuICAgIC5qc29uKHsgc3RhdHVzOiAnRXJyb3InLCBtZXNzYWdlOiAnRXJybyBhbyBlbnZpYXIgc3RhdHVzLicsIGVycm9yOiBlcnJvciB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmV0dXJuU3VjZXNzKHJlczogUmVzcG9uc2UsIGRhdGE6IGFueSkge1xuICByZXMuc3RhdHVzKDIwMSkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogZGF0YSwgbWFwcGVyOiAncmV0dXJuJyB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRUZXh0U3RvcmllKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICAgI3N3YWdnZXIudGFncyA9IFtcIlN0YXR1cyBTdG9yaWVzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJvYmpcIl0gPSB7XG4gICAgICBpbjogJ2JvZHknLFxuICAgICAgc2NoZW1hOiB7XG4gICAgICAgIHRleHQ6ICdNeSBuZXcgc3RvcmllJyxcbiAgICAgICAgb3B0aW9uczogeyBiYWNrZ3JvdW5kQ29sb3I6ICcjMDI3NWQ4JywgZm9udDogMn0sXG4gICAgICB9XG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgdGV4dDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICBvcHRpb25zOiB7IHR5cGU6ICdvYmplY3QnIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFsndGV4dCddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgICdEZWZhdWx0Jzoge1xuICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdNeSBuZXcgc3RvcmllJyxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7IGJhY2tncm91bmRDb2xvcjogJyMwMjc1ZDgnLCBmb250OiAyfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyB0ZXh0LCBvcHRpb25zIH0gPSByZXEuYm9keTtcblxuICBpZiAoIXRleHQpXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgIG1lc3NhZ2U6ICdUZXh0IHdhcyBub3QgaW5mb3JtZWQnLFxuICAgIH0pO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gW107XG4gICAgcmVzdWx0cy5wdXNoKGF3YWl0IHJlcS5jbGllbnQuc2VuZFRleHRTdGF0dXModGV4dCwgb3B0aW9ucykpO1xuXG4gICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKCdFcnJvciBzZW5kaW5nIHRoZSB0ZXh0IG9mIHN0b3JpZXMnKTtcbiAgICByZXR1cm5TdWNlc3MocmVzLCByZXN1bHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm5FcnJvcihyZXEsIHJlcywgZXJyb3IpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kSW1hZ2VTdG9yaWUocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgICAjc3dhZ2dlci50YWdzID0gW1wiU3RhdHVzIFN0b3JpZXNcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiB7XG4gICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGF0aDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3BhdGgnXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICAnRGVmYXVsdCc6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBwYXRoOiAnUGF0aCBvZiB5b3VyIGltYWdlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBwYXRoIH0gPSByZXEuYm9keTtcblxuICBpZiAoIXBhdGggJiYgIXJlcS5maWxlKVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOiAnU2VuZGluZyB0aGUgaW1hZ2UgaXMgbWFuZGF0b3J5JyxcbiAgICB9KTtcblxuICBjb25zdCBwYXRoRmlsZSA9IHBhdGggfHwgcmVxLmZpbGU/LnBhdGg7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBbXTtcbiAgICByZXN1bHRzLnB1c2goYXdhaXQgcmVxLmNsaWVudC5zZW5kSW1hZ2VTdGF0dXMocGF0aEZpbGUpKTtcblxuICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbignRXJyb3Igc2VuZGluZyB0aGUgaW1hZ2Ugb2Ygc3RvcmllcycpO1xuICAgIHJldHVyblN1Y2VzcyhyZXMsIHJlc3VsdHMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybkVycm9yKHJlcSwgcmVzLCBlcnJvcik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRWaWRlb1N0b3JpZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAgICNzd2FnZ2VyLnRhZ3MgPSBbXCJTdGF0dXMgU3Rvcmllc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgY29udGVudDoge1xuICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcGF0aDogeyB0eXBlOiBcInN0cmluZ1wiIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1aXJlZDogW1wicGF0aFwiXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgcGF0aDogXCJQYXRoIG9mIHlvdXIgdmlkZW9cIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBwYXRoIH0gPSByZXEuYm9keTtcblxuICBpZiAoIXBhdGggJiYgIXJlcS5maWxlKVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOiAnU2VuZGluZyB0aGUgVmlkZW8gaXMgbWFuZGF0b3J5JyxcbiAgICB9KTtcblxuICBjb25zdCBwYXRoRmlsZSA9IHBhdGggfHwgcmVxLmZpbGU/LnBhdGg7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzOiBhbnkgPSBbXTtcblxuICAgIHJlc3VsdHMucHVzaChhd2FpdCByZXEuY2xpZW50LnNlbmRWaWRlb1N0YXR1cyhwYXRoRmlsZSkpO1xuXG4gICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKCdFcnJvciBzZW5kaW5nIG1lc3NhZ2UnKTtcbiAgICBpZiAocmVxLmZpbGUpIGF3YWl0IHVubGlua0FzeW5jKHBhdGhGaWxlKTtcbiAgICByZXR1cm5TdWNlc3MocmVzLCByZXN1bHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm5FcnJvcihyZXEsIHJlcywgZXJyb3IpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBQUEsVUFBQSxHQUFBQyxPQUFBOztBQUVBLFNBQVNDLFdBQVdBLENBQUNDLEdBQVksRUFBRUMsR0FBYSxFQUFFQyxLQUFVLEVBQUU7RUFDNURGLEdBQUcsQ0FBQ0csTUFBTSxDQUFDRCxLQUFLLENBQUNBLEtBQUssQ0FBQztFQUN2QkQsR0FBRztFQUNBRyxNQUFNLENBQUMsR0FBRyxDQUFDO0VBQ1hDLElBQUksQ0FBQyxFQUFFRCxNQUFNLEVBQUUsT0FBTyxFQUFFRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUVKLEtBQUssRUFBRUEsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMvRTs7QUFFQSxlQUFlSyxZQUFZQSxDQUFDTixHQUFhLEVBQUVPLElBQVMsRUFBRTtF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