import * as fb from "firebase-admin";

import { onGroupCreate } from "./group/onGroupCreate";
import { onGroupGet } from "./group/onGroupGet";

import { onUserCreate } from "./user/onUserCreate";

fb.initializeApp();

exports.onGroupCreate = onGroupCreate;
exports.onGroupGet = onGroupGet;

exports.onUserCreate = onUserCreate;
