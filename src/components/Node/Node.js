import React from "react";
import styles from "./Node.css";
import {
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
import { faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Node = ({
  id,
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
  const {
    label,
    description,
    deletable,
    inputs = [],
    outputs = []
  } = nodeTypes[type];

  const nodeWrapper = React.useRef();
  const tooltipRef = React.useRef();
  const [titleMenuOpen, setTitleMenuOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState({ x: 0, y: 0 });

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

  const handleTitleContextMenu = e => {
    e.preventDefault();
    e.stopPropagation();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setTitleMenuOpen(true);
    return false;
  };
  const closeTitleContextMenu = () => {
    setTitleMenuOpen(false);
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

  return (
    <Draggable
      className={styles.wrapper}
      style={{
        width,
        transform: `translate(${x}px, ${y}px)`
      }}
      onDragStart={startDrag}
      onDrag={handleDrag}
      onDragEnd={stopDrag}
      innerRef={nodeWrapper}
      data-node-id={id}
      stageState={stageState}
      stageRect={stageRect}
      onContextMenu={handleContextMenu}
    >
      <div className={styles.titleBar} onContextMenu={handleTitleContextMenu}>
        <p className={styles.title}>{label}</p>
        {/* <div
          className={styles.titleBarInfoIcon}
          // onMouseMove={onInfoCircleMouseMove}
        >
          <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
          <div ref={tooltipRef} className={styles.nodeTooltip}>
            <p className={styles.nodeTooltipTitle}>{label}</p>
            {description}
          </div>
        </div> */}
        {deletable !== false ? (
          <div className={styles.titleBarCloseIcon} onClick={deleteNode}>
            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
          </div>
        ) : null}
      </div>
      <IoPorts
        nodeId={id}
        inputs={inputs}
        outputs={outputs}
        connections={connections}
        updateNodeConnections={updateNodeConnections}
        inputData={inputData}
      />
      {titleMenuOpen ? (
        <Portal>
          <ContextMenu
            x={menuCoordinates.x}
            y={menuCoordinates.y}
            options={[
              {
                label: "Rename",
                value: "rename",
                description: "Renames the current node."
              }
            ]}
            onRequestClose={closeTitleContextMenu}
            onOptionSelected={handleMenuOption}
            hideFilter
            label={label}
            description={description}
            emptyText="This node has no options."
          />
        </Portal>
      ) : null}
      {/* {menuOpen ? (
        <Portal>
          <ContextMenu
            x={menuCoordinates.x}
            y={menuCoordinates.y}
            options={[
              ...(deletable !== false
                ? [
                    {
                      label: "Delete Node",
                      value: "deleteNode",
                      description: "Deletes a node and all of its connections."
                    }
                  ]
                : [])
            ]}
            onRequestClose={closeContextMenu}
            onOptionSelected={handleMenuOption}
            hideFilter
            label="Node Options"
            emptyText="This node has no options."
          />
        </Portal>
      ) : null} */}
    </Draggable>
  );
};

export default Node;
