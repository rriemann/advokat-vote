// Define the Angular 'votings' module

import WelcomeComponent from './Welcome.component';
import CreateComponent from './Create.component';
import ShowComponent from './Show.component';
import VotingsDataService from './VotingsData.service';

import ngTimePicker from 'angular-material-time-picker';

import LocalStorageModule from 'angular-local-storage';
// import ngMessages from 'angular-messages';
import 'angular-messages';

export default angular.module("votings", ['ngMaterial', ngTimePicker, 'ngMessages', LocalStorageModule])
.component(WelcomeComponent.name, WelcomeComponent.config)
.service("VotingsDataService", VotingsDataService)
.config((localStorageServiceProvider) => {
  // https://github.com/grevory/angular-local-storage#angular-local-storage
  localStorageServiceProvider
  .setPrefix('avokat-vote')
  // .setStorageType('sessionStorage')
  .setStorageType('localStorage');
  // .setNotify(true, true)
})
.config(($stateProvider) => {
  $stateProvider.state('welcome', {
    url: "/",
    component: WelcomeComponent.name,
    params: {
      message: null,
    },
  });
})
.component(CreateComponent.name, CreateComponent.config)
.config(($stateProvider) => {
  $stateProvider.state('create', {
    url: '/create',
    component: CreateComponent.name,
    data: { requiresAuth: true },
  });
})
.component(ShowComponent.name, ShowComponent.config)
.config(($stateProvider) => {
  $stateProvider.state('show', {
    url: '/show/:votingId',
    component: ShowComponent.name,
    // // data: { requiresAuth: true },
    resolve: {
      voting: function($transition$, VotingsDataService) {
        return VotingsDataService.votings[$transition$.params().votingId];
      }
    },
  });
});
