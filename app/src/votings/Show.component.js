import angular from 'angular';

import {API_ENDPOINT} from 'src/app.config';

import SignalClient from 'src/lib/signal-client';
import {Node, storage} from 'kad';
import WebRTC from 'src/lib/transport/index';

class ShowController {
  constructor(VotingsDataService, $http, $timeout, $q, AuthService) {
    this.$inject = ['VotingsDataService', '$http', '$timeout', '$q', 'AuthService'];
    this.input = {};
    this.VotingsDataService = VotingsDataService;
    this.$http = $http;
    this.$timeout = $timeout;
    this.$q = $q;
    this.AuthService = AuthService;

    this.logs = [];
  }

  $onInit() {
    if(this.voting.input) {
      this.$timeout(() => this.startVote());
    }
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
    this.VotingsDataService.save();
    this.$timeout(() => this.startVote());
  }

  reset() {
    this.input = {};
  }

  createNode(nick) {
    // assume that websocket is already conected
    if(this.signaller) {
      return reject("already signaller");
    }

    this.signaller = new SignalClient(nick);
    console.log('createNode with id', nick);

    this.node = new Node({
      transport: new WebRTC(new WebRTC.Contact({
        nick: nick
      }), { signaller: this.signaller }),
      storage: new storage.LocalStorage(nick)
    });


    let data = {
      _id: nick,
      // some other connecting information may required by other protocols, e.g. port
    };
    this.$http.put(API_ENDPOINT+`/api/tracker/${this.voting._id}/random`, data,
    {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).then((data) => {
          console.log("tracker", data);
          return !data.data ? false : JSON.parse(data.data);
    }).then((contact) => {
      this.$q((resolve,reject) => {
        if(!contact) {
          console.info("ommit connect");
          return resolve();
        }
        this.node.connect({ nick: contact._id }, function(err) {
          if(err) {
            console.error(err);
            return reject();
          }
          console.info("Connected!");
          resolve();
        });
      }).then(() => {
        var timeout = (this.voting.description.start.getTime() - (new Date()).getTime());
        if (timeout < 0) timeout = 0;
        this.$timeout(() => {
          this.startAggregation();
        }, timeout);
      });
    });
  }

  startAggregation() {
    return 4;
  }

  startVote() {
    var registerLog = []
    this.logs.push({
        title: "Registration",
        entries: registerLog
    });
    registerLog.push("Ballot prepared. Require now authorisation.");
    let nick = this.AuthService.user.email;
    this.createNode(nick);
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
