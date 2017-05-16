'use strict';

describe('Foods E2E Tests:', function () {
  describe('Test Foods page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/foods');
      expect(element.all(by.repeater('food in foods')).count()).toEqual(0);
    });
  });
});
