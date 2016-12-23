import { takeEvery } from "redux-saga";
import { put, call } from "redux-saga/effects";
import { actions } from "./reducer";
import * as api from "./repo";

const sagas = [];

sagas.push(function* () {
  yield* takeEvery("REQUEST_NOTES", function* () {
    const response = yield call(api.getNotes);
    yield put(actions.loadNotes(response));
  });
});

sagas.push(function* () {
  yield* takeEvery("REQUEST_ADD_NOTE", function* ({ payload }) {
    const response = yield call(api.addNote, payload);
    yield put(actions.addNote(response));
  });
});

sagas.push(function* () {
  yield* takeEvery("REQUEST_UPDATE_NOTE", function* ({ payload }) {
    const response = yield call(api.updateNote, payload);
    yield put(actions.updateNote(response));
  });
});

export default sagas;
