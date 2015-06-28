(function() {
    app = angular.module('clanstats', ['firebase']);

    app.controller("AuthCtrl", [
        '$scope', '$rootScope', '$firebaseAuth',
        function($scope, $rootScope, $firebaseAuth) {
            var ref = new Firebase("https://insightsc.firebaseio.com/");
            $rootScope.ref = ref;
            $rootScope.auth = $firebaseAuth(ref);
            ref.onAuth(function(authData) {
                $rootScope.auth.user = authData
                if (authData) {
                    console.log("Authenticated with uid:", authData.uid);

                } else {
                    console.log("Client unauthenticated.")

                }
            });
            $scope.createUser = function() {
                $scope.message = null;
                $scope.error = null;

                $rootScope.auth.$createUser({
                    email: $scope.email,
                    password: $scope.password
                }).then(function(user) {
                    $rootScope.auth.user = user;
                    console.log("User " + user.uid + " created successfully!");
                    $scope.signIn();
                }).catch(function(error) {
                    $scope.error = error;
                });
            };

            $scope.unAuth = function() {
                $scope.message = null;
                $scope.error = null;
                $rootScope.ref.unauth();
            }

            $scope.removeUser = function() {
                $scope.message = null;
                $scope.error = null;

                $rootScope.auth.$removeUser({
                    email: $scope.email,
                    password: $scope.password
                }).then(function() {
                    $scope.message = "User removed";
                }).catch(function(error) {
                    $scope.error = error;
                });
            };

            $scope.signIn = function() {
                $scope.message = null;
                $scope.error = null;
                $rootScope.auth.$authWithPassword({
                    email: $scope.email,
                    password: $scope.password
                }).then(function(user) {
                    $rootScope.auth.user = user;
                    console.log("Logged in as:", user.uid);
                    this.auth = true;
                    $rootScope.alert.message = '';

                }).catch(function(error) {
                    $rootScope.alert.class = 'danger';
                    $rootScope.alert.message = 'The username and password combination you entered is invalid.';
                    console.error("Authentication failed:", error);
                    if (error === "Error: The specified password is incorrect.") {
                        $rootScope.alert.message = 'Invalid password. Please try again.';
                    } else {

                        $rootScope.alert.message = 'There is no account associated with that e-mail. Please contact the administrator.';
                    }
                    //console.log("Attempting to create new user");
                    //$scope.createUser();
                });

            }

        }
    ]);

    app.controller('AlertCtrl', [
        '$scope', '$rootScope',
        function($scope, $rootScope) {
            $rootScope.alert = {};
        }
    ]);

    app.controller('DataCtrl', ['$scope', '$rootScope', '$firebaseArray', function($scope, $rootScope, $firebaseArray) {
       //angularFire - replaces normal firebase Callback on('value', function(snapshot)...
	   $scope.data = $firebaseArray($rootScope.ref);

        $scope.addGame = function() {
            $scope.ourClan = 'Insight Gaming';
            $rootScope.ref.push({
                clan1: $scope.ourClan,
                clan2: $scope.otherClan,
                wins: $scope.clanWins,
                losses: $scope.clanLosses
            });

        }

    }]);

})();