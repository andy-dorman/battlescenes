;(function(){
    var authenticationService = angular.module('authenticationService', []);
    authenticationService.factory('AuthenticationService',
        function($http, $log, $location){
            return {
                login: function(login, antiForgeryToken){
                    return $http({
                            method: 'POST',
                            url: 'api/Account/AuthenticateUser',
                            data: login,
                            headers: { 'RequestVerificationToken': antiForgeryToken }
                        });
                    },
                logout: function() {
                    return $http.post('/api/Account/Logout');
                    }

            };
    });
}());
