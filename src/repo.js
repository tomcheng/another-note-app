import findIndex from "lodash/findIndex";
import max from "lodash/max";
import moment from "moment"

const saveLocalNotes = notes => { localStorage.setItem("notes", JSON.stringify(notes)); };

const getLocalNotes = () => {
  const json = localStorage.getItem("notes");

  if (!json) { return []; }

  return JSON.parse(json);
};

export const getNotes = () => ({ notes: getLocalNotes() });

export const addNote = ({ title }) => {
  const notes = getLocalNotes();
  const id = (max(notes.map(note => note.id)) || 0) + 1;
  const note = {
    id,
    title,
    type: "note",
    body: "",
    updatedAt: moment().format(),
  };

  saveLocalNotes([note].concat(notes));

  return { note };
};

export const updateNote = ({ id, updates }) => {
  const notes = getLocalNotes();
  const noteIndex = findIndex(notes, { id });
  const oldNote = notes.splice(noteIndex, 1)[0];
  const newNote = { ...oldNote, ...updates, updatedAt: moment().format() };

  saveLocalNotes([newNote].concat(notes));

  return { note: newNote };
};

export const deleteNote = ({ id }) => {
  const notes = getLocalNotes();

  saveLocalNotes(notes.filter(note => note.id !== id));
};

export const convertToList = ({ id }) => {
  const notes = getLocalNotes();
  const noteIndex = findIndex(notes, { id });
  const oldNote = notes.splice(noteIndex, 1)[0];
  const list = {
    id,
    title: oldNote.title,
    type: "list",
    items: oldNote.body.split("\n")
      .filter(value => value.trim !== "")
      .map((value, index) => ({ id: index + 1, value, checked: false })),
    updatedAt: moment().format(),
  };

  saveLocalNotes([list].concat(notes));

  return { note: list };
};

export const updateListItem = ({ listId, itemId, updates }) => {
  const notes = getLocalNotes();
  const listIndex = findIndex(notes, { id: listId });
  const list = notes.splice(listIndex, 1)[0];
  const itemIndex = findIndex(list.items, { id: itemId });
  list.items[itemIndex] = { ...list.items[itemIndex], ...updates };

  saveLocalNotes([list].concat(notes));

  return { note: list };
};
