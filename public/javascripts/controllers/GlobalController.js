app.controller('GlobalController', [
	'$scope', 
	'$state',
	'$rootScope',
	function($scope, $state, $rootScope) {
	'use strict';
	console.log('#### Global Controller');

	// This Controller and view exist for user testing
	// This is where I determine which version of the app to render
	// In this case, there is just 1 version - v1
	$state.go('app.v1.landing');
}]);