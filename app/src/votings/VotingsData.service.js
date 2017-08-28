/**
 * This service store votings
 */
export default class AuthService {
  constructor($rootScope, $q, localStorageService) {
    this.$inject = ['$rootScope', '$q', 'localStorageService'];
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.localStorageService = localStorageService;

    this.votings = localStorageService.get("votings") || {};
  }

  addVoting(voting) {
    // is it new?
    if(this.votings[voting._id]) {
      return;
    }

    this.votings[voting._id] = voting;
    this.localStorageService.set("votings", this.votings);
  }



}
