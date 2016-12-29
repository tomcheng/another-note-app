import reducer, { actions, selectors } from "./reducer";

it("updates search", () => {
  let state = reducer(undefined, actions.selectNextNote());
  state = reducer(state, actions.updateSearch({ search: "foo" }));

  expect(selectors.getSearch(state)).toBe("foo");
  expect(selectors.getIsNavigating(state)).toBe(false);
});

it("clears selected note when updating from delete", () => {
  let state = reducer(undefined, actions.loadNotes({
    notes: [ { id: 1, title: "foo", body: "" } ],
  }));
  state = reducer(state, actions.selectNote({ id: 1 }));
  state = reducer(state, actions.selectNextNote());
  state = reducer(state, actions.deleteSearch({ search: "f" }));

  expect(selectors.getSearch(state)).toBe("f");
  expect(selectors.getSelectedNote(state)).toBeFalsy();
  expect(selectors.getIsNavigating(state)).toBe(false);
});

it("does not select a note based on search", () => {
  let state = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "" },
      { id: 2, title: "bar", body: "" },
    ],
  }));
  state = reducer(state, actions.updateSearch({ search: "b" }));

  expect(selectors.getSelectedNote(state)).toBeFalsy();
});

it("keeps selected note when clearing search", () => {
  let state = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "" },
    ],
  }));
  state = reducer(state, actions.selectNote({ id: 1 }));
  state = reducer(state, actions.clearSearch());

  expect(selectors.getSearch(state)).toBe("");
  expect(selectors.getSelectedNote(state)).toEqual({ id: 1, title: "foo", body: "" });
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

  expect(selectors.getSelectedNote(state)).toBeFalsy();
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

it("loads UI settings", () => {
  const state = reducer(undefined, actions.loadUISettings({ listHeight: 100 }));

  expect(selectors.getListHeight(state)).toBe(100);
  expect(selectors.getUISettingsLoaded(state)).toBe(true);
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
  expect(selectors.getSelectedNote(state)).toEqual({ id: 2, title: "bar", body: "", updatedAt: "2" });
});

it("sets editing note body flag after adding a note", () => {
  const state = reducer(undefined, actions.addNote({ note: { id: 1, type: "note" } }));

  expect(selectors.getIsEditingNoteBody(state)).toEqual(true);
});

it("sets adding item flag after adding a list", () => {
  const state = reducer(undefined, actions.addNote({ note: { id: 1, type: "list" } }));

  expect(selectors.getIsEditingNoteBody(state)).toEqual(false);
  expect(selectors.getIsAddingListItem(state)).toEqual(true);
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

it("selects a note", () => {
  let state = reducer(undefined, actions.loadNotes({ notes: [
    { id: 1, title: "foo", body: "" },
    { id: 2, title: "bar", body: "" },
  ] }));
  state = reducer(state, actions.selectNote({ id: 2 }));

  expect(selectors.getSelectedNote(state)).toEqual({ id: 2, title: "bar", body: "" });
});

it("deselects a note", () => {
  let state = reducer(undefined, actions.loadNotes({ notes: [
    { id: 1, title: "foo", body: "" },
  ] }));
  state = reducer(state, actions.selectNote({ id: 1 }));
  state = reducer(state, actions.deselectNote());

  expect(selectors.getSelectedNote(state)).toBeFalsy();
});

it("sets the editing flag", () => {
  const state = reducer(undefined, actions.setEditing());

  expect(selectors.getIsEditing(state)).toBe(true);
});

it("cancels the editing flag", () => {
  let state = reducer(undefined, actions.setEditing());
  state = reducer(state, actions.cancelEditing());

  expect(selectors.getIsEditing(state)).toBe(false);
});

it("sets the editing body flag", () => {
  const state = reducer(undefined, actions.setEditNoteBody());

  expect(selectors.getIsEditingNoteBody(state)).toBe(true);
  expect(selectors.getIsEditing(state)).toBe(true);
});

it("cancels the editing body flag", () => {
  let state = reducer(undefined, actions.setEditNoteBody());
  state = reducer(state, actions.cancelEditNoteBody());

  expect(selectors.getIsEditingNoteBody(state)).toBe(false);
});

it("sets the add list item flag", () => {
  const state = reducer(undefined, actions.setAddListItem());

  expect(selectors.getIsAddingListItem(state)).toBe(true);
  expect(selectors.getIsEditing(state)).toBe(true);
});

it("cancels the add list item flag", () => {
  let state = reducer(undefined, actions.setAddListItem());
  state = reducer(state, actions.cancelAddListItem());

  expect(selectors.getIsAddingListItem(state)).toBe(false);
});

it("selects the first visible note as next if none is selected", () => {
  let state = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "" },
    ],
  }));
  state = reducer(state, actions.selectNextNote());

  expect(selectors.getSelectedNote(state)).toEqual({ id: 1, title: "foo", body: "" });
});

it("selects the next visible note if a note is selected", () => {
  let state = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "", updatedAt: "2" },
      { id: 2, title: "bar", body: "", updatedAt: "1" },
    ],
  }));
  state = reducer(state, actions.selectNote({ id: 1 }));
  state = reducer(state, actions.selectNextNote());

  expect(selectors.getSelectedNote(state)).toEqual({ id: 2, title: "bar", body: "", updatedAt: "1" });
});

it("it selects the previous note", () => {
  let state = reducer(undefined, actions.loadNotes({
    notes: [
      { id: 1, title: "foo", body: "", updatedAt: "2" },
      { id: 2, title: "bar", body: "", updatedAt: "1" },
    ],
  }));
  state = reducer(state, actions.selectNote({ id: 2 }));
  state = reducer(state, actions.selectPreviousNote());

  expect(selectors.getSelectedNote(state)).toEqual({ id: 1, title: "foo", body: "", updatedAt: "2" });
});

it("it sets isNavigating when selecting next", () => {
  let state = reducer(undefined, actions.updateSearch({ search: "foo" }));
  state = reducer(state, actions.selectNextNote());

  expect(selectors.getIsNavigating(state)).toEqual(true);
});

it("it sets isNavigating when selecting previous", () => {
  let state = reducer(undefined, actions.updateSearch({ search: "foo" }));
  state = reducer(state, actions.selectPreviousNote());

  expect(selectors.getIsNavigating(state)).toEqual(true);
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
