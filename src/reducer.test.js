import reducer, { addNote, getNotes, getActiveNote } from "./reducer";

it("initializes with a list of empty notes", () => {
  const initial = reducer(undefined, {});
  expect(getNotes(initial)).toEqual([]);
});

it("fills in fields for addNote action", () => {
  expect(addNote("foo")).toEqual({
    type: "addNote",
    payload: { title: "foo", id: 1, body: "" },
  });
});

it("adds a note", () => {
  const before = reducer(undefined, {});
  const action = {
    type: "addNote",
    payload: { title: "foo", id: 1, body: "" },
  };
  const after = reducer(before, action);

  expect(getNotes(after)).toEqual([{ id: 1, title: "foo", body: "" }]);
  expect(getActiveNote(after)).toEqual({ id: 1, title: "foo", body: "" });
});

it("updates a note body", () => {
  const before = reducer(undefined, {
    type: "addNote",
    payload: { title: "foo", id: 1, body: "" },
  });
  const action = {
    type: "updateNoteBody",
    payload: { id: 1, body: "bar" },
  };
  const after = reducer(before, action);

  expect(getNotes(after)).toEqual([{ id: 1, title: "foo", body: "bar" }]);
});

it("loads notes", () => {
  const after = reducer(undefined, {
    type: "loadNotes",
    payload: { notes: [
      { id: 1, title: "foo", body: "" },
      { id: 2, title: "bar", body: "" },
    ] },
  });

  expect(getNotes(after)).toEqual([
    { id: 1, title: "foo", body: "" },
    { id: 2, title: "bar", body: "" },
  ]);
});

it("selects an active note", () => {
  const before = reducer(undefined, {
    type: "loadNotes",
    payload: { notes: [
      { id: 1, title: "foo", body: "" },
      { id: 2, title: "bar", body: "" },
    ] },
  });
  const action = {
    type: "selectNote",
    payload: { id: 2 },
  };
  const after = reducer(before, action);

  expect(getActiveNote(after)).toEqual({ id: 2, title: "bar", body: "" });
});
