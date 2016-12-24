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

export const deleteNote = ({ id }) => {
  const notes = getLocalNotes();

  saveLocalNotes(notes.filter(note => note.id !== id));
};
