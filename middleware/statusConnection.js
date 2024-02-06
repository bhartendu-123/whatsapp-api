"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = statusConnection;

















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
 */async function statusConnection(req, res, next) {try {const numbers = [];if (req.client && req.client.isConnected) {await req.client.isConnected();const localArr = (0, _functions.contactToArray)(req.body.phone || [], req.body.isGroup,
        req.body.isNewsletter
      );
      let index = 0;
      for (const contact of localArr) {
        if (req.body.isGroup || req.body.isNewsletter) {
          localArr[index] = contact;
        } else if (numbers.indexOf(contact) < 0) {
          const profile = await req.client.
          checkNumberStatus(contact).
          catch((error) => console.log(error));
          if (!profile?.numberExists) {
            const num = contact.split('@')[0];
            return res.status(400).json({
              response: null,
              status: 'Connected',
              message: `O número ${num} não existe.`
            });
          } else {
            if (numbers.indexOf(profile.id._serialized) < 0) {
              numbers.push(profile.id._serialized);
            }
            localArr[index] = profile.id._serialized;
          }
        }
        index++;
      }
      req.body.phone = localArr;
    } else {
      return res.status(404).json({
        response: null,
        status: 'Disconnected',
        message: 'A sessão do WhatsApp não está ativa.'
      });
    }
    next();
  } catch (error) {
    req.logger.error(error);
    return res.status(404).json({
      response: null,
      status: 'Disconnected',
      message: 'A sessão do WhatsApp não está ativa.'
    });
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnVuY3Rpb25zIiwicmVxdWlyZSIsInN0YXR1c0Nvbm5lY3Rpb24iLCJyZXEiLCJyZXMiLCJuZXh0IiwibnVtYmVycyIsImNsaWVudCIsImlzQ29ubmVjdGVkIiwibG9jYWxBcnIiLCJjb250YWN0VG9BcnJheSIsImJvZHkiLCJwaG9uZSIsImlzR3JvdXAiLCJpc05ld3NsZXR0ZXIiLCJpbmRleCIsImNvbnRhY3QiLCJpbmRleE9mIiwicHJvZmlsZSIsImNoZWNrTnVtYmVyU3RhdHVzIiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJudW1iZXJFeGlzdHMiLCJudW0iLCJzcGxpdCIsInN0YXR1cyIsImpzb24iLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJpZCIsIl9zZXJpYWxpemVkIiwicHVzaCIsImxvZ2dlciJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3N0YXR1c0Nvbm5lY3Rpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDIxIFdQUENvbm5lY3QgVGVhbVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5cbmltcG9ydCB7IGNvbnRhY3RUb0FycmF5IH0gZnJvbSAnLi4vdXRpbC9mdW5jdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzdGF0dXNDb25uZWN0aW9uKFxuICByZXE6IFJlcXVlc3QsXG4gIHJlczogUmVzcG9uc2UsXG4gIG5leHQ6IE5leHRGdW5jdGlvblxuKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgbnVtYmVyczogYW55ID0gW107XG4gICAgaWYgKHJlcS5jbGllbnQgJiYgcmVxLmNsaWVudC5pc0Nvbm5lY3RlZCkge1xuICAgICAgYXdhaXQgcmVxLmNsaWVudC5pc0Nvbm5lY3RlZCgpO1xuXG4gICAgICBjb25zdCBsb2NhbEFyciA9IGNvbnRhY3RUb0FycmF5KFxuICAgICAgICByZXEuYm9keS5waG9uZSB8fCBbXSxcbiAgICAgICAgcmVxLmJvZHkuaXNHcm91cCxcbiAgICAgICAgcmVxLmJvZHkuaXNOZXdzbGV0dGVyXG4gICAgICApO1xuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGZvciAoY29uc3QgY29udGFjdCBvZiBsb2NhbEFycikge1xuICAgICAgICBpZiAocmVxLmJvZHkuaXNHcm91cCB8fCByZXEuYm9keS5pc05ld3NsZXR0ZXIpIHtcbiAgICAgICAgICBsb2NhbEFycltpbmRleF0gPSBjb250YWN0O1xuICAgICAgICB9IGVsc2UgaWYgKG51bWJlcnMuaW5kZXhPZihjb250YWN0KSA8IDApIHtcbiAgICAgICAgICBjb25zdCBwcm9maWxlOiBhbnkgPSBhd2FpdCByZXEuY2xpZW50XG4gICAgICAgICAgICAuY2hlY2tOdW1iZXJTdGF0dXMoY29udGFjdClcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG4gICAgICAgICAgaWYgKCFwcm9maWxlPy5udW1iZXJFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IG51bSA9IChjb250YWN0IGFzIGFueSkuc3BsaXQoJ0AnKVswXTtcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgICAgICAgIHJlc3BvbnNlOiBudWxsLFxuICAgICAgICAgICAgICBzdGF0dXM6ICdDb25uZWN0ZWQnLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBgTyBuw7ptZXJvICR7bnVtfSBuw6NvIGV4aXN0ZS5gLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICgobnVtYmVycyBhcyBhbnkpLmluZGV4T2YocHJvZmlsZS5pZC5fc2VyaWFsaXplZCkgPCAwKSB7XG4gICAgICAgICAgICAgIChudW1iZXJzIGFzIGFueSkucHVzaChwcm9maWxlLmlkLl9zZXJpYWxpemVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChsb2NhbEFyciBhcyBhbnkpW2luZGV4XSA9IHByb2ZpbGUuaWQuX3NlcmlhbGl6ZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9XG4gICAgICByZXEuYm9keS5waG9uZSA9IGxvY2FsQXJyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oe1xuICAgICAgICByZXNwb25zZTogbnVsbCxcbiAgICAgICAgc3RhdHVzOiAnRGlzY29ubmVjdGVkJyxcbiAgICAgICAgbWVzc2FnZTogJ0Egc2Vzc8OjbyBkbyBXaGF0c0FwcCBuw6NvIGVzdMOhIGF0aXZhLicsXG4gICAgICB9KTtcbiAgICB9XG4gICAgbmV4dCgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7XG4gICAgICByZXNwb25zZTogbnVsbCxcbiAgICAgIHN0YXR1czogJ0Rpc2Nvbm5lY3RlZCcsXG4gICAgICBtZXNzYWdlOiAnQSBzZXNzw6NvIGRvIFdoYXRzQXBwIG7Do28gZXN0w6EgYXRpdmEuJyxcbiAgICB9KTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsSUFBQUEsVUFBQSxHQUFBQyxPQUFBLHNCQUFtRCxDQWxCbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBTWUsZUFBZUMsZ0JBQWdCQSxDQUM1Q0MsR0FBWSxFQUNaQyxHQUFhLEVBQ2JDLElBQWtCLEVBQ2xCLENBQ0EsSUFBSSxDQUNGLE1BQU1DLE9BQVksR0FBRyxFQUFFLENBQ3ZCLElBQUlILEdBQUcsQ0FBQ0ksTUFBTSxJQUFJSixHQUFHLENBQUNJLE1BQU0sQ0FBQ0MsV0FBVyxFQUFFLENBQ3hDLE1BQU1MLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDQyxXQUFXLENBQUMsQ0FBQyxDQUU5QixNQUFNQyxRQUFRLEdBQUcsSUFBQUMseUJBQWMsRUFDN0JQLEdBQUcsQ0FBQ1EsSUFBSSxDQUFDQyxLQUFLLElBQUksRUFBRSxFQUNwQlQsR0FBRyxDQUFDUSxJQUFJLENBQUNFLE9BQU87UUFDaEJWLEdBQUcsQ0FBQ1EsSUFBSSxDQUFDRztNQUNYLENBQUM7TUFDRCxJQUFJQyxLQUFLLEdBQUcsQ0FBQztNQUNiLEtBQUssTUFBTUMsT0FBTyxJQUFJUCxRQUFRLEVBQUU7UUFDOUIsSUFBSU4sR0FBRyxDQUFDUSxJQUFJLENBQUNFLE9BQU8sSUFBSVYsR0FBRyxDQUFDUSxJQUFJLENBQUNHLFlBQVksRUFBRTtVQUM3Q0wsUUFBUSxDQUFDTSxLQUFLLENBQUMsR0FBR0MsT0FBTztRQUMzQixDQUFDLE1BQU0sSUFBSVYsT0FBTyxDQUFDVyxPQUFPLENBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtVQUN2QyxNQUFNRSxPQUFZLEdBQUcsTUFBTWYsR0FBRyxDQUFDSSxNQUFNO1VBQ2xDWSxpQkFBaUIsQ0FBQ0gsT0FBTyxDQUFDO1VBQzFCSSxLQUFLLENBQUMsQ0FBQ0MsS0FBSyxLQUFLQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0YsS0FBSyxDQUFDLENBQUM7VUFDdkMsSUFBSSxDQUFDSCxPQUFPLEVBQUVNLFlBQVksRUFBRTtZQUMxQixNQUFNQyxHQUFHLEdBQUlULE9BQU8sQ0FBU1UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxPQUFPdEIsR0FBRyxDQUFDdUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7Y0FDMUJDLFFBQVEsRUFBRSxJQUFJO2NBQ2RGLE1BQU0sRUFBRSxXQUFXO2NBQ25CRyxPQUFPLEVBQUcsWUFBV0wsR0FBSTtZQUMzQixDQUFDLENBQUM7VUFDSixDQUFDLE1BQU07WUFDTCxJQUFLbkIsT0FBTyxDQUFTVyxPQUFPLENBQUNDLE9BQU8sQ0FBQ2EsRUFBRSxDQUFDQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUU7Y0FDdkQxQixPQUFPLENBQVMyQixJQUFJLENBQUNmLE9BQU8sQ0FBQ2EsRUFBRSxDQUFDQyxXQUFXLENBQUM7WUFDL0M7WUFDQ3ZCLFFBQVEsQ0FBU00sS0FBSyxDQUFDLEdBQUdHLE9BQU8sQ0FBQ2EsRUFBRSxDQUFDQyxXQUFXO1VBQ25EO1FBQ0Y7UUFDQWpCLEtBQUssRUFBRTtNQUNUO01BQ0FaLEdBQUcsQ0FBQ1EsSUFBSSxDQUFDQyxLQUFLLEdBQUdILFFBQVE7SUFDM0IsQ0FBQyxNQUFNO01BQ0wsT0FBT0wsR0FBRyxDQUFDdUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7UUFDMUJDLFFBQVEsRUFBRSxJQUFJO1FBQ2RGLE1BQU0sRUFBRSxjQUFjO1FBQ3RCRyxPQUFPLEVBQUU7TUFDWCxDQUFDLENBQUM7SUFDSjtJQUNBekIsSUFBSSxDQUFDLENBQUM7RUFDUixDQUFDLENBQUMsT0FBT2dCLEtBQUssRUFBRTtJQUNkbEIsR0FBRyxDQUFDK0IsTUFBTSxDQUFDYixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUN2QixPQUFPakIsR0FBRyxDQUFDdUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7TUFDMUJDLFFBQVEsRUFBRSxJQUFJO01BQ2RGLE1BQU0sRUFBRSxjQUFjO01BQ3RCRyxPQUFPLEVBQUU7SUFDWCxDQUFDLENBQUM7RUFDSjtBQUNGIn0=