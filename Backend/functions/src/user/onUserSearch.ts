import * as fn from "firebase-functions";
import algoliasearch from "algoliasearch";

const ALGOLIA_ID = fn.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = fn.config().algolia.api_key;

export const onUserSearch = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
  const index = client.initIndex("users");

  return await index
    .search(data.query, {
      attributesToRetrieve: ["profile.firstname", "profile.lastname"],
    })
    .then((result) => {
      return result.hits.map((hit) => hit.objectID);
    });
});
