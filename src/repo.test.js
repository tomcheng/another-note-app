import * as api from "./repo";

beforeEach(() => {
  localStorage.clear();
});

it("returns an empty list if no notes are saved", () => {
  expect(api.getNotes()).toEqual({ notes: [] });
});

it("saves a note", () => {
  const response = api.addNote({ title: "foo" });

  expect(response).toEqual({ note: { title: "foo", body: "", id: 1 } });
  expect(api.getNotes()).toEqual({ notes: [
    { title: "foo", body: "", id: 1 },
  ] });
});

it("save multiple notes", () => {
  api.addNote({ title: "foo" });
  api.addNote({ title: "bar" });

  expect(api.getNotes()).toEqual({ notes: [
    { title: "foo", body: "", id: 1 },
    { title: "bar", body: "", id: 2 },
  ] })
});
