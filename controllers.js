(function() {
    'use strict';

    var app = angular.module('app.controllers', []);

      app.controller('mainCtrl', function($scope, DB) {
        $scope.mydata = DB.getStatesData();
      });
})();
