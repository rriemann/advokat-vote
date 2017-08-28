import angular from 'angular';

import * as utils from 'src/lib/utils';

class ShowController {
  constructor($rootScope, AuthService, $state, $mdDialog, $q, VotingsDataService) {
    this.$inject = ['$rootScope', 'AuthService', '$state', '$mdDialog', '$q', 'VotingsDataService'];
    this.$q = $q;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.VotingsDataService = VotingsDataService;
  }

}

export default {
  name: 'showPage',
  config: {
    // bindings: { pristineContact: '<' },
    controller: ShowController,
    templateUrl: 'src/votings/Show.html',
    bindings: {
      voting: '<',
    },
  },
};
