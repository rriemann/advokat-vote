/**
 * Main App Controller for the Angular Material Starter App
 * @param UsersDataService
 * @param $mdSidenav
 * @constructor
 */
function AppController(UsersDataService, $mdSidenav) {
  var self = this;

  self.selectedVoting     = null;
  self.votings        = [ ];
  self.selectVoting   = selectVoting;
  self.toggleList   = toggleVotingsList;
  self.openAccountMenu = openAccountMenu;

  // Load all registered users

  UsersDataService
        .loadAllUsers()
        .then( function( users ) {
          self.users    = [].concat(users);
          self.selected = users[0];
        });

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
    self.selected = angular.isNumber(voting) ? $scope.users[voting] : voting;
  }
}

export default [ 'UsersDataService', '$mdSidenav', AppController ];
