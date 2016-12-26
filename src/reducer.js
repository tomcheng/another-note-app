import { createSelector } from "reselect";

export const actions = {};
export const selectors = {};

actions.updateSearch             = payload => ({ type: "UPDATE_SEARCH", payload });
actions.deleteSearch             = payload => ({ type: "DELETE_SEARCH", payload });
actions.clearSearch              = ()      => ({ type: "CLEAR_SEARCH" });
actions.setIsSearching           = ()      => ({ type: "SET_IS_SEARCHING" });
actions.clearIsSearching         = ()      => ({ type: "CLEAR_IS_SEARCHING" });
actions.requestNotes             = ()      => ({ type: "REQUEST_NOTES" });
actions.loadNotes                = payload => ({ type: "LOAD_NOTES", payload });
actions.requestAddList           = payload => ({ type: "REQUEST_ADD_LIST", payload });
actions.requestAddNote           = payload => ({ type: "REQUEST_ADD_NOTE", payload });
actions.addNote                  = payload => ({ type: "ADD_NOTE", payload });
actions.requestUpdateNote        = payload => ({ type: "REQUEST_UPDATE_NOTE", payload });
actions.updateNote               = payload => ({ type: "UPDATE_NOTE", payload });
actions.requestDeleteNote        = payload => ({ type: "REQUEST_DELETE_NOTE", payload });
actions.deleteNote               = payload => ({ type: "DELETE_NOTE", payload });
actions.selectNote               = payload => ({ type: "SELECT_NOTE", payload });
actions.deselectNote             = ()      => ({ type: "DESELECT_NOTE" });
actions.selectNextNote           = ()      => ({ type: "SELECT_NEXT_NOTE" });
actions.selectPreviousNote       = ()      => ({ type: "SELECT_PREVIOUS_NOTE" });
actions.editNoteBody             = ()      => ({ type: "EDIT_NOTE_BODY" });
actions.editNoteTitle            = ()      => ({ type: "EDIT_NOTE_TITLE" });
actions.setAddListItem           = ()      => ({ type: "SET_ADD_LIST_ITEM" });
actions.cancelEditNoteBody       = ()      => ({ type: "CANCEL_EDIT_NOTE_BODY" });
actions.cancelEditNoteTitle      = ()      => ({ type: "CANCEL_EDIT_NOTE_TITLE" });
actions.cancelAddListItem        = ()      => ({ type: "CANCEL_ADD_LIST_ITEM" });
actions.requestConvertNoteToList = payload => ({ type: "REQUEST_CONVERT_NOTE_TO_LIST", payload });
actions.requestAddListItem       = payload => ({ type: "REQUEST_ADD_LIST_ITEM", payload });
actions.requestUpdateListItem    = payload => ({ type: "REQUEST_UPDATE_LIST_ITEM", payload });
actions.setListHeight            = payload => ({ type: "SET_LIST_HEIGHT", payload });

const initialState = {
  isEditingNoteBody: false,
  isEditingNoteTitle: false,
  isAddingListItem: false,
  isNavigating: false,
  isSearching: false,
  listHeight: 250,
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
        isEditing: false,
        isNavigating: false,
        search: payload.search,
        selectedNoteId: null,
      };
    case "CLEAR_SEARCH":
      return { ...state, search: "" };
    case "SET_IS_SEARCHING":
      return { ...state, isSearching: true };
    case "CLEAR_IS_SEARCHING":
      return { ...state, isSearching: false };
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
        isEditingNoteBody: payload.note.type === "note",
        isAddingListItem: payload.note.type === "list",
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
    case "DELETE_NOTE":
      return {
        ...state,
        notes: {
          ...state.notes,
          [payload.id]: undefined,
        },
        noteIds: state.noteIds.filter(id => id !== payload.id),
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
    case "EDIT_NOTE_TITLE":
      return { ...state, isEditingNoteTitle: true };
    case "CANCEL_EDIT_NOTE_TITLE":
      return { ...state, isEditingNoteTitle: false };
    case "SET_ADD_LIST_ITEM":
      return { ...state, isAddingListItem: true };
    case "CANCEL_ADD_LIST_ITEM":
      return { ...state, isAddingListItem: false };
    case "SET_LIST_HEIGHT":
      return { ...state, listHeight: payload.height };
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
selectors.getSelectedNote       = state => state.notes[state.selectedNoteId];
selectors.getIsEditingNoteBody  = state => state.isEditingNoteBody;
selectors.getIsEditingNoteTitle = state => state.isEditingNoteTitle;
selectors.getIsAddingListItem   = state => state.isAddingListItem;
selectors.getIsEditing          = state => state.isEditingNoteBody ||
                                           state.isEditingNoteTitle ||
                                           state.isAddingListItem;
selectors.getIsNavigating       = state => state.isNavigating;
selectors.getIsSearching        = state => state.isSearching;
selectors.getNotesLoaded        = state => state.notesLoaded;
selectors.getSearch             = state => state.search;
selectors.getListHeight         = state => state.listHeight;
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
