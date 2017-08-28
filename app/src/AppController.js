/**
 * Main App Controller for the Angular Material Starter App
 * @param UsersDataService
 * @param $mdSidenav
 * @constructor
 */
function AppController(AuthService, $mdSidenav, VotingsDataService) {
  var self = this;

  self.selectedVoting     = null;
  self.votings        = [ ];
  self.selectVoting   = selectVoting;
  self.toggleList   = toggleVotingsList;
  self.openAccountMenu = openAccountMenu;
  self.AuthService = AuthService;
  self.VotingsDataService = VotingsDataService;

  self.votings = VotingsDataService.votings;

  // *********************************
  // Internal methods
  // *********************************

  /**
   * Hide or Show the 'left' sideNav area
   */
  function toggleVotingsList() {
    $mdSidenav('left').toggle();
  }

  function openAccountMenu($mdMenu, $event) {
    $mdMenu.open($event);
  }

  /**
   * Select the current avatars
   * @param menuId
   */
  function selectVoting( voting ) {
    // var selected = angular.isNumber(voting) ? self.votings[voting] : voting;
    console.log("clicked", voting);
  }
}

export default [ 'AuthService', '$mdSidenav', 'VotingsDataService', AppController ];
