
export default {
  name: 'welcomePage',
  config: {
    // bindings: { pristineContact: '<' },

    // controller: EditContactController,

    templateUrl: 'src/votings/Welcome.html',
    controller: function($stateParams) {
      this.message = $stateParams.message;
    },
    controllerAs: 'ctrl',
  },
};
