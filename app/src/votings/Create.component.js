import angular from 'angular';

import * as utils from 'src/lib/utils';

class CreateController {
  constructor($rootScope, AuthService, $mdConstant, $state, $mdDialog, $q, $mdpTimePicker, VotingsDataService) {
    this.$inject = ['$rootScope', 'AuthService', '$mdConstant', '$state', '$mdDialog', '$q', '$mdpTimePicker', 'VotingsDataService'];
    this.$q = $q;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.VotingsDataService = VotingsDataService;

    this.customSeparatorKeys = [
      $mdConstant.KEY_CODE.ENTER,
      188, // because $mdConstant.KEY_CODE.COMMA doesn't work
    ]

    this.today = new Date();
    this.today.setHours(0,0,0,0); // otherwise datepicker doesn't accept today
    this.isSaving = false;

    // model for election form
    this.newModel = {
      start: new Date(),
      sponsor: AuthService.user.email,
      electorate: [],
      questions: [],
    };

    this.addQuestion();
  }

  addQuestion() {
    this.newModel.questions.push({
      answers: [],
      votes: 1,
    });
  }

  transformChipTitle(chip) {
    if(angular.isObject(chip)) {
      return chip;
    }

    return {title: chip};
  }

  isLastQuestion() {
    return this.newModel.questions.length == 1
  }

  removeQuestion(index) {
    return this.newModel.questions.splice(index, 1);
  }

  // add hashes in place, return reference
  hash(model) {
    // model.created = new Date()
    model.questions.forEach((question) => {
      question.answers.forEach((answer) => {
        delete answer._id;
        answer._id = utils.hash(angular.copy(answer));
      });
      delete question._id;
      question._id = utils.hash(angular.copy(question));
    });
    delete model._id;
    model._id = utils.hash(angular.copy(model));
    return model;
  }

  queryParticipants(searchText) {
    var emails = ['robert@riemann.cc', 'stephane.grumbach@inria.fr'];
    return this.$q(function(resolve, reject) {
      var results = emails.filter(function(email) {
          return email.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
      });
      resolve(emails);
    });
  }

  submit() {
    this.isSaving = true;
    console.log("submitting", this.newModel);
    this.newModel = this.hash(this.newModel);
    var newModel = angular.copy(this.newModel);
    console.log("newModel", newModel);
    this.VotingsDataService.addVoting(newModel);
    this.$state.go('show',{votingId: newModel._id});
    // submit (with promise?)
    /* nope
      console.log "couldn't submit: ", err
      $mdDialog.show(
        $mdDialog.alert()
        # .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Error')
        .textContent(err.message)
        .ariaLabel('Error Dialog')
        .ok('Close')
        # .targetEvent(ev)
    */
    // then:
    this.isSaving = false;
  }

}

export default {
  name: 'createPage',
  config: {
    // bindings: { pristineContact: '<' },
    controller: CreateController,
    templateUrl: 'src/votings/Create.html',
  },
};
