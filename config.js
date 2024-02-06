"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = exports.default = {
  secretKey: 'THISISMYSECURETOKEN',
  host: 'http://localhost',
  port: '21465',
  deviceName: 'WppConnect',
  poweredBy: 'WPPConnect-Server',
  startAllSession: true,
  tokenStoreType: 'file',
  maxListeners: 15,
  customUserDataDir: './userDataDir/',
  webhook: {
    url: null,
    autoDownload: true,
    uploadS3: false,
    readMessage: true,
    allUnreadOnStart: false,
    listenAcks: true,
    onPresenceChanged: true,
    onParticipantsChanged: true,
    onReactionMessage: true,
    onPollResponse: true,
    onRevokedMessage: true,
    onLabelUpdated: true,
    onSelfMessage: false,
    ignore: ['status@broadcast']
  },
  websocket: {
    autoDownload: false,
    uploadS3: false
  },
  chatwoot: {
    sendQrCode: true,
    sendStatus: true
  },
  archive: {
    enable: false,
    waitTime: 10,
    daysToArchive: 45
  },
  log: {
    level: 'silly', // Before open a issue, change level to silly and retry a action
    logger: ['console', 'file']
  },
  createOptions: {
    browserArgs: [
    '--disable-web-security',
    '--no-sandbox',
    '--disable-web-security',
    '--aggressive-cache-discard',
    '--disable-cache',
    '--disable-application-cache',
    '--disable-offline-load-stale-cache',
    '--disk-cache-size=0',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--disable-translate',
    '--hide-scrollbars',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-first-run',
    '--safebrowsing-disable-auto-update',
    '--ignore-certificate-errors',
    '--ignore-ssl-errors',
    '--ignore-certificate-errors-spki-list'],

    /**
     * Example of configuring the linkPreview generator
     * If you set this to 'null', it will use global servers; however, you have the option to define your own server
     * Clone the repository https://github.com/wppconnect-team/wa-js-api-server and host it on your server with ssl
     *
     * Configure the attribute as follows:
     * linkPreviewApiServers: [ 'https://www.yourserver.com/wa-js-api-server' ]
     */
    linkPreviewApiServers: null
  },
  mapper: {
    enable: false,
    prefix: 'tagone-'
  },
  db: {
    mongodbDatabase: 'tokens',
    mongodbCollection: '',
    mongodbUser: '',
    mongodbPassword: '',
    mongodbHost: '',
    mongoIsRemote: true,
    mongoURLRemote: '',
    mongodbPort: 27017,
    redisHost: 'localhost',
    redisPort: 6379,
    redisPassword: '',
    redisDb: 0,
    redisPrefix: 'docker'
  },
  aws_s3: {
    region: 'sa-east-1',
    access_key_id: null,
    secret_key: null,
    defaultBucketName: null,
    endpoint: null,
    forcePathStyle: null
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzZWNyZXRLZXkiLCJob3N0IiwicG9ydCIsImRldmljZU5hbWUiLCJwb3dlcmVkQnkiLCJzdGFydEFsbFNlc3Npb24iLCJ0b2tlblN0b3JlVHlwZSIsIm1heExpc3RlbmVycyIsImN1c3RvbVVzZXJEYXRhRGlyIiwid2ViaG9vayIsInVybCIsImF1dG9Eb3dubG9hZCIsInVwbG9hZFMzIiwicmVhZE1lc3NhZ2UiLCJhbGxVbnJlYWRPblN0YXJ0IiwibGlzdGVuQWNrcyIsIm9uUHJlc2VuY2VDaGFuZ2VkIiwib25QYXJ0aWNpcGFudHNDaGFuZ2VkIiwib25SZWFjdGlvbk1lc3NhZ2UiLCJvblBvbGxSZXNwb25zZSIsIm9uUmV2b2tlZE1lc3NhZ2UiLCJvbkxhYmVsVXBkYXRlZCIsIm9uU2VsZk1lc3NhZ2UiLCJpZ25vcmUiLCJ3ZWJzb2NrZXQiLCJjaGF0d29vdCIsInNlbmRRckNvZGUiLCJzZW5kU3RhdHVzIiwiYXJjaGl2ZSIsImVuYWJsZSIsIndhaXRUaW1lIiwiZGF5c1RvQXJjaGl2ZSIsImxvZyIsImxldmVsIiwibG9nZ2VyIiwiY3JlYXRlT3B0aW9ucyIsImJyb3dzZXJBcmdzIiwibGlua1ByZXZpZXdBcGlTZXJ2ZXJzIiwibWFwcGVyIiwicHJlZml4IiwiZGIiLCJtb25nb2RiRGF0YWJhc2UiLCJtb25nb2RiQ29sbGVjdGlvbiIsIm1vbmdvZGJVc2VyIiwibW9uZ29kYlBhc3N3b3JkIiwibW9uZ29kYkhvc3QiLCJtb25nb0lzUmVtb3RlIiwibW9uZ29VUkxSZW1vdGUiLCJtb25nb2RiUG9ydCIsInJlZGlzSG9zdCIsInJlZGlzUG9ydCIsInJlZGlzUGFzc3dvcmQiLCJyZWRpc0RiIiwicmVkaXNQcmVmaXgiLCJhd3NfczMiLCJyZWdpb24iLCJhY2Nlc3Nfa2V5X2lkIiwic2VjcmV0X2tleSIsImRlZmF1bHRCdWNrZXROYW1lIiwiZW5kcG9pbnQiLCJmb3JjZVBhdGhTdHlsZSJdLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICBzZWNyZXRLZXk6ICdUSElTSVNNWVNFQ1VSRVRPS0VOJyxcbiAgaG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3QnLFxuICBwb3J0OiAnMjE0NjUnLFxuICBkZXZpY2VOYW1lOiAnV3BwQ29ubmVjdCcsXG4gIHBvd2VyZWRCeTogJ1dQUENvbm5lY3QtU2VydmVyJyxcbiAgc3RhcnRBbGxTZXNzaW9uOiB0cnVlLFxuICB0b2tlblN0b3JlVHlwZTogJ2ZpbGUnLFxuICBtYXhMaXN0ZW5lcnM6IDE1LFxuICBjdXN0b21Vc2VyRGF0YURpcjogJy4vdXNlckRhdGFEaXIvJyxcbiAgd2ViaG9vazoge1xuICAgIHVybDogbnVsbCxcbiAgICBhdXRvRG93bmxvYWQ6IHRydWUsXG4gICAgdXBsb2FkUzM6IGZhbHNlLFxuICAgIHJlYWRNZXNzYWdlOiB0cnVlLFxuICAgIGFsbFVucmVhZE9uU3RhcnQ6IGZhbHNlLFxuICAgIGxpc3RlbkFja3M6IHRydWUsXG4gICAgb25QcmVzZW5jZUNoYW5nZWQ6IHRydWUsXG4gICAgb25QYXJ0aWNpcGFudHNDaGFuZ2VkOiB0cnVlLFxuICAgIG9uUmVhY3Rpb25NZXNzYWdlOiB0cnVlLFxuICAgIG9uUG9sbFJlc3BvbnNlOiB0cnVlLFxuICAgIG9uUmV2b2tlZE1lc3NhZ2U6IHRydWUsXG4gICAgb25MYWJlbFVwZGF0ZWQ6IHRydWUsXG4gICAgb25TZWxmTWVzc2FnZTogZmFsc2UsXG4gICAgaWdub3JlOiBbJ3N0YXR1c0Bicm9hZGNhc3QnXSxcbiAgfSxcbiAgd2Vic29ja2V0OiB7XG4gICAgYXV0b0Rvd25sb2FkOiBmYWxzZSxcbiAgICB1cGxvYWRTMzogZmFsc2UsXG4gIH0sXG4gIGNoYXR3b290OiB7XG4gICAgc2VuZFFyQ29kZTogdHJ1ZSxcbiAgICBzZW5kU3RhdHVzOiB0cnVlLFxuICB9LFxuICBhcmNoaXZlOiB7XG4gICAgZW5hYmxlOiBmYWxzZSxcbiAgICB3YWl0VGltZTogMTAsXG4gICAgZGF5c1RvQXJjaGl2ZTogNDUsXG4gIH0sXG4gIGxvZzoge1xuICAgIGxldmVsOiAnc2lsbHknLCAvLyBCZWZvcmUgb3BlbiBhIGlzc3VlLCBjaGFuZ2UgbGV2ZWwgdG8gc2lsbHkgYW5kIHJldHJ5IGEgYWN0aW9uXG4gICAgbG9nZ2VyOiBbJ2NvbnNvbGUnLCAnZmlsZSddLFxuICB9LFxuICBjcmVhdGVPcHRpb25zOiB7XG4gICAgYnJvd3NlckFyZ3M6IFtcbiAgICAgICctLWRpc2FibGUtd2ViLXNlY3VyaXR5JyxcbiAgICAgICctLW5vLXNhbmRib3gnLFxuICAgICAgJy0tZGlzYWJsZS13ZWItc2VjdXJpdHknLFxuICAgICAgJy0tYWdncmVzc2l2ZS1jYWNoZS1kaXNjYXJkJyxcbiAgICAgICctLWRpc2FibGUtY2FjaGUnLFxuICAgICAgJy0tZGlzYWJsZS1hcHBsaWNhdGlvbi1jYWNoZScsXG4gICAgICAnLS1kaXNhYmxlLW9mZmxpbmUtbG9hZC1zdGFsZS1jYWNoZScsXG4gICAgICAnLS1kaXNrLWNhY2hlLXNpemU9MCcsXG4gICAgICAnLS1kaXNhYmxlLWJhY2tncm91bmQtbmV0d29ya2luZycsXG4gICAgICAnLS1kaXNhYmxlLWRlZmF1bHQtYXBwcycsXG4gICAgICAnLS1kaXNhYmxlLWV4dGVuc2lvbnMnLFxuICAgICAgJy0tZGlzYWJsZS1zeW5jJyxcbiAgICAgICctLWRpc2FibGUtdHJhbnNsYXRlJyxcbiAgICAgICctLWhpZGUtc2Nyb2xsYmFycycsXG4gICAgICAnLS1tZXRyaWNzLXJlY29yZGluZy1vbmx5JyxcbiAgICAgICctLW11dGUtYXVkaW8nLFxuICAgICAgJy0tbm8tZmlyc3QtcnVuJyxcbiAgICAgICctLXNhZmVicm93c2luZy1kaXNhYmxlLWF1dG8tdXBkYXRlJyxcbiAgICAgICctLWlnbm9yZS1jZXJ0aWZpY2F0ZS1lcnJvcnMnLFxuICAgICAgJy0taWdub3JlLXNzbC1lcnJvcnMnLFxuICAgICAgJy0taWdub3JlLWNlcnRpZmljYXRlLWVycm9ycy1zcGtpLWxpc3QnLFxuICAgIF0sXG4gICAgLyoqXG4gICAgICogRXhhbXBsZSBvZiBjb25maWd1cmluZyB0aGUgbGlua1ByZXZpZXcgZ2VuZXJhdG9yXG4gICAgICogSWYgeW91IHNldCB0aGlzIHRvICdudWxsJywgaXQgd2lsbCB1c2UgZ2xvYmFsIHNlcnZlcnM7IGhvd2V2ZXIsIHlvdSBoYXZlIHRoZSBvcHRpb24gdG8gZGVmaW5lIHlvdXIgb3duIHNlcnZlclxuICAgICAqIENsb25lIHRoZSByZXBvc2l0b3J5IGh0dHBzOi8vZ2l0aHViLmNvbS93cHBjb25uZWN0LXRlYW0vd2EtanMtYXBpLXNlcnZlciBhbmQgaG9zdCBpdCBvbiB5b3VyIHNlcnZlciB3aXRoIHNzbFxuICAgICAqXG4gICAgICogQ29uZmlndXJlIHRoZSBhdHRyaWJ1dGUgYXMgZm9sbG93czpcbiAgICAgKiBsaW5rUHJldmlld0FwaVNlcnZlcnM6IFsgJ2h0dHBzOi8vd3d3LnlvdXJzZXJ2ZXIuY29tL3dhLWpzLWFwaS1zZXJ2ZXInIF1cbiAgICAgKi9cbiAgICBsaW5rUHJldmlld0FwaVNlcnZlcnM6IG51bGwsXG4gIH0sXG4gIG1hcHBlcjoge1xuICAgIGVuYWJsZTogZmFsc2UsXG4gICAgcHJlZml4OiAndGFnb25lLScsXG4gIH0sXG4gIGRiOiB7XG4gICAgbW9uZ29kYkRhdGFiYXNlOiAndG9rZW5zJyxcbiAgICBtb25nb2RiQ29sbGVjdGlvbjogJycsXG4gICAgbW9uZ29kYlVzZXI6ICcnLFxuICAgIG1vbmdvZGJQYXNzd29yZDogJycsXG4gICAgbW9uZ29kYkhvc3Q6ICcnLFxuICAgIG1vbmdvSXNSZW1vdGU6IHRydWUsXG4gICAgbW9uZ29VUkxSZW1vdGU6ICcnLFxuICAgIG1vbmdvZGJQb3J0OiAyNzAxNyxcbiAgICByZWRpc0hvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHJlZGlzUG9ydDogNjM3OSxcbiAgICByZWRpc1Bhc3N3b3JkOiAnJyxcbiAgICByZWRpc0RiOiAwLFxuICAgIHJlZGlzUHJlZml4OiAnZG9ja2VyJyxcbiAgfSxcbiAgYXdzX3MzOiB7XG4gICAgcmVnaW9uOiAnc2EtZWFzdC0xJyxcbiAgICBhY2Nlc3Nfa2V5X2lkOiBudWxsLFxuICAgIHNlY3JldF9rZXk6IG51bGwsXG4gICAgZGVmYXVsdEJ1Y2tldE5hbWU6IG51bGwsXG4gICAgZW5kcG9pbnQ6IG51bGwsXG4gICAgZm9yY2VQYXRoU3R5bGU6IG51bGwsXG4gIH0sXG59O1xuIl0sIm1hcHBpbmdzIjoicUlBQWU7RUFDYkEsU0FBUyxFQUFFLHFCQUFxQjtFQUNoQ0MsSUFBSSxFQUFFLGtCQUFrQjtFQUN4QkMsSUFBSSxFQUFFLE9BQU87RUFDYkMsVUFBVSxFQUFFLFlBQVk7RUFDeEJDLFNBQVMsRUFBRSxtQkFBbUI7RUFDOUJDLGVBQWUsRUFBRSxJQUFJO0VBQ3JCQyxjQUFjLEVBQUUsTUFBTTtFQUN0QkMsWUFBWSxFQUFFLEVBQUU7RUFDaEJDLGlCQUFpQixFQUFFLGdCQUFnQjtFQUNuQ0MsT0FBTyxFQUFFO0lBQ1BDLEdBQUcsRUFBRSxJQUFJO0lBQ1RDLFlBQVksRUFBRSxJQUFJO0lBQ2xCQyxRQUFRLEVBQUUsS0FBSztJQUNmQyxXQUFXLEVBQUUsSUFBSTtJQUNqQkMsZ0JBQWdCLEVBQUUsS0FBSztJQUN2QkMsVUFBVSxFQUFFLElBQUk7SUFDaEJDLGlCQUFpQixFQUFFLElBQUk7SUFDdkJDLHFCQUFxQixFQUFFLElBQUk7SUFDM0JDLGlCQUFpQixFQUFFLElBQUk7SUFDdkJDLGNBQWMsRUFBRSxJQUFJO0lBQ3BCQyxnQkFBZ0IsRUFBRSxJQUFJO0lBQ3RCQyxjQUFjLEVBQUUsSUFBSTtJQUNwQkMsYUFBYSxFQUFFLEtBQUs7SUFDcEJDLE1BQU0sRUFBRSxDQUFDLGtCQUFrQjtFQUM3QixDQUFDO0VBQ0RDLFNBQVMsRUFBRTtJQUNUYixZQUFZLEVBQUUsS0FBSztJQUNuQkMsUUFBUSxFQUFFO0VBQ1osQ0FBQztFQUNEYSxRQUFRLEVBQUU7SUFDUkMsVUFBVSxFQUFFLElBQUk7SUFDaEJDLFVBQVUsRUFBRTtFQUNkLENBQUM7RUFDREMsT0FBTyxFQUFFO0lBQ1BDLE1BQU0sRUFBRSxLQUFLO0lBQ2JDLFFBQVEsRUFBRSxFQUFFO0lBQ1pDLGFBQWEsRUFBRTtFQUNqQixDQUFDO0VBQ0RDLEdBQUcsRUFBRTtJQUNIQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0lBQ2hCQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBTTtFQUM1QixDQUFDO0VBQ0RDLGFBQWEsRUFBRTtJQUNiQyxXQUFXLEVBQUU7SUFDWCx3QkFBd0I7SUFDeEIsY0FBYztJQUNkLHdCQUF3QjtJQUN4Qiw0QkFBNEI7SUFDNUIsaUJBQWlCO0lBQ2pCLDZCQUE2QjtJQUM3QixvQ0FBb0M7SUFDcEMscUJBQXFCO0lBQ3JCLGlDQUFpQztJQUNqQyx3QkFBd0I7SUFDeEIsc0JBQXNCO0lBQ3RCLGdCQUFnQjtJQUNoQixxQkFBcUI7SUFDckIsbUJBQW1CO0lBQ25CLDBCQUEwQjtJQUMxQixjQUFjO0lBQ2QsZ0JBQWdCO0lBQ2hCLG9DQUFvQztJQUNwQyw2QkFBNkI7SUFDN0IscUJBQXFCO0lBQ3JCLHVDQUF1QyxDQUN4Qzs7SUFDRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0lDLHFCQUFxQixFQUFFO0VBQ3pCLENBQUM7RUFDREMsTUFBTSxFQUFFO0lBQ05ULE1BQU0sRUFBRSxLQUFLO0lBQ2JVLE1BQU0sRUFBRTtFQUNWLENBQUM7RUFDREMsRUFBRSxFQUFFO0lBQ0ZDLGVBQWUsRUFBRSxRQUFRO0lBQ3pCQyxpQkFBaUIsRUFBRSxFQUFFO0lBQ3JCQyxXQUFXLEVBQUUsRUFBRTtJQUNmQyxlQUFlLEVBQUUsRUFBRTtJQUNuQkMsV0FBVyxFQUFFLEVBQUU7SUFDZkMsYUFBYSxFQUFFLElBQUk7SUFDbkJDLGNBQWMsRUFBRSxFQUFFO0lBQ2xCQyxXQUFXLEVBQUUsS0FBSztJQUNsQkMsU0FBUyxFQUFFLFdBQVc7SUFDdEJDLFNBQVMsRUFBRSxJQUFJO0lBQ2ZDLGFBQWEsRUFBRSxFQUFFO0lBQ2pCQyxPQUFPLEVBQUUsQ0FBQztJQUNWQyxXQUFXLEVBQUU7RUFDZixDQUFDO0VBQ0RDLE1BQU0sRUFBRTtJQUNOQyxNQUFNLEVBQUUsV0FBVztJQUNuQkMsYUFBYSxFQUFFLElBQUk7SUFDbkJDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCQyxpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCQyxRQUFRLEVBQUUsSUFBSTtJQUNkQyxjQUFjLEVBQUU7RUFDbEI7QUFDRixDQUFDIn0=