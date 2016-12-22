const logger = store => next => action => {
  const result = next(action);

  console.groupCollapsed(action.type);
  if (action.payload) { console.log("payload:", action.payload); }
  if (action.meta) { console.log("meta:", action.meta); }
  console.log("state: ", store.getState());
  console.groupEnd(action.type);

  return result;
};

export default logger;
