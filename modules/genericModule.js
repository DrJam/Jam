var moduleName = {};

moduleName.eventsHandled = {
    "ready": false,
    "debug": false,
    "message": false,
    "warn": false,
    "messageDeleted": false,
    "messageUpdated": false,
    "disconnected": false,
    "error": false,
    "raw": false,
    "serverCreated": false,
    "serverDeleted": false,
    "serverUpdated": false,
    "channelCreated": false,
    "channelDeleted": false,
    "channelUpdated": false,
    "serverRoleCreated": false,
    "serverRoleDeleted": false,
    "serverRoleUpdated": false,
    "serverNewMember": false,
    "serverMemberRemoved": false,
    "serverMemberUpdated": false,
    "presence": false,
    "userTypingStarted": false,
    "userTypingStopped": false,
    "userBanned": false,
    "userUnbanned": false,
    "noteUpdated": false,
    "voiceJoin": false,
    "voiceSwitch": false,
    "voiceLeave": false,
    "voiceStateUpdate": false,
    "voiceSpeaking": false
};

moduleName.events = {
    "ready": function (mod) {},
    "debug": function (mod, message) {},
    "message": function (mod, message) {},
    "warn": function (mod, message) {},
    "messageDeleted": function (mod, message, channel) {},
    "messageUpdated": function (mod, oldMessage, newMessage) {},
    "disconnected": function (mod) {},
    "error": function (mod, error) {},
    "raw": function (mod, rawData) {},
    "serverCreated": function (mod, server) {},
    "serverDeleted": function (mod, server) {},
    "serverUpdated": function (mod, oldServer, newServer) {},
    "channelCreated": function (mod, channel) {},
    "channelDeleted": function (mod, channel) {},
    "channelUpdated": function (mod, oldChannel, newChannel) {},
    "serverRoleCreated": function (mod, role) {},
    "serverRoleDeleted": function (mod, role) {},
    "serverRoleUpdated": function (mod, oldRole, newRole) {},
    "serverNewMember": function (mod, server, user) {},
    "serverMemberRemoved": function (mod, server, user) {},
    "serverMemberUpdated": function (mod, server, newUser, oldUser) {},
    "presence": function (mod, oldUser, newUser) {},
    "userTypingStarted": function (mod, user, channel) {},
    "userTypingStopped": function (mod, user, channel) {},
    "userBanned": function (mod, user, server) {},
    "userUnbanned": function (mod, user, server) {},
    "noteUpdated": function (mod, user, oldNote) {},
    "voiceJoin": function (mod, voiceChannel, user) {},
    "voiceSwitch": function (mod, oldVoiceChannel, newVoiceChannel, user) {},
    "voiceLeave": function (mod, voiceChannel, user) {},
    "voiceStateUpdate": function (mod, voiceChannel, user, oldVoiceProperties, newVoiceProperties) {},
    "voiceSpeaking": function (mod, voiceChannel, user) {}
};

module.exports = moduleName;