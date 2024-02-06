"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _config = _interopRequireDefault(require("../../config"));
var _fileTokenStory = _interopRequireDefault(require("./fileTokenStory"));
var _mongodbTokenStory = _interopRequireDefault(require("./mongodbTokenStory"));
var _redisTokenStory = _interopRequireDefault(require("./redisTokenStory"));

class Factory {
  createTokenStory(client) {
    let myTokenStore;
    const type = _config.default.tokenStoreType;

    if (type === 'mongodb') {
      myTokenStore = new _mongodbTokenStory.default(client);
    } else if (type === 'redis') {
      myTokenStore = new _redisTokenStory.default(client);
    } else {
      myTokenStore = new _fileTokenStory.default(client);
    }

    return myTokenStore.tokenStore;
  }
}var _default = exports.default =

Factory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY29uZmlnIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfZmlsZVRva2VuU3RvcnkiLCJfbW9uZ29kYlRva2VuU3RvcnkiLCJfcmVkaXNUb2tlblN0b3J5IiwiRmFjdG9yeSIsImNyZWF0ZVRva2VuU3RvcnkiLCJjbGllbnQiLCJteVRva2VuU3RvcmUiLCJ0eXBlIiwiY29uZmlnIiwidG9rZW5TdG9yZVR5cGUiLCJNb25nb2RiVG9rZW5TdG9yZSIsIlJlZGlzVG9rZW5TdG9yZSIsIkZpbGVUb2tlblN0b3JlIiwidG9rZW5TdG9yZSIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbC90b2tlblN0b3JlL2ZhY3RvcnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IEZpbGVUb2tlblN0b3JlIGZyb20gJy4vZmlsZVRva2VuU3RvcnknO1xuaW1wb3J0IE1vbmdvZGJUb2tlblN0b3JlIGZyb20gJy4vbW9uZ29kYlRva2VuU3RvcnknO1xuaW1wb3J0IFJlZGlzVG9rZW5TdG9yZSBmcm9tICcuL3JlZGlzVG9rZW5TdG9yeSc7XG5cbmNsYXNzIEZhY3Rvcnkge1xuICBwdWJsaWMgY3JlYXRlVG9rZW5TdG9yeShjbGllbnQ6IGFueSkge1xuICAgIGxldCBteVRva2VuU3RvcmU7XG4gICAgY29uc3QgdHlwZSA9IGNvbmZpZy50b2tlblN0b3JlVHlwZTtcblxuICAgIGlmICh0eXBlID09PSAnbW9uZ29kYicpIHtcbiAgICAgIG15VG9rZW5TdG9yZSA9IG5ldyBNb25nb2RiVG9rZW5TdG9yZShjbGllbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3JlZGlzJykge1xuICAgICAgbXlUb2tlblN0b3JlID0gbmV3IFJlZGlzVG9rZW5TdG9yZShjbGllbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBteVRva2VuU3RvcmUgPSBuZXcgRmlsZVRva2VuU3RvcmUoY2xpZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbXlUb2tlblN0b3JlLnRva2VuU3RvcmU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRmFjdG9yeTtcbiJdLCJtYXBwaW5ncyI6InlMQUFBLElBQUFBLE9BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLGVBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLGtCQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRyxnQkFBQSxHQUFBSixzQkFBQSxDQUFBQyxPQUFBOztBQUVBLE1BQU1JLE9BQU8sQ0FBQztFQUNMQyxnQkFBZ0JBLENBQUNDLE1BQVcsRUFBRTtJQUNuQyxJQUFJQyxZQUFZO0lBQ2hCLE1BQU1DLElBQUksR0FBR0MsZUFBTSxDQUFDQyxjQUFjOztJQUVsQyxJQUFJRixJQUFJLEtBQUssU0FBUyxFQUFFO01BQ3RCRCxZQUFZLEdBQUcsSUFBSUksMEJBQWlCLENBQUNMLE1BQU0sQ0FBQztJQUM5QyxDQUFDLE1BQU0sSUFBSUUsSUFBSSxLQUFLLE9BQU8sRUFBRTtNQUMzQkQsWUFBWSxHQUFHLElBQUlLLHdCQUFlLENBQUNOLE1BQU0sQ0FBQztJQUM1QyxDQUFDLE1BQU07TUFDTEMsWUFBWSxHQUFHLElBQUlNLHVCQUFjLENBQUNQLE1BQU0sQ0FBQztJQUMzQzs7SUFFQSxPQUFPQyxZQUFZLENBQUNPLFVBQVU7RUFDaEM7QUFDRixDQUFDLElBQUFDLFFBQUEsR0FBQUMsT0FBQSxDQUFBQyxPQUFBOztBQUVjYixPQUFPIn0=