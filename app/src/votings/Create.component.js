class CreateController {
  constructor($rootScope, AuthService, $mdConstant, $state, $mdDialog) {
    this.$inject = ['$rootScope', 'AuthService', '$mdConstant', '$state', '$mdDialog'];

    this.customSeparatorKeys = [
      $mdConstant.KEY_CODE.ENTER,
      188, // because $mdConstant.KEY_CODE.COMMA doesn't work
    ]

    this.today = new Date();
    this.today.setHours(0,0,0,0); // otherwise datepicker doesn't accept today
    this.isSaving = false;

    // model for election form
    this.newModel = {
      sponsor: AuthService.user.email,
      electorate: [],
      questions: [],
    };

    addQuestion();
  }

  addQuestion() {
    this.newModel.questions.push({
      answers: [],
      votes: 1,
    });
    console.log(2+4);
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
        answer._id = helpers.hash(answer)
      });
      delete question._id;
      question._id = helpers.hash(question);
    });
    delete model._id;
    model._id = helpers.hash(model);
    return model;
  }
  /*
  @queryParticipants = (searchText) ->
    @queryPromise ||= $meteor.call 'notifierQueryParticipants', searchText
    .then (data) =>
      @queryPromise = undefined
      data

  @submit = ->
    @isSaving = true
    console.log "submitting", @newModel
    @newModel = @hash(@newModel)
    $meteor.call 'notifierCreate', @newModel._id, angular.copy(@newModel)
    .then ->
      $state.go 'index'
    , (err) =>
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
      ).then =>
        @isSaving = false

  return
  */

}

export default {
  name: 'createPage',
  config: {
    // bindings: { pristineContact: '<' },

    controller: CreateController,
    conrollerAs: 'ctrl',

    templateUrl: 'src/votings/Create.html',
  },
};
