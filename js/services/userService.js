;(function(){
    var userService = angular.module('userService',  ['firebase']);

    userService.constant('FIREBASE_URI', 'https://shining-fire-4276.firebaseio.com');

    userService.factory('UserService', [ '$firebaseAuth', 'FIREBASE_URI',
        function( $firebaseAuth, FIREBASE_URI){
            var firebaseRef = new Firebase(FIREBASE_URI);
            var loginService = $firebaseAuth(firebaseRef);
            this.currentUser = null;
            var authenticated = false;

            var authRef = new Firebase(FIREBASE_URI + "/.info/authenticated");
            loginService.$onAuth(function(authData) {
              if (authData) {
                  this.currentUser = authData;
                  authenticated = true;
              } else {
                  this.currentUser = null;
                  authenticated = false;
              }
            });

            var getCurrentUser = function() {

                //return this.currentUser;
                var authData = loginService.$getAuth();
                this.currentUser = authData;
                return authData;
            };


            getCurrentUser();

            return {
                loginService: loginService,
                firebaseRef: firebaseRef,
                currentUser: this.currentUser,
                getCurrentUser: getCurrentUser,
                authenticated: authRef
            };
        }
]);
})();
