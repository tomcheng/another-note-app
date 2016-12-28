import findIndex from "lodash/findIndex";
import max from "lodash/max";
import moment from "moment"

const save = ({ key, payload }) => { localStorage.setItem(key, JSON.stringify(payload)); };

const getLocalNotes = () => {
  const json = localStorage.getItem("notes");

  if (!json) { return []; }

  return JSON.parse(json);
};

const getLocalUISettings = () => {
  const json = localStorage.getItem("ui_settings");

  if (!json) { return { listHeight: 300 }; }

  return JSON.parse(json);
};

export const getUISettings = () => getLocalUISettings();

export const updateUISettings = settings => {
  const oldSettings = getLocalUISettings();
  const newSettings = { ...oldSettings, ...settings };

  save({ key: "ui_settings", payload: newSettings });

  return newSettings;
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
    createdAt: moment().format(),
    updatedAt: moment().format(),
  };

  save({ key: "notes", payload: [note].concat(notes) });

  return { note };
};

export const addList = ({ title }) => {
  const notes = getLocalNotes();
  const id = (max(notes.map(note => note.id)) || 0) + 1;
  const list = {
    id,
    title,
    type: "list",
    items: [],
    hideChecked: false,
    createdAt: moment().format(),
    updatedAt: moment().format(),
  };

  save({ key: "notes", payload: [list].concat(notes) });

  return { note: list };
};

export const updateNote = ({ id, updates }) => {
  const notes = getLocalNotes();
  const noteIndex = findIndex(notes, { id });
  const oldNote = notes.splice(noteIndex, 1)[0];
  const newNote = {
    ...oldNote,
    ...updates,
    updatedAt: moment().format(),
  };

  save({ key: "notes", payload: [newNote].concat(notes) });

  return { note: newNote };
};

export const deleteNote = ({ id }) => {
  const notes = getLocalNotes();

  save({ key: "notes", payload: notes.filter(note => note.id !== id) });
};

export const convertToList = ({ id }) => {
  const notes = getLocalNotes();
  const noteIndex = findIndex(notes, { id });
  const oldNote = notes.splice(noteIndex, 1)[0];
  const list = {
    id,
    title: oldNote.title,
    type: "list",
    hideChecked: false,
    items: oldNote.body.split("\n")
      .filter(value => value.trim() !== "")
      .map((value, index) => ({ id: index + 1, value, checked: false })),
    createdAt: oldNote.createdAt,
    updatedAt: moment().format(),
  };

  save({ key: "notes", payload: [list].concat(notes) });

  return { note: list };
};

export const addListItem = ({ listId, value }) => {
  const notes = getLocalNotes();
  const listIndex = findIndex(notes, { id: listId });
  const list = notes.splice(listIndex, 1)[0];

  list.items.push({ id: list.items.length + 1, value, checked: false });
  list.updatedAt = moment().format();

  save({ key: "notes", payload: [list].concat(notes) });

  return { note: list };
};

export const updateListItem = ({ listId, itemId, updates }) => {
  const notes = getLocalNotes();
  const listIndex = findIndex(notes, { id: listId });
  const list = notes.splice(listIndex, 1)[0];
  const itemIndex = findIndex(list.items, { id: itemId });

  list.items[itemIndex] = { ...list.items[itemIndex], ...updates };
  list.updatedAt = moment().format();

  save({ key: "notes", payload: [list].concat(notes) });

  return { note: list };
};
