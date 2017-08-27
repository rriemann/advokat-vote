// Define the Angular 'votings' module

import WelcomeComponent from './Welcome.component';

export default angular.module("votings", ['ngMaterial'])
.component(WelcomeComponent.name, WelcomeComponent.config)
.config(($stateProvider) => {
  $stateProvider.state('welcome', {
    url: "/",
    component: WelcomeComponent.name,
  })
});
