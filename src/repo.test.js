import * as api from "./repo";
import moment from "moment";
import defaults from "lodash/defaults";

const addNoteDefaults = note => defaults(note, {
  type: "note",
  body: "",
  updatedAt: moment().format(),
});

const addListDefaults = list => defaults(list, {
  type: "list",
  items: [],
  hideChecked: false,
  updatedAt: moment().format(),
});

beforeEach(() => {
  localStorage.clear();
});

it("returns an empty list if no notes are saved", () => {
  expect(api.getNotes()).toEqual({ notes: [] });
});

it("adds a note", () => {
  const response = api.addNote({ title: "foo" });

  expect(api.getNotes()).toEqual({ notes: [ addNoteDefaults({ id: 1, title: "foo" }) ] });
  expect(response).toEqual({ note: addNoteDefaults({ id: 1, title: "foo" }) });
});

it("adds a list", () => {
  const response = api.addList({ title: "foo" });

  expect(api.getNotes()).toEqual({ notes: [ addListDefaults({ id: 1, title: "foo" }) ] });
  expect(response).toEqual({ note: addListDefaults({ id: 1, title: "foo" }) });
});

it("save multiple notes and puts latest ones first", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });

  expect(api.getNotes()).toEqual({ notes: [
    addNoteDefaults({ id: 2, title: "bar" }),
    addNoteDefaults({ id: 1, title: "foo" }),
  ] })
});

it("increments ids properly", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });
  api.addNote({ title: "baz" });

  expect(api.getNotes()).toEqual({ notes: [
    addNoteDefaults({ id: 3, title: "baz" }),
    addNoteDefaults({ id: 2, title: "bar" }),
    addNoteDefaults({ id: 1, title: "foo" }),
  ] })
});

it("updates a note", () => {
  api.addNote({ title: "foo" });
  const response = api.updateNote({ id: 1, updates: { body: "bar" } });

  expect(api.getNotes()).toEqual({ notes: [
    addNoteDefaults({ id: 1, title: "foo", body: "bar" }),
  ] });
  expect(response).toEqual({ note: addNoteDefaults({ id: 1, title: "foo", body: "bar" }) });
});

it("puts updated notes at the beginning of the list", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });
  api.updateNote({ id: 1, updates: { body: "baz" } });

  expect(api.getNotes()).toEqual({ notes: [
    addNoteDefaults({ id: 1, title: "foo", body: "baz" }),
    addNoteDefaults({ id: 2, title: "bar" }),
  ] })
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

  expect(response).toEqual({ note: addListDefaults({
    id: 1,
    title: "foo",
    items: [{ id: 1, checked: false, value: "bar" }],
  }) });
});

it("converts an empty note to a list with no items", () => {
  api.addNote({ title: "foo" });
  const response = api.convertToList({ id: 1 });

  expect(response).toEqual({ note: addListDefaults({
    id: 1,
    title: "foo",
    updatedAt: moment().format(),
  }) });
});

it("adds a list item", () => {
  api.addNote({ title: "foo" });
  api.convertToList({ id: 1 });
  const response = api.addListItem({ listId: 1, value: "bar" });

  expect(response).toEqual({ note: addListDefaults({
    id: 1,
    title: "foo",
    items: [{ id: 1, checked: false, value: "bar" }],
  }) });
});

it("updates a list item", () => {
  api.addNote({ title: "foo" });
  api.updateNote({ id: 1, updates: { body: "bar" } });
  api.convertToList({ id: 1 });
  const response = api.updateListItem({ listId: 1, itemId: 1, updates: { checked: true } });

  expect(response).toEqual({ note: addListDefaults({
    id: 1,
    title: "foo",
    items: [{ id: 1, checked: true, value: "bar" }],
  }) });
});
