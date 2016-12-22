import { takeEvery } from "redux-saga";
import { put } from "redux-saga/effects";
import { addNote } from "./reducer";

const sagas = [];
let id = 1;

sagas.push(function* () {
  yield* takeEvery("REQUEST_ADD_NOTE", function* (action) {
    yield put(addNote({ note: { title: action.payload.title, body: "", id: id++ } }));
  })
})

export default sagas;
