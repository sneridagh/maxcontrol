'use strict';

/**
 * @ngdoc function
 * @name maxcontrolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the maxcontrolApp
 */
angular.module('maxcontrolApp')
  .controller('MainCtrl', ['Session', function (Session) {
    this.username = Session.username;
    $('#side-menu').metisMenu(); // jshint ignore:line
  }])

  .controller('MaxClientDemo', ['Contexts', 'MAXUtils', function (Contexts, MAXUtils) {
    this.demo = function () {
        // this.results = Contexts.search({tags: '[COMMUNITY]'});
        this.results = Contexts.search();
        // this.results = MAXUtils.sha1('http://ulearn.beta.upcnet.es');
    };
    this.results = 'Here the results';
  }]);
