import * as fb from "firebase-admin";

import { onGroupCreate } from "./groups/onGroupCreate";

import { onGroupGetById } from "./groups/onGroupGet";

fb.initializeApp();

exports.onGroupCreate = onGroupCreate;

exports.onGroupGetById = onGroupGetById;
