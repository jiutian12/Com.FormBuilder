/**
 * ng-context-menu - v1.0.1 - An AngularJS directive to display a context menu
 * when a right-click event is triggered
 *
 * @author Ian Kennington Walter (http://ianvonwalter.com)
 */
(function(angular) {
  'use strict';

  angular
    .module('ng-context-menu', [])
    .factory('ContextMenuService', function() {
      return {
        element: null,
        menuElement: null
      };
    })
    .directive('contextMenu', [
      '$document',
      'ContextMenuService',
      function($document, ContextMenuService) {
        return {
          restrict: 'A',
          scope: {
            'callback': '&contextMenu',
            'disabled': '&contextMenuDisabled',
            'closeCallback': '&contextMenuClose'
          },
          link: function($scope, $element, $attrs) {
            var opened = false;

            function open(event, menuElement) {
              menuElement.addClass('open');

              menuElement.css('top', event.clientY + 'px');
              menuElement.css('left', event.clientX + 'px');
              opened = true;
            }

            function close(menuElement) {
              menuElement.removeClass('open');

              if (opened) {
                $scope.closeCallback();
              }

              opened = false;
            }

            $element.bind('contextmenu', function(event) {
              if (!$scope.disabled()) {
                if (ContextMenuService.menuElement !== null) {
                  close(ContextMenuService.menuElement);
                }
                ContextMenuService.menuElement = angular.element(
                  document.getElementById($attrs.target)
                );
                ContextMenuService.element = event.target;
                //console.log('set', ContextMenuService.element);

                event.preventDefault();
                event.stopPropagation();
                $scope.$apply(function() {
                  $scope.callback({ $event: event });
                });
                $scope.$apply(function() {
                  open(event, ContextMenuService.menuElement);
                });
              }
            });

            function handleKeyUpEvent(event) {
              //console.log('keyup');
              if (!$scope.disabled() && opened && event.keyCode === 27) {
                $scope.$apply(function() {
                  close(ContextMenuService.menuElement);
                });
              }
            }

            function handleClickEvent(event) {
              if (!$scope.disabled() &&
                opened &&
                (event.button !== 2 ||
                  event.target !== ContextMenuService.element)) {
                $scope.$apply(function() {
                  close(ContextMenuService.menuElement);
                });
              }
            }

            $document.bind('keyup', handleKeyUpEvent);
            // Firefox treats a right-click as a click and a contextmenu event
            // while other browsers just treat it as a contextmenu event
            $document.bind('click', handleClickEvent);
            $document.bind('contextmenu', handleClickEvent);

            $scope.$on('$destroy', function() {
              //console.log('destroy');
              $document.unbind('keyup', handleKeyUpEvent);
              $document.unbind('click', handleClickEvent);
              $document.unbind('contextmenu', handleClickEvent);
            });
          }
        };
      }
    ]);
})(angular);