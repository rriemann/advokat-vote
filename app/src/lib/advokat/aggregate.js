export default class Aggregate {
  static initClass() {

    this.fromObject = this.prototype.copy;
  }

  // create a new aggregate from a ballot object
  //
  // @param {Object} vote representation of the ballot
  // @example How a ballot could look like
  //   { bfa2013d3480: 'a93efd302b20c2da',
  //     question_id:  answer_id }
  constructor(ballot) {
    // data storage for questions
    //
    // We use arrays to keep it sortable
    // @example
    //   [
    //    { question_id: [
    //                    {answer_id: counter},
    //                    {answer_id_2: counter}
    //                   ]
    //    },
    //    { question_id_2: [] }
    //   ]
    this.questions = [];

    if (ballot != null) {
      // we assume that question_id is unique in ballot and
      // answer_id unique in question_id
      for (let question_id in ballot) {
        const answer_id = ballot[question_id];
        const answer = {};
        answer[answer_id] = 1; // set counter to 1
        const question = {};
        question[question_id] = [answer];
        this.questions.push(question);
      }

      this._sort();
    }
  }

  // sort the questions object
  // @private
  _sort() {
    for (let question of Array.from(this.questions)) {
      for (let question_id in question) {
        const answer_array = question[question_id];
        answer_array.sort();
      }
    }
    return this.questions.sort();
  }

  // implement virtual methods

  toObject() {
    this._sort();
    return {questions: this.questions};
  }

  dataIterator(callback) {
    return Array.from(this.questions).map((question) =>
      (() => {
        const result = [];
        for (var question_id in question) {
          const answers = question[question_id];
          result.push(Array.from(answers).map((answer) =>
            (() => {
              const result1 = [];
              for (let answer_id in answer) {
                const count = answer[answer_id];
                result1.push(callback(question_id, answer_id, count));
              }
              return result1;
            })()));
        }
        return result;
      })());
  }

  static union(a,b) {
    let answer_id, count, question_id, answer;
    if (!(a instanceof Aggregate) || !(b instanceof Aggregate)) { throw Error(); }

    const newAggregate = new Aggregate();

    const data = {}; // object only
    for (let questions of [a.questions, b.questions]) {
      for (let question of Array.from(questions)) {
        for (question_id in question) {
          const answers = question[question_id];
          if (data[question_id] == null) { data[question_id] = {}; }
          for (answer of Array.from(answers)) {
            for (answer_id in answer) {
              count = answer[answer_id];
              if (data[question_id][answer_id] == null) { data[question_id][answer_id] = 0; }
              data[question_id][answer_id] += count;
            }
          }
        }
      }
    }

    // recomposition to sortable data format
    newAggregate.questions = (() => {
      const result = [];
      for (question_id in data) {
        answer = data[question_id];
        const question_obj = {};
        question_obj[question_id] = (() => {
          const result1 = [];
          for (answer_id in answer) {
            count = answer[answer_id];
            const answer_obj = {};
            answer_obj[answer_id] = count;
            result1.push(answer_obj);
          }
          return result1;
        })();
        question_obj[question_id].sort(); // sort answers
        result.push(question_obj);
      }
      return result;
    })();

    newAggregate.questions.sort(); // sort questions

    return newAggregate;
  }

  static copy(anAggregate) {
    const newAggregate = new Aggregate();
    newAggregate.questions = _.cloneDeep(anAggregate.questions);

    return newAggregate;
  }

  static equal(a,b) {
    if (!(a instanceof Aggregate) || !(b instanceof Aggregate)) { throw Error(); }

    return _.isEqual(a, b);
  }

  isSubsetFrom(otherAggregate) {
    // We iterate over this object and check that every value is represented
    // in the otherAggregate.
    for (let question of Array.from(this.questions)) {
      for (var question_id in question) {
        const answers = question[question_id];
        const otherQuestion = _.find(otherAggregate.questions, otherQuestion => otherQuestion[question_id] != null);
        if (otherQuestion == null) {
          return false; // otherAggregate is missing a question
        }
        for (let answer of Array.from(answers)) {
          for (var answer_id in answer) {
            const count = answer[answer_id];
            const otherAnswer = _.find(otherQuestion[question_id], otherAnswer => otherAnswer[answer_id] != null);
            if (otherAnswer == null) {
              return false; // otherQuestion is misssing an answer
            }
            if (otherAnswer[answer_id] < count) {
              return false; // otherAnswer has votes missing
            }
          }
        }
      }
    }
    return true;
  }

  // gives number of votes in the aggregate
  //
  // @depreciated
  // @note This should not be part of the aggregate, but of the app frontend code
  // @return {Number} total number of votes
  voteCount() {
    let totalCount = 0;
    for (let question of Array.from(this.questions)) {
      for (let question_id in question) {
        const answers = question[question_id];
        for (let answer of Array.from(answers)) {
          for (let answer_id in answer) {
            const count = answer[answer_id];
            totalCount += count;
          }
        }
      }
    }
    return totalCount;
  }

  // provides a hash based on the #toObject export
  //
  // @return {String} hash
  hash() {
    return Crypto.hash(this.toObject());
  }

  // export the entire Aggregate state to a json string
  //
  // @return {JSON} json string
  toJson() {
    return JSON.stringify(this.toObject());
  }
}
Aggregate.initClass();
