'use strict';

/**
 * @ngdoc function
 * @name maxcontrolApp.service:MAXClient
 * @description
 * # MainCtrl Services for the MAXClient endpoints. It assumes that the username
 *   and token are globally available in $rootScope.
 */


var MAXClient = angular.module('MAXClient', []);

MAXClient.factory('Contexts', ['$resource', 'MAXHeaders', function($resource, MAXHeaders) {
    return $resource('https://max.upcnet.es/contexts', null, {
        search: {method:'GET', params: {tags:'@tags', hash:'@hash'}, headers:MAXHeaders, isArray: true},
    });
}]);

MAXClient.factory('MAXHeaders', ['MAXSession', '_MAXUI', function(MAXSession, _MAXUI) {
    var headers = {};
    if (_MAXUI) {
        headers = {'X-Oauth-Username': _MAXUI.username,
                   'X-Oauth-Token': _MAXUI.oauth_token,
                   'X-Oauth-Scope': 'widgetcli'};
    } else {
        headers = {'X-Oauth-Username': MAXSession.username,
                   'X-Oauth-Token': MAXSession.oauth_token,
                   'X-Oauth-Scope': 'widgetcli'};
    }
    return headers;
}]);

MAXClient.value('MAXSession', {
    username: '',
    oauth_token: ''
});

MAXClient.factory('_MAXUI', [function() {
    if (window._MAXUI !== undefined) {
        return window._MAXUI;
    } else {
        return false;
    }
}]);

MAXClient.directive('oauthinfo', [function() {
    return {
        restrict: 'E',
        controller: function($scope, $element, $attrs, MAXSession) {
            MAXSession.username = $attrs.username;
            MAXSession.oauth_token = $attrs.oauthToken;
            $attrs.oauthToken = '';
        }
    };
}]);
