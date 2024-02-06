"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.backupSessions = backupSessions;exports.closeAllSessions = closeAllSessions;exports.restoreSessions = restoreSessions;















var _archiver = _interopRequireDefault(require("archiver"));

var _fs = _interopRequireDefault(require("fs"));
var _unzipper = _interopRequireDefault(require("unzipper"));

var _ = require("..");
var _config = _interopRequireDefault(require("../config"));
var _functions = require("./functions");
var _getAllTokens = _interopRequireDefault(require("./getAllTokens"));
var _sessionUtil = require("./sessionUtil"); /*
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
 */function backupSessions(req) {// eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {await closeAllSessions(req);const output = _fs.default.createWriteStream(__dirname + '/../backupSessions.zip');const archive = (0, _archiver.default)('zip', { zlib: { level: 9 } // Sets the compression level.
        });archive.on('error', function (err) {reject(err);req.logger.error(err);});archive.pipe(output);
      archive.directory(__dirname + '/../../tokens', 'tokens');
      _fs.default.cpSync(
        _config.default.customUserDataDir,
        __dirname + '/../../backupFolder',
        { force: true, recursive: true }
      );

      archive.directory(__dirname + '/../../backupFolder', 'userDataDir');
      archive.finalize();

      output.on('close', () => {
        _fs.default.rmSync(__dirname + '/../../backupFolder', { recursive: true });
        const myStream = _fs.default.createReadStream(
          __dirname + '/../backupSessions.zip'
        );
        myStream.pipe(req.res);
        myStream.on('end', () => {
          _.logger.info('Sessions successfully backuped. Restarting sessions...');
          (0, _functions.startAllSessions)(_config.default, _.logger);
          req.res?.end();
        });
        myStream.on('error', function (err) {
          console.log(err);
          reject(err);
        });
      });
    });
}

async function restoreSessions(
req,
file)
{
  if (!file?.mimetype?.includes('zip')) {
    throw new Error('Please, send zipped file');
  }
  const path = file.path;
  _.logger.info('Starting restore sessions...');
  await closeAllSessions(req);

  const extract = _fs.default.
  createReadStream(path).
  pipe(_unzipper.default.Extract({ path: './restore' }));
  extract.on('close', () => {
    try {
      _fs.default.cpSync(__dirname + '/../../restore/tokens', 'tokens', {
        force: true,
        recursive: true
      });
    } catch (error) {
      _.logger.info("Folder 'tokens' not found.");
    }
    try {
      _fs.default.cpSync(
        __dirname + '/../../restore/userDataDir',
        _config.default.customUserDataDir,
        {
          force: false,
          recursive: true
        }
      );
    } catch (error) {
      _.logger.info("Folder 'userDataDir' not found.");
    }
    _.logger.info('Sessions successfully restored. Starting...');
    (0, _functions.startAllSessions)(_config.default, _.logger);
  });

  return { success: true };
}

async function closeAllSessions(req) {
  const names = await (0, _getAllTokens.default)(req);
  names.forEach(async (session) => {
    const client = _sessionUtil.clientsArray[session];
    try {
      delete _sessionUtil.clientsArray[session];
      if (client?.status) {
        _.logger.info('Stopping session: ' + session);
        await client.page.browser().close();
      }
      delete _sessionUtil.clientsArray[session];
    } catch (error) {
      _.logger.error('Not was possible stop session: ' + session);
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXJjaGl2ZXIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9mcyIsIl91bnppcHBlciIsIl8iLCJfY29uZmlnIiwiX2Z1bmN0aW9ucyIsIl9nZXRBbGxUb2tlbnMiLCJfc2Vzc2lvblV0aWwiLCJiYWNrdXBTZXNzaW9ucyIsInJlcSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2xvc2VBbGxTZXNzaW9ucyIsIm91dHB1dCIsImZpbGVTeXN0ZW0iLCJjcmVhdGVXcml0ZVN0cmVhbSIsIl9fZGlybmFtZSIsImFyY2hpdmUiLCJhcmNoaXZlciIsInpsaWIiLCJsZXZlbCIsIm9uIiwiZXJyIiwibG9nZ2VyIiwiZXJyb3IiLCJwaXBlIiwiZGlyZWN0b3J5IiwiY3BTeW5jIiwiY29uZmlnIiwiY3VzdG9tVXNlckRhdGFEaXIiLCJmb3JjZSIsInJlY3Vyc2l2ZSIsImZpbmFsaXplIiwicm1TeW5jIiwibXlTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwicmVzIiwiaW5mbyIsInN0YXJ0QWxsU2Vzc2lvbnMiLCJlbmQiLCJjb25zb2xlIiwibG9nIiwicmVzdG9yZVNlc3Npb25zIiwiZmlsZSIsIm1pbWV0eXBlIiwiaW5jbHVkZXMiLCJFcnJvciIsInBhdGgiLCJleHRyYWN0IiwidW56aXBwZXIiLCJFeHRyYWN0Iiwic3VjY2VzcyIsIm5hbWVzIiwiZ2V0QWxsVG9rZW5zIiwiZm9yRWFjaCIsInNlc3Npb24iLCJjbGllbnQiLCJjbGllbnRzQXJyYXkiLCJzdGF0dXMiLCJwYWdlIiwiYnJvd3NlciIsImNsb3NlIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvbWFuYWdlU2Vzc2lvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMjMgV1BQQ29ubmVjdCBUZWFtXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBhcmNoaXZlciBmcm9tICdhcmNoaXZlcic7XG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZmlsZVN5c3RlbSBmcm9tICdmcyc7XG5pbXBvcnQgdW56aXBwZXIgZnJvbSAndW56aXBwZXInO1xuXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLic7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBzdGFydEFsbFNlc3Npb25zIH0gZnJvbSAnLi9mdW5jdGlvbnMnO1xuaW1wb3J0IGdldEFsbFRva2VucyBmcm9tICcuL2dldEFsbFRva2Vucyc7XG5pbXBvcnQgeyBjbGllbnRzQXJyYXkgfSBmcm9tICcuL3Nlc3Npb25VdGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJhY2t1cFNlc3Npb25zKHJlcTogUmVxdWVzdCk6IFByb21pc2U8YW55PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hc3luYy1wcm9taXNlLWV4ZWN1dG9yXG4gIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgYXdhaXQgY2xvc2VBbGxTZXNzaW9ucyhyZXEpO1xuICAgIGNvbnN0IG91dHB1dCA9IGZpbGVTeXN0ZW0uY3JlYXRlV3JpdGVTdHJlYW0oXG4gICAgICBfX2Rpcm5hbWUgKyAnLy4uL2JhY2t1cFNlc3Npb25zLnppcCdcbiAgICApO1xuICAgIGNvbnN0IGFyY2hpdmUgPSBhcmNoaXZlcignemlwJywge1xuICAgICAgemxpYjogeyBsZXZlbDogOSB9LCAvLyBTZXRzIHRoZSBjb21wcmVzc2lvbiBsZXZlbC5cbiAgICB9KTtcbiAgICBhcmNoaXZlLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgICAgcmVxLmxvZ2dlci5lcnJvcihlcnIpO1xuICAgIH0pO1xuICAgIGFyY2hpdmUucGlwZShvdXRwdXQpO1xuICAgIGFyY2hpdmUuZGlyZWN0b3J5KF9fZGlybmFtZSArICcvLi4vLi4vdG9rZW5zJywgJ3Rva2VucycpO1xuICAgIGZpbGVTeXN0ZW0uY3BTeW5jKFxuICAgICAgY29uZmlnLmN1c3RvbVVzZXJEYXRhRGlyLFxuICAgICAgX19kaXJuYW1lICsgJy8uLi8uLi9iYWNrdXBGb2xkZXInLFxuICAgICAgeyBmb3JjZTogdHJ1ZSwgcmVjdXJzaXZlOiB0cnVlIH1cbiAgICApO1xuXG4gICAgYXJjaGl2ZS5kaXJlY3RvcnkoX19kaXJuYW1lICsgJy8uLi8uLi9iYWNrdXBGb2xkZXInLCAndXNlckRhdGFEaXInKTtcbiAgICBhcmNoaXZlLmZpbmFsaXplKCk7XG5cbiAgICBvdXRwdXQub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgZmlsZVN5c3RlbS5ybVN5bmMoX19kaXJuYW1lICsgJy8uLi8uLi9iYWNrdXBGb2xkZXInLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgIGNvbnN0IG15U3RyZWFtID0gZmlsZVN5c3RlbS5jcmVhdGVSZWFkU3RyZWFtKFxuICAgICAgICBfX2Rpcm5hbWUgKyAnLy4uL2JhY2t1cFNlc3Npb25zLnppcCdcbiAgICAgICk7XG4gICAgICBteVN0cmVhbS5waXBlKHJlcS5yZXMgYXMgYW55KTtcbiAgICAgIG15U3RyZWFtLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdTZXNzaW9ucyBzdWNjZXNzZnVsbHkgYmFja3VwZWQuIFJlc3RhcnRpbmcgc2Vzc2lvbnMuLi4nKTtcbiAgICAgICAgc3RhcnRBbGxTZXNzaW9ucyhjb25maWcsIGxvZ2dlcik7XG4gICAgICAgIHJlcS5yZXM/LmVuZCgpO1xuICAgICAgfSk7XG4gICAgICBteVN0cmVhbS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXN0b3JlU2Vzc2lvbnMoXG4gIHJlcTogUmVxdWVzdCxcbiAgZmlsZTogRXhwcmVzcy5NdWx0ZXIuRmlsZVxuKTogUHJvbWlzZTxhbnk+IHtcbiAgaWYgKCFmaWxlPy5taW1ldHlwZT8uaW5jbHVkZXMoJ3ppcCcpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UsIHNlbmQgemlwcGVkIGZpbGUnKTtcbiAgfVxuICBjb25zdCBwYXRoID0gZmlsZS5wYXRoO1xuICBsb2dnZXIuaW5mbygnU3RhcnRpbmcgcmVzdG9yZSBzZXNzaW9ucy4uLicpO1xuICBhd2FpdCBjbG9zZUFsbFNlc3Npb25zKHJlcSk7XG5cbiAgY29uc3QgZXh0cmFjdCA9IGZpbGVTeXN0ZW1cbiAgICAuY3JlYXRlUmVhZFN0cmVhbShwYXRoKVxuICAgIC5waXBlKHVuemlwcGVyLkV4dHJhY3QoeyBwYXRoOiAnLi9yZXN0b3JlJyB9KSk7XG4gIGV4dHJhY3Qub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBmaWxlU3lzdGVtLmNwU3luYyhfX2Rpcm5hbWUgKyAnLy4uLy4uL3Jlc3RvcmUvdG9rZW5zJywgJ3Rva2VucycsIHtcbiAgICAgICAgZm9yY2U6IHRydWUsXG4gICAgICAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dnZXIuaW5mbyhcIkZvbGRlciAndG9rZW5zJyBub3QgZm91bmQuXCIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgZmlsZVN5c3RlbS5jcFN5bmMoXG4gICAgICAgIF9fZGlybmFtZSArICcvLi4vLi4vcmVzdG9yZS91c2VyRGF0YURpcicsXG4gICAgICAgIGNvbmZpZy5jdXN0b21Vc2VyRGF0YURpcixcbiAgICAgICAge1xuICAgICAgICAgIGZvcmNlOiBmYWxzZSxcbiAgICAgICAgICByZWN1cnNpdmU6IHRydWUsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ2dlci5pbmZvKFwiRm9sZGVyICd1c2VyRGF0YURpcicgbm90IGZvdW5kLlwiKTtcbiAgICB9XG4gICAgbG9nZ2VyLmluZm8oJ1Nlc3Npb25zIHN1Y2Nlc3NmdWxseSByZXN0b3JlZC4gU3RhcnRpbmcuLi4nKTtcbiAgICBzdGFydEFsbFNlc3Npb25zKGNvbmZpZywgbG9nZ2VyKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xvc2VBbGxTZXNzaW9ucyhyZXE6IFJlcXVlc3QpIHtcbiAgY29uc3QgbmFtZXMgPSBhd2FpdCBnZXRBbGxUb2tlbnMocmVxKTtcbiAgbmFtZXMuZm9yRWFjaChhc3luYyAoc2Vzc2lvbjogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgY2xpZW50ID0gY2xpZW50c0FycmF5W3Nlc3Npb25dO1xuICAgIHRyeSB7XG4gICAgICBkZWxldGUgY2xpZW50c0FycmF5W3Nlc3Npb25dO1xuICAgICAgaWYgKGNsaWVudD8uc3RhdHVzKSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdTdG9wcGluZyBzZXNzaW9uOiAnICsgc2Vzc2lvbik7XG4gICAgICAgIGF3YWl0IGNsaWVudC5wYWdlLmJyb3dzZXIoKS5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgZGVsZXRlIGNsaWVudHNBcnJheVtzZXNzaW9uXTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nZ2VyLmVycm9yKCdOb3Qgd2FzIHBvc3NpYmxlIHN0b3Agc2Vzc2lvbjogJyArIHNlc3Npb24pO1xuICAgIH1cbiAgfSk7XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsSUFBQUEsU0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBOztBQUVBLElBQUFDLEdBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLFNBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTs7QUFFQSxJQUFBRyxDQUFBLEdBQUFILE9BQUE7QUFDQSxJQUFBSSxPQUFBLEdBQUFMLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBSyxVQUFBLEdBQUFMLE9BQUE7QUFDQSxJQUFBTSxhQUFBLEdBQUFQLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTyxZQUFBLEdBQUFQLE9BQUEsa0JBQTZDLENBekI3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FhTyxTQUFTUSxjQUFjQSxDQUFDQyxHQUFZLEVBQWdCLENBQ3pEO0VBQ0EsT0FBTyxJQUFJQyxPQUFPLENBQUMsT0FBT0MsT0FBTyxFQUFFQyxNQUFNLEtBQUssQ0FDNUMsTUFBTUMsZ0JBQWdCLENBQUNKLEdBQUcsQ0FBQyxDQUMzQixNQUFNSyxNQUFNLEdBQUdDLFdBQVUsQ0FBQ0MsaUJBQWlCLENBQ3pDQyxTQUFTLEdB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