/**
 * Created by felix on 18.11.15.
 */
angular.module('stateLoaderDemo', ['ui.router', 'ec.stateloader'])

  .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }]).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state("basic", {
      url:         "/",
      templateUrl: 'basic.tpl.html'
    }).state('example', {
      url:        '/example/:delay',
      resolve:    {
        data: function($stateParams, $timeout, $q) {
          var deferred = $q.defer();

          $timeout(function() {
            deferred.resolve('INCREDIBLE AMOUNT OF DATA');
          }, $stateParams.delay);

          return deferred.promise;
        }
      },
      template:   '<p>This Page took {{delay}}ms to load!</p>',
      controller: function($scope, $stateParams, data) {
        $scope.delay = $stateParams.delay;
        console.log(data);
      }
    });
  }]);