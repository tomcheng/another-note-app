import { put, call, takeEvery } from "redux-saga/effects";
import { actions } from "./reducer";
import * as api from "./repo";

const sagas = [];

sagas.push(function*() {
  yield takeEvery("REQUEST_NOTES", function*() {
    const response = yield call(api.getNotes);
    yield put(actions.loadNotes(response));
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_ADD_NOTE", function*({ payload }) {
    const response = yield call(api.addNote, payload);
    yield put(actions.addNote(response));
    if (payload.callback) {
      yield call(payload.callback, response);
    }
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_ADD_LIST", function*({ payload }) {
    const response = yield call(api.addList, payload);
    yield put(actions.addNote(response));
    if (payload.callback) {
      yield call(payload.callback, response);
    }
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_UPDATE_NOTE", function*({ payload }) {
    const response = yield call(api.updateNote, payload);
    yield put(actions.updateNote(response));
    if (payload.callback) {
      yield call(payload.callback);
    }
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_DELETE_NOTE", function*({ payload }) {
    yield call(api.deleteNote, payload);
    yield put(actions.deleteNote(payload));
    if (payload.callback) {
      yield call(payload.callback);
    }
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_CONVERT_NOTE_TO_LIST", function*({ payload }) {
    const response = yield call(api.convertToList, payload);
    yield put(actions.updateNote(response));
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_ADD_LIST_ITEM", function*({ payload }) {
    const response = yield call(api.addListItem, payload);
    yield put(actions.updateNote(response));
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_UPDATE_LIST_ITEM", function*({ payload }) {
    const response = yield call(api.updateListItem, payload);
    yield put(actions.updateNote(response));
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_CHECK_LIST_ITEM", function*({ payload }) {
    const response = yield call(api.checkListItem, payload);
    yield put(actions.updateNote(response));
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_UNCHECK_LIST_ITEM", function*({ payload }) {
    const response = yield call(api.uncheckListItem, payload);
    yield put(actions.updateNote(response));
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_DELETE_LIST_ITEM", function*({ payload }) {
    const response = yield call(api.deleteListItem, payload);
    yield put(actions.updateNote(response));
  });
});

sagas.push(function*() {
  yield takeEvery("REQUEST_REPLACE_LIST", function*({ payload }) {
    const response = yield call(api.replaceList, payload);
    yield put(actions.updateNote(response));
  });
});

export default sagas;
