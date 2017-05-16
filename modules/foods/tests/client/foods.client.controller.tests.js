(function () {
  'use strict';

  describe('Foods Controller Tests', function () {
    // Initialize global variables
    var FoodsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      FoodsService,
      mockFood;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _FoodsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      FoodsService = _FoodsService_;

      // create mock Food
      mockFood = new FoodsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Food Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Foods controller.
      FoodsController = $controller('FoodsController as vm', {
        $scope: $scope,
        foodResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleFoodPostData;

      beforeEach(function () {
        // Create a sample Food object
        sampleFoodPostData = new FoodsService({
          name: 'Food Name'
        });

        $scope.vm.food = sampleFoodPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (FoodsService) {
        // Set POST response
        $httpBackend.expectPOST('api/foods', sampleFoodPostData).respond(mockFood);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Food was created
        expect($state.go).toHaveBeenCalledWith('foods.view', {
          foodId: mockFood._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/foods', sampleFoodPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Food in $scope
        $scope.vm.food = mockFood;
      });

      it('should update a valid Food', inject(function (FoodsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/foods\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('foods.view', {
          foodId: mockFood._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (FoodsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/foods\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Foods
        $scope.vm.food = mockFood;
      });

      it('should delete the Food and redirect to Foods', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/foods\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('foods.list');
      });

      it('should should not delete the Food and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
