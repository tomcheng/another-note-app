import findIndex from "lodash/findIndex";
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
  const id = notes.length ? notes[notes.length - 1].id + 1 : 1;
  const note = { id, title, body: "", updatedAt: moment().format() };

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
