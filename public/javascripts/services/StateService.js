// This is where I store states and monitor all the controllers and views

app.service('StateService', [function() {
  'use strict';
  console.log('#### State Service');

  var data = {
    'Window': {
      'scrollTop': 0
    },
    'LandingController': {
      'loaded': false,
      'cards': [],
      'lastSeen': false
    }
  }
  return {
    data: data
  }
}])
