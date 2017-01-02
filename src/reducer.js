import { createSelector } from "reselect";
import sortBy from "lodash/sortBy";
import omit from "lodash/omit";

export const actions = {};
export const selectors = {};

actions.updateSearch             = payload => ({ type: "UPDATE_SEARCH", payload });
actions.deleteSearch             = payload => ({ type: "DELETE_SEARCH", payload });
actions.clearSearch              = ()      => ({ type: "CLEAR_SEARCH" });
actions.requestNotes             = ()      => ({ type: "REQUEST_NOTES" });
actions.loadNotes                = payload => ({ type: "LOAD_NOTES", payload });
actions.requestAddList           = payload => ({ type: "REQUEST_ADD_LIST", payload });
actions.requestAddNote           = payload => ({ type: "REQUEST_ADD_NOTE", payload });
actions.addNote                  = payload => ({ type: "ADD_NOTE", payload });
actions.requestUpdateNote        = payload => ({ type: "REQUEST_UPDATE_NOTE", payload });
actions.updateNote               = payload => ({ type: "UPDATE_NOTE", payload });
actions.requestDeleteNote        = payload => ({ type: "REQUEST_DELETE_NOTE", payload });
actions.deleteNote               = payload => ({ type: "DELETE_NOTE", payload });
actions.requestConvertNoteToList = payload => ({ type: "REQUEST_CONVERT_NOTE_TO_LIST", payload });
actions.requestAddListItem       = payload => ({ type: "REQUEST_ADD_LIST_ITEM", payload });
actions.requestUpdateListItem    = payload => ({ type: "REQUEST_UPDATE_LIST_ITEM", payload });
actions.requestDeleteListItem    = payload => ({ type: "REQUEST_DELETE_LIST_ITEM", payload });

const initialState = {
  notes: {},
  noteIds: [],
  notesLoaded: false,
  search: "",
};

const notesToIds = notes => sortBy(notes, "updatedAt").reverse().map(note => note.id);

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "UPDATE_SEARCH": {
      return {
        ...state,
        isEditing: false,
        isNavigating: false,
        search: payload.search,
      };
    }
    case "DELETE_SEARCH":
      return {
        ...state,
        search: payload.search,
      };
    case "CLEAR_SEARCH":
      return { ...state, search: "" };
    case "LOAD_NOTES":
      return {
        ...state,
        notes: payload.notes.reduce((acc, curr) => ({
          ...acc,
          [curr.id]: curr,
        }), {}),
        noteIds: notesToIds(payload.notes),
        notesLoaded: true,
      };
    case "ADD_NOTE": {
      const newNotes = {
        ...state.notes,
        [payload.note.id]: payload.note,
      };

      return {
        ...state,
        notes: newNotes,
        noteIds: notesToIds(newNotes),
        search: "",
        isEditingNoteBody: payload.note.type === "note",
        isAddingListItem: payload.note.type === "list",
        selectedNoteId: payload.note.id,
      };
    }
    case "UPDATE_NOTE": {
      const newNotes = {
        ...state.notes,
        [payload.note.id]: payload.note,
      };

      return {
        ...state,
        notes: newNotes,
        noteIds: notesToIds(newNotes),
      };
    }
    case "DELETE_NOTE": {
      const newNotes = omit(state.notes, [payload.id]);

      return {
        ...state,
        notes: newNotes,
        noteIds: notesToIds(newNotes),
      };
    }
    default:
      return state;
  }
};

const matches = (note, search) => {
  const processedSearch = search.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedTitle = note.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const processedBody = note.type === "list"
    ? note.items.map(item => item.value).join("").toLowerCase().replace(/[^a-z0-9]/g, "")
    : note.body.toLowerCase().replace(/[^a-z0-9]/g, "");

  return processedTitle.indexOf(processedSearch) !== -1 ||
    processedBody.indexOf(processedSearch) !== -1;
};

selectors.getNotesById          = state => state.notes;
selectors.getNoteIds            = state => state.noteIds;
selectors.getNotesLoaded        = state => state.notesLoaded;
selectors.getSearch             = state => state.search;
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
