(function () {
  'use strict';

  angular
    .module('core', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
    .controller('HomeController', HomeController);
  HomeController.$inject = ['$scope'];
  function HomeController($scope) {
    var vm = this;
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [
      {
        image: 'https://www.cooky.vn/imgs/Ads/ca-phe-trung-19590.jpg',
        text: 'Slide text 1',
        tip1: 'Trân châu trắng',
        tip2: 'Pha chế thức uống',
        id: 0
      },
      {
        image: 'https://www.cooky.vn/imgs/Ads/matcha-latte-19593.jpg',
        text: 'Slide text 2',
        tip1: 'Matcha ngon tuyet voi',
        tip2: 'Pha chế thức uống',
        id: 1
      },
      {
        image: 'https://www.cooky.vn/imgs/Ads/banh-gao-xien-que-ap-chao-sot-han-quoc-tteok-kkochi-19605.jpg',
        text: 'Slide text 3',
        tip1: 'tteok-kkochi',
        tip2: 'Pha chế thức uống',
        id: 2
      },
      {
        image: 'https://www.cooky.vn/imgs/Ads/mam-ruoc-thai-nam-pla-wan.jpg',
        tip1: 'Mam ruoc Thai Nam',
        tip2: 'Pha chế thức uống',
        text: 'Slide text 4',
        id: 3
      },
      {
        image: 'https://www.cooky.vn/imgs/Ads/thach-pho-mai.jpg',
        text: 'Slide text 5',
        tip1: 'Mam ruoc Thai Nam',
        tip2: 'Pha chế thức uống',
        id: 4
      },
      {
        image: 'https://www.cooky.vn/imgs/Ads/tran-chau-trang.jpg',
        text: 'Slide text 6',
        tip1: 'Mam ruoc Thai Nam',
        tip2: 'Pha chế thức uống',
        id: 5
      },
      {
        image: 'https://www.cooky.vn/imgs/Ads/banh-brownie-chocolate-dang.jpg',
        text: 'Slide text 7',
        tip1: 'Mam ruoc Thai Nam',
        tip2: 'Pha chế thức uống',
        id: 6
      },
      {
        image: 'https://www.cooky.vn/imgs/Ads/banh-chanh-lime-pie.jpg',
        text: 'Slide text 8',
        tip1: 'Mam ruoc Thai Nam',
        tip2: 'Pha chế thức uống',
        id: 7
      },
      {
        image: 'https://www.cooky.vn/imgs/Ads/canh-kim-chi.jpg',
        text: 'Slide text 9',
        tip1: 'Mam ruoc Thai Nam',
        tip2: 'Pha chế thức uống',
        id: 8
      }];
    var currIndex = 0;
  }
}());
