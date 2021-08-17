export default (selectedNodes = [], action) => {
  switch (action.type) {
    case "TOGGLE_CLICK_NODE":
      let shouldAdd = true;
      let newState = [];
      selectedNodes.forEach(nodeId => {
        if (nodeId === action.selectedNode) {
          shouldAdd = false;
        } else {
          newState.push(nodeId);
        }
      });
      if (shouldAdd) {
        newState.push(action.selectedNode);
      }
      return newState;
    case "CLICK_NODE":
      let isNodeSelected = false;
      selectedNodes.forEach(nodeId => {
        if (nodeId === action.selectedNode) {
          isNodeSelected = true;
        }
      });
      if (!isNodeSelected) {
        return [action.selectedNode];
      } else {
        return selectedNodes;
      }
    case "CLEAR_SELECTION":
      if (selectedNodes.length > 0) {
        return [];
      } else {
        return selectedNodes;
      }
    case "SELECT_NODES":
      return [...selectedNodes, ...action.selectedNodes];
    default:
      return selectedNodes;
  }
};
