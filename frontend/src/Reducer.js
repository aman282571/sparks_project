export function Reducer(state, action) {
  switch (action.type) {
    case "login":
      return { id: action.payload.id };
    case "logout":
      return { id: null };
    default:
      return state;
  }
}
