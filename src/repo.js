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

  saveLocalNotes(notes.concat(note));

  return { note };
};

export const updateNote = ({ id, updates }) => {
  const notes = getLocalNotes();
  const noteIndex = findIndex(notes, { id });
  const newNote = { ...notes[noteIndex], ...updates, updatedAt: moment().format() };

  notes[noteIndex] = newNote;

  saveLocalNotes(notes);

  return { note: newNote };
};
