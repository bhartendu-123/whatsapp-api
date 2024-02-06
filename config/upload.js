"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;














var _multer = _interopRequireDefault(require("multer"));
var _path = _interopRequireDefault(require("path")); /*
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
 */const storage = _multer.default.diskStorage({ destination: function (req, file, cb) {const __dirname = _path.default.resolve(_path.default.dirname(''));cb(null, _path.default.resolve(__dirname, 'uploads'));}, filename: function (req, file, cb) {const filename = `wppConnect-${Date.now()}-${file.originalname}`;cb(null, filename);} });const uploads = (0, _multer.default)({ storage: storage });var _default = exports.default = uploads;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbXVsdGVyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfcGF0aCIsInN0b3JhZ2UiLCJtdWx0ZXIiLCJkaXNrU3RvcmFnZSIsImRlc3RpbmF0aW9uIiwicmVxIiwiZmlsZSIsImNiIiwiX19kaXJuYW1lIiwicGF0aCIsInJlc29sdmUiLCJkaXJuYW1lIiwiZmlsZW5hbWUiLCJEYXRlIiwibm93Iiwib3JpZ2luYWxuYW1lIiwidXBsb2FkcyIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL3VwbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMjEgV1BQQ29ubmVjdCBUZWFtXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5pbXBvcnQgbXVsdGVyIGZyb20gJ211bHRlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3Qgc3RvcmFnZSA9IG11bHRlci5kaXNrU3RvcmFnZSh7XG4gIGRlc3RpbmF0aW9uOiBmdW5jdGlvbiAocmVxLCBmaWxlLCBjYikge1xuICAgIGNvbnN0IF9fZGlybmFtZSA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoJycpKTtcbiAgICBjYihudWxsLCBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAndXBsb2FkcycpKTtcbiAgfSxcbiAgZmlsZW5hbWU6IGZ1bmN0aW9uIChyZXEsIGZpbGUsIGNiKSB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBgd3BwQ29ubmVjdC0ke0RhdGUubm93KCl9LSR7ZmlsZS5vcmlnaW5hbG5hbWV9YDtcbiAgICBjYihudWxsLCBmaWxlbmFtZSk7XG4gIH0sXG59KTtcblxuY29uc3QgdXBsb2FkcyA9IG11bHRlcih7IHN0b3JhZ2U6IHN0b3JhZ2UgfSk7XG5leHBvcnQgZGVmYXVsdCB1cGxvYWRzO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxJQUFBQSxPQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxLQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUEsVUFBd0IsQ0FoQnhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUlBLE1BQU1FLE9BQU8sR0FBR0MsZUFBTSxDQUFDQyxXQUFXLENBQUMsRUFDakNDLFdBQVcsRUFBRSxTQUFBQSxDQUFVQyxHQUFHLEVBQUVDLElBQUksRUFBRUMsRUFBRSxFQUFFLENBQ3BDLE1BQU1DLFNBQVMsR0FBR0MsYUFBSSxDQUFDQyxPQUFPLENBQUNELGFBQUksQ0FBQ0UsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ2hESixFQUFFLENBQUMsSUFBSSxFQUFFRSxhQUFJLENBQUNDLE9BQU8sQ0FBQ0YsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQzlDLENBQUMsRUFDREksUUFBUSxFQUFFLFNBQUFBLENBQVVQLEdBQUcsRUFBRUMsSUFBSSxFQUFFQyxFQUFFLEVBQUUsQ0FDakMsTUFBTUssUUFBUSxHQUFJLGNBQWFDLElBQUksQ0FBQ0MsR0FBRyxDQUFDLENBQUUsSUFBR1IsSUFBSSxDQUFDUyxZQUFhLEVBQUMsQ0FDaEVSLEVBQUUsQ0FBQyxJQUFJLEVBQUVLLFFBQVEsQ0FBQyxDQUNwQixDQUFDLENBQ0gsQ0FBQyxDQUFDLENBRUYsTUFBTUksT0FBTyxHQUFHLElBQUFkLGVBQU0sRUFBQyxFQUFFRCxPQUFPLEVBQUVBLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFBZ0IsUUFBQSxHQUFBQyxPQUFBLENBQUFDLE9BQUEsR0FDOUJILE9BQU8ifQ==