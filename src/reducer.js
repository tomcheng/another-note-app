export const actions = {};

actions.updateSearch   = payload => ({ type: "UPDATE_SEARCH", payload });
actions.requestNotes   = ()      => ({ type: "REQUEST_NOTES" });
actions.loadNotes      = payload => ({ type: "LOAD_NOTES", payload });
actions.requestAddNote = payload => ({ type: "REQUEST_ADD_NOTE", payload });
actions.addNote        = payload => ({ type: "ADD_NOTE", payload });
actions.updateNoteBody = payload => ({ type: "UPDATE_NOTE_BODY", payload });
actions.selectNote     = payload => ({ type: "SELECT_NOTE", payload });

const initialState = {
  activeNoteId: null,
  isEditing: false,
  notes: {},
  noteIds: [],
  notesLoaded: false,
  search: "",
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "UPDATE_SEARCH":
      return {
        ...state,
        isEditing: false,
        search: payload.search,
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
        activeNoteId: payload.note.id,
      };
    case "UPDATE_NOTE_BODY":
      return {
        ...state,
        notes: {
          ...state.notes,
          [payload.id]: {
            ...state.notes[payload.id],
            body: payload.body,
          }
        },
      };
    case "SELECT_NOTE":
      return {
        ...state,
        activeNoteId: payload.id,
      };
    default:
      return state;
  }
};

export const selectors = {};

selectors.getActiveNote  = state => state.notes[state.activeNoteId];
selectors.getIsEditing   = state => state.isEditing;
selectors.getNotes       = state => state.noteIds.map(id => state.notes[id]);
selectors.getNotesLoaded = state => state.notesLoaded;
selectors.getSearch      = state => state.search;

export default reducer;
