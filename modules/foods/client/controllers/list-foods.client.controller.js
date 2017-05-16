(function () {
  'use strict';

  angular
    .module('foods')
    .controller('FoodsListController', FoodsListController);

  FoodsListController.$inject = ['FoodsService'];

  function FoodsListController(FoodsService) {
    var vm = this;

    vm.foods = FoodsService.query();
  }
}());
