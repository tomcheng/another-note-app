import * as api from "./repo";
import moment from "moment";

beforeEach(() => {
  localStorage.clear();
});

it("returns an empty list if no notes are saved", () => {
  expect(api.getNotes()).toEqual({ notes: [] });
});

it("saves a note", () => {
  const response = api.addNote({ title: "foo" });

  expect(api.getNotes()).toEqual({ notes: [
    { id: 1, title: "foo", body: "", updatedAt: moment().format() },
  ] });
  expect(response).toEqual({ note: { id: 1, title: "foo", body: "", updatedAt: moment().format() } });
});

it("save multiple notes and puts latest ones first", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });

  expect(api.getNotes()).toEqual({ notes: [
    { id: 2, title: "bar", body: "", updatedAt: moment().format() },
    { id: 1, title: "foo", body: "", updatedAt: moment().format() },
  ] })
});

it("increments ids properly", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });
  api.addNote({ title: "baz" });

  expect(api.getNotes()).toEqual({ notes: [
    { id: 3, title: "baz", body: "", updatedAt: moment().format() },
    { id: 2, title: "bar", body: "", updatedAt: moment().format() },
    { id: 1, title: "foo", body: "", updatedAt: moment().format() },
  ] })
});

it("updates a note", () => {
  api.addNote({ title: "foo" });
  const response = api.updateNote({ id: 1, updates: { body: "bar" } });

  expect(api.getNotes()).toEqual({ notes: [
    { id: 1, title: "foo", body: "bar", updatedAt: moment().format() },
  ] });
  expect(response).toEqual({ note: {
    id: 1, title: "foo", body: "bar", updatedAt: moment().format(),
  } });
});

it("puts updated notes at the beginning of the list", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });
  api.updateNote({ id: 1, updates: { body: "baz" } });

  expect(api.getNotes()).toEqual({ notes: [
    { id: 1, title: "foo", body: "baz", updatedAt: moment().format() },
    { id: 2, title: "bar", body: "", updatedAt: moment().format() },
  ] })
});
