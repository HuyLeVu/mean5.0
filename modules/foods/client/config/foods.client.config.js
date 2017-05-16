(function () {
  'use strict';

  angular
    .module('foods')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Foods',
      state: 'foods',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'foods', {
      title: 'List Foods',
      state: 'foods.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'foods', {
      title: 'Create Food',
      state: 'foods.create',
      roles: ['user']
    });
  }
}());
