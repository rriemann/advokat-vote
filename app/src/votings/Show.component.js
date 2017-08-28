import angular from 'angular';

class ShowController {
  constructor(voting) {
    this.$inject = ['voting'];
  }
}

export default {
  name: 'showPage',
  config: {
    // bindings: { pristineContact: '<' },
    templateUrl: 'src/votings/Show.html',
    bindings: {
      voting: '<',
    },
  },
};
