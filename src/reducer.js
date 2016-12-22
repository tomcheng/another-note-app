let id = 1;

export const updateSearch = search => ({
  type: "updateSearch",
  payload: search,
});

export const loadNotes = ({ notes }) => ({
  type: "loadNotes",
  payload: { notes },
});

export const addNote = title => ({
  type: "addNote",
  payload: {
    title,
    id: id++,
    body: "",
  }
});

export const updateNoteBody = ({ id, body }) => ({
  type: "updateNoteBody",
  payload: { id, body },
});

export const selectNote = id => ({
  type: "selectNote",
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
    case "updateSearch":
      return {
        ...state,
        isEditing: false,
        search: action.payload,
      };
    case "loadNotes":
      return {
        ...state,
        notes: action.payload.notes.reduce((acc, curr) => ({
          ...acc,
          [curr.id]: curr,
        }), {}),
        noteIds: action.payload.notes.map(note => note.id),
      };
    case "addNote":
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.payload.id]: action.payload,
        },
        noteIds: state.noteIds.concat(action.payload.id),
        search: "",
        isEditing: true,
        activeNoteId: action.payload.id,
      };
    case "updateNoteBody":
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
    case "selectNote":
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
