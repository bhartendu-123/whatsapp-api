"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.clientsArray = exports.chromiumArgs = void 0;exports.deleteSessionOnArray = deleteSessionOnArray;exports.sessions = exports.eventEmitter = void 0;















var _events = require("events"); /*
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
 */const chromiumArgs = exports.chromiumArgs = ['--disable-web-security', // Disables web security
'--no-sandbox', // Disables sandbox
'--aggressive-cache-discard', // Aggressively discards cache
'--disable-cache', // Disables cache
'--disable-application-cache', // Disables application cache
'--disable-offline-load-stale-cache', // Disables loading stale offline cache
'--disk-cache-size=0', // Sets disk cache size to 0
'--disable-background-networking', // Disables background networking activities
'--disable-default-apps', // Disables default apps
'--disable-extensions', // Disables extensions
'--disable-sync', // Disables synchronization
'--disable-translate', // Disables translation
'--hide-scrollbars', // Hides scrollbars
'--metrics-recording-only', // Records metrics only
'--mute-audio', // Mutes audio
'--no-first-run', // Skips first run
'--safebrowsing-disable-auto-update', // Disables Safe Browsing auto-update
'--ignore-certificate-errors', // Ignores certificate errors
'--ignore-ssl-errors', // Ignores SSL errors
'--ignore-certificate-errors-spki-list' // Ignores certificate errors in SPKI list
]; // eslint-disable-next-line prefer-const
let clientsArray = exports.clientsArray = [];const sessions = exports.sessions = [];const eventEmitter = exports.eventEmitter = new _events.EventEmitter();function deleteSessionOnArray(session) {const newArray = clientsArray;delete clientsArray[session];exports.clientsArray = clientsArray = newArray;}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRzIiwicmVxdWlyZSIsImNocm9taXVtQXJncyIsImV4cG9ydHMiLCJjbGllbnRzQXJyYXkiLCJzZXNzaW9ucyIsImV2ZW50RW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImRlbGV0ZVNlc3Npb25PbkFycmF5Iiwic2Vzc2lvbiIsIm5ld0FycmF5Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvc2Vzc2lvblV0aWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDIxIFdQUENvbm5lY3QgVGVhbVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHsgV2hhdHNhcHAgfSBmcm9tICdAd3BwY29ubmVjdC10ZWFtL3dwcGNvbm5lY3QnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuZXhwb3J0IGNvbnN0IGNocm9taXVtQXJncyA9IFtcbiAgJy0tZGlzYWJsZS13ZWItc2VjdXJpdHknLCAvLyBEaXNhYmxlcyB3ZWIgc2VjdXJpdHlcbiAgJy0tbm8tc2FuZGJveCcsIC8vIERpc2FibGVzIHNhbmRib3hcbiAgJy0tYWdncmVzc2l2ZS1jYWNoZS1kaXNjYXJkJywgLy8gQWdncmVzc2l2ZWx5IGRpc2NhcmRzIGNhY2hlXG4gICctLWRpc2FibGUtY2FjaGUnLCAvLyBEaXNhYmxlcyBjYWNoZVxuICAnLS1kaXNhYmxlLWFwcGxpY2F0aW9uLWNhY2hlJywgLy8gRGlzYWJsZXMgYXBwbGljYXRpb24gY2FjaGVcbiAgJy0tZGlzYWJsZS1vZmZsaW5lLWxvYWQtc3RhbGUtY2FjaGUnLCAvLyBEaXNhYmxlcyBsb2FkaW5nIHN0YWxlIG9mZmxpbmUgY2FjaGVcbiAgJy0tZGlzay1jYWNoZS1zaXplPTAnLCAvLyBTZXRzIGRpc2sgY2FjaGUgc2l6ZSB0byAwXG4gICctLWRpc2FibGUtYmFja2dyb3VuZC1uZXR3b3JraW5nJywgLy8gRGlzYWJsZXMgYmFja2dyb3VuZCBuZXR3b3JraW5nIGFjdGl2aXRpZXNcbiAgJy0tZGlzYWJsZS1kZWZhdWx0LWFwcHMnLCAvLyBEaXNhYmxlcyBkZWZhdWx0IGFwcHNcbiAgJy0tZGlzYWJsZS1leHRlbnNpb25zJywgLy8gRGlzYWJsZXMgZXh0ZW5zaW9uc1xuICAnLS1kaXNhYmxlLXN5bmMnLCAvLyBEaXNhYmxlcyBzeW5jaHJvbml6YXRpb25cbiAgJy0tZGlzYWJsZS10cmFuc2xhdGUnLCAvLyBEaXNhYmxlcyB0cmFuc2xhdGlvblxuICAnLS1oaWRlLXNjcm9sbGJhcnMnLCAvLyBIaWRlcyBzY3JvbGxiYXJzXG4gICctLW1ldHJpY3MtcmVjb3JkaW5nLW9ubHknLCAvLyBSZWNvcmRzIG1ldHJpY3Mgb25seVxuICAnLS1tdXRlLWF1ZGlvJywgLy8gTXV0ZXMgYXVkaW9cbiAgJy0tbm8tZmlyc3QtcnVuJywgLy8gU2tpcHMgZmlyc3QgcnVuXG4gICctLXNhZmVicm93c2luZy1kaXNhYmxlLWF1dG8tdXBkYXRlJywgLy8gRGlzYWJsZXMgU2FmZSBCcm93c2luZyBhdXRvLXVwZGF0ZVxuICAnLS1pZ25vcmUtY2VydGlmaWNhdGUtZXJyb3JzJywgLy8gSWdub3JlcyBjZXJ0aWZpY2F0ZSBlcnJvcnNcbiAgJy0taWdub3JlLXNzbC1lcnJvcnMnLCAvLyBJZ25vcmVzIFNTTCBlcnJvcnNcbiAgJy0taWdub3JlLWNlcnRpZmljYXRlLWVycm9ycy1zcGtpLWxpc3QnLCAvLyBJZ25vcmVzIGNlcnRpZmljYXRlIGVycm9ycyBpbiBTUEtJIGxpc3Rcbl07XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG5leHBvcnQgbGV0IGNsaWVudHNBcnJheTogV2hhdHNhcHBbXSA9IFtdO1xuZXhwb3J0IGNvbnN0IHNlc3Npb25zID0gW107XG5leHBvcnQgY29uc3QgZXZlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlU2Vzc2lvbk9uQXJyYXkoc2Vzc2lvbjogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IG5ld0FycmF5ID0gY2xpZW50c0FycmF5O1xuICBkZWxldGUgY2xpZW50c0FycmF5W3Nlc3Npb25dO1xuICBjbGllbnRzQXJyYXkgPSBuZXdBcnJheTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxJQUFBQSxPQUFBLEdBQUFDLE9BQUEsV0FBc0MsQ0FoQnRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUlPLE1BQU1DLFlBQVksR0FBQUMsT0FBQSxDQUFBRCxZQUFBLEdBQUcsQ0FDMUIsd0JBQXdCLEVBQUU7QUFDMUIsY0FBYyxFQUFFO0FBQ2hCLDRCQUE0QixFQUFFO0FBQzlCLGlCQUFpQixFQUFFO0FBQ25CLDZCQUE2QixFQUFFO0FBQy9CLG9DQUFvQyxFQUFFO0FBQ3RDLHFCQUFxQixFQUFFO0FBQ3ZCLGlDQUFpQyxFQUFFO0FBQ25DLHdCQUF3QixFQUFFO0FBQzFCLHNCQUFzQixFQUFFO0FBQ3hCLGdCQUFnQixFQUFFO0FBQ2xCLHFCQUFxQixFQUFFO0FBQ3ZCLG1CQUFtQixFQUFFO0FBQ3JCLDBCQUEwQixFQUFFO0FBQzVCLGNBQWMsRUFBRTtBQUNoQixnQkFBZ0IsRUFBRTtBQUNsQixvQ0FBb0MsRUFBRTtBQUN0Qyw2QkFBNkIsRUFBRTtBQUMvQixxQkFBcUIsRUFBRTtBQUN2Qix1Q0FBdUMsQ0FBRTtBQUFBLENBQzFDLENBQUMsQ0FDRjtBQUNPLElBQUlFLFlBQXdCLEdBQUFELE9BQUEsQ0FBQUMsWUFBQSxHQUFHLEVBQUUsQ0FDakMsTUFBTUMsUUFBUSxHQUFBRixPQUFBLENBQUFFLFFBQUEsR0FBRyxFQUFFLENBQ25CLE1BQU1DLFlBQVksR0FBQUgsT0FBQSxDQUFBRyxZQUFBLEdBQUcsSUFBSUMsb0JBQVksQ0FBQyxDQUFDLENBRXZDLFNBQVNDLG9CQUFvQkEsQ0FBQ0MsT0FBZSxFQUFRLENBQzFELE1BQU1DLFFBQVEsR0FBR04sWUFBWSxDQUM3QixPQUFPQSxZQUFZLENBQUNLLE9BQU8sQ0FBQyxDQUM1Qk4sT0FBQSxDQUFBQyxZQUFBLEdBQUFBLFlBQVksR0FBR00sUUFBUSxDQUN6QiJ9