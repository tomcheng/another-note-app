import reducer, { actions, selectors } from "./reducer";

it("updates search", () => {
  const state = reducer(undefined, actions.updateSearch({ search: "foo" }));

  expect(selectors.getSearch(state)).toBe("foo");
});

it("clears selected note when updating from delete", () => {
  let state = reducer(undefined, actions.loadNotes({
    notes: [ { id: 1, title: "foo", body: "" } ],
  }));
  state = reducer(state, actions.selectNote({ id: 1 }));
  state = reducer(state, actions.deleteSearch({ search: "f" }));

  expect(selectors.getSearch(state)).toBe("f");
  expect(selectors.getSelectedNote(state)).toBeFalsy();
});

it("selects a note based on search", () => {
  const before = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "" },
      { id: 2, title: "bar", body: "" },
    ],
  }));
  const state = reducer(before, actions.updateSearch({ search: "b" }));

  expect(selectors.getSelectedNote(state)).toEqual({ id: 2, title: "bar", body: "" });
});

it("initializes with a list of empty notes", () => {
  const state = reducer(undefined, {});

  expect(selectors.getNotes(state)).toEqual([]);
});

it("initializes with notes not loaded", () => {
  const state = reducer(undefined, {});

  expect(selectors.getNotesLoaded(state)).toBe(false);
});

it("loads notes", () => {
  const state = reducer(undefined, actions.loadNotes({ notes: [
    { id: 1, title: "foo", body: "" },
    { id: 2, title: "bar", body: "" },
  ] }));

  expect(selectors.getNotes(state)).toEqual([
    { id: 1, title: "foo", body: "" },
    { id: 2, title: "bar", body: "" },
  ]);
  expect(selectors.getNotesLoaded(state)).toBe(true);
});

it("adds a note", () => {
  const state = reducer(undefined, actions.addNote({ note: { id: 1, title: "foo", body: "" } }));

  expect(selectors.getNotes(state)).toEqual([{ id: 1, title: "foo", body: "" }]);
  expect(selectors.getSelectedNote(state)).toEqual({ id: 1, title: "foo", body: "" });
});

it("updates a note", () => {
  const before = reducer(undefined, actions.addNote({ note: { id: 1, title: "foo", body: "" } }));
  const state = reducer(before, actions.updateNote({ note: { id: 1, title: "foo", body: "bar" } }));

  expect(selectors.getNotes(state)).toEqual([{ id: 1, title: "foo", body: "bar" }]);
});

it("selects an active note", () => {
  const before = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "" },
      { id: 2, title: "bar", body: "" },
    ],
  }));
  const state = reducer(before, actions.selectNote({ id: 2 }));

  expect(selectors.getSelectedNote(state)).toEqual({ id: 2, title: "bar", body: "" });
});

it("sets the editing flag", () => {
  const state = reducer(undefined, actions.editNote());

  expect(selectors.getIsEditing(state)).toBe(true);
});
