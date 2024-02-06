"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;














var _express = require("express");
var _multer = _interopRequireDefault(require("multer"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _upload = _interopRequireDefault(require("../config/upload"));
var CatalogController = _interopRequireWildcard(require("../controller/catalogController"));
var CommunityController = _interopRequireWildcard(require("../controller/communityController"));
var DeviceController = _interopRequireWildcard(require("../controller/deviceController"));
var _encryptController = require("../controller/encryptController");
var GroupController = _interopRequireWildcard(require("../controller/groupController"));
var LabelsController = _interopRequireWildcard(require("../controller/labelsController"));
var MessageController = _interopRequireWildcard(require("../controller/messageController"));
var MiscController = _interopRequireWildcard(require("../controller/miscController"));
var NewsletterController = _interopRequireWildcard(require("../controller/newsletterController"));
var OrderController = _interopRequireWildcard(require("../controller/orderController"));
var SessionController = _interopRequireWildcard(require("../controller/sessionController"));
var StatusController = _interopRequireWildcard(require("../controller/statusController"));
var _auth = _interopRequireDefault(require("../middleware/auth"));
var HealthCheck = _interopRequireWildcard(require("../middleware/healthCheck"));
var prometheusRegister = _interopRequireWildcard(require("../middleware/instrumentation"));
var _statusConnection = _interopRequireDefault(require("../middleware/statusConnection"));
var _swagger = _interopRequireDefault(require("../swagger.json"));function _getRequireWildcardCache(e) {if ("function" != typeof WeakMap) return null;var r = new WeakMap(),t = new WeakMap();return (_getRequireWildcardCache = function (e) {return e ? t : r;})(e);}function _interopRequireWildcard(e, r) {if (!r && e && e.__esModule) return e;if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };var t = _getRequireWildcardCache(r);if (t && t.has(e)) return t.get(e);var n = { __proto__: null },a = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];}return n.default = e, t && t.set(e, n), n;} /*
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
 */const upload = (0, _multer.default)(_upload.default);const routes = (0, _express.Router)(); // Generate Token
routes.post('/api/:session/:secretkey/generate-token', _encryptController.encryptSession); // All Sessions
routes.get('/api/:secretkey/show-all-sessions', SessionController.showAllSessions);routes.post('/api/:secretkey/start-all', SessionController.startAllSessions); // Sessions
routes.get('/api/:session/check-connection-session',
_auth.default,
SessionController.checkConnectionSession
);
routes.get(
  '/api/:session/get-media-by-message/:messageId',
  _auth.default,
  SessionController.getMediaByMessage
);
routes.get(
  '/api/:session/get-platform-from-message/:messageId',
  _auth.default,
  DeviceController.getPlatformFromMessage
);
routes.get('/api/:session/qrcode-session', _auth.default, SessionController.getQrCode);
routes.post(
  '/api/:session/start-session',
  _auth.default,
  SessionController.startSession
);
routes.post(
  '/api/:session/logout-session',
  _auth.default,
  _statusConnection.default,
  SessionController.logOutSession
);
routes.post(
  '/api/:session/:secretkey/clear-session-data',
  MiscController.clearSessionData
);
routes.post(
  '/api/:session/close-session',
  _auth.default,
  SessionController.closeSession
);
routes.post(
  '/api/:session/subscribe-presence',
  _auth.default,
  SessionController.subscribePresence
);
routes.post(
  '/api/:session/download-media',
  _auth.default,
  _statusConnection.default,
  SessionController.downloadMediaByMessage
);

// Messages
routes.post(
  '/api/:session/send-message',
  _auth.default,
  _statusConnection.default,
  MessageController.sendMessage
);
routes.post(
  '/api/:session/edit-message',
  _auth.default,
  _statusConnection.default,
  MessageController.editMessage
);
routes.post(
  '/api/:session/send-image',
  upload.single('file'),
  _auth.default,
  _statusConnection.default,
  MessageController.sendFile
);
routes.post(
  '/api/:session/send-sticker',
  upload.single('file'),
  _auth.default,
  _statusConnection.default,
  MessageController.sendImageAsSticker
);
routes.post(
  '/api/:session/send-sticker-gif',
  upload.single('file'),
  _auth.default,
  _statusConnection.default,
  MessageController.sendImageAsStickerGif
);
routes.post(
  '/api/:session/send-reply',
  _auth.default,
  _statusConnection.default,
  MessageController.replyMessage
);
routes.post(
  '/api/:session/send-file',
  upload.single('file'),
  _auth.default,
  _statusConnection.default,
  MessageController.sendFile
);
routes.post(
  '/api/:session/send-file-base64',
  _auth.default,
  _statusConnection.default,
  MessageController.sendFile
);
routes.post(
  '/api/:session/send-voice',
  _auth.default,
  _statusConnection.default,
  MessageController.sendVoice
);
routes.post(
  '/api/:session/send-voice-base64',
  _auth.default,
  _statusConnection.default,
  MessageController.sendVoice64
);
routes.get(
  '/api/:session/status-session',
  _auth.default,
  SessionController.getSessionState
);
routes.post(
  '/api/:session/send-status',
  _auth.default,
  _statusConnection.default,
  MessageController.sendStatusText
);
routes.post(
  '/api/:session/send-link-preview',
  _auth.default,
  _statusConnection.default,
  MessageController.sendLinkPreview
);
routes.post(
  '/api/:session/send-location',
  _auth.default,
  _statusConnection.default,
  MessageController.sendLocation
);
routes.post(
  '/api/:session/send-mentioned',
  _auth.default,
  _statusConnection.default,
  MessageController.sendMentioned
);
routes.post(
  '/api/:session/send-buttons',
  _auth.default,
  _statusConnection.default,
  MessageController.sendButtons
);
routes.post(
  '/api/:session/send-list-message',
  _auth.default,
  _statusConnection.default,
  MessageController.sendListMessage
);
routes.post(
  '/api/:session/send-order-message',
  _auth.default,
  _statusConnection.default,
  MessageController.sendOrderMessage
);
routes.post(
  '/api/:session/send-poll-message',
  _auth.default,
  _statusConnection.default,
  MessageController.sendPollMessage
);

// Group
routes.get(
  '/api/:session/all-broadcast-list',
  _auth.default,
  _statusConnection.default,
  GroupController.getAllBroadcastList
);
routes.get(
  '/api/:session/all-groups',
  _auth.default,
  _statusConnection.default,
  GroupController.getAllGroups
);
routes.get(
  '/api/:session/group-members/:groupId',
  _auth.default,
  _statusConnection.default,
  GroupController.getGroupMembers
);
routes.get(
  '/api/:session/common-groups/:wid',
  _auth.default,
  _statusConnection.default,
  GroupController.getCommonGroups
);
routes.get(
  '/api/:session/group-admins/:groupId',
  _auth.default,
  _statusConnection.default,
  GroupController.getGroupAdmins
);
routes.get(
  '/api/:session/group-invite-link/:groupId',
  _auth.default,
  _statusConnection.default,
  GroupController.getGroupInviteLink
);
routes.get(
  '/api/:session/group-revoke-link/:groupId',
  _auth.default,
  _statusConnection.default,
  GroupController.revokeGroupInviteLink
);
routes.get(
  '/api/:session/group-members-ids/:groupId',
  _auth.default,
  _statusConnection.default,
  GroupController.getGroupMembersIds
);
routes.post(
  '/api/:session/create-group',
  _auth.default,
  _statusConnection.default,
  GroupController.createGroup
);
routes.post(
  '/api/:session/leave-group',
  _auth.default,
  _statusConnection.default,
  GroupController.leaveGroup
);
routes.post(
  '/api/:session/join-code',
  _auth.default,
  _statusConnection.default,
  GroupController.joinGroupByCode
);
routes.post(
  '/api/:session/add-participant-group',
  _auth.default,
  _statusConnection.default,
  GroupController.addParticipant
);
routes.post(
  '/api/:session/remove-participant-group',
  _auth.default,
  _statusConnection.default,
  GroupController.removeParticipant
);
routes.post(
  '/api/:session/promote-participant-group',
  _auth.default,
  _statusConnection.default,
  GroupController.promoteParticipant
);
routes.post(
  '/api/:session/demote-participant-group',
  _auth.default,
  _statusConnection.default,
  GroupController.demoteParticipant
);
routes.post(
  '/api/:session/group-info-from-invite-link',
  _auth.default,
  _statusConnection.default,
  GroupController.getGroupInfoFromInviteLink
);
routes.post(
  '/api/:session/group-description',
  _auth.default,
  _statusConnection.default,
  GroupController.setGroupDescription
);
routes.post(
  '/api/:session/group-property',
  _auth.default,
  _statusConnection.default,
  GroupController.setGroupProperty
);
routes.post(
  '/api/:session/group-subject',
  _auth.default,
  _statusConnection.default,
  GroupController.setGroupSubject
);
routes.post(
  '/api/:session/messages-admins-only',
  _auth.default,
  _statusConnection.default,
  GroupController.setMessagesAdminsOnly
);
routes.post(
  '/api/:session/group-pic',
  upload.single('file'),
  _auth.default,
  _statusConnection.default,
  GroupController.setGroupProfilePic
);
routes.post(
  '/api/:session/change-privacy-group',
  _auth.default,
  _statusConnection.default,
  GroupController.changePrivacyGroup
);

// Chat
routes.get(
  '/api/:session/all-chats',
  _auth.default,
  _statusConnection.default,
  DeviceController.getAllChats
);
routes.post(
  '/api/:session/list-chats',
  _auth.default,
  _statusConnection.default,
  DeviceController.listChats
);

routes.get(
  '/api/:session/all-chats-archived',
  _auth.default,
  _statusConnection.default,
  DeviceController.getAllChatsArchiveds
);
routes.get(
  '/api/:session/all-chats-with-messages',
  _auth.default,
  _statusConnection.default,
  DeviceController.getAllChatsWithMessages
);
routes.get(
  '/api/:session/all-messages-in-chat/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.getAllMessagesInChat
);
routes.get(
  '/api/:session/all-new-messages',
  _auth.default,
  _statusConnection.default,
  DeviceController.getAllNewMessages
);
routes.get(
  '/api/:session/unread-messages',
  _auth.default,
  _statusConnection.default,
  DeviceController.getUnreadMessages
);
routes.get(
  '/api/:session/all-unread-messages',
  _auth.default,
  _statusConnection.default,
  DeviceController.getAllUnreadMessages
);
routes.get(
  '/api/:session/chat-by-id/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.getChatById
);
routes.get(
  '/api/:session/message-by-id/:messageId',
  _auth.default,
  _statusConnection.default,
  DeviceController.getMessageById
);
routes.get(
  '/api/:session/chat-is-online/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.getChatIsOnline
);
routes.get(
  '/api/:session/last-seen/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.getLastSeen
);
routes.get(
  '/api/:session/list-mutes/:type',
  _auth.default,
  _statusConnection.default,
  DeviceController.getListMutes
);
routes.get(
  '/api/:session/load-messages-in-chat/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.loadAndGetAllMessagesInChat
);
routes.get(
  '/api/:session/get-messages/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.getMessages
);

routes.post(
  '/api/:session/archive-chat',
  _auth.default,
  _statusConnection.default,
  DeviceController.archiveChat
);
routes.post(
  '/api/:session/archive-all-chats',
  _auth.default,
  _statusConnection.default,
  DeviceController.archiveAllChats
);
routes.post(
  '/api/:session/clear-chat',
  _auth.default,
  _statusConnection.default,
  DeviceController.clearChat
);
routes.post(
  '/api/:session/clear-all-chats',
  _auth.default,
  _statusConnection.default,
  DeviceController.clearAllChats
);
routes.post(
  '/api/:session/delete-chat',
  _auth.default,
  _statusConnection.default,
  DeviceController.deleteChat
);
routes.post(
  '/api/:session/delete-all-chats',
  _auth.default,
  _statusConnection.default,
  DeviceController.deleteAllChats
);
routes.post(
  '/api/:session/delete-message',
  _auth.default,
  _statusConnection.default,
  DeviceController.deleteMessage
);
routes.post(
  '/api/:session/react-message',
  _auth.default,
  _statusConnection.default,
  DeviceController.reactMessage
);
routes.post(
  '/api/:session/forward-messages',
  _auth.default,
  _statusConnection.default,
  DeviceController.forwardMessages
);
routes.post(
  '/api/:session/mark-unseen',
  _auth.default,
  _statusConnection.default,
  DeviceController.markUnseenMessage
);
routes.post(
  '/api/:session/pin-chat',
  _auth.default,
  _statusConnection.default,
  DeviceController.pinChat
);
routes.post(
  '/api/:session/contact-vcard',
  _auth.default,
  _statusConnection.default,
  DeviceController.sendContactVcard
);
routes.post(
  '/api/:session/send-mute',
  _auth.default,
  _statusConnection.default,
  DeviceController.sendMute
);
routes.post(
  '/api/:session/send-seen',
  _auth.default,
  _statusConnection.default,
  DeviceController.sendSeen
);
routes.post(
  '/api/:session/chat-state',
  _auth.default,
  _statusConnection.default,
  DeviceController.setChatState
);
routes.post(
  '/api/:session/temporary-messages',
  _auth.default,
  _statusConnection.default,
  DeviceController.setTemporaryMessages
);
routes.post(
  '/api/:session/typing',
  _auth.default,
  _statusConnection.default,
  DeviceController.setTyping
);
routes.post(
  '/api/:session/recording',
  _auth.default,
  _statusConnection.default,
  DeviceController.setRecording
);
routes.post(
  '/api/:session/star-message',
  _auth.default,
  _statusConnection.default,
  DeviceController.starMessage
);
routes.get(
  '/api/:session/reactions/:id',
  _auth.default,
  _statusConnection.default,
  DeviceController.getReactions
);
routes.get(
  '/api/:session/votes/:id',
  _auth.default,
  _statusConnection.default,
  DeviceController.getVotes
);
routes.post(
  '/api/:session/reject-call',
  _auth.default,
  _statusConnection.default,
  DeviceController.rejectCall
);

// Catalog
routes.get(
  '/api/:session/get-products',
  _auth.default,
  _statusConnection.default,
  CatalogController.getProducts
);
routes.get(
  '/api/:session/get-product-by-id',
  _auth.default,
  _statusConnection.default,
  CatalogController.getProductById
);
routes.post(
  '/api/:session/add-product',
  _auth.default,
  _statusConnection.default,
  CatalogController.addProduct
);
routes.post(
  '/api/:session/edit-product',
  _auth.default,
  _statusConnection.default,
  CatalogController.editProduct
);
routes.post(
  '/api/:session/del-products',
  _auth.default,
  _statusConnection.default,
  CatalogController.delProducts
);
routes.post(
  '/api/:session/change-product-image',
  _auth.default,
  _statusConnection.default,
  CatalogController.changeProductImage
);
routes.post(
  '/api/:session/add-product-image',
  _auth.default,
  _statusConnection.default,
  CatalogController.addProductImage
);
routes.post(
  '/api/:session/remove-product-image',
  _auth.default,
  _statusConnection.default,
  CatalogController.removeProductImage
);
routes.get(
  '/api/:session/get-collections',
  _auth.default,
  _statusConnection.default,
  CatalogController.getCollections
);
routes.post(
  '/api/:session/create-collection',
  _auth.default,
  _statusConnection.default,
  CatalogController.createCollection
);
routes.post(
  '/api/:session/edit-collection',
  _auth.default,
  _statusConnection.default,
  CatalogController.editCollection
);
routes.post(
  '/api/:session/del-collection',
  _auth.default,
  _statusConnection.default,
  CatalogController.deleteCollection
);
routes.post(
  '/api/:session/send-link-catalog',
  _auth.default,
  _statusConnection.default,
  CatalogController.sendLinkCatalog
);
routes.post(
  '/api/:session/set-product-visibility',
  _auth.default,
  _statusConnection.default,
  CatalogController.setProductVisibility
);
routes.post(
  '/api/:session/set-cart-enabled',
  _auth.default,
  _statusConnection.default,
  CatalogController.updateCartEnabled
);

// Status
routes.post(
  '/api/:session/send-text-storie',
  _auth.default,
  _statusConnection.default,
  StatusController.sendTextStorie
);
routes.post(
  '/api/:session/send-image-storie',
  upload.single('file'),
  _auth.default,
  _statusConnection.default,
  StatusController.sendImageStorie
);
routes.post(
  '/api/:session/send-video-storie',
  upload.single('file'),
  _auth.default,
  _statusConnection.default,
  StatusController.sendVideoStorie
);

// Labels
routes.post(
  '/api/:session/add-new-label',
  _auth.default,
  _statusConnection.default,
  LabelsController.addNewLabel
);
routes.post(
  '/api/:session/add-or-remove-label',
  _auth.default,
  _statusConnection.default,
  LabelsController.addOrRemoveLabels
);
routes.get(
  '/api/:session/get-all-labels',
  _auth.default,
  _statusConnection.default,
  LabelsController.getAllLabels
);
routes.put(
  '/api/:session/delete-all-labels',
  _auth.default,
  _statusConnection.default,
  LabelsController.deleteAllLabels
);
routes.put(
  '/api/:session/delete-label/:id',
  _auth.default,
  _statusConnection.default,
  LabelsController.deleteLabel
);

// Contact
routes.get(
  '/api/:session/check-number-status/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.checkNumberStatus
);
routes.get(
  '/api/:session/all-contacts',
  _auth.default,
  _statusConnection.default,
  DeviceController.getAllContacts
);
routes.get(
  '/api/:session/contact/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.getContact
);
routes.get(
  '/api/:session/profile/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.getNumberProfile
);
routes.get(
  '/api/:session/profile-pic/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.getProfilePicFromServer
);
routes.get(
  '/api/:session/profile-status/:phone',
  _auth.default,
  _statusConnection.default,
  DeviceController.getStatus
);

// Blocklist
routes.get(
  '/api/:session/blocklist',
  _auth.default,
  _statusConnection.default,
  DeviceController.getBlockList
);
routes.post(
  '/api/:session/block-contact',
  _auth.default,
  _statusConnection.default,
  DeviceController.blockContact
);
routes.post(
  '/api/:session/unblock-contact',
  _auth.default,
  _statusConnection.default,
  DeviceController.unblockContact
);

// Device
routes.get(
  '/api/:session/get-battery-level',
  _auth.default,
  _statusConnection.default,
  DeviceController.getBatteryLevel
);
routes.get(
  '/api/:session/host-device',
  _auth.default,
  _statusConnection.default,
  DeviceController.getHostDevice
);
routes.get(
  '/api/:session/get-phone-number',
  _auth.default,
  _statusConnection.default,
  DeviceController.getPhoneNumber
);

// Profile
routes.post(
  '/api/:session/set-profile-pic',
  upload.single('file'),
  _auth.default,
  _statusConnection.default,
  DeviceController.setProfilePic
);
routes.post(
  '/api/:session/profile-status',
  _auth.default,
  _statusConnection.default,
  DeviceController.setProfileStatus
);
routes.post(
  '/api/:session/change-username',
  _auth.default,
  _statusConnection.default,
  DeviceController.setProfileName
);

// Business
routes.post(
  '/api/:session/edit-business-profile',
  _auth.default,
  _statusConnection.default,
  SessionController.editBusinessProfile
);
routes.get(
  '/api/:session/get-business-profiles-products',
  _auth.default,
  _statusConnection.default,
  OrderController.getBusinessProfilesProducts
);
routes.get(
  '/api/:session/get-order-by-messageId/:messageId',
  _auth.default,
  _statusConnection.default,
  OrderController.getOrderbyMsg
);
routes.get('/api/:secretkey/backup-sessions', MiscController.backupAllSessions);
routes.post(
  '/api/:secretkey/restore-sessions',
  upload.single('file'),
  MiscController.restoreAllSessions
);
routes.get(
  '/api/:session/take-screenshot',
  _auth.default,
  MiscController.takeScreenshot
);
routes.post('/api/:session/set-limit', MiscController.setLimit);

//Communitys
routes.post(
  '/api/:session/create-community',
  _auth.default,
  _statusConnection.default,
  CommunityController.createCommunity
);
routes.post(
  '/api/:session/deactivate-community',
  _auth.default,
  _statusConnection.default,
  CommunityController.deactivateCommunity
);
routes.post(
  '/api/:session/add-community-subgroup',
  _auth.default,
  _statusConnection.default,
  CommunityController.addSubgroupsCommunity
);
routes.post(
  '/api/:session/remove-community-subgroup',
  _auth.default,
  _statusConnection.default,
  CommunityController.removeSubgroupsCommunity
);
routes.post(
  '/api/:session/promote-community-participant',
  _auth.default,
  _statusConnection.default,
  CommunityController.promoteCommunityParticipant
);
routes.post(
  '/api/:session/demote-community-participant',
  _auth.default,
  _statusConnection.default,
  CommunityController.demoteCommunityParticipant
);
routes.get(
  '/api/:session/community-participants/:id',
  _auth.default,
  _statusConnection.default,
  CommunityController.getCommunityParticipants
);

routes.post(
  '/api/:session/newsletter',
  _auth.default,
  _statusConnection.default,
  NewsletterController.createNewsletter
);
routes.put(
  '/api/:session/newsletter/:id',
  _auth.default,
  _statusConnection.default,
  NewsletterController.editNewsletter
);

routes.delete(
  '/api/:session/newsletter/:id',
  _auth.default,
  _statusConnection.default,
  NewsletterController.destroyNewsletter
);
routes.post(
  '/api/:session/mute-newsletter/:id',
  _auth.default,
  _statusConnection.default,
  NewsletterController.muteNewsletter
);

routes.post('/api/:session/chatwoot', DeviceController.chatWoot);

// Api Doc
routes.use('/api-docs', _swaggerUiExpress.default.serve);
routes.get('/api-docs', _swaggerUiExpress.default.setup(_swagger.default));

//k8s
routes.get('/healthz', HealthCheck.healthz);
routes.get('/unhealthy', HealthCheck.unhealthy);

//Metrics Prometheus

routes.get('/metrics', prometheusRegister.metrics);var _default = exports.default =

routes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXhwcmVzcyIsInJlcXVpcmUiLCJfbXVsdGVyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9zd2FnZ2VyVWlFeHByZXNzIiwiX3VwbG9hZCIsIkNhdGFsb2dDb250cm9sbGVyIiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJDb21tdW5pdHlDb250cm9sbGVyIiwiRGV2aWNlQ29udHJvbGxlciIsIl9lbmNyeXB0Q29udHJvbGxlciIsIkdyb3VwQ29udHJvbGxlciIsIkxhYmVsc0NvbnRyb2xsZXIiLCJNZXNzYWdlQ29udHJvbGxlciIsIk1pc2NDb250cm9sbGVyIiwiTmV3c2xldHRlckNvbnRyb2xsZXIiLCJPcmRlckNvbnRyb2xsZXIiLCJTZXNzaW9uQ29udHJvbGxlciIsIlN0YXR1c0NvbnRyb2xsZXIiLCJfYXV0aCIsIkhlYWx0aENoZWNrIiwicHJvbWV0aGV1c1JlZ2lzdGVyIiwiX3N0YXR1c0Nvbm5lY3Rpb24iLCJfc3dhZ2dlciIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsImUiLCJXZWFrTWFwIiwiciIsInQiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsInVwbG9hZCIsIm11bHRlciIsInVwbG9hZENvbmZpZyIsInJvdXRlcyIsIlJvdXRlciIsInBvc3QiLCJlbmNyeXB0U2Vzc2lvbiIsInNob3dBbGxTZXNzaW9ucyIsInN0YXJ0QWxsU2Vzc2lvbnMiLCJ2ZXJpZnlUb2tlbiIsImNoZWNrQ29ubmVjdGlvblNlc3Npb24iLCJnZXRNZWRpYUJ5TWVzc2FnZSIsImdldFBsYXRmb3JtRnJvbU1lc3NhZ2UiLCJnZXRRckNvZGUiLCJzdGFydFNlc3Npb24iLCJzdGF0dXNDb25uZWN0aW9uIiwibG9nT3V0U2Vzc2lvbiIsImNsZWFyU2Vzc2lvbkRhdGEiLCJjbG9zZVNlc3Npb24iLCJzdWJzY3JpYmVQcmVzZW5jZSIsImRvd25sb2FkTWVkaWFCeU1lc3NhZ2UiLCJzZW5kTWVzc2FnZSIsImVkaXRNZXNzYWdlIiwic2luZ2xlIiwic2VuZEZpbGUiLCJzZW5kSW1hZ2VBc1N0aWNrZXIiLCJzZW5kSW1hZ2VBc1N0aWNrZXJHaWYiLCJyZXBseU1lc3NhZ2UiLCJzZW5kVm9pY2UiLCJzZW5kVm9pY2U2NCIsImdldFNlc3Npb25TdGF0ZSIsInNlbmRTdGF0dXNUZXh0Iiwic2VuZExpbmtQcmV2aWV3Iiwic2VuZExvY2F0aW9uIiwic2VuZE1lbnRpb25lZCIsInNlbmRCdXR0b25zIiwic2VuZExpc3RNZXNzYWdlIiwic2VuZE9yZGVyTWVzc2FnZSIsInNlbmRQb2xsTWVzc2FnZSIsImdldEFsbEJyb2FkY2FzdExpc3QiLCJnZXRBbGxHcm91cHMiLCJnZXRHcm91cE1lbWJlcnMiLCJnZXRDb21tb25Hcm91cHMiLCJnZXRHcm91cEFkbWlucyIsImdldEdyb3VwSW52aXRlTGluayIsInJldm9rZUdyb3VwSW52aXRlTGluayIsImdldEdyb3VwTWVtYmVyc0lkcyIsImNyZWF0ZUdyb3VwIiwibGVhdmVHcm91cCIsImpvaW5Hcm91cEJ5Q29kZSIsImFkZFBhcnRpY2lwYW50IiwicmVtb3ZlUGFydGljaXBhbnQiLCJwcm9tb3RlUGFydGljaXBhbnQiLCJkZW1vdGVQYXJ0aWNpcGFudCIsImdldEdyb3VwSW5mb0Zyb21JbnZpdGVMaW5rIiwic2V0R3JvdXBEZXNjcmlwdGlvbiIsInNldEdyb3VwUHJvcGVydHkiLCJzZXRHcm91cFN1YmplY3QiLCJzZXRNZXNzYWdlc0FkbWluc09ubHkiLCJzZXRHcm91cFByb2ZpbGVQaWMiLCJjaGFuZ2VQcml2YWN5R3JvdXAiLCJnZXRBbGxDaGF0cyIsImxpc3RDaGF0cyIsImdldEFsbENoYXRzQXJjaGl2ZWRzIiwiZ2V0QWxsQ2hhdHNXaXRoTWVzc2FnZXMiLCJnZXRBbGxNZXNzYWdlc0luQ2hhdCIsImdldEFsbE5ld01lc3NhZ2VzIiwiZ2V0VW5yZWFkTWVzc2FnZXMiLCJnZXRBbGxVbnJlYWRNZXNzYWdlcyIsImdldENoYXRCeUlkIiwiZ2V0TWVzc2FnZUJ5SWQiLCJnZXRDaGF0SXNPbmxpbmUiLCJnZXRMYXN0U2VlbiIsImdldExpc3RNdXRlcyIsImxvYWRBbmRHZXRBbGxNZXNzYWdlc0luQ2hhdCIsImdldE1lc3NhZ2VzIiwiYXJjaGl2ZUNoYXQiLCJhcmNoaXZlQWxsQ2hhdHMiLCJjbGVhckNoYXQiLCJjbGVhckFsbENoYXRzIiwiZGVsZXRlQ2hhdCIsImRlbGV0ZUFsbENoYXRzIiwiZGVsZXRlTWVzc2FnZSIsInJlYWN0TWVzc2FnZSIsImZvcndhcmRNZXNzYWdlcyIsIm1hcmtVbnNlZW5NZXNzYWdlIiwicGluQ2hhdCIsInNlbmRDb250YWN0VmNhcmQiLCJzZW5kTXV0ZSIsInNlbmRTZWVuIiwic2V0Q2hhdFN0YXRlIiwic2V0VGVtcG9yYXJ5TWVzc2FnZXMiLCJzZXRUeXBpbmciLCJzZXRSZWNvcmRpbmciLCJzdGFyTWVzc2FnZSIsImdldFJlYWN0aW9ucyIsImdldFZvdGVzIiwicmVqZWN0Q2FsbCIsImdldFByb2R1Y3RzIiwiZ2V0UHJvZHVjdEJ5SWQiLCJhZGRQcm9kdWN0IiwiZWRpdFByb2R1Y3QiLCJkZWxQcm9kdWN0cyIsImNoYW5nZVByb2R1Y3RJbWFnZSIsImFkZFByb2R1Y3RJbWFnZSIsInJlbW92ZVByb2R1Y3RJbWFnZSIsImdldENvbGxlY3Rpb25zIiwiY3JlYXRlQ29sbGVjdGlvbiIsImVkaXRDb2xsZWN0aW9uIiwiZGVsZXRlQ29sbGVjdGlvbiIsInNlbmRMaW5rQ2F0YWxvZyIsInNldFByb2R1Y3RWaXNpYmlsaXR5IiwidXBkYXRlQ2FydEVuYWJsZWQiLCJzZW5kVGV4dFN0b3JpZSIsInNlbmRJbWFnZVN0b3JpZSIsInNlbmRWaWRlb1N0b3JpZSIsImFkZE5ld0xhYmVsIiwiYWRkT3JSZW1vdmVMYWJlbHMiLCJnZXRBbGxMYWJlbHMiLCJwdXQiLCJkZWxldGVBbGxMYWJlbHMiLCJkZWxldGVMYWJlbCIsImNoZWNrTnVtYmVyU3RhdHVzIiwiZ2V0QWxsQ29udGFjdHMiLCJnZXRDb250YWN0IiwiZ2V0TnVtYmVyUHJvZmlsZSIsImdldFByb2ZpbGVQaWNGcm9tU2VydmVyIiwiZ2V0U3RhdHVzIiwiZ2V0QmxvY2tMaXN0IiwiYmxvY2tDb250YWN0IiwidW5ibG9ja0NvbnRhY3QiLCJnZXRCYXR0ZXJ5TGV2ZWwiLCJnZXRIb3N0RGV2aWNlIiwiZ2V0UGhvbmVOdW1iZXIiLCJzZXRQcm9maWxlUGljIiwic2V0UHJvZmlsZVN0YXR1cyIsInNldFByb2ZpbGVOYW1lIiwiZWRpdEJ1c2luZXNzUHJvZmlsZSIsImdldEJ1c2luZXNzUHJvZmlsZXNQcm9kdWN0cyIsImdldE9yZGVyYnlNc2ciLCJiYWNrdXBBbGxTZXNzaW9ucyIsInJlc3RvcmVBbGxTZXNzaW9ucyIsInRha2VTY3JlZW5zaG90Iiwic2V0TGltaXQiLCJjcmVhdGVDb21tdW5pdHkiLCJkZWFjdGl2YXRlQ29tbXVuaXR5IiwiYWRkU3ViZ3JvdXBzQ29tbXVuaXR5IiwicmVtb3ZlU3ViZ3JvdXBzQ29tbXVuaXR5IiwicHJvbW90ZUNvbW11bml0eVBhcnRpY2lwYW50IiwiZGVtb3RlQ29tbXVuaXR5UGFydGljaXBhbnQiLCJnZXRDb21tdW5pdHlQYXJ0aWNpcGFudHMiLCJjcmVhdGVOZXdzbGV0dGVyIiwiZWRpdE5ld3NsZXR0ZXIiLCJkZWxldGUiLCJkZXN0cm95TmV3c2xldHRlciIsIm11dGVOZXdzbGV0dGVyIiwiY2hhdFdvb3QiLCJ1c2UiLCJzd2FnZ2VyVWkiLCJzZXJ2ZSIsInNldHVwIiwic3dhZ2dlckRvY3VtZW50IiwiaGVhbHRoeiIsInVuaGVhbHRoeSIsIm1ldHJpY3MiLCJfZGVmYXVsdCIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAyMSBXUFBDb25uZWN0IFRlYW1cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IG11bHRlciBmcm9tICdtdWx0ZXInO1xuaW1wb3J0IHN3YWdnZXJVaSBmcm9tICdzd2FnZ2VyLXVpLWV4cHJlc3MnO1xuXG5pbXBvcnQgdXBsb2FkQ29uZmlnIGZyb20gJy4uL2NvbmZpZy91cGxvYWQnO1xuaW1wb3J0ICogYXMgQ2F0YWxvZ0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlci9jYXRhbG9nQ29udHJvbGxlcic7XG5pbXBvcnQgKiBhcyBDb21tdW5pdHlDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXIvY29tbXVuaXR5Q29udHJvbGxlcic7XG5pbXBvcnQgKiBhcyBEZXZpY2VDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXIvZGV2aWNlQ29udHJvbGxlcic7XG5pbXBvcnQgeyBlbmNyeXB0U2Vzc2lvbiB9IGZyb20gJy4uL2NvbnRyb2xsZXIvZW5jcnlwdENvbnRyb2xsZXInO1xuaW1wb3J0ICogYXMgR3JvdXBDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXIvZ3JvdXBDb250cm9sbGVyJztcbmltcG9ydCAqIGFzIExhYmVsc0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlci9sYWJlbHNDb250cm9sbGVyJztcbmltcG9ydCAqIGFzIE1lc3NhZ2VDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXIvbWVzc2FnZUNvbnRyb2xsZXInO1xuaW1wb3J0ICogYXMgTWlzY0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlci9taXNjQ29udHJvbGxlcic7XG5pbXBvcnQgKiBhcyBOZXdzbGV0dGVyQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVyL25ld3NsZXR0ZXJDb250cm9sbGVyJztcbmltcG9ydCAqIGFzIE9yZGVyQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVyL29yZGVyQ29udHJvbGxlcic7XG5pbXBvcnQgKiBhcyBTZXNzaW9uQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVyL3Nlc3Npb25Db250cm9sbGVyJztcbmltcG9ydCAqIGFzIFN0YXR1c0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlci9zdGF0dXNDb250cm9sbGVyJztcbmltcG9ydCB2ZXJpZnlUb2tlbiBmcm9tICcuLi9taWRkbGV3YXJlL2F1dGgnO1xuaW1wb3J0ICogYXMgSGVhbHRoQ2hlY2sgZnJvbSAnLi4vbWlkZGxld2FyZS9oZWFsdGhDaGVjayc7XG5pbXBvcnQgKiBhcyBwcm9tZXRoZXVzUmVnaXN0ZXIgZnJvbSAnLi4vbWlkZGxld2FyZS9pbnN0cnVtZW50YXRpb24nO1xuaW1wb3J0IHN0YXR1c0Nvbm5lY3Rpb24gZnJvbSAnLi4vbWlkZGxld2FyZS9zdGF0dXNDb25uZWN0aW9uJztcbmltcG9ydCBzd2FnZ2VyRG9jdW1lbnQgZnJvbSAnLi4vc3dhZ2dlci5qc29uJztcblxuY29uc3QgdXBsb2FkID0gbXVsdGVyKHVwbG9hZENvbmZpZyBhcyBhbnkpO1xuY29uc3Qgcm91dGVzID0gUm91dGVyKCk7XG5cbi8vIEdlbmVyYXRlIFRva2VuXG5yb3V0ZXMucG9zdCgnL2FwaS86c2Vzc2lvbi86c2VjcmV0a2V5L2dlbmVyYXRlLXRva2VuJywgZW5jcnlwdFNlc3Npb24pO1xuXG4vLyBBbGwgU2Vzc2lvbnNcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZWNyZXRrZXkvc2hvdy1hbGwtc2Vzc2lvbnMnLFxuICBTZXNzaW9uQ29udHJvbGxlci5zaG93QWxsU2Vzc2lvbnNcbik7XG5yb3V0ZXMucG9zdCgnL2FwaS86c2VjcmV0a2V5L3N0YXJ0LWFsbCcsIFNlc3Npb25Db250cm9sbGVyLnN0YXJ0QWxsU2Vzc2lvbnMpO1xuXG4vLyBTZXNzaW9uc1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vY2hlY2stY29ubmVjdGlvbi1zZXNzaW9uJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIFNlc3Npb25Db250cm9sbGVyLmNoZWNrQ29ubmVjdGlvblNlc3Npb25cbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9nZXQtbWVkaWEtYnktbWVzc2FnZS86bWVzc2FnZUlkJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIFNlc3Npb25Db250cm9sbGVyLmdldE1lZGlhQnlNZXNzYWdlXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vZ2V0LXBsYXRmb3JtLWZyb20tbWVzc2FnZS86bWVzc2FnZUlkJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0UGxhdGZvcm1Gcm9tTWVzc2FnZVxuKTtcbnJvdXRlcy5nZXQoJy9hcGkvOnNlc3Npb24vcXJjb2RlLXNlc3Npb24nLHZlcmlmeVRva2VuLFNlc3Npb25Db250cm9sbGVyLmdldFFyQ29kZSk7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc3RhcnQtc2Vzc2lvbicsXG4gIHZlcmlmeVRva2VuLFxuICBTZXNzaW9uQ29udHJvbGxlci5zdGFydFNlc3Npb25cbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vbG9nb3V0LXNlc3Npb24nLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgU2Vzc2lvbkNvbnRyb2xsZXIubG9nT3V0U2Vzc2lvblxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi86c2VjcmV0a2V5L2NsZWFyLXNlc3Npb24tZGF0YScsXG4gIE1pc2NDb250cm9sbGVyLmNsZWFyU2Vzc2lvbkRhdGFcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vY2xvc2Utc2Vzc2lvbicsXG4gIHZlcmlmeVRva2VuLFxuICBTZXNzaW9uQ29udHJvbGxlci5jbG9zZVNlc3Npb25cbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc3Vic2NyaWJlLXByZXNlbmNlJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIFNlc3Npb25Db250cm9sbGVyLnN1YnNjcmliZVByZXNlbmNlXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2Rvd25sb2FkLW1lZGlhJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIFNlc3Npb25Db250cm9sbGVyLmRvd25sb2FkTWVkaWFCeU1lc3NhZ2Vcbik7XG5cbi8vIE1lc3NhZ2VzXG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2VuZC1tZXNzYWdlJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIE1lc3NhZ2VDb250cm9sbGVyLnNlbmRNZXNzYWdlXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2VkaXQtbWVzc2FnZScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBNZXNzYWdlQ29udHJvbGxlci5lZGl0TWVzc2FnZVxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLWltYWdlJyxcbiAgdXBsb2FkLnNpbmdsZSgnZmlsZScpLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgTWVzc2FnZUNvbnRyb2xsZXIuc2VuZEZpbGVcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2VuZC1zdGlja2VyJyxcbiAgdXBsb2FkLnNpbmdsZSgnZmlsZScpLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgTWVzc2FnZUNvbnRyb2xsZXIuc2VuZEltYWdlQXNTdGlja2VyXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL3NlbmQtc3RpY2tlci1naWYnLFxuICB1cGxvYWQuc2luZ2xlKCdmaWxlJyksXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBNZXNzYWdlQ29udHJvbGxlci5zZW5kSW1hZ2VBc1N0aWNrZXJHaWZcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2VuZC1yZXBseScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBNZXNzYWdlQ29udHJvbGxlci5yZXBseU1lc3NhZ2Vcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2VuZC1maWxlJyxcbiAgdXBsb2FkLnNpbmdsZSgnZmlsZScpLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgTWVzc2FnZUNvbnRyb2xsZXIuc2VuZEZpbGVcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2VuZC1maWxlLWJhc2U2NCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBNZXNzYWdlQ29udHJvbGxlci5zZW5kRmlsZVxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLXZvaWNlJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIE1lc3NhZ2VDb250cm9sbGVyLnNlbmRWb2ljZVxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLXZvaWNlLWJhc2U2NCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBNZXNzYWdlQ29udHJvbGxlci5zZW5kVm9pY2U2NFxuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL3N0YXR1cy1zZXNzaW9uJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIFNlc3Npb25Db250cm9sbGVyLmdldFNlc3Npb25TdGF0ZVxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLXN0YXR1cycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBNZXNzYWdlQ29udHJvbGxlci5zZW5kU3RhdHVzVGV4dFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLWxpbmstcHJldmlldycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBNZXNzYWdlQ29udHJvbGxlci5zZW5kTGlua1ByZXZpZXdcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2VuZC1sb2NhdGlvbicsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBNZXNzYWdlQ29udHJvbGxlci5zZW5kTG9jYXRpb25cbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2VuZC1tZW50aW9uZWQnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgTWVzc2FnZUNvbnRyb2xsZXIuc2VuZE1lbnRpb25lZFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLWJ1dHRvbnMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgTWVzc2FnZUNvbnRyb2xsZXIuc2VuZEJ1dHRvbnNcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2VuZC1saXN0LW1lc3NhZ2UnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgTWVzc2FnZUNvbnRyb2xsZXIuc2VuZExpc3RNZXNzYWdlXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL3NlbmQtb3JkZXItbWVzc2FnZScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBNZXNzYWdlQ29udHJvbGxlci5zZW5kT3JkZXJNZXNzYWdlXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL3NlbmQtcG9sbC1tZXNzYWdlJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIE1lc3NhZ2VDb250cm9sbGVyLnNlbmRQb2xsTWVzc2FnZVxuKTtcblxuLy8gR3JvdXBcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2FsbC1icm9hZGNhc3QtbGlzdCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBHcm91cENvbnRyb2xsZXIuZ2V0QWxsQnJvYWRjYXN0TGlzdFxuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2FsbC1ncm91cHMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgR3JvdXBDb250cm9sbGVyLmdldEFsbEdyb3Vwc1xuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2dyb3VwLW1lbWJlcnMvOmdyb3VwSWQnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgR3JvdXBDb250cm9sbGVyLmdldEdyb3VwTWVtYmVyc1xuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2NvbW1vbi1ncm91cHMvOndpZCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBHcm91cENvbnRyb2xsZXIuZ2V0Q29tbW9uR3JvdXBzXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vZ3JvdXAtYWRtaW5zLzpncm91cElkJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIEdyb3VwQ29udHJvbGxlci5nZXRHcm91cEFkbWluc1xuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2dyb3VwLWludml0ZS1saW5rLzpncm91cElkJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIEdyb3VwQ29udHJvbGxlci5nZXRHcm91cEludml0ZUxpbmtcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9ncm91cC1yZXZva2UtbGluay86Z3JvdXBJZCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBHcm91cENvbnRyb2xsZXIucmV2b2tlR3JvdXBJbnZpdGVMaW5rXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vZ3JvdXAtbWVtYmVycy1pZHMvOmdyb3VwSWQnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgR3JvdXBDb250cm9sbGVyLmdldEdyb3VwTWVtYmVyc0lkc1xuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9jcmVhdGUtZ3JvdXAnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgR3JvdXBDb250cm9sbGVyLmNyZWF0ZUdyb3VwXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2xlYXZlLWdyb3VwJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIEdyb3VwQ29udHJvbGxlci5sZWF2ZUdyb3VwXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2pvaW4tY29kZScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBHcm91cENvbnRyb2xsZXIuam9pbkdyb3VwQnlDb2RlXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2FkZC1wYXJ0aWNpcGFudC1ncm91cCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBHcm91cENvbnRyb2xsZXIuYWRkUGFydGljaXBhbnRcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vcmVtb3ZlLXBhcnRpY2lwYW50LWdyb3VwJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIEdyb3VwQ29udHJvbGxlci5yZW1vdmVQYXJ0aWNpcGFudFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9wcm9tb3RlLXBhcnRpY2lwYW50LWdyb3VwJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIEdyb3VwQ29udHJvbGxlci5wcm9tb3RlUGFydGljaXBhbnRcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vZGVtb3RlLXBhcnRpY2lwYW50LWdyb3VwJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIEdyb3VwQ29udHJvbGxlci5kZW1vdGVQYXJ0aWNpcGFudFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9ncm91cC1pbmZvLWZyb20taW52aXRlLWxpbmsnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgR3JvdXBDb250cm9sbGVyLmdldEdyb3VwSW5mb0Zyb21JbnZpdGVMaW5rXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2dyb3VwLWRlc2NyaXB0aW9uJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIEdyb3VwQ29udHJvbGxlci5zZXRHcm91cERlc2NyaXB0aW9uXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2dyb3VwLXByb3BlcnR5JyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIEdyb3VwQ29udHJvbGxlci5zZXRHcm91cFByb3BlcnR5XG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2dyb3VwLXN1YmplY3QnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgR3JvdXBDb250cm9sbGVyLnNldEdyb3VwU3ViamVjdFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9tZXNzYWdlcy1hZG1pbnMtb25seScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBHcm91cENvbnRyb2xsZXIuc2V0TWVzc2FnZXNBZG1pbnNPbmx5XG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2dyb3VwLXBpYycsXG4gIHVwbG9hZC5zaW5nbGUoJ2ZpbGUnKSxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIEdyb3VwQ29udHJvbGxlci5zZXRHcm91cFByb2ZpbGVQaWNcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vY2hhbmdlLXByaXZhY3ktZ3JvdXAnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgR3JvdXBDb250cm9sbGVyLmNoYW5nZVByaXZhY3lHcm91cFxuKTtcblxuLy8gQ2hhdFxucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vYWxsLWNoYXRzJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0QWxsQ2hhdHNcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vbGlzdC1jaGF0cycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLmxpc3RDaGF0c1xuKTtcblxucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vYWxsLWNoYXRzLWFyY2hpdmVkJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0QWxsQ2hhdHNBcmNoaXZlZHNcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9hbGwtY2hhdHMtd2l0aC1tZXNzYWdlcycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLmdldEFsbENoYXRzV2l0aE1lc3NhZ2VzXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vYWxsLW1lc3NhZ2VzLWluLWNoYXQvOnBob25lJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0QWxsTWVzc2FnZXNJbkNoYXRcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9hbGwtbmV3LW1lc3NhZ2VzJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0QWxsTmV3TWVzc2FnZXNcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi91bnJlYWQtbWVzc2FnZXMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5nZXRVbnJlYWRNZXNzYWdlc1xuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2FsbC11bnJlYWQtbWVzc2FnZXMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5nZXRBbGxVbnJlYWRNZXNzYWdlc1xuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2NoYXQtYnktaWQvOnBob25lJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0Q2hhdEJ5SWRcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9tZXNzYWdlLWJ5LWlkLzptZXNzYWdlSWQnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5nZXRNZXNzYWdlQnlJZFxuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2NoYXQtaXMtb25saW5lLzpwaG9uZScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLmdldENoYXRJc09ubGluZVxuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2xhc3Qtc2Vlbi86cGhvbmUnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5nZXRMYXN0U2VlblxuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2xpc3QtbXV0ZXMvOnR5cGUnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5nZXRMaXN0TXV0ZXNcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9sb2FkLW1lc3NhZ2VzLWluLWNoYXQvOnBob25lJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIubG9hZEFuZEdldEFsbE1lc3NhZ2VzSW5DaGF0XG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vZ2V0LW1lc3NhZ2VzLzpwaG9uZScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLmdldE1lc3NhZ2VzXG4pO1xuXG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vYXJjaGl2ZS1jaGF0JyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuYXJjaGl2ZUNoYXRcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vYXJjaGl2ZS1hbGwtY2hhdHMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5hcmNoaXZlQWxsQ2hhdHNcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vY2xlYXItY2hhdCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLmNsZWFyQ2hhdFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9jbGVhci1hbGwtY2hhdHMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5jbGVhckFsbENoYXRzXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2RlbGV0ZS1jaGF0JyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZGVsZXRlQ2hhdFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9kZWxldGUtYWxsLWNoYXRzJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZGVsZXRlQWxsQ2hhdHNcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vZGVsZXRlLW1lc3NhZ2UnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5kZWxldGVNZXNzYWdlXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL3JlYWN0LW1lc3NhZ2UnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5yZWFjdE1lc3NhZ2Vcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vZm9yd2FyZC1tZXNzYWdlcycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLmZvcndhcmRNZXNzYWdlc1xuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9tYXJrLXVuc2VlbicsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLm1hcmtVbnNlZW5NZXNzYWdlXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL3Bpbi1jaGF0JyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIucGluQ2hhdFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9jb250YWN0LXZjYXJkJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuc2VuZENvbnRhY3RWY2FyZFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLW11dGUnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5zZW5kTXV0ZVxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLXNlZW4nLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5zZW5kU2VlblxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9jaGF0LXN0YXRlJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuc2V0Q2hhdFN0YXRlXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL3RlbXBvcmFyeS1tZXNzYWdlcycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLnNldFRlbXBvcmFyeU1lc3NhZ2VzXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL3R5cGluZycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLnNldFR5cGluZ1xuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9yZWNvcmRpbmcnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5zZXRSZWNvcmRpbmdcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc3Rhci1tZXNzYWdlJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuc3Rhck1lc3NhZ2Vcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9yZWFjdGlvbnMvOmlkJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0UmVhY3Rpb25zXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vdm90ZXMvOmlkJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0Vm90ZXNcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vcmVqZWN0LWNhbGwnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5yZWplY3RDYWxsXG4pO1xuXG4vLyBDYXRhbG9nXG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9nZXQtcHJvZHVjdHMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ2F0YWxvZ0NvbnRyb2xsZXIuZ2V0UHJvZHVjdHNcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9nZXQtcHJvZHVjdC1ieS1pZCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBDYXRhbG9nQ29udHJvbGxlci5nZXRQcm9kdWN0QnlJZFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9hZGQtcHJvZHVjdCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBDYXRhbG9nQ29udHJvbGxlci5hZGRQcm9kdWN0XG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2VkaXQtcHJvZHVjdCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBDYXRhbG9nQ29udHJvbGxlci5lZGl0UHJvZHVjdFxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9kZWwtcHJvZHVjdHMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ2F0YWxvZ0NvbnRyb2xsZXIuZGVsUHJvZHVjdHNcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vY2hhbmdlLXByb2R1Y3QtaW1hZ2UnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ2F0YWxvZ0NvbnRyb2xsZXIuY2hhbmdlUHJvZHVjdEltYWdlXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2FkZC1wcm9kdWN0LWltYWdlJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIENhdGFsb2dDb250cm9sbGVyLmFkZFByb2R1Y3RJbWFnZVxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9yZW1vdmUtcHJvZHVjdC1pbWFnZScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBDYXRhbG9nQ29udHJvbGxlci5yZW1vdmVQcm9kdWN0SW1hZ2Vcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9nZXQtY29sbGVjdGlvbnMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ2F0YWxvZ0NvbnRyb2xsZXIuZ2V0Q29sbGVjdGlvbnNcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vY3JlYXRlLWNvbGxlY3Rpb24nLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ2F0YWxvZ0NvbnRyb2xsZXIuY3JlYXRlQ29sbGVjdGlvblxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9lZGl0LWNvbGxlY3Rpb24nLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ2F0YWxvZ0NvbnRyb2xsZXIuZWRpdENvbGxlY3Rpb25cbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vZGVsLWNvbGxlY3Rpb24nLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ2F0YWxvZ0NvbnRyb2xsZXIuZGVsZXRlQ29sbGVjdGlvblxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLWxpbmstY2F0YWxvZycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBDYXRhbG9nQ29udHJvbGxlci5zZW5kTGlua0NhdGFsb2dcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2V0LXByb2R1Y3QtdmlzaWJpbGl0eScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBDYXRhbG9nQ29udHJvbGxlci5zZXRQcm9kdWN0VmlzaWJpbGl0eVxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZXQtY2FydC1lbmFibGVkJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIENhdGFsb2dDb250cm9sbGVyLnVwZGF0ZUNhcnRFbmFibGVkXG4pO1xuXG4vLyBTdGF0dXNcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLXRleHQtc3RvcmllJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIFN0YXR1c0NvbnRyb2xsZXIuc2VuZFRleHRTdG9yaWVcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vc2VuZC1pbWFnZS1zdG9yaWUnLFxuICB1cGxvYWQuc2luZ2xlKCdmaWxlJyksXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBTdGF0dXNDb250cm9sbGVyLnNlbmRJbWFnZVN0b3JpZVxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZW5kLXZpZGVvLXN0b3JpZScsXG4gIHVwbG9hZC5zaW5nbGUoJ2ZpbGUnKSxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIFN0YXR1c0NvbnRyb2xsZXIuc2VuZFZpZGVvU3RvcmllXG4pO1xuXG4vLyBMYWJlbHNcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9hZGQtbmV3LWxhYmVsJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIExhYmVsc0NvbnRyb2xsZXIuYWRkTmV3TGFiZWxcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vYWRkLW9yLXJlbW92ZS1sYWJlbCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBMYWJlbHNDb250cm9sbGVyLmFkZE9yUmVtb3ZlTGFiZWxzXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vZ2V0LWFsbC1sYWJlbHMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgTGFiZWxzQ29udHJvbGxlci5nZXRBbGxMYWJlbHNcbik7XG5yb3V0ZXMucHV0KFxuICAnL2FwaS86c2Vzc2lvbi9kZWxldGUtYWxsLWxhYmVscycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBMYWJlbHNDb250cm9sbGVyLmRlbGV0ZUFsbExhYmVsc1xuKTtcbnJvdXRlcy5wdXQoXG4gICcvYXBpLzpzZXNzaW9uL2RlbGV0ZS1sYWJlbC86aWQnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgTGFiZWxzQ29udHJvbGxlci5kZWxldGVMYWJlbFxuKTtcblxuLy8gQ29udGFjdFxucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vY2hlY2stbnVtYmVyLXN0YXR1cy86cGhvbmUnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5jaGVja051bWJlclN0YXR1c1xuKTtcbnJvdXRlcy5nZXQoXG4gICcvYXBpLzpzZXNzaW9uL2FsbC1jb250YWN0cycsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLmdldEFsbENvbnRhY3RzXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vY29udGFjdC86cGhvbmUnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5nZXRDb250YWN0XG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vcHJvZmlsZS86cGhvbmUnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5nZXROdW1iZXJQcm9maWxlXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vcHJvZmlsZS1waWMvOnBob25lJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0UHJvZmlsZVBpY0Zyb21TZXJ2ZXJcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9wcm9maWxlLXN0YXR1cy86cGhvbmUnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5nZXRTdGF0dXNcbik7XG5cbi8vIEJsb2NrbGlzdFxucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vYmxvY2tsaXN0JyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0QmxvY2tMaXN0XG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2Jsb2NrLWNvbnRhY3QnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5ibG9ja0NvbnRhY3Rcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vdW5ibG9jay1jb250YWN0JyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIudW5ibG9ja0NvbnRhY3Rcbik7XG5cbi8vIERldmljZVxucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vZ2V0LWJhdHRlcnktbGV2ZWwnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5nZXRCYXR0ZXJ5TGV2ZWxcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9ob3N0LWRldmljZScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLmdldEhvc3REZXZpY2Vcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9nZXQtcGhvbmUtbnVtYmVyJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIERldmljZUNvbnRyb2xsZXIuZ2V0UGhvbmVOdW1iZXJcbik7XG5cbi8vIFByb2ZpbGVcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9zZXQtcHJvZmlsZS1waWMnLFxuICB1cGxvYWQuc2luZ2xlKCdmaWxlJyksXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLnNldFByb2ZpbGVQaWNcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vcHJvZmlsZS1zdGF0dXMnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgRGV2aWNlQ29udHJvbGxlci5zZXRQcm9maWxlU3RhdHVzXG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2NoYW5nZS11c2VybmFtZScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBEZXZpY2VDb250cm9sbGVyLnNldFByb2ZpbGVOYW1lXG4pO1xuXG4vLyBCdXNpbmVzc1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2VkaXQtYnVzaW5lc3MtcHJvZmlsZScsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBTZXNzaW9uQ29udHJvbGxlci5lZGl0QnVzaW5lc3NQcm9maWxlXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vZ2V0LWJ1c2luZXNzLXByb2ZpbGVzLXByb2R1Y3RzJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIE9yZGVyQ29udHJvbGxlci5nZXRCdXNpbmVzc1Byb2ZpbGVzUHJvZHVjdHNcbik7XG5yb3V0ZXMuZ2V0KFxuICAnL2FwaS86c2Vzc2lvbi9nZXQtb3JkZXItYnktbWVzc2FnZUlkLzptZXNzYWdlSWQnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgT3JkZXJDb250cm9sbGVyLmdldE9yZGVyYnlNc2dcbik7XG5yb3V0ZXMuZ2V0KCcvYXBpLzpzZWNyZXRrZXkvYmFja3VwLXNlc3Npb25zJywgTWlzY0NvbnRyb2xsZXIuYmFja3VwQWxsU2Vzc2lvbnMpO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZWNyZXRrZXkvcmVzdG9yZS1zZXNzaW9ucycsXG4gIHVwbG9hZC5zaW5nbGUoJ2ZpbGUnKSxcbiAgTWlzY0NvbnRyb2xsZXIucmVzdG9yZUFsbFNlc3Npb25zXG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vdGFrZS1zY3JlZW5zaG90JyxcbiAgdmVyaWZ5VG9rZW4sXG4gIE1pc2NDb250cm9sbGVyLnRha2VTY3JlZW5zaG90XG4pO1xucm91dGVzLnBvc3QoJy9hcGkvOnNlc3Npb24vc2V0LWxpbWl0JywgTWlzY0NvbnRyb2xsZXIuc2V0TGltaXQpO1xuXG4vL0NvbW11bml0eXNcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9jcmVhdGUtY29tbXVuaXR5JyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIENvbW11bml0eUNvbnRyb2xsZXIuY3JlYXRlQ29tbXVuaXR5XG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL2RlYWN0aXZhdGUtY29tbXVuaXR5JyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIENvbW11bml0eUNvbnRyb2xsZXIuZGVhY3RpdmF0ZUNvbW11bml0eVxuKTtcbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9hZGQtY29tbXVuaXR5LXN1Ymdyb3VwJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIENvbW11bml0eUNvbnRyb2xsZXIuYWRkU3ViZ3JvdXBzQ29tbXVuaXR5XG4pO1xucm91dGVzLnBvc3QoXG4gICcvYXBpLzpzZXNzaW9uL3JlbW92ZS1jb21tdW5pdHktc3ViZ3JvdXAnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ29tbXVuaXR5Q29udHJvbGxlci5yZW1vdmVTdWJncm91cHNDb21tdW5pdHlcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vcHJvbW90ZS1jb21tdW5pdHktcGFydGljaXBhbnQnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ29tbXVuaXR5Q29udHJvbGxlci5wcm9tb3RlQ29tbXVuaXR5UGFydGljaXBhbnRcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vZGVtb3RlLWNvbW11bml0eS1wYXJ0aWNpcGFudCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBDb21tdW5pdHlDb250cm9sbGVyLmRlbW90ZUNvbW11bml0eVBhcnRpY2lwYW50XG4pO1xucm91dGVzLmdldChcbiAgJy9hcGkvOnNlc3Npb24vY29tbXVuaXR5LXBhcnRpY2lwYW50cy86aWQnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgQ29tbXVuaXR5Q29udHJvbGxlci5nZXRDb21tdW5pdHlQYXJ0aWNpcGFudHNcbik7XG5cbnJvdXRlcy5wb3N0KFxuICAnL2FwaS86c2Vzc2lvbi9uZXdzbGV0dGVyJyxcbiAgdmVyaWZ5VG9rZW4sXG4gIHN0YXR1c0Nvbm5lY3Rpb24sXG4gIE5ld3NsZXR0ZXJDb250cm9sbGVyLmNyZWF0ZU5ld3NsZXR0ZXJcbik7XG5yb3V0ZXMucHV0KFxuICAnL2FwaS86c2Vzc2lvbi9uZXdzbGV0dGVyLzppZCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBOZXdzbGV0dGVyQ29udHJvbGxlci5lZGl0TmV3c2xldHRlclxuKTtcblxucm91dGVzLmRlbGV0ZShcbiAgJy9hcGkvOnNlc3Npb24vbmV3c2xldHRlci86aWQnLFxuICB2ZXJpZnlUb2tlbixcbiAgc3RhdHVzQ29ubmVjdGlvbixcbiAgTmV3c2xldHRlckNvbnRyb2xsZXIuZGVzdHJveU5ld3NsZXR0ZXJcbik7XG5yb3V0ZXMucG9zdChcbiAgJy9hcGkvOnNlc3Npb24vbXV0ZS1uZXdzbGV0dGVyLzppZCcsXG4gIHZlcmlmeVRva2VuLFxuICBzdGF0dXNDb25uZWN0aW9uLFxuICBOZXdzbGV0dGVyQ29udHJvbGxlci5tdXRlTmV3c2xldHRlclxuKTtcblxucm91dGVzLnBvc3QoJy9hcGkvOnNlc3Npb24vY2hhdHdvb3QnLCBEZXZpY2VDb250cm9sbGVyLmNoYXRXb290KTtcblxuLy8gQXBpIERvY1xucm91dGVzLnVzZSgnL2FwaS1kb2NzJywgc3dhZ2dlclVpLnNlcnZlKTtcbnJvdXRlcy5nZXQoJy9hcGktZG9jcycsIHN3YWdnZXJVaS5zZXR1cChzd2FnZ2VyRG9jdW1lbnQpKTtcblxuLy9rOHNcbnJvdXRlcy5nZXQoJy9oZWFsdGh6JywgSGVhbHRoQ2hlY2suaGVhbHRoeik7XG5yb3V0ZXMuZ2V0KCcvdW5oZWFsdGh5JywgSGVhbHRoQ2hlY2sudW5oZWFsdGh5KTtcblxuLy9NZXRyaWNzIFByb21ldGhldXNcblxucm91dGVzLmdldCgnL21ldHJpY3MnLCBwcm9tZXRoZXVzUmVnaXN0ZXIubWV0cmljcyk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcztcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsSUFBQUEsUUFBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsT0FBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUcsaUJBQUEsR0FBQUQsc0JBQUEsQ0FBQUYsT0FBQTs7QUFFQSxJQUFBSSxPQUFBLEdBQUFGLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBSyxpQkFBQSxHQUFBQyx1QkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQU8sbUJBQUEsR0FBQUQsdUJBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFRLGdCQUFBLEdBQUFGLHVCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBUyxrQkFBQSxHQUFBVCxPQUFBO0FBQ0EsSUFBQVUsZUFBQSxHQUFBSix1QkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQVcsZ0JBQUEsR0FBQUwsdUJBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFZLGlCQUFBLEdBQUFOLHVCQUFBLENBQUFOLE9BQUE7QUFD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