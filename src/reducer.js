import { createSelector } from "reselect";
import find from "lodash/find";

export const actions = {};

actions.updateSearch      = payload => ({ type: "UPDATE_SEARCH", payload });
actions.deleteSearch      = payload => ({ type: "DELETE_SEARCH", payload });
actions.requestNotes      = ()      => ({ type: "REQUEST_NOTES" });
actions.loadNotes         = payload => ({ type: "LOAD_NOTES", payload });
actions.requestAddNote    = payload => ({ type: "REQUEST_ADD_NOTE", payload });
actions.addNote           = payload => ({ type: "ADD_NOTE", payload });
actions.requestUpdateNote = payload => ({ type: "REQUEST_UPDATE_NOTE", payload });
actions.updateNote        = payload => ({ type: "UPDATE_NOTE", payload });
actions.selectNote        = payload => ({ type: "SELECT_NOTE", payload });
actions.editNote          = ()      => ({ type: "EDIT_NOTE" });

const initialState = {
  isEditing: false,
  notes: {},
  noteIds: [],
  notesLoaded: false,
  search: "",
  selectedNoteId: null,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "UPDATE_SEARCH":
      const notes = state.noteIds.map(id => state.notes[id]);
      const matchedNote = find(notes, note => {
        const processedSearch = payload.search.toLowerCase();
        const processedTitle = note.title.toLowerCase();

        if (processedSearch === "") { return false; }

        return processedTitle.indexOf(processedSearch) === 0;
      });

      return {
        ...state,
        isEditing: false,
        search: payload.search,
        selectedNoteId: matchedNote ? matchedNote.id : null,
      };
    case "DELETE_SEARCH":
      return {
        ...state,
        isEditing: false,
        search: payload.search,
        selectedNoteId: null,
      };
    case "LOAD_NOTES":
      return {
        ...state,
        notes: payload.notes.reduce((acc, curr) => ({
          ...acc,
          [curr.id]: curr,
        }), {}),
        noteIds: payload.notes.map(note => note.id),
        notesLoaded: true,
      };
    case "ADD_NOTE":
      return {
        ...state,
        notes: {
          ...state.notes,
          [payload.note.id]: payload.note,
        },
        noteIds: state.noteIds.concat(payload.note.id),
        search: "",
        isEditing: true,
        selectedNoteId: payload.note.id,
      };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: {
          ...state.notes,
          [payload.note.id]: payload.note,
        },
      };
    case "SELECT_NOTE":
      return {
        ...state,
        selectedNoteId: payload.id,
      };
    case "EDIT_NOTE":
      return {
        ...state,
        isEditing: true,
      };
    default:
      return state;
  }
};

export const selectors = {};

selectors.getNotesById    = state => state.notes;
selectors.getNoteIds      = state => state.noteIds;
selectors.getSelectedNote = state => state.notes[state.selectedNoteId];
selectors.getIsEditing    = state => state.isEditing;
selectors.getNotesLoaded  = state => state.notesLoaded;
selectors.getSearch       = state => state.search;
selectors.getNotes = createSelector(
  selectors.getNotesById,
  selectors.getNoteIds,
  (notesById, noteIds) => noteIds.map(id => notesById[id])
);

export default reducer;
