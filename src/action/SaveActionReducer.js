export default  (state = 0, action) => {
    switch (action.type) {
      case 'saveOk': return 1;
      case 'init': return 0;
      default: return state;
    }
  };
  