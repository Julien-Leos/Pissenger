import * as fb from "firebase-admin";

import { onGroupCreate } from "./group/onGroupCreate";
import { onGroupRequest } from "./group/onGroupRequest";
import { onGroupGet } from "./group/onGroupGet";

import { onUserCreate } from "./user/onUserCreate";
import { onUserGet } from "./user/onUserGet";

fb.initializeApp();

exports.onGroupCreate = onGroupCreate;
exports.onGroupRequest = onGroupRequest;
exports.onGroupGet = onGroupGet;

exports.onUserCreate = onUserCreate;
exports.onUserGet = onUserGet;
