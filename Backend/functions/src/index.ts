import * as fb from "firebase-admin";

import { onGroupCreate } from "./group/onGroupCreate";
import { onGroupRequest } from "./group/onGroupRequest";
import { onGroupLeave } from "./group/onGroupLeave";
import { onGroupGet } from "./group/onGroupGet";

import { onMessageSend } from "./message/onMessageSend";
import { onMessageReact } from "./message/onMessageReact";

import { onUserCreate } from "./user/onUserCreate";
import { onUserSearch } from "./user/onUserSearch";
import { onUserGet } from "./user/onUserGet";

import { onNotificationListen } from "./notification/onNotificationListen";
import { onNotificationRead } from "./notification/onNotificationRead";

fb.initializeApp();

exports.onGroupCreate = onGroupCreate;
exports.onGroupRequest = onGroupRequest;
exports.onGroupLeave = onGroupLeave;
exports.onGroupGet = onGroupGet;

exports.onMessageSend = onMessageSend;
exports.onMessageReact = onMessageReact;

exports.onUserCreate = onUserCreate;
exports.onUserSearch = onUserSearch;
exports.onUserGet = onUserGet;

exports.onNotificationListen = onNotificationListen;
exports.onNotificationRead = onNotificationRead;
