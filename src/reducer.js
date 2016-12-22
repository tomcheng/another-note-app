let id = 1;

export const updateSearch = search => ({
  type: "updateSearch",
  payload: search,
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
    default:
      return state;
  }
};

export const getIsEditing = state => state.isEditing;

export const getSearch = state => state.search;

export const getNotes = state => state.noteIds.map(id => state.notes[id]);

export const getActiveNote = state => state.notes[state.activeNoteId];

export default reducer;
