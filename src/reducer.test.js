import reducer, { actions, selectors } from "./reducer";

it("updates search", () => {
  const state = reducer(undefined, actions.updateSearch({ search: "foo" }));

  expect(selectors.getSearch(state)).toBe("foo");
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
  const state = reducer(undefined, actions.addNote({ note: { title: "foo", id: 1, body: "" } }));

  expect(selectors.getNotes(state)).toEqual([{ id: 1, title: "foo", body: "" }]);
  expect(selectors.getActiveNote(state)).toEqual({ id: 1, title: "foo", body: "" });
});

it("updates a note body", () => {
  const before = reducer(undefined, actions.addNote({ note: { title: "foo", id: 1, body: "" } }));
  const action = actions.updateNoteBody({ id: 1, body: "bar" });
  const state = reducer(before, action);

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

  expect(selectors.getActiveNote(state)).toEqual({ id: 2, title: "bar", body: "" });
});