app.controller('LandingController', [
  '$scope',
  '$rootScope',
  '$state',
  '$timeout',
  'StateService',
  'Upload',
  'CardService',
  function(
    $scope,
    $rootScope,
    $state,
    $timeout,
    StateService,
    Upload,
    CardService) {
    'use strict';
    console.log('#### Landing Controller');


    // init - check to see if controller has been loaded
    if (!StateService.data['LandingController'].loaded) {
      init();
    } else {
      // If you were to leave this view and return, the cards will already be stored in the service
      console.log('#### Controller has already loaded');
    }

    function init() {
      // Set Loaded to true
      StateService.data['LandingController'].loaded = true;
      $scope.card = {};
      $scope.card.image = 'http://cdn.playbuzz.com/cdn/2bff0e00-cbe8-49e5-85d4-7e4c052df449/f097abfe-d3d6-42c5-9768-11616bc985e2.jpg';
    }

    // Ui-responders
    $scope.getData = function(type) {
      return StateService.data[type];
    };

    $scope.getCards = function() {
    	var cards = CardService.get();
    	cards.then(function(response) {
    		console.log('#### Got the cards');
        for(var i = 0; i < response.data.length; i++) {
          StateService.data['LandingController'].cards.push(response.data[i]);
        }
    	});
    };
    $scope.getCards();

    $scope.showForm = function() {
      $scope.showOverlay = true;
      $timeout(function() {
        $scope.fadeInOverlay = true;
      }, 100);
    };

    $scope.hideForm = function() {
      $scope.fadeInOverlay = false;
      $timeout(function() {
        $scope.showOverlay = false;
        $scope.card = {};
        $scope.card.image = 'http://cdn.playbuzz.com/cdn/2bff0e00-cbe8-49e5-85d4-7e4c052df449/f097abfe-d3d6-42c5-9768-11616bc985e2.jpg';
      }, 500);
    };

    // If I had more time, I would port this into it's own directive
    $scope.upload = function(files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var headers = {
            'Content-Type': file.type,
          }
          Upload.upload({
            url: '/api/card/upload/image',
            method: 'POST',
            file: file
          }).success(function(data, status, headers, config) {
            console.log('#### Uploaded the image successfully');
            console.log(data);
            $scope.card.image = 'images/cards/' + data;
          }).error(function(err) {
            console.log(err);
          });
        }
      }
    };

    // Simple check to see if all fields are filled out
    function formErrorCheck() {
      if (!$scope.card.title) {
        $scope.cardError = 'title';
        return false;
      } else if (!$scope.card.blurb) {
        $scope.cardError = 'blurb';
        return false;
      } else if (!$scope.card.url) {
        $scope.cardError = 'url';
        return false;
      } else if (!$scope.card.author) {
        $scope.cardError = 'author';
        return false;
      } else {
        return true;
      }
    }

    // Create a card
    $scope.createCard = function() {
      if (formErrorCheck()) {
        console.log('#### No errors');
        var createCard = CardService.create($scope.card);
        createCard.then(function(response) {
          console.log('#### Card has been created successfully');
          console.log(response);
          StateService.data['LandingController'].cards.unshift(response.data);
          $scope.hideForm();
        })
      } else {
        console.log('#### Error occured');

      }
    };
    // Ui-relayers
    $scope.$watch('files', function() {
      $scope.upload($scope.files);
    });
    $scope.$watch('card.title', function() {
      $scope.cardError = '';
    });
    $scope.$watch('card.blurb', function() {
      $scope.cardError = '';
    });
    $scope.$watch('card.url', function() {
      $scope.cardError = '';
    });
    $scope.$watch('card.author', function() {
      $scope.cardError = '';
    });
    $rootScope.$on('window scrolling', function() {
      if(StateService.data['Window'].scrollTop > StateService.data['Window'].height - 250) {
        $scope.getCards();
      }
    })
  }
]);
