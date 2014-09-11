;(function(){
    var userService = angular.module('userService',  ['firebase']);

    userService.constant('FIREBASE_URI', 'https://shining-fire-4276.firebaseio.com');

    userService.factory('UserService', [ '$firebaseSimpleLogin', 'FIREBASE_URI',
        function( $firebaseSimpleLogin, FIREBASE_URI){
            var firebaseRef = new Firebase(FIREBASE_URI);
            var loginService = $firebaseSimpleLogin(firebaseRef);
            this.currentUser = null;

            var getCurrentUser = function() {
            	loginService.$getCurrentUser().then(function(user){
                    this.currentUser = user;

                });
            };

            getCurrentUser();

            return {
                loginService: loginService,
                firebaseRef: firebaseRef,
                currentUser: this.currentUser
            }
        }
]);
})();
