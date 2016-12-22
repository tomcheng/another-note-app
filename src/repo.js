let id = 1;

export const getNotes = () => ({ notes: [] });

export const addNote = ({ title }) => ({ note: { title, body: "", id: id++ } });
