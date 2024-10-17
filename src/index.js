export const provider = {
  page(e, credentials) {
    return {
      method: 'GET',
      url: 'https://perdu.com',
      headers: [],
      body: '',
    };
  },

  track(e, credentials) {
    throw "Not implemented";
  },

  user(e, credentials) {
    throw "Not implemented";
  },
};
