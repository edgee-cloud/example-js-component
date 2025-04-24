import assert from 'assert'
import {consentManagement} from '../src/index.js';

describe('consent management component', function () {

  const sampleCookies = [
    ["example", "granted"]
  ];
  const sampleSettings = [
    ["your_api_key", "api_value"]
  ];

  describe('#page()', function () {
    it('should return granted', function () {
      const req = consentManagement.map(sampleCookies, sampleSettings);
      assert.equal(req, "granted");
    });
  });

});
