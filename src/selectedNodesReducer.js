export default (selectedNodes = [], action) => {
  switch (action.type) {
    case "CLICK_NODE":
      if (selectedNodes.length === 1 
        && selectedNodes.includes(action.selectedNode)){
        return selectedNodes
      } else {
        return [action.selectedNode];
      }
    case "SELECT_NODES":
      return [...selectedNodes, ...action.selectedNodes];
    default:
      return selectedNodes;
  }
};
