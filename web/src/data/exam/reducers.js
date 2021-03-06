import * as ActionTypes from '@/data/rootActionTypes';
import { combineReducers } from 'redux';
import update from 'immutability-helper';

const initExamState = {
  classTitle: '',
  testName: '',
  testTime: '',
  current: 0,
  last: 0,
};

const info = (state = initExamState, action = {}) => {
  switch (action.type) {
    case ActionTypes.GET_EXAM:
      return {
        ...action.info,
        current: 0,
        last: action.questions.length,
      };

    case ActionTypes.NEXT_QUESTION:
      return {
        ...state,
        current: state.current + 1 >= state.last ? state.current : state.current + 1,
      };

    case ActionTypes.PREV_QUESTION:
      return {
        ...state,
        current: state.current - 1 >= 0 ? state.current - 1 : 0,
      };
    default:
      return state;
  }
};

const questions = (state = [], action = {}) => {
  switch (action.type) {
    case ActionTypes.MARK_ANSWER:
      if (action.value) {
        return update(state, {
          [action.idx]: {
            answer: { $push: [action.answerIdx] },
          },
        });
      }

      return state.map((question, qIdx) => {
        if (qIdx !== action.idx) return question;

        return {
          ...question,
          answer: question.answer.filter((item) => item !== action.answerIdx),
        };
      });

    case ActionTypes.GET_EXAM:
      return action.questions;

    default:
      return state;
  }
};

export default combineReducers({
  info,
  questions,
});
