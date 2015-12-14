/**
 * Created by felix on 18.11.15.
 */
'use strict';
angular.module('ec.stateloader', []).directive('stateLoader', ['$rootScope',
  '$timeout',
  function($rootScope, $timeout) {
    //credits to
    // http://stackoverflow.com/questions/24200909/apply-loading-spinner-during-ui-router-resolve
    return {
      scope:      {
        fromState: '@', //restrict showing loader only
                        // when loading from this state
                        // name
        toState:   '@', //restrict showing loader only
                        // when loading this state name
        delay:     '@', //show loader after ms loading time
        forceShow: '='
      },
      restrict:   'E',
      transclude: true,
      replace:    true,
      compile:    function(elem, attrs, transcludeFn) {
        var timer;
        return {
          pre:  function preLink(scope) {
            scope.shouldFire =
              function(fromState, toState) {
                return (!scope.fromState ||
                  fromState.name === scope.fromState) &&
                  (!scope.toState ||
                  toState.name === scope.toState) &&
                  scope.forceShow === undefined;
              };
            scope.hideLoader = function(element, force) {
              if (!scope.forceShow || force) {
                if (timer) {
                  $timeout.cancel(timer);
                }
                element.addClass('ng-hide');
              }
            };
            scope.showLoader = function(element) {
              if (scope.delay > 0) {
                timer = $timeout(function() {
                  element.removeClass('ng-hide');
                }, scope.delay);
              } else {
                element.removeClass('ng-hide');
              }
            };

            transcludeFn(elem, function(clone) {
              //check if element contains custom loading
              // text/html
              scope.transcluding = clone.length > 0;
            });
          },
          post: function postLink(scope, element) {
            scope.delay = typeof scope.delay ===
            'number' ? scope.delay : 100;

            scope.$watch('forceShow', function(show) {
              if (show) {
                scope.showLoader(element);
              } else {
                scope.hideLoader(element);
              }
            });

            scope.hideLoader(element, true);

            var show = $rootScope.$on('$stateChangeStart', function(event,
              toState, toParams, fromState, fromParams) {
              if (scope.shouldFire(fromState, toState)) {
                scope.showLoader(element);
              }
            });
            var hide = $rootScope.$on('$stateChangeSuccess', function(event,
              toState, toParams, fromState, fromParams) {
              if (scope.shouldFire(fromState, toState)) {
                scope.hideLoader(element);
              }
            });
            scope.$on('$destroy', show);
            scope.$on('$destroy', hide);
          }
        };
      },
      template:   '<div class="angular-state-loader"><span ng-hide="transcluding">' +
                  '<i class="material-icons rotate-right">autorenew</i>' +
                  '</span><ng-transclude></ng-transclude></div>'
    };
  }]);