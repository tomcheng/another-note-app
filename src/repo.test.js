import * as api from "./repo";
import moment from "moment";
import defaults from "lodash/defaults";

const addDefaults = note => defaults(note, {
  body: "",
  type: "note",
  updatedAt: moment().format(),
});

beforeEach(() => {
  localStorage.clear();
});

it("returns an empty list if no notes are saved", () => {
  expect(api.getNotes()).toEqual({ notes: [] });
});

it("saves a note", () => {
  const response = api.addNote({ title: "foo" });

  expect(api.getNotes()).toEqual({ notes: [ {
    id: 1,
    type: "note",
    title: "foo",
    body: "",
    updatedAt: moment().format()
  } ] });
  expect(response).toEqual({ note: {
    id: 1,
    type: "note",
    title: "foo",
    body: "",
    updatedAt: moment().format(),
  } });
});

it("save multiple notes and puts latest ones first", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });

  expect(api.getNotes()).toEqual({ notes: [
    addDefaults({ id: 2, title: "bar" }),
    addDefaults({ id: 1, title: "foo" }),
  ] })
});

it("increments ids properly", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });
  api.addNote({ title: "baz" });

  expect(api.getNotes()).toEqual({ notes: [
    addDefaults({ id: 3, title: "baz" }),
    addDefaults({ id: 2, title: "bar" }),
    addDefaults({ id: 1, title: "foo" }),
  ] })
});

it("updates a note", () => {
  api.addNote({ title: "foo" });
  const response = api.updateNote({ id: 1, updates: { body: "bar" } });

  expect(api.getNotes()).toEqual({ notes: [
    addDefaults({ id: 1, title: "foo", body: "bar" }),
  ] });
  expect(response).toEqual({ note: addDefaults({ id: 1, title: "foo", body: "bar" }) });
});

it("puts updated notes at the beginning of the list", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });
  api.updateNote({ id: 1, updates: { body: "baz" } });

  expect(api.getNotes()).toEqual({ notes: [
    addDefaults({ id: 1, title: "foo", body: "baz" }),
    addDefaults({ id: 2, title: "bar" }),
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

  expect(response).toEqual({ note: {
    id: 1,
    title: "foo",
    type: "list",
    items: [{ id: 1, checked: false, value: "bar" }],
    updatedAt: moment().format(),
  } });
});

it("converts an empty note to a list with no items", () => {
  api.addNote({ title: "foo" });
  const response = api.convertToList({ id: 1 });

  expect(response).toEqual({ note: {
    id: 1,
    title: "foo",
    type: "list",
    items: [],
    updatedAt: moment().format(),
  } });
});

it("adds a list item", () => {
  api.addNote({ title: "foo" });
  api.convertToList({ id: 1 });
  const response = api.addListItem({ listId: 1, value: "bar" });

  expect(response).toEqual({ note: {
    id: 1,
    title: "foo",
    type: "list",
    items: [{ id: 1, checked: false, value: "bar" }],
    updatedAt: moment().format(),
  } });
});

it("updates a list item", () => {
  api.addNote({ title: "foo" });
  api.updateNote({ id: 1, updates: { body: "bar" } });
  api.convertToList({ id: 1 });
  const response = api.updateListItem({ listId: 1, itemId: 1, updates: { checked: true } });

  expect(response).toEqual({ note: {
    id: 1,
    title: "foo",
    type: "list",
    items: [{ id: 1, checked: true, value: "bar" }],
    updatedAt: moment().format(),
  } });
});
