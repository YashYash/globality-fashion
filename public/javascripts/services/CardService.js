// Read and write cards

app.service('CardService', [
  '$http',
  'StateService',
  function(
    $http,
    StateService) {
    'use strict';
    console.log('#### Card Service');

    return {
      get: function() {
        if(StateService.data['LandingController'].cards.length > 0) {
          console.log('#### Greater than 0');
          StateService.data['LandingController'].lastSeen = StateService.data['LandingController'].cards[StateService.data['LandingController'].cards.length - 1]._id;
        }
        console.log(StateService.data['LandingController'].lastSeen);
        var url = '/api/card/get?id=' + StateService.data['LandingController'].lastSeen;
        var result = $http.get(url).then(function(response) {
          return response;
        });
        return result;
      },
      create: function(card) {
        var url = '/api/card/create';
        var result = $http.post(url, card).then(function(response) {
          return response;
        });
        return result;
      }
    }
  }
])
