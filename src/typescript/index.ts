import {
  EdgeeProtocolsDataCollection,
  EdgeeRequest,
  Dict,
  Event,
  PageData,
  TrackData,
  UserData,
  Context
} from "../../types/interfaces/edgee-protocols-data-collection"

const API_ENDPOINT: string = "https://your-endpoint.com/path";

const convertDict = (dict: Dict): Map<string, string> => {
  let data = new Map<string, string>();

  for (let [key, value] of dict) {
    data.set(key, value);
  }

  return data;
};

const buildEdgeeRequest = (payload: any, apiKey: string): EdgeeRequest => ({
  method: 'POST',
  url: API_ENDPOINT,
  headers: [
    ['Content-Type', 'application/json'],
    ["Authorization", `Bearer ${apiKey}`],
  ],
  body: JSON.stringify(payload),
  forwardClientHeaders: true,
});

const buildPagePayload = (data: PageData, context: Context): any => {
  const sessionId = parseInt(context.session.sessionId);
  const pageTitle = data.title;
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    pageTitle,
  };
};

const buildTrackPayload = (data: TrackData, context: Context): any => {
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

const buildUserPayload = (data: UserData, context: Context): any => {
  const sessionId = parseInt(context.session.sessionId);
  const userId = data.userId;
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    userId,
  };
};

export const dataCollection: typeof EdgeeProtocolsDataCollection = {

  page(e: Event, settings: Dict) {
    if (e.data.tag != 'page') {
      throw new Error("Missing page data");
    }

    // convert to native object
    const dictSettings = convertDict(settings);
    const apiKey = dictSettings.get('your_api_key');
    if (!apiKey) throw new Error("Missing API key");

    // build payload
    const payload = buildPagePayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, apiKey);
  },

  track(e: Event, settings: Dict) {
    if (e.data.tag != 'track') {
      throw new Error("Missing track data");
    }

    // convert to native object
    const dictSettings = convertDict(settings);
    const apiKey = dictSettings.get('your_api_key');
    if (!apiKey) throw new Error("Missing API key");
    

    // build payload
    const payload = buildTrackPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, apiKey);
  },

  user(e: Event, settings: Dict) {
    if (e.data.tag != 'user') {
      throw new Error("Missing user data");
    }

    // convert to native object
    const dictSettings = convertDict(settings);
    const apiKey = dictSettings.get('your_api_key');
    if (!apiKey) throw new Error("Missing API key");

    // build payload
    const payload = buildUserPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, apiKey);
  },
};
