/**
 * @typedef {import("../types/interfaces/edgee-protocols-data-collection").EdgeeProtocolsDataCollection} EdgeeProtocolsDataCollection
 * @typedef {import("../types/interfaces/edgee-protocols-data-collection").EdgeeRequest} EdgeeRequest
 * @typedef {import("../types/interfaces/edgee-protocols-data-collection").Dict} Dict
 * @typedef {import("../types/interfaces/edgee-protocols-data-collection").Event} Event
 * @typedef {import("../types/interfaces/edgee-protocols-data-collection").PageData} PageData
 * @typedef {import("../types/interfaces/edgee-protocols-data-collection").TrackData} TrackData
 * @typedef {import("../types/interfaces/edgee-protocols-data-collection").UserData} UserData
 * @typedef {import("../types/interfaces/edgee-protocols-data-collection").Context} Context
 */

const API_ENDPOINT = "https://your-endpoint.com/path";

/**
 * Convert a {@link Dict} into a native JavaScript object
 *
 * Needed since Wasm Component doesn't have a native map type.
 *
 * @param {Dict} dict
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
 * @returns {EdgeeRequest}
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
 * @param {PageData} data
 * @param {Context} context
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
 * @param {TrackData} data
 * @param {Context} context
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
 * @param {UserData} data
 * @param {Context} context
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

/** @type {EdgeeProtocolsDataCollection} */
export const dataCollection = {

  /**
   * @param {Event} e
   * @param {Dict} settings
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
    return buildEdgeeRequest(payload, settings['your_api_key']);
  },

  /**
   * @param {Event} e
   * @param {Dict} settings
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
    return buildEdgeeRequest(payload, settings['your_api_key']);
  },

  /**
   * @param {Event} e
   * @param {Dict} settings
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
    return buildEdgeeRequest(payload, settings['your_api_key']);
  },
};
