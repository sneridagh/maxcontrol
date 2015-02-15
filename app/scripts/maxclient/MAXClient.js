'use strict';

/**
 * @ngdoc function
 * @name maxcontrolApp.service:MAXClient
 * @description
 * # MainCtrl Services for the MAXClient endpoints. It assumes that the username
 *   and token are globally available in $rootScope.
 */


var MAXClient = angular.module('MAXClient', []);

MAXClient.factory('Contexts', ['$resource', 'MAXInfo', function($resource, MAXInfo) {
    return $resource(MAXInfo.max_server+'/contexts', null, {
        search: {method:'GET', params: {tags:'@tags', hash:'@hash'}, headers:MAXInfo.headers, isArray: true},
    });
}]);

MAXClient.factory('ApiInfo', ['$resource', 'MAXInfo', function($resource, MAXInfo) {
    return $resource(MAXInfo.max_server+'/info/api', null, {
        query: {method:'GET'},
    });
}]);

MAXClient.factory('MAXInfo', ['MAXSession', '_MAXUI', function(MAXSession, _MAXUI) {
    var maxinfo = {};
    if (_MAXUI) {
        maxinfo.headers = {'X-Oauth-Username': _MAXUI.username,
                           'X-Oauth-Token': _MAXUI.oauth_token,
                           'X-Oauth-Scope': 'widgetcli'};
        maxinfo.max_server = _MAXUI.max_server;
    } else {
        maxinfo.headers = {'X-Oauth-Username': MAXSession.username,
                           'X-Oauth-Token': MAXSession.oauth_token,
                           'X-Oauth-Scope': 'widgetcli'};
        maxinfo.max_server = MAXSession.max_server;
    }
    return maxinfo;
}]);

MAXClient.value('MAXSession', {
    username: '',
    oauth_token: '',
    max_server: ''
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
            MAXSession.max_server = $attrs.maxServer;
        }
    };
}]);
