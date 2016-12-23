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
  console.log(">> moment().format():", moment().format());
});

it("save multiple notes", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });

  expect(api.getNotes()).toEqual({ notes: [
    { id: 1, title: "foo", body: "", updatedAt: moment().format() },
    { id: 2, title: "bar", body: "", updatedAt: moment().format() },
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
