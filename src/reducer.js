import { createSelector } from "reselect";
import find from "lodash/find";

export const actions = {};
export const selectors = {};

actions.updateSearch       = payload => ({ type: "UPDATE_SEARCH", payload });
actions.deleteSearch       = payload => ({ type: "DELETE_SEARCH", payload });
actions.requestNotes       = ()      => ({ type: "REQUEST_NOTES" });
actions.loadNotes          = payload => ({ type: "LOAD_NOTES", payload });
actions.requestAddNote     = payload => ({ type: "REQUEST_ADD_NOTE", payload });
actions.addNote            = payload => ({ type: "ADD_NOTE", payload });
actions.requestUpdateNote  = payload => ({ type: "REQUEST_UPDATE_NOTE", payload });
actions.updateNote         = payload => ({ type: "UPDATE_NOTE", payload });
actions.selectNote         = payload => ({ type: "SELECT_NOTE", payload });
actions.deselectNote       = ()      => ({ type: "DESELECT_NOTE" });
actions.selectNextNote     = ()      => ({ type: "SELECT_NEXT_NOTE" });
actions.selectPreviousNote = ()      => ({ type: "SELECT_PREVIOUS_NOTE" });
actions.editNoteBody       = ()      => ({ type: "EDIT_NOTE_BODY" });
actions.cancelEditNoteBody = ()      => ({ type: "CANCEL_EDIT_NOTE_BODY" });

const initialState = {
  isEditingNoteBody: false,
  isNavigating: false,
  notes: {},
  noteIds: [],
  notesLoaded: false,
  search: "",
  selectedNoteId: null,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "UPDATE_SEARCH": {
      const notes = selectors.getNotes(state);
      const matchedNote = find(notes, note => {
        const processedSearch = payload.search.toLowerCase();
        const processedTitle = note.title.toLowerCase();

        if (processedSearch === "") { return false; }

        return processedTitle.indexOf(processedSearch) === 0;
      });

      return {
        ...state,
        isEditing: false,
        isNavigating: false,
        search: payload.search,
        selectedNoteId: matchedNote ? matchedNote.id : null,
      };
    }
    case "DELETE_SEARCH":
      return {
        ...state,
        isEditing: false,
        isNavigating: false,
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
        noteIds: [payload.note.id].concat(state.noteIds),
        search: "",
        isEditingNoteBody: true,
        selectedNoteId: payload.note.id,
      };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: {
          ...state.notes,
          [payload.note.id]: payload.note,
        },
        noteIds: [payload.note.id].concat(state.noteIds.filter(id => id !== payload.note.id)),
      };
    case "SELECT_NOTE":
      return { ...state, selectedNoteId: payload.id };
    case "DESELECT_NOTE":
      return { ...state, selectedNoteId: null };
    case "SELECT_NEXT_NOTE": {
      const visibleIds = selectors.getVisibleNoteIds(state);
      const currentId = state.selectedNoteId;
      const selectedNoteId = currentId
        ? visibleIds[Math.min(visibleIds.length - 1, visibleIds.indexOf(currentId) + 1)]
        : visibleIds[0];

      return { ...state, selectedNoteId, isNavigating: true };
    }
    case "SELECT_PREVIOUS_NOTE": {
      const visibleIds = selectors.getVisibleNoteIds(state);
      const currentId = state.selectedNoteId;
      const selectedNoteId = currentId
        ? visibleIds[Math.max(0, visibleIds.indexOf(currentId) - 1)]
        : visibleIds[visibleIds.length - 1];

      return { ...state, selectedNoteId, isNavigating: true };
    }
    case "EDIT_NOTE_BODY":
      return { ...state, isEditingNoteBody: true };
    case "CANCEL_EDIT_NOTE_BODY":
      return { ...state, isEditingNoteBody: false };
    default:
      return state;
  }
};

const matches = (note, search) => {
  const processedSearch = search.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedTitle = note.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedBody = note.body.toLowerCase().replace(/[^a-z0-9]/g, "");

  return processedTitle.indexOf(processedSearch) !== -1 ||
    processedBody.indexOf(processedSearch) !== -1;
};

selectors.getNotesById         = state => state.notes;
selectors.getNoteIds           = state => state.noteIds;
selectors.getSelectedNote      = state => state.notes[state.selectedNoteId];
selectors.getIsEditingNoteBody = state => state.isEditingNoteBody;
selectors.getIsNavigating      = state => state.isNavigating;
selectors.getNotesLoaded       = state => state.notesLoaded;
selectors.getSearch            = state => state.search;
selectors.getNotes = createSelector(
  selectors.getNotesById,
  selectors.getNoteIds,
  (notesById, noteIds) => noteIds.map(id => notesById[id])
);
selectors.getVisibleNoteIds = createSelector(
  selectors.getNotes,
  selectors.getSearch,
  (notes, search) => notes.filter(note => matches(note, search)).map(note => note.id)
);

export default reducer;
