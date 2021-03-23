/**
 * Created by felix on 18.11.15.
 */
'use strict';
var app = angular.module('ec.stateloader', []).provider('stateLoader', function() {
    var settings = {
        template:    '<div class="angular-state-loader ng-hide">' +
        '<span ng-hide="transcluding">' +
        '</span><ng-transclude></ng-transclude></div>',
        templateUrl: null
    };

    this.setTemplate = function(tpl) {
        settings.template = tpl;
    };
    this.getTemplate = function() {
        return settings.template;
    };
    this.setTemplateUrl = function(tpl) {
        settings.templateUrl = tpl;
    };
    this.getTemplateUrl = function() {
        return settings.templateUrl;
    };
    this.$get = function() {
        return this;
    };
}).directive('stateLoader',
    ['$timeout', '$transitions', 'stateLoader',
    function($timeout, $transitions, stateLoader) {
    //credits to
    // http://stackoverflow.com/questions/24200909/apply-loading-spinner-during-ui-router-resolve
    return {
        scope:       {
            fromState: '@', //restrict showing loader only
                            // when loading from this state
                            // name
            toState:   '@', //restrict showing loader only
                            // when loading this state name
            delay:     '@', //show loader after ms loading time
            forceShow: '='
        },
        restrict:    'E',
        transclude:  true,
        replace:     true,
        compile:     function(elem, attrs, transcludeFn) {
            var timer;
            return {
                pre: function preLink(scope) {
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

                    var show = $transitions.onStart({}, function($transition) {
                        if (scope.shouldFire($transition.$from(), $transition.$to())) {
                            scope.showLoader(element);
                        }
                    });
                    var hide = $transitions.onSuccess({}, function($transition) {
                        if (scope.shouldFire($transition.$from(), $transition.$to())) {
                            scope.hideLoader(element);
                        }
                    });

                    scope.$on('$destroy', show);
                    scope.$on('$destroy', hide);
                }
            };
        },
        template:    !stateLoader.getTemplateUrl() ? stateLoader.getTemplate() : null,
        templateUrl: stateLoader.getTemplateUrl() || null
    };
}]);

// Check for CommonJS support
if (typeof module === 'object' && module.exports) {
    module.exports = app;
}
