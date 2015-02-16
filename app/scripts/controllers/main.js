'use strict';

/**
 * @ngdoc function
 * @name maxcontrolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the maxcontrolApp
 */
angular.module('maxcontrolApp')
  .controller('MainCtrl', ['Session', 'ApiInfo', '_', function (Session, ApiInfo, _) {
    var self = this;
    self.username = Session.username;
    var res = [];
    var byCat = {};
    ApiInfo.query().$promise.then(function (response) {
      _.each(_.keys(response), function (elem) {res.push(response[elem]);});
      _.each(res, function (elem) {
        if (_.isEmpty(byCat[elem.category])) {
          byCat[elem.category] = [];
          byCat[elem.category].push(elem);
        }
        else {
          byCat[elem.category].push(elem);
        }
      });
      self.results = byCat;
      self.categories = _.keys(byCat);
    });
  }])

  .controller('MaxClientDemo', ['ApiInfo', '_', function (ApiInfo, _) {
    var self = this;
    self.demo = function () {
        // this.results = Contexts.search({tags: '[COMMUNITY]'});
        // this.results = Contexts.search();
        // this.results = MAXUtils.sha1('http://ulearn.beta.upcnet.es');
        // this.results = ApiInfo.query();
        var res = [];
        var byCat = {};
        ApiInfo.query().$promise.then(function (response) {
          _.each(_.keys(response), function (elem) {res.push(response[elem]);});
          _.each(res, function (elem) {byCat[elem.category] = elem;});
          self.results = byCat;
        });

    };
    this.results = 'Here the results';
  }]);

// Experiments amb directives per plugins de jq. Al final ui-jq rocks!
// .directive('metismenu', ['$timeout', function($timeout) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//           var applyMenu = function () {
//             $(element).metisMenu();
//           };
//           $timeout(applyMenu, 500);
//             // $timeout(function(){
//             //   // debugger
//             //     $(element).metisMenu({toggle:true});
//             // }, 0, false);

//             // scope.$on('apiloaded', function () {
//             // scope.$watch('results', function(){
//                 // $timeout(function(){
//                 //     $(element).metisMenu({toggle:true});
//                 // }, 1000, false);
//             // });
//         }
//     };
// }]);
