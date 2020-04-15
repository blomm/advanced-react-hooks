export default function speakerReducer(state, action) {
  function updatefavorite(favorite) {
    return state.map((item, index) => {
      if (item.id == action.sessionId) {
        item.favorite = favorite;
        return item;
      }
      return item;
    });
  }

  switch (action.type) {
    case 'setSpeakerList':
      return action.data;
    case 'favorite':
      return updatefavorite(true);
    case 'unfavorite':
      return updatefavorite(false);
    default:
      return state;
  }
}
