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
    'ui.jq',
    'ui.router'
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
  .config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', function ($stateProvider, $urlRouterProvider, USER_ROLES) {
    $urlRouterProvider.otherwise('/api');
    $stateProvider
      .state('api', {
        url: '/api',
        templateUrl: 'views/api.html',
        controller: 'ApiCtrl',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        }
      })
      .state('api.route_id', {
        url: '/:route_id',
        templateUrl: 'views/api_routes.html',
        controller: 'ApiRoutesCtrl',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      });
  }])
  .run(['$rootScope', '$location', 'AUTH_EVENTS', 'DEVEL_CONFIG', 'AuthService', 'Session', 'MAXSession', function ($rootScope, $location, AUTH_EVENTS, DEVEL_CONFIG, AuthService, Session, MAXSession) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
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
