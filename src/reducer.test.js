import reducer, { actions, selectors } from "./reducer";

it("updates search", () => {
  const state = reducer(undefined, actions.updateSearch({ search: "foo" }));

  expect(selectors.getSearch(state)).toBe("foo");
});

it("updates visible notes based on search", () => {
  let state = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "", updatedAt: "3" },
      { id: 2, title: "bar", body: "", updatedAt: "2" },
      { id: 3, title: "foo", body: "bar", updatedAt: "1" },
    ],
  }));
  state = reducer(state, actions.updateSearch({ search: "b" }));

  expect(selectors.getVisibleNoteIds(state)).toEqual([2, 3]);
});

it("takes into account special characters when matching", () => {
  let state = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "" },
      { id: 2, title: "bar", body: "" },
    ],
  }));
  state = reducer(state, actions.updateSearch({ search: "b'" }));

  expect(selectors.getVisibleNoteIds(state)).toEqual([2]);
});

it("sets the isSearching flag", () => {
  const state = reducer(undefined, actions.setIsSearching());

  expect(selectors.getIsSearching(state)).toBe(true);
});

it("clears the isSearching flag", () => {
  let state = reducer(undefined, actions.setIsSearching());
  state = reducer(state, actions.clearIsSearching());

  expect(selectors.getIsSearching(state)).toBe(false);
});

it("initializes with a list of empty notes", () => {
  const state = reducer(undefined, {});

  expect(selectors.getNotes(state)).toEqual([]);
});

it("initializes with notes not loaded", () => {
  const state = reducer(undefined, {});

  expect(selectors.getNotesLoaded(state)).toBe(false);
});

it("loads notes and sorts them by updated time", () => {
  const state = reducer(undefined, actions.loadNotes({ notes: [
    { id: 1, title: "foo", body: "", updatedAt: "2" },
    { id: 2, title: "bar", body: "", updatedAt: "3" },
    { id: 3, title: "bar", body: "", updatedAt: "1" },
  ] }));

  expect(selectors.getNotes(state)).toEqual([
    { id: 2, title: "bar", body: "", updatedAt: "3" },
    { id: 1, title: "foo", body: "", updatedAt: "2" },
    { id: 3, title: "bar", body: "", updatedAt: "1" },
  ]);
  expect(selectors.getNotesLoaded(state)).toBe(true);
});

it("memoizes notes", () => {
  const state1 = reducer(undefined, {});
  const state2 = reducer(state1, {});

  expect(selectors.getNotes(state1)).toBe(selectors.getNotes(state2));
});

it("adds a note to the beginning of the list", () => {
  let state = reducer(undefined, actions.loadNotes({ notes: [
    { id: 1, title: "foo", body: "", updatedAt: "1" },
  ] }));
  state = reducer(state, actions.addNote({ note: { id: 2, title: "bar", body: "", updatedAt: "2" } }));

  expect(selectors.getNotes(state)).toEqual([
    { id: 2, title: "bar", body: "", updatedAt: "2" },
    { id: 1, title: "foo", body: "", updatedAt: "1" },
  ]);
});

it("updates a note", () => {
  let state = reducer(undefined, actions.loadNotes({ notes: [
    { id: 2, title: "bar", body: "", updatedAt: "2" },
    { id: 1, title: "foo", body: "", updatedAt: "1" },
  ] }));
  state = reducer(state, actions.updateNote({ note: { id: 1, title: "foo", body: "bar", updatedAt: "3" } }));

  expect(selectors.getNotes(state)).toEqual([
    { id: 1, title: "foo", body: "bar", updatedAt: "3" },
    { id: 2, title: "bar", body: "", updatedAt: "2" },
  ]);
});

it("deletes a note", () => {
  let state = reducer(undefined, actions.loadNotes({ notes: [
    { id: 1, title: "foo", body: "" },
  ] }));
  state = reducer(state, actions.deleteNote({ id: 1 }));

  expect(selectors.getNotes(state)).toEqual([]);
});

it("handles loading lists", () => {
  let state = reducer(undefined, actions.loadNotes({ notes: [
    { id: 1, title: "foo", type: "list", items: [{ value: "bar", checked: false }] }
  ] }));

  expect(selectors.getNotes(state)).toEqual([
    { id: 1, title: "foo", type: "list", items: [{ value: "bar", checked: false }] }
  ]);
  expect(selectors.getVisibleNoteIds(state)).toEqual([1]);
});
