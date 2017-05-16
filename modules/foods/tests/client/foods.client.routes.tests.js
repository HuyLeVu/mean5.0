(function () {
  'use strict';

  describe('Foods Route Tests', function () {
    // Initialize global variables
    var $scope,
      FoodsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FoodsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FoodsService = _FoodsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('foods');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/foods');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FoodsController,
          mockFood;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('foods.view');
          $templateCache.put('modules/foods/client/views/view-food.client.view.html', '');

          // create mock Food
          mockFood = new FoodsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Food Name'
          });

          // Initialize Controller
          FoodsController = $controller('FoodsController as vm', {
            $scope: $scope,
            foodResolve: mockFood
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:foodId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.foodResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            foodId: 1
          })).toEqual('/foods/1');
        }));

        it('should attach an Food to the controller scope', function () {
          expect($scope.vm.food._id).toBe(mockFood._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/foods/client/views/view-food.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FoodsController,
          mockFood;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('foods.create');
          $templateCache.put('modules/foods/client/views/form-food.client.view.html', '');

          // create mock Food
          mockFood = new FoodsService();

          // Initialize Controller
          FoodsController = $controller('FoodsController as vm', {
            $scope: $scope,
            foodResolve: mockFood
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.foodResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/foods/create');
        }));

        it('should attach an Food to the controller scope', function () {
          expect($scope.vm.food._id).toBe(mockFood._id);
          expect($scope.vm.food._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/foods/client/views/form-food.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FoodsController,
          mockFood;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('foods.edit');
          $templateCache.put('modules/foods/client/views/form-food.client.view.html', '');

          // create mock Food
          mockFood = new FoodsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Food Name'
          });

          // Initialize Controller
          FoodsController = $controller('FoodsController as vm', {
            $scope: $scope,
            foodResolve: mockFood
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:foodId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.foodResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            foodId: 1
          })).toEqual('/foods/1/edit');
        }));

        it('should attach an Food to the controller scope', function () {
          expect($scope.vm.food._id).toBe(mockFood._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/foods/client/views/form-food.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
