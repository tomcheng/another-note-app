export const updateSearch = search => ({
  type: "updateSearch",
  payload: search,
});

export const addNote = title => ({
  type: "addNote",
  payload: { title, body: "" }
});

const initialState = {
  search: "",
  notes: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "updateSearch":
      return { ...state, search: action.payload };
    case "addNote":
      return {
        ...state,
        search: "",
        notes: state.notes.concat(action.payload),
      };
    default:
      return state;
  }
};

export const getSearch = state => state.search;

export const getNotes = state => state.notes;

export default reducer;
