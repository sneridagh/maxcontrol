'use strict';

/**
 * @ngdoc function
 * @name maxcontrolApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the maxcontrolApp
 */
angular.module('maxcontrolApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
