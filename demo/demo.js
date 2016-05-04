/**
 * Created by felix on 18.11.15.
 */
'use strict';
angular.module('stateLoaderDemo', ['ui.router',
    'ec.stateloader'])

  .run(['$rootScope',
    '$state',
    '$stateParams',
    function($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }]).config(['$stateProvider',
  '$urlRouterProvider',
  'stateLoaderProvider',
  function($stateProvider, $urlRouterProvider, stateLoaderProvider) {
    //By commenting in one of the two blocks below, you can change the default template:

    /*stateLoaderProvider.setTemplate('<div class="angular-state-loader">' +
     '<i class="material-icons rotate-right">check</i>' +
     '</div>');*/

    //stateLoaderProvider.setTemplateUrl('custom.tpl.html');

    $stateProvider.state("basic", {
      url:         "/",
      templateUrl: 'basic.tpl.html'
    }).state('example', {
      url:         '/example/:delay',
      resolve:     {
        data: function($stateParams, $timeout, $q) {
          var deferred = $q.defer();

          $timeout(function() {
            deferred.resolve('INCREDIBLE AMOUNT OF DATA');
          }, $stateParams.delay);

          return deferred.promise;
        }
      },
      templateUrl: 'example.tpl.html',
      controller:  function($scope, $stateParams, data) {
        $scope.delay = $stateParams.delay;
        console.log(data);
      }
    });
    $urlRouterProvider.otherwise('/');
  }]);