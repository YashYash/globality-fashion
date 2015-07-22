// The reason I did this here is so that the emit is accessible globally

app.directive('ngWindow', [
  '$rootScope',
  'StateService',
  function(
    $rootScope,
    StateService) {
    console.log('#### Ng Window Directive');
    'use strict';
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        $("#scroll-content").on('scroll', function() {
          StateService.data['Window'].height = $("#cards-container").height();
          StateService.data['Window'].scrollTop = $("#scroll-content").scrollTop();
          $rootScope.$emit('window scrolling');
        })
      },
      controller: ['$scope', function($scope) {
        console.log('#### Ng Window Directive');
      }]
    }
  }
]);
