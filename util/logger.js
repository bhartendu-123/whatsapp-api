"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.createLogger = createLogger;














var _winston = _interopRequireDefault(require("winston")); /*
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
 */ // Use JSON logging for log files
// Here winston.format.errors() just seem to work
// because there is no winston.format.simple()
const jsonLogFileFormat = _winston.default.format.combine(_winston.default.format.errors({ stack: true }), _winston.default.format.timestamp(), _winston.default.format.prettyPrint());function createLogger(options) {const log_level = options.level; // Create file loggers
  const logger = _winston.default.createLogger({ level: 'debug', format: jsonLogFileFormat });
  // When running locally, write everything to the console
  // with proper stacktraces enabled
  if (options.logger.indexOf('console') > -1) {
    logger.add(
      new _winston.default.transports.Console({
        format: _winston.default.format.combine(
          _winston.default.format.errors({ stack: true }),
          _winston.default.format.colorize(),
          _winston.default.format.printf(({ level, message, timestamp, stack }) => {
            if (stack) {
              // print log trace
              return `${level}: ${timestamp} ${message} - ${stack}`;
            }
            return `${level}: ${timestamp} ${message}`;
          })
        )
      })
    );
  }
  if (options.logger.indexOf('file') > -1) {
    logger.add(
      new _winston.default.transports.File({
        filename: './log/app.logg',
        level: log_level,
        maxsize: 10485760,
        maxFiles: 3
      })
    );
  }

  return logger;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfd2luc3RvbiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwianNvbkxvZ0ZpbGVGb3JtYXQiLCJ3aW5zdG9uIiwiZm9ybWF0IiwiY29tYmluZSIsImVycm9ycyIsInN0YWNrIiwidGltZXN0YW1wIiwicHJldHR5UHJpbnQiLCJjcmVhdGVMb2dnZXIiLCJvcHRpb25zIiwibG9nX2xldmVsIiwibGV2ZWwiLCJsb2dnZXIiLCJpbmRleE9mIiwiYWRkIiwidHJhbnNwb3J0cyIsIkNvbnNvbGUiLCJjb2xvcml6ZSIsInByaW50ZiIsIm1lc3NhZ2UiLCJGaWxlIiwiZmlsZW5hbWUiLCJtYXhzaXplIiwibWF4RmlsZXMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9sb2dnZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDIxIFdQUENvbm5lY3QgVGVhbVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IHdpbnN0b24gZnJvbSAnd2luc3Rvbic7XG5cbi8vIFVzZSBKU09OIGxvZ2dpbmcgZm9yIGxvZyBmaWxlc1xuLy8gSGVyZSB3aW5zdG9uLmZvcm1hdC5lcnJvcnMoKSBqdXN0IHNlZW0gdG8gd29ya1xuLy8gYmVjYXVzZSB0aGVyZSBpcyBubyB3aW5zdG9uLmZvcm1hdC5zaW1wbGUoKVxuY29uc3QganNvbkxvZ0ZpbGVGb3JtYXQgPSB3aW5zdG9uLmZvcm1hdC5jb21iaW5lKFxuICB3aW5zdG9uLmZvcm1hdC5lcnJvcnMoeyBzdGFjazogdHJ1ZSB9KSxcbiAgd2luc3Rvbi5mb3JtYXQudGltZXN0YW1wKCksXG4gIHdpbnN0b24uZm9ybWF0LnByZXR0eVByaW50KClcbik7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2dnZXIob3B0aW9uczogYW55KSB7XG4gIGNvbnN0IGxvZ19sZXZlbCA9IG9wdGlvbnMubGV2ZWw7XG4gIC8vIENyZWF0ZSBmaWxlIGxvZ2dlcnNcbiAgY29uc3QgbG9nZ2VyID0gd2luc3Rvbi5jcmVhdGVMb2dnZXIoe1xuICAgIGxldmVsOiAnZGVidWcnLFxuICAgIGZvcm1hdDoganNvbkxvZ0ZpbGVGb3JtYXQsXG4gIH0pO1xuXG4gIC8vIFdoZW4gcnVubmluZyBsb2NhbGx5LCB3cml0ZSBldmVyeXRoaW5nIHRvIHRoZSBjb25zb2xlXG4gIC8vIHdpdGggcHJvcGVyIHN0YWNrdHJhY2VzIGVuYWJsZWRcbiAgaWYgKG9wdGlvbnMubG9nZ2VyLmluZGV4T2YoJ2NvbnNvbGUnKSA+IC0xKSB7XG4gICAgbG9nZ2VyLmFkZChcbiAgICAgIG5ldyB3aW5zdG9uLnRyYW5zcG9ydHMuQ29uc29sZSh7XG4gICAgICAgIGZvcm1hdDogd2luc3Rvbi5mb3JtYXQuY29tYmluZShcbiAgICAgICAgICB3aW5zdG9uLmZvcm1hdC5lcnJvcnMoeyBzdGFjazogdHJ1ZSB9KSxcbiAgICAgICAgICB3aW5zdG9uLmZvcm1hdC5jb2xvcml6ZSgpLFxuICAgICAgICAgIHdpbnN0b24uZm9ybWF0LnByaW50ZigoeyBsZXZlbCwgbWVzc2FnZSwgdGltZXN0YW1wLCBzdGFjayB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoc3RhY2spIHtcbiAgICAgICAgICAgICAgLy8gcHJpbnQgbG9nIHRyYWNlXG4gICAgICAgICAgICAgIHJldHVybiBgJHtsZXZlbH06ICR7dGltZXN0YW1wfSAke21lc3NhZ2V9IC0gJHtzdGFja31gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGAke2xldmVsfTogJHt0aW1lc3RhbXB9ICR7bWVzc2FnZX1gO1xuICAgICAgICAgIH0pXG4gICAgICAgICksXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgaWYgKG9wdGlvbnMubG9nZ2VyLmluZGV4T2YoJ2ZpbGUnKSA+IC0xKSB7XG4gICAgbG9nZ2VyLmFkZChcbiAgICAgIG5ldyB3aW5zdG9uLnRyYW5zcG9ydHMuRmlsZSh7XG4gICAgICAgIGZpbGVuYW1lOiAnLi9sb2cvYXBwLmxvZ2cnLFxuICAgICAgICBsZXZlbDogbG9nX2xldmVsLFxuICAgICAgICBtYXhzaXplOiAxMDQ4NTc2MCxcbiAgICAgICAgbWF4RmlsZXM6IDMsXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbG9nZ2VyO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxJQUFBQSxRQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUEsYUFBOEIsQ0FmOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBZEEsQ0FpQkE7QUFDQTtBQUNBO0FBQ0EsTUFBTUMsaUJBQWlCLEdBQUdDLGdCQUFPLENBQUNDLE1BQU0sQ0FBQ0MsT0FBTyxDQUM5Q0YsZ0JBQU8sQ0FBQ0MsTUFBTSxDQUFDRSxNQUFNLENBQUMsRUFBRUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDdENKLGdCQUFPLENBQUNDLE1BQU0sQ0FBQ0ksU0FBUyxDQUFDLENBQUMsRUFDMUJMLGdCQUFPLENBQUNDLE1BQU0sQ0FBQ0ssV0FBVyxDQUFDLENBQzdCLENBQUMsQ0FFTSxTQUFTQyxZQUFZQSxDQUFDQyxPQUFZLEVBQUUsQ0FDekMsTUFBTUMsU0FBUyxHQUFHRCxPQUFPLENBQUNFLEtBQUssQ0FBQyxDQUNoQztFQUNBLE1BQU1DLE1BQU0sR0FBR1gsZ0JBQU8sQ0FBQ08sWUFBWSxDQUFDLEVBQ2xDRyxLQUFLLEVBQUUsT0FBTyxFQUNkVCxNQUFNLEVBQUVGLGlCQUFpQixDQUMzQixDQUFDLENBQUM7RUFFRjtFQUNBO0VBQ0EsSUFBSVMsT0FBTyxDQUFDRyxNQUFNLENBQUNDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtJQUMxQ0QsTUFBTSxDQUFDRSxHQUFHO01BQ1IsSUFBSWIsZ0JBQU8sQ0FBQ2MsVUFBVSxDQUFDQyxPQUFPLENBQUM7UUFDN0JkLE1BQU0sRUFBRUQsZ0JBQU8sQ0FBQ0MsTUFBTSxDQUFDQyxPQUFPO1VBQzVCRixnQkFBTyxDQUFDQyxNQUFNLENBQUNFLE1BQU0sQ0FBQyxFQUFFQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztVQUN0Q0osZ0JBQU8sQ0FBQ0MsTUFBTSxDQUFDZSxRQUFRLENBQUMsQ0FBQztVQUN6QmhCLGdCQUFPLENBQUNDLE1BQU0sQ0FBQ2dCLE1BQU0sQ0FBQyxDQUFDLEVBQUVQLEtBQUssRUFBRVEsT0FBTyxFQUFFYixTQUFTLEVBQUVELEtBQUssQ0FBQyxDQUFDLEtBQUs7WUFDOUQsSUFBSUEsS0FBSyxFQUFFO2NBQ1Q7Y0FDQSxPQUFRLEdBQUVNLEtBQU0sS0FBSUwsU0FBVSxJQUFHYSxPQUFRLE1BQUtkLEtBQU0sRUFBQztZQUN2RDtZQUNBLE9BQVEsR0FBRU0sS0FBTSxLQUFJTCxTQUFVLElBQUdhLE9BQVEsRUFBQztVQUM1QyxDQUFDO1FBQ0g7TUFDRixDQUFDO0lBQ0gsQ0FBQztFQUNIO0VBQ0EsSUFBSVYsT0FBTyxDQUFDRyxNQUFNLENBQUNDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtJQUN2Q0QsTUFBTSxDQUFDRSxHQUFHO01BQ1IsSUFBSWIsZ0JBQU8sQ0FBQ2MsVUFBVSxDQUFDSyxJQUFJLENBQUM7UUFDMUJDLFFBQVEsRUFBRSxnQkFBZ0I7UUFDMUJWLEtBQUssRUFBRUQsU0FBUztRQUNoQlksT0FBTyxFQUFFLFFBQVE7UUFDakJDLFFBQVEsRUFBRTtNQUNaLENBQUM7SUFDSCxDQUFDO0VBQ0g7O0VBRUEsT0FBT1gsTUFBTTtBQUNmIn0=