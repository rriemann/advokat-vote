/**
 * This service store votings
 */
export default class VotingsDataService {
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

    this.votings[voting._id] = {
      _id: voting._id,
      description: voting,
    }
    this.localStorageService.set("votings", this.votings);
  }

  save() {
    this.localStorageService.set("votings", this.votings);
  }



}
