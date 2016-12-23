import reducer, { actions, selectors } from "./reducer";

it("updates search", () => {
  const state = reducer(undefined, actions.updateSearch({ search: "foo" }));

  expect(selectors.getSearch(state)).toBe("foo");
});

it("initializes with a list of empty notes", () => {
  const initial = reducer(undefined, {});

  expect(selectors.getNotes(initial)).toEqual([]);
});

it("initializes with notes not loaded", () => {
  const initial = reducer(undefined, {});

  expect(selectors.getNotesLoaded(initial)).toBe(false);
});

it("loads notes", () => {
  const after = reducer(undefined, {
    type: "LOAD_NOTES",
    payload: { notes: [
      { id: 1, title: "foo", body: "" },
      { id: 2, title: "bar", body: "" },
    ] },
  });

  expect(selectors.getNotes(after)).toEqual([
    { id: 1, title: "foo", body: "" },
    { id: 2, title: "bar", body: "" },
  ]);
  expect(selectors.getNotesLoaded(after)).toBe(true);
});

it("adds a note", () => {
  const before = reducer(undefined, {});
  const action = actions.addNote({ note: { title: "foo", id: 1, body: "" } });
  const after = reducer(before, action);

  expect(selectors.getNotes(after)).toEqual([{ id: 1, title: "foo", body: "" }]);
  expect(selectors.getActiveNote(after)).toEqual({ id: 1, title: "foo", body: "" });
});

it("updates a note body", () => {
  const before = reducer(undefined, actions.addNote({ note: { title: "foo", id: 1, body: "" } }));
  const action = actions.updateNoteBody({ id: 1, body: "bar" });
  const after = reducer(before, action);

  expect(selectors.getNotes(after)).toEqual([{ id: 1, title: "foo", body: "bar" }]);
});

it("selects an active note", () => {
  const before = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "" },
      { id: 2, title: "bar", body: "" },
    ],
  }));
  const after = reducer(before, actions.selectNote({ id: 2 }));

  expect(selectors.getActiveNote(after)).toEqual({ id: 2, title: "bar", body: "" });
});
