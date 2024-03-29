import * as api from "./repo";
import moment from "moment";
import defaults from "lodash/defaults";

const addNoteDefaults = note =>
  defaults(note, {
    type: "note",
    body: "",
    createdAt: moment().format(),
    updatedAt: moment().format()
  });

const addListDefaults = list =>
  defaults(list, {
    type: "list",
    items: {},
    order: [],
    hideChecked: true,
    createdAt: moment().format(),
    updatedAt: moment().format()
  });

beforeEach(() => {
  localStorage.clear();
  api.clearNotes__forTestingOnly();
});

it("creates a default note if no notes are saved", () => {
  localStorage.clear();
  expect(api.getNotes().notes.length).toBe(1);
});

it("adds a note", () => {
  const response = api.addNote({ title: "foo" });

  expect(api.getNotes()).toEqual({
    notes: [addNoteDefaults({ id: 1, title: "foo" })]
  });
  expect(response).toEqual({ note: addNoteDefaults({ id: 1, title: "foo" }) });
});

it("adds a list", () => {
  const response = api.addList({ title: "foo" });

  expect(api.getNotes()).toEqual({
    notes: [addListDefaults({ id: 1, title: "foo" })]
  });
  expect(response).toEqual({ note: addListDefaults({ id: 1, title: "foo" }) });
});

it("save multiple notes", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });

  expect(api.getNotes()).toEqual({
    notes: [
      addNoteDefaults({ id: 1, title: "foo" }),
      addNoteDefaults({ id: 2, title: "bar" })
    ]
  });
});

it("increments ids properly", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });
  api.addNote({ title: "baz" });

  expect(api.getNotes()).toEqual({
    notes: [
      addNoteDefaults({ id: 1, title: "foo" }),
      addNoteDefaults({ id: 2, title: "bar" }),
      addNoteDefaults({ id: 3, title: "baz" })
    ]
  });
});

it("updates a note", () => {
  api.addNote({ title: "foo" });
  const response = api.updateNote({ id: 1, updates: { body: "bar" } });

  expect(api.getNotes()).toEqual({
    notes: [addNoteDefaults({ id: 1, title: "foo", body: "bar" })]
  });
  expect(response).toEqual({
    note: addNoteDefaults({ id: 1, title: "foo", body: "bar" })
  });
});

it("deletes a note", () => {
  api.addNote({ title: "foo" });
  api.deleteNote({ id: 1 });
  expect(api.getNotes()).toEqual({ notes: [] });
});

it("converts a note to a list", () => {
  api.addNote({ title: "foo" });
  api.updateNote({ id: 1, updates: { body: "bar" } });
  const response = api.convertToList({ id: 1 });

  expect(response).toEqual({
    note: addListDefaults({
      id: 1,
      title: "foo",
      items: { 1: { id: 1, checked: false, value: "bar", checkedAt: null } },
      order: [1]
    })
  });
});

it("converts an empty note to a list with no items", () => {
  api.addNote({ title: "foo" });
  const response = api.convertToList({ id: 1 });

  expect(response).toEqual({
    note: addListDefaults({
      id: 1,
      title: "foo",
      updatedAt: moment().format(),
      items: {}
    })
  });
});

it("adds a list item", () => {
  api.addList({ title: "foo" });
  const response = api.addListItem({ listId: 1, value: "bar" });

  expect(response).toEqual({
    note: addListDefaults({
      id: 1,
      title: "foo",
      items: { 1: { id: 1, checked: false, value: "bar", checkedAt: null } },
      order: [1]
    })
  });
});

it("does not duplicate ids when adding a list item", () => {
  api.addList({ title: "foo" });
  api.addListItem({ listId: 1, value: "bar" });
  api.addListItem({ listId: 1, value: "baz" });
  api.deleteListItem({ listId: 1, itemId: 1 });
  const response = api.addListItem({ listId: 1, value: "qux" });

  expect(response).toEqual({
    note: addListDefaults({
      id: 1,
      title: "foo",
      items: {
        2: { id: 2, checked: false, value: "baz", checkedAt: null },
        3: { id: 3, checked: false, value: "qux", checkedAt: null }
      },
      order: [2, 3]
    })
  });
});

it("updates a list item", () => {
  api.addList({ title: "foo" });
  api.addListItem({ listId: 1, value: "bar" });
  const response = api.updateListItem({
    listId: 1,
    itemId: 1,
    updates: { value: "baz" }
  });

  expect(response).toEqual({
    note: addListDefaults({
      id: 1,
      title: "foo",
      items: { 1: { id: 1, checked: false, value: "baz", checkedAt: null } },
      order: [1]
    })
  });
});

it("checks a list item", () => {
  api.addList({ title: "foo" });
  api.addListItem({ listId: 1, value: "bar" });
  api.addListItem({ listId: 1, value: "baz" });
  const response = api.checkListItem({ listId: 1, itemId: 1 });

  expect(response).toEqual({
    note: addListDefaults({
      id: 1,
      title: "foo",
      items: {
        1: { id: 1, checked: true, value: "bar", checkedAt: moment().format() },
        2: { id: 2, checked: false, value: "baz", checkedAt: null }
      },
      order: [2]
    })
  });
});

it("unchecks a list item", () => {
  api.addList({ title: "foo" });
  api.addListItem({ listId: 1, value: "bar" });
  api.addListItem({ listId: 1, value: "baz" });
  api.checkListItem({ listId: 1, itemId: 1 });
  const response = api.uncheckListItem({ listId: 1, itemId: 1 });

  expect(response).toEqual({
    note: addListDefaults({
      id: 1,
      title: "foo",
      items: {
        1: { id: 1, checked: false, value: "bar", checkedAt: null },
        2: { id: 2, checked: false, value: "baz", checkedAt: null }
      },
      order: [2, 1]
    })
  });
});

it("deletes a list item", () => {
  api.addList({ title: "foo" });
  api.addListItem({ listId: 1, value: "bar" });
  const response = api.deleteListItem({ listId: 1, itemId: 1 });

  expect(response).toEqual({
    note: addListDefaults({
      id: 1,
      title: "foo",
      items: {},
      order: []
    })
  });
});

it("replaces a list", () => {
  api.addList({ title: "foo" });
  api.addListItem({ listId: 1, value: "bar" });
  const response = api.replaceList({
    id: 1,
    list: addListDefaults({ id: 1, title: "foo" })
  });

  expect(response).toEqual({ note: addListDefaults({ id: 1, title: "foo" }) });
});
