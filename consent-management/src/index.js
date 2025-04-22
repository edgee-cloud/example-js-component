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

/** @type {EdgeeConsentManagement} */
export const consentManagement = {

  map(cookies, settings) {
    // convert to native object
    settings = convertDict(settings);
    cookies = convertDict(cookies);

    if (cookies['example']) {
        if (cookies['example'] == 'granted') {
            return 'granted';
        } else if (cookies['example'] == 'denied') {
            return 'denied';
        } else {
            return 'pending';
        }
    }
    return;
  },
};
