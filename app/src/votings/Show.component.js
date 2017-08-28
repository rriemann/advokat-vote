import angular from 'angular';

class ShowController {
  constructor(VotingsDataService) {
    this.$inject = ['VotingsDataService'];
    this.input = {};
    this.save = VotingsDataService.save;
  }

  isChecked(question, answer) {
    this.input[question._id] = this.input[question._id] || [];
    return (this.input[question._id]).includes(answer._id);
  }

  toggleCheck(question, answer, votes) {
    console.log(question, answer, votes);
    this.input[question._id] = this.input[question._id] || [];
    let index = this.input[question._id].indexOf(answer._id)
    if(index > -1) {
      // remove
      this.input[question._id].splice(index, 1);
    } else {
      // add
      if(this.input[question._id].length < votes) { // BUG ng-click triggered of disabled elements
        this.input[question._id].push(answer._id)
      }
    }
  }

  isDisabled(question, answer, votes){
    this.input[question._id] = this.input[question._id] || [];
    return !this.isChecked(question, answer) && this.input[question._id].length == votes
  }

  submit() {
    // console.log("valid?", this.form.$valid);
    this.voting.input = this.input;
    console.log(this.input);
  }

  reset() {
    this.input = {};
  }
}

export default {
  name: 'showPage',
  config: {
    // bindings: { pristineContact: '<' },
    templateUrl: 'src/votings/Show.html',
    controller: ShowController,
    bindings: {
      voting: '<',
    },
  },
};
