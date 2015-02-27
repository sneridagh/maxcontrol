'use strict';

/**
 * @ngdoc function
 * @name maxcontrolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the maxcontrolApp
 */
angular.module('maxcontrolApp')
  .controller('ApiCtrl', ['Session', 'ApiInfo', function (Session, ApiInfo) {
    var self = this;
    self.username = Session.username;
    ApiInfo.by_category().$promise.then(function (response) {
      self.results = response;
    });
  }])
  .controller('ApiRoutesCtrl', ['$stateParams', function ($stateParams) {
    var self = this;
    self.route_id = $stateParams.route_id;

  }]);

