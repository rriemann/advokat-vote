// Define the Angular 'votings' module

import WelcomeComponent from './Welcome.component';
import CreateComponent from './Create.component';

export default angular.module("votings", ['ngMaterial'])
.component(WelcomeComponent.name, WelcomeComponent.config)
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
});
