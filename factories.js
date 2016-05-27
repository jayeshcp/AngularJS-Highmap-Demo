(function() {
  'use strict';

  var app = angular.module('app.factories', []);

  app.factory('DB', function($http) {
    var statesData = [{
      'code': 'us-ma',
      value: 20
    }, {
      'code': 'us-ny',
      value: 30
    }, {
      'code': 'us-tx',
      value: 13
    }];

    var countiesData = {
      'us-ny': [{
        'code': 'us-ny-063',
        value: 20
      }],
      'us-ma': [{
        'code': 'us-ma-001',
        value: 20
      }]
    };

    return {
      getStatesData: function() {
        return statesData
      },
      getCountyData: function(state) {
        return countiesData[state]
      }
    }
  });
})();
