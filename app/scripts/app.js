'use strict';

/**
 * @ngdoc overview
 * @name maxcontrolApp
 * @description
 * # maxcontrolApp
 *
 * Main module of the application.
 */

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._;
});

angular
  .module('maxcontrolApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'MAXClient',
    'underscore',
    // 'ngModel'
  ])
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
  })
  .constant('DEVEL_CONFIG', {
    is_development: true,
    username: 'victor.fernandez',
    oauth_token: 'uj5v4XrWMxGP25CN3pAE39mYCL7cwBMV',
    max_server: 'https://max.upcnet.es'
  })
  .config(['$routeProvider', 'USER_ROLES', function ($routeProvider, USER_ROLES) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      })
      .otherwise({
        redirectTo: '/'
      });

  }])
  .run(['$rootScope', '$location', 'AUTH_EVENTS', 'DEVEL_CONFIG', 'AuthService', 'Session', 'MAXSession', function ($rootScope, $location, AUTH_EVENTS, DEVEL_CONFIG, AuthService, Session, MAXSession) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
      // Configuration while in development, change constants in 'DEVEL_CONFIG'
      // accordingly
      if (DEVEL_CONFIG.is_development) {
        Session.id = DEVEL_CONFIG.username;
        Session.username = DEVEL_CONFIG.username;
        MAXSession.username = DEVEL_CONFIG.username;
        $rootScope.username = DEVEL_CONFIG.username;
        Session.token = DEVEL_CONFIG.oauth_token;
        MAXSession.oauth_token = DEVEL_CONFIG.oauth_token;
        MAXSession.max_server = DEVEL_CONFIG.max_server;
        $rootScope.token = DEVEL_CONFIG.oauth_token;
        Session.userRole = 'admin';
      }
      if (next.data !== undefined) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
          event.preventDefault();
          if (AuthService.isAuthenticated()) {
            // user is not allowed
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          } else {
            // user is not logged in
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            $location.path('/login');
          }
        }
      }
    });
  }]);
