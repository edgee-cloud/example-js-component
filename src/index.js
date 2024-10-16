export const provider = {
  page(payload, credentials) {
    return {
      method: 'GET',
      url: 'https://perdu.com',
      headers: [],
      body: '',
    };
  },

  track(payload, credentials) {
    throw "Not implemented";
  },

  identify(payload, credentials) {
    throw "Not implemented";
  },
};
