import findIndex from "lodash/findIndex";
import max from "lodash/max";
import moment from "moment"

const save = ({ key, payload }) => { localStorage.setItem(key, JSON.stringify(payload)); };

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
    createdAt: moment().format(),
    updatedAt: moment().format(),
  };
  notes.push(note);

  save({ key: "notes", payload: notes });

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
  notes.push(list);

  save({ key: "notes", payload: notes });

  return { note: list };
};

export const updateNote = ({ id, updates }) => {
  const notes = getLocalNotes();
  const noteIndex = findIndex(notes, { id });
  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
  };

  if (updates.hideChecked === undefined) {
    updatedNote.updatedAt = moment().format();
  }

  notes[noteIndex] = updatedNote;

  save({ key: "notes", payload: notes });

  return { note: updatedNote };
};

export const deleteNote = ({ id }) => {
  const notes = getLocalNotes();

  save({ key: "notes", payload: notes.filter(note => note.id !== id) });
};

export const convertToList = ({ id }) => {
  const notes = getLocalNotes();
  const noteIndex = findIndex(notes, { id });
  const oldNote = notes[noteIndex];
  const list = {
    id,
    title: oldNote.title,
    type: "list",
    hideChecked: false,
    items: oldNote.body.split("\n")
      .filter(value => value.trim() !== "")
      .map((value, index) => ({ id: index + 1, value, checked: false, checkedAt: null })),
    createdAt: oldNote.createdAt,
    updatedAt: moment().format(),
  };

  notes[noteIndex] = list;

  save({ key: "notes", payload: notes });

  return { note: list };
};

export const addListItem = ({ listId, value }) => {
  const notes = getLocalNotes();
  const listIndex = findIndex(notes, { id: listId });
  const list = notes[listIndex];
  const id = (max(list.items.map(item => item.id)) || 0) + 1;

  list.items.push({ id, value, checked: false, checkedAt: null });
  list.updatedAt = moment().format();

  save({ key: "notes", payload: notes });

  return { note: list };
};

export const updateListItem = ({ listId, itemId, updates }) => {
  const notes = getLocalNotes();
  const listIndex = findIndex(notes, { id: listId });
  const list = notes[listIndex];
  const itemIndex = findIndex(list.items, { id: itemId });

  list.items[itemIndex] = { ...list.items[itemIndex], ...updates };
  list.updatedAt = moment().format();

  if (updates.checked === true) {
    list.items[itemIndex].checkedAt = moment().format();
  }

  if (updates.checked === false) {
    list.items[itemIndex].checkedAt = null;
  }

  save({ key: "notes", payload: notes });

  return { note: list };
};

export const deleteListItem = ({ listId, itemId }) => {
  const notes = getLocalNotes();
  const listIndex = findIndex(notes, { id: listId });
  const list = notes[listIndex];

  list.items = list.items.filter(item => item.id !== itemId);
  list.updatedAt = moment().format();

  save({ key: "notes", payload: notes });

  return { note: list };
};
