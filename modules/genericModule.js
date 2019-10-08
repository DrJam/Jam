var moduleName = {};

moduleName.events = {
    "ready": function (mod,client) {},
    "debug": function (mod,client, message) {},
    "rawMessage": function (mod,client, message) {},
    "message": function (mod,client, message) {},
    "warn": function (mod,client, message) {},
    "messageDeleted": function (mod,client, message, channel) {},
    "messageUpdated": function (mod,client, oldMessage, newMessage) {},
    "disconnected": function (mod,client) {},
    "error": function (mod,client, error) {},
    "raw": function (mod,client, rawData) {},
    "serverCreated": function (mod,client, server) {},
    "serverDeleted": function (mod,client, server) {},
    "serverUpdated": function (mod,client, oldServer, newServer) {},
    "channelCreated": function (mod,client, channel) {},
    "channelDeleted": function (mod,client, channel) {},
    "channelUpdated": function (mod,client, oldChannel, newChannel) {},
    "serverRoleCreated": function (mod,client, role) {},
    "serverRoleDeleted": function (mod,client, role) {},
    "serverRoleUpdated": function (mod,client, oldRole, newRole) {},
    "serverNewMember": function (mod,client, server, user) {},
    "serverMemberRemoved": function (mod,client, server, user) {},
    "serverMemberUpdated": function (mod,client, server, newUser, oldUser) {},
    "presence": function (mod,client, oldUser, newUser) {},
    "userTypingStarted": function (mod,client, user, channel) {},
    "userTypingStopped": function (mod,client, user, channel) {},
    "userBanned": function (mod,client, user, server) {},
    "userUnbanned": function (mod,client, user, server) {},
    "noteUpdated": function (mod,client, user, oldNote) {},
    "voiceJoin": function (mod,client, voiceChannel, user) {},
    "voiceSwitch": function (mod,client, oldVoiceChannel, newVoiceChannel, user) {},
    "voiceLeave": function (mod,client, voiceChannel, user) {},
    "voiceStateUpdate": function (mod,client, voiceChannel, user, oldVoiceProperties, newVoiceProperties) {},
    "voiceSpeaking": function (mod,client, voiceChannel, user) {}
};

module.exports = moduleName;