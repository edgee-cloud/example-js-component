/**
 * @typedef {import("../types/interfaces/provider").Provider} Provider
 * @typedef {import("../types/interfaces/provider").EdgeeRequest} EdgeeRequest
 * @typedef {import("../types/interfaces/provider").Dict} Dict
 * @typedef {import("../types/interfaces/provider").Event} Event
 */

export const convertDict = (dict) => {
  let data = {};

  for (let [key, value] of dict) {
    data[key] = value;
  }

  return data;
};

/**
 * @param {string} type
 * @param {Event} e
 * @param {number} sessionId
 */
export const buildAmplitudeEvent = (type, e, sessionId) => {
  let event = {
    event_type: type,
    library: 'Edgee',
    platform: 'Web',

    device_id: e.context.user.edgeeId,

    user_agent: e.context.client.userAgent,
    language: e.context.client.locale,
    ip: e.context.client.ip,
  };

  if (sessionId != 0) {
    event.session_id = sessionId;
  }

  if (e.context.user.userId != '') {
    event.user_id = e.context.user.userId;
  }

  return event;
};

/**
 * @param {any} payload
 *
 * @returns {EdgeeRequest}
 */
const buildEdgeeRequest = (endpoint, payload) => ({
  method: 'POST',
  url: `https://${endpoint}.amplitude.com/2/httpapi`,
  headers: [
    ['Content-Type', 'application/json'],
  ],
  body: JSON.stringify(payload),
});

/** @type {Provider} */
export const provider = {
  page(e, cred) {
    if (e.data.tag != 'page') {
      throw "Missing page data";
    }

    let event, eventProps;

    const sessionId = parseInt(e.context.session.sessionId);
    const data = e.data.val;
    cred = convertDict(cred);

    let events = [];

    event = buildAmplitudeEvent('[Amplitude] Page Viewed', e, sessionId);

    eventProps = {
      '[Amplitude] Page Location': `${data.url}${data.search}`,
      '[Amplitude] Page Path': data.path,
      '[Amplitude] Page Title': data.title,
      '[Amplitude] Page URL': data.url,
    };

    let url = new URL(data.url);
    eventProps['[Amplitude] Page Domain'] = url.hostname;

    event.event_properties = eventProps;

    events.push(event);

    let payload = {
      api_key: cred['amplitude_api_key'],
      options: {
        min_id_length: 1,
      },
      events,
    };
    return buildEdgeeRequest(cred['amplitude_endpoint'], payload);
  },

  track(e, cred) {
    if (e.data.tag != 'track') {
      throw "Missing track data";
    }

    let event, eventProps;

    const sessionId = parseInt(e.context.session.sessionId);
    const data = e.data.val;
    cred = convertDict(cred);

    let events = [];

    event = buildAmplitudeEvent(data.name, e, sessionId);
    events.push(event);

    let payload = {
      api_key: cred['amplitude_api_key'],
      options: {
        min_id_length: 1,
      },
      events,
    };
    return buildEdgeeRequest(cred['amplitude_endpoint'], payload);
  },

  user(e, cred) {
    if (e.data.tag != 'user') {
      throw "Missing user data";
    }

    let event, eventProps;

    const sessionId = parseInt(e.context.session.sessionId);
    const data = e.data.val;
    cred = convertDict(cred);

    let events = [];

    event = buildAmplitudeEvent(data.name, e, sessionId);
    events.push(event);

    let payload = {
      api_key: cred['amplitude_api_key'],
      options: {
        min_id_length: 1,
      },
      events,
    };
    return buildEdgeeRequest(cred['amplitude_endpoint'], payload);
  },
};
