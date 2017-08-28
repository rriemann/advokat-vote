// Load libraries
import angular from 'angular';

import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import '@uirouter/angularjs';

import AppController from 'src/AppController';
import Users from 'src/users/Users';
import Votings from 'src/votings/Votings';
import AuthService from 'src/Auth.service';
import AuthHook from 'src/Auth.hook';

export default angular.module( 'advokat', [ 'ui.router', 'ngMaterial', Users.name, Votings.name ] )
.config(($mdIconProvider, $mdThemingProvider) => {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('red');
})
.service('AuthService', AuthService)
//.run(AuthHook)
.controller('AppController', AppController)
.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('state1', {
      url: "/state1",
      templateUrl: "partials/state1.html"
    })
    .state('state1.list', {
      url: "/list",
      templateUrl: "partials/state1.list.html",
      controller: function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
      }
    })
    .state('state2', {
      url: "/state2",
      templateUrl: "partials/state2.html"
    })
    .state('state2.list', {
      url: "/list",
      templateUrl: "partials/state2.list.html",
      controller: function($scope) {
        $scope.things = ["A", "Set", "Of", "Things"];
      }
    });
});
