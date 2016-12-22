export const updateSearch = search => ({
  type: "UPDATE_SEARCH",
  payload: search,
});

export const loadNotes = ({ notes }) => ({
  type: "LOAD_NOTES",
  payload: { notes },
});

export const requestAddNote = ({ title }) => ({
  type: "REQUEST_ADD_NOTE",
  payload: { title },
});

export const addNote = ({ note }) => ({
  type: "ADD_NOTE",
  payload: { note },
});

export const updateNoteBody = ({ id, body }) => ({
  type: "UPDATE_NOTE_BODY",
  payload: { id, body },
});

export const selectNote = id => ({
  type: "SELECT_NOTE",
  payload: { id },
});

const initialState = {
  activeNoteId: null,
  isEditing: false,
  notes: {},
  noteIds: [],
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

export const getIsEditing = state => state.isEditing;

export const getSearch = state => state.search;

export const getNotes = state => state.noteIds.map(id => state.notes[id]);

export const getActiveNote = state => state.notes[state.activeNoteId];

export default reducer;
