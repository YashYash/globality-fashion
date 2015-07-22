app.directive('fashionCard', [
  function() {
    console.log('#### Fashion Card Directive');
    'use strict';
    return {
      restrict: 'E',
      scope: {
        card: '='
      },
      link: function(scope, element, attrs) {},
      templateUrl: 'views/fashion-card.html',
      controller: ['$scope', function($scope) {
        // Scope in here is isolated
        $scope.goTo = function(url) {
          var win = window.open(url, '_blank');
          win.focus();
        };
      }]
    }
  }
]);
