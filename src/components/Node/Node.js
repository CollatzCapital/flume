import React from "react";
import styles from "./Node.css";
import {
  SelectedNodesContext,
  SelectedNodesDispatchContext,
  NodeTypesContext,
  NodeDispatchContext,
  StageContext,
  CacheContext
} from "../../context";
import { getPortRect, calculateCurve } from "../../connectionCalculator";
import { Portal } from "react-portal";
import ContextMenu from "../ContextMenu/ContextMenu";
import IoPorts from "../IoPorts/IoPorts";
import Draggable from "../Draggable/Draggable";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Node = ({
  id,
  name,
  width,
  height,
  x,
  y,
  delay = 6,
  stageRect,
  connections,
  type,
  inputData,
  onDragStart,
  onDragEnd,
  onDrag
}) => {
  const cache = React.useContext(CacheContext);
  const nodeTypes = React.useContext(NodeTypesContext);
  const nodesDispatch = React.useContext(NodeDispatchContext);
  const stageState = React.useContext(StageContext);
  const selectedNodesContext = React.useContext(SelectedNodesContext);
  const dispatchSelectedNodes = React.useContext(SelectedNodesDispatchContext);
  const isSelected = selectedNodesContext.includes(id);
  const {
    label,
    description,
    deletable,
    inputs = [],
    outputs = []
  } = nodeTypes[type];
  const nodeWrapper = React.useRef();
  const titleEditor = React.useRef();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState({ x: 0, y: 0 });
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [editingName, setEditingName] = React.useState("");
  const [nodeName, setNodeName] = React.useState(name ? name : label);

  const byScale = value => (1 / stageState.scale) * value;

  const updateConnectionsByTransput = (transput = {}, isOutput) => {
    Object.entries(transput).forEach(([portName, outputs]) => {
      outputs.forEach(output => {
        const toRect = getPortRect(
          id,
          portName,
          isOutput ? "output" : "input",
          cache
        );
        const fromRect = getPortRect(
          output.nodeId,
          output.portName,
          isOutput ? "input" : "output",
          cache
        );
        const portHalf = fromRect.width / 2;
        let combined;
        if (isOutput) {
          combined = id + portName + output.nodeId + output.portName;
        } else {
          combined = output.nodeId + output.portName + id + portName;
        }
        let cnx;
        const cachedConnection = cache.current.connections[combined];
        if (cachedConnection) {
          cnx = cachedConnection;
        } else {
          cnx = document.querySelector(`[data-connection-id="${combined}"]`);
          cache.current.connections[combined] = cnx;
        }
        const from = {
          x:
            byScale(
              toRect.x -
                stageRect.current.x +
                portHalf -
                stageRect.current.width / 2
            ) + byScale(stageState.translate.x),
          y:
            byScale(
              toRect.y -
                stageRect.current.y +
                portHalf -
                stageRect.current.height / 2
            ) + byScale(stageState.translate.y)
        };
        const to = {
          x:
            byScale(
              fromRect.x -
                stageRect.current.x +
                portHalf -
                stageRect.current.width / 2
            ) + byScale(stageState.translate.x),
          y:
            byScale(
              fromRect.y -
                stageRect.current.y +
                portHalf -
                stageRect.current.height / 2
            ) + byScale(stageState.translate.y)
        };
        cnx.setAttribute("d", calculateCurve(from, to));
      });
    });
  };

  const updateNodeConnections = () => {
    if (connections) {
      updateConnectionsByTransput(connections.inputs);
      updateConnectionsByTransput(connections.outputs, true);
    }
  };

  const stopDrag = (e, coordinates) => {
    nodesDispatch({
      type: "SET_NODE_COORDINATES",
      ...coordinates,
      nodeId: id
    });
  };

  const handleDrag = ({ x, y }) => {
    nodeWrapper.current.style.transform = `translate(${x}px,${y}px)`;
    updateNodeConnections();
  };

  const startDrag = e => {
    onDragStart();
  };

  const handleContextMenu = e => {
    e.preventDefault();
    e.stopPropagation();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
    return false;
  };

  const closeContextMenu = () => {
    setMenuOpen(false);
  };

  const handleTickClicked = () => {
    setNodeName(editingName);
    setIsRenaming(false);
    setEditingName("");
    nodesDispatch({
      type: 'RENAME_NODE',
      nodeId: id,
      name: editingName
    })
  };

  const handleCloseClicked = () => {
    if (isRenaming) {
      setIsRenaming(false);
      setEditingName("");
    } else {
      deleteNode();
    }
  };

  const deleteNode = () => {
    nodesDispatch({
      type: "REMOVE_NODE",
      nodeId: id
    });
  };

  const handleMenuOption = ({ value }) => {
    switch (value) {
      case "deleteNode":
        deleteNode();
        break;
      case "renameNode":
        handleTitleDoubleClick();
        break;
      default:
        return;
    }
  };

  // const onInfoCircleMouseMove = event => {
  //   const left = event.clientX + 20;
  //   const top = event.clientY + 10;
  //   if (tooltipRef && tooltipRef.current) {
  //     tooltipRef.current.style.left = left + "px";
  //     tooltipRef.current.style.top = top + "px";
  //     tooltipRef.current.style.translate = `translate(${x}px, ${y}px)`;
  //   }
  // };

  const style = {
    width,
    transform: `translate(${x}px, ${y}px)`
  };
  if (isSelected) {
    style.outline = "black dashed 2px";
    style.zIndex = 2;
  }

  const onNodeSelected = e => {
    if (e.ctrlKey) {
      dispatchSelectedNodes({
        type: "TOGGLE_CLICK_NODE",
        selectedNode: id
      });
    } else {
      dispatchSelectedNodes({
        type: "CLICK_NODE",
        selectedNode: id
      });
    }
  };
  const handleTitleKeyDown = e => {
    switch (e.key) {
      case "Escape":
        handleCloseClicked();
        break;
      case "Enter":
      case "Tab":
        handleTickClicked();
        break;
      default:
        break;
    }
  };

  const handleTitleChanging = e => {
    setEditingName(e.target.value);
    setIsRenaming(true);
  };

  const handleTitleDoubleClick = () => {
    setEditingName(nodeName);
    setIsRenaming(true);
  };

  return (
    <Draggable
      className={styles.wrapper}
      style={style}
      onDragStart={startDrag}
      onDrag={handleDrag}
      onDragEnd={stopDrag}
      innerRef={nodeWrapper}
      data-node-id={id}
      stageState={stageState}
      stageRect={stageRect}
      onContextMenu={handleContextMenu}
      onMouseDown={e => onNodeSelected(e)}
    >
      <div className={styles.titleContainer}>
        {isRenaming ? (
          <div className={styles.titleBar}>
            <input
              type="text"
              className={styles.titleInput}
              onChange={e => handleTitleChanging(e)}
              onMouseDown={e => e.stopPropagation()}
              onKeyDown={e => handleTitleKeyDown(e)}
              defaultValue={editingName}
              ref={titleEditor}
            />
            <div
              className={styles.titleBarTickIcon}
              onClick={handleTickClicked}
            >
              <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
            </div>
            <div
              className={styles.titleBarCloseIcon}
              onClick={handleCloseClicked}
            >
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </div>
          </div>
        ) : (
          <p className={styles.title} onDoubleClick={handleTitleDoubleClick}>
            {nodeName}
          </p>
        )}
      </div>

      <IoPorts
        nodeId={id}
        inputs={inputs}
        outputs={outputs}
        connections={connections}
        updateNodeConnections={updateNodeConnections}
        inputData={inputData}
      />
      {menuOpen ? (
        <Portal>
          <ContextMenu
            x={menuCoordinates.x}
            y={menuCoordinates.y}
            options={[
              {
                label: "Rename Node",
                value: "renameNode"
              },
              {
                label: "Delete Node",
                value: "deleteNode"
              }
            ]}
            onRequestClose={closeContextMenu}
            onOptionSelected={handleMenuOption}
            hideFilter
            label={label}
            description={description}
            emptyText="This node has no options."
          />
        </Portal>
      ) : null}
    </Draggable>
  );
};

export default Node;
