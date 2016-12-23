import { matches } from "./Notes";

it("returns true if string is empty", () => {
  expect(matches("", { title: "foo", body: "" })).toBe(true);
});

it("does basic matching", () => {
  expect(matches("fo", { title: "foo", body: "" })).toBe(true);
  expect(matches("oo", { title: "foo", body: "" })).toBe(true);
  expect(matches("Fo", { title: "foo", body: "" })).toBe(true);
  expect(matches("a", { title: "foo", body: "" })).toBe(false);
});
