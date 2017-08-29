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
  // http://mcg.mbitson.com/#!?mcgpalette0=%233f51b5
  $mdThemingProvider.definePalette('advokat', {
    '50': 'f3e0e0',
    '100': 'e0b3b3',
    '200': 'cc8080',
    '300': 'b84d4d',
    '400': 'a82626',
    '500': '990000',
    '600': '910000',
    '700': '860000',
    '800': '7c0000',
    '900': '6b0000',
    'A100': 'ff9a9a',
    'A200': 'ff6767',
    'A400': 'ff3434',
    'A700': 'ff1a1a',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': [
      '50',
      '100',
      '200',
      'A100',
      'A200'
    ],
    'contrastLightColors': [
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      'A400',
      'A700'
    ]
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('advokat');
    // .accentPalette('red')
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
