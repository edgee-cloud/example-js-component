/**
 * @typedef {import("../types/wit.d.ts").dataCollection} EdgeeDataCollection
 */

import { dataCollection } from "../types/wit.d.ts";

const API_ENDPOINT = "https://your-endpoint.com/path";

/**
 * Convert a {@link Dict} into a native JavaScript object
 *
 * Needed since Wasm Component doesn't have a native map type.
 *
 * @param {dataCollection.Dict} dict
 *
 * @returns {Map}
 */
export const convertDict = (dict) => {
  let data = {};

  for (let [key, value] of dict) {
    data[key] = value;
  }

  return data;
};

/**
 * @param {any} payload
 * @param {string} payload
 *
 * @returns {dataCollection.EdgeeRequest}
 */
const buildEdgeeRequest = (payload, apiKey) => ({
  method: 'POST',
  url: API_ENDPOINT,
  headers: [
    ['Content-Type', 'application/json'],
    ["Authorization", `Bearer ${apiKey}`],
  ],
  body: JSON.stringify(payload),
  forwardClientHeaders: true,
});

/**
 * @param {dataCollection.PageData} data
 * @param {dataCollection.Context} context
 *
 * @returns {any}
 */
const buildPagePayload = (data, context) => {
  const sessionId = parseInt(context.session.sessionId);
  const pageTitle = data.title;
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    pageTitle,
  };
};

/**
 * @param {dataCollection.TrackData} data
 * @param {dataCollection.Context} context
 *
 * @returns {any}
 */
const buildTrackPayload = (data, context) => {
  const sessionId = parseInt(context.session.sessionId);
  const eventName = data.name;
  const eventProperties = convertDict(data.properties);
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    eventName,
    eventProperties,
  };
};

/**
 * @param {dataCollection.UserData} data
 * @param {dataCollection.Context} context
 *
 * @returns {any}
 */
const buildUserPayload = (data, context) => {
  const sessionId = parseInt(context.session.sessionId);
  const userId = data.userId;
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    userId,
  };
};

/** @type {EdgeeDataCollection} */
export const dataCollection = {

  /**
   * @param {dataCollection.Event} e
   * @param {dataCollection.Dict} settings
  */
  page(e, settings) {
    if (e.data.tag != 'page') {
      throw new Error("Missing page data");
    }

    // convert to native object
    settings = convertDict(settings);

    // build payload
    const payload = buildPagePayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, settings['example']);
  },

  /**
   * @param {dataCollection.Event} e
   * @param {dataCollection.Dict} settings
  */
  track(e, settings) {
    if (e.data.tag != 'track') {
      throw new Error("Missing track data");
    }

    // convert to native object
    settings = convertDict(settings);

    // build payload
    const payload = buildTrackPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, settings['example']);
  },

  /**
   * @param {dataCollection.Event} e
   * @param {dataCollection.Dict} settings
  */
  user(e, settings) {
    if (e.data.tag != 'user') {
      throw new Error("Missing user data");
    }

    // convert to native object
    settings = convertDict(settings);

    // build payload
    const payload = buildUserPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, settings['example']);
  },
};
