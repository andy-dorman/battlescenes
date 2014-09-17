;(function(){
    var userService = angular.module('userService',  ['firebase']);

    userService.constant('FIREBASE_URI', 'https://shining-fire-4276.firebaseio.com');

    userService.factory('UserService', [ '$firebaseSimpleLogin', 'FIREBASE_URI',
        function( $firebaseSimpleLogin, FIREBASE_URI){
            var firebaseRef = new Firebase(FIREBASE_URI);
            var loginService = $firebaseSimpleLogin(firebaseRef);
            this.currentUser = null;
            var authenticated = false;

            var authRef = new Firebase(FIREBASE_URI + "/.info/authenticated");
            authRef.on("value", function(snap) {
              if (snap.val() === true) {
                authenticated = true;
              } else {
                authenticated = false;
              }
            });

            var getCurrentUser = function() {
            	loginService.$getCurrentUser().then(function(user){
                    this.currentUser = user;
                    return user;

                });
            };


            getCurrentUser();

            return {
                loginService: loginService,
                firebaseRef: firebaseRef,
                currentUser: this.currentUser,
                getCurrentUser: getCurrentUser,
                authenticated: authRef
            }
        }
]);
})();
