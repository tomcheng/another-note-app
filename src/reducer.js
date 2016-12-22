export const actions = {};

actions.updateSearch = search => ({
  type: "UPDATE_SEARCH",
  payload: search,
});

actions.requestNotes = () => ({ type: "REQUEST_NOTES" });

actions.loadNotes = ({ notes }) => ({
  type: "LOAD_NOTES",
  payload: { notes },
});

actions.requestAddNote = ({ title }) => ({
  type: "REQUEST_ADD_NOTE",
  payload: { title },
});

actions.addNote = ({ note }) => ({
  type: "ADD_NOTE",
  payload: { note },
});

actions.updateNoteBody = ({ id, body }) => ({
  type: "UPDATE_NOTE_BODY",
  payload: { id, body },
});

actions.selectNote = id => ({
  type: "SELECT_NOTE",
  payload: { id },
});

const initialState = {
  activeNoteId: null,
  isEditing: false,
  notes: {},
  noteIds: [],
  notesLoaded: false,
  search: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_SEARCH":
      return {
        ...state,
        isEditing: false,
        search: action.payload,
      };
    case "LOAD_NOTES":
      return {
        ...state,
        notes: action.payload.notes.reduce((acc, curr) => ({
          ...acc,
          [curr.id]: curr,
        }), {}),
        noteIds: action.payload.notes.map(note => note.id),
        notesLoaded: true,
      };
    case "ADD_NOTE":
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.payload.note.id]: action.payload.note,
        },
        noteIds: state.noteIds.concat(action.payload.note.id),
        search: "",
        isEditing: true,
        activeNoteId: action.payload.note.id,
      };
    case "UPDATE_NOTE_BODY":
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.payload.id]: {
            ...state.notes[action.payload.id],
            body: action.payload.body,
          }
        },
      };
    case "SELECT_NOTE":
      return {
        ...state,
        activeNoteId: action.payload.id,
      };
    default:
      return state;
  }
};

export const selectors = {};

selectors.getActiveNote = state => state.notes[state.activeNoteId];
selectors.getIsEditing = state => state.isEditing;
selectors.getNotes = state => state.noteIds.map(id => state.notes[id]);
selectors.getNotesLoaded = state => state.notesLoaded;
selectors.getSearch = state => state.search;

export default reducer;
