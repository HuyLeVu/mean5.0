// Foods service used to communicate Foods REST endpoints
(function () {
  'use strict';

  angular
    .module('foods')
    .factory('FoodsService', FoodsService);

  FoodsService.$inject = ['$resource'];

  function FoodsService($resource) {
    return $resource('api/foods/:foodId', {
      foodId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
