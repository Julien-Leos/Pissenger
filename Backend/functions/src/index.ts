import * as fb from "firebase-admin";

import { onGroupCreate } from "./groups/onGroupCreate";

import { onGroupGet } from "./groups/onGroupGet";

fb.initializeApp();

exports.onGroupCreate = onGroupCreate;

exports.onGroupGet = onGroupGet;
