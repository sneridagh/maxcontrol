'use strict';

/**
 * @ngdoc function
 * @name maxcontrolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the maxcontrolApp
 */
angular.module('maxcontrolApp')
    .controller('LoginCtrl', ['$rootScope', 'AUTH_EVENTS', 'AuthService', '$location', function ($rootScope, AUTH_EVENTS, AuthService, $location) {
        var self = this;

        self.login = function () {
            AuthService.login(self.credentials).then(function () {
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              $location.path('/');
            }, function () {
              $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        };
    }])

    .factory('AuthService', ['$http', 'Session', function ($http, Session) {
      var authService = {};
      var transform = function(data){
        return $.param(data); // jshint ignore:line
      };
      authService.login = function (credentials) {
        credentials.grant_type = 'password'; // jshint ignore:line
        credentials.scope = 'widgetcli';
        var config = {};
        config.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        config.transformRequest = transform;
        return $http
          .post('https://oauth.upcnet.es/token', credentials, config)
          .then(function (res) {
            Session.create(res.data.access_token, credentials.username, 'admin');
            // return credentials.username;
          });
      };

      authService.isAuthenticated = function () {
        return !!Session.username;
      };

      authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
          authorizedRoles.indexOf(Session.userRole) !== -1);
      };

      return authService;
    }])

    .service('Session', [function () {
      this.create = function (sessionId, username, userRole) {
        this.id = sessionId;
        this.username = username;
        this.token = sessionId;
        this.userRole = userRole;
      };
      this.destroy = function () {
        this.id = null;
        this.username = null;
        this.token = null;
        this.userRole = null;
      };
      return this;
    }]);

