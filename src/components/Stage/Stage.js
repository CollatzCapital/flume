import React from "react";
import styles from "./Stage.css";
import { Portal } from "react-portal";
import ContextMenu from "../ContextMenu/ContextMenu";
import { NodeTypesContext, NodeDispatchContext, SelectedNodesDispatchContext } from "../../context";
import Draggable from "../Draggable/Draggable";
import orderBy from "lodash/orderBy";
import clamp from "lodash/clamp";
import { STAGE_ID } from "../../constants";

const Stage = ({
  scale,
  translate,
  editorId,
  dispatchStageState,
  children,
  outerStageChildren,
  numNodes,
  stageRef,
  controlToPan,
  dispatchComments,
  disableComments,
  disablePan,
  disableZoom
}) => {
  const nodeTypes = React.useContext(NodeTypesContext);
  const dispatchNodes = React.useContext(NodeDispatchContext);
  const dispatchSelectedNodes = React.useContext(SelectedNodesDispatchContext);
  const wrapper = React.useRef();
  const translateWrapper = React.useRef();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState({ x: 0, y: 0 });
  const dragData = React.useRef({ x: 0, y: 0 });
  const [ctrlIsPressed, setCtrlIsPressed] = React.useState(false);

  const setStageRect = React.useCallback(() => {
    stageRef.current = wrapper.current.getBoundingClientRect();
  }, []);

  React.useEffect(() => {
    stageRef.current = wrapper.current.getBoundingClientRect();
    window.addEventListener("resize", setStageRect);
    return () => {
      window.removeEventListener("resize", setStageRect);
    };
  }, [stageRef, setStageRect]);

  const handleWheel = React.useCallback(
    e => {
      if (e.target.nodeName === "TEXTAREA" || e.target.dataset.comment) {
        if (e.target.clientHeight < e.target.scrollHeight) return;
      }
      e.preventDefault();
      if (numNodes > 0) {
        const delta = e.deltaY;
        dispatchStageState(({ scale }) => ({
          type: "SET_SCALE",
          scale: clamp(scale - clamp(delta, -10, 10) * 0.005, 0.1, 7)
        }));
      }
    },
    [dispatchStageState, numNodes]
  );

  const handleDragDelayStart = e => {
    wrapper.current.focus();
  };

  const handleDragStart = e => {
    e.preventDefault();
    dragData.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseDrag = (coords, e) => {
    const xDistance = dragData.current.x - e.clientX;
    const yDistance = dragData.current.y - e.clientY;
    translateWrapper.current.style.transform = `translate(${-(
      translate.x + xDistance
    )}px, ${-(translate.y + yDistance)}px)`;
  };

  const handleDragEnd = e => {
    const xDistance = dragData.current.x - e.clientX;
    const yDistance = dragData.current.y - e.clientY;
    dragData.current.x = e.clientX;
    dragData.current.y = e.clientY;
    dispatchStageState(({ translate: tran }) => ({
      type: "SET_TRANSLATE",
      translate: {
        x: tran.x + xDistance,
        y: tran.y + yDistance
      }
    }));
  };

  const handleContextMenu = e => {
    e.preventDefault();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
    return false;
  };

  const closeContextMenu = () => {
    setMenuOpen(false);
  };

  const byScale = value => (1 / scale) * value;

  const addNode = (nodeType, fromCursor, internalType = "") => {
    const schema = nodeTypes[nodeType];
    if (schema) {
      const wrapperRect = wrapper.current.getBoundingClientRect();
      const xOffset = fromCursor
        ? byScale(menuCoordinates.x - wrapperRect.x - wrapperRect.width / 2)
        : byScale(200 -wrapperRect.x - wrapperRect.width / 2);
      const yOffset = fromCursor
        ? byScale(menuCoordinates.y - wrapperRect.y - wrapperRect.height / 2)
        : byScale(100 -wrapperRect.y - wrapperRect.height / 2);
      const x = xOffset + byScale(translate.x);
      const y = yOffset + byScale(translate.y);
      if (internalType === "comment") {
        dispatchComments({
          type: "ADD_COMMENT",
          x,
          y
        });
      } else {
        dispatchNodes({
          type: "ADD_NODE",
          x,
          y,
          name: schema.label,
          nodeType
        });
      }
    }
  };

  React.useImperativeHandle(stageRef, () => ({
    addNode: nodeType => {
      addNode(nodeType);
    },
    clearNodes: () => {
      dispatchNodes({
        type: "CLEAR_NODES"
      });
    }
  }));

  const handleDocumentKeyUp = e => {
    if (e.which === 17) {
      setCtrlIsPressed(false);
      document.removeEventListener("keyup", handleDocumentKeyUp);
    }
  };

  const handleKeyDown = e => {
    if (e.which === 17 && document.activeElement === wrapper.current) {
      e.preventDefault();
      e.stopPropagation();
      setCtrlIsPressed(true);
      document.addEventListener("keyup", handleDocumentKeyUp);
    }
  };

  const handleMouseEnter = () => {
    if (!wrapper.current.contains(document.activeElement)) {
      wrapper.current.focus();
    }
  };

  React.useEffect(() => {
    if (!disableZoom) {
      let stageWrapper = wrapper.current;
      stageWrapper.addEventListener("wheel", handleWheel);
      return () => {
        stageWrapper.removeEventListener("wheel", handleWheel);
      };
    }
  }, [handleWheel, disableZoom]);

  const menuOptions = React.useMemo(() => {
    const options = orderBy(
      Object.values(nodeTypes)
        .filter(node => node.addable !== false)
        .map(node => ({
          value: node.type,
          label: node.label,
          description: node.description,
          sortIndex: node.sortIndex,
          node
        })),
      ["sortIndex", "label"]
    );
    if (!disableComments) {
      options.push({
        value: "comment",
        label: "Comment",
        description: "A comment for documenting nodes",
        internalType: "comment"
      });
    }
    return options;
  }, [nodeTypes, disableComments]);
  const handleMouseDown = () => {
    dispatchSelectedNodes({
      type: "CLEAR_SELECTION"
    });
  }

  return (
    <Draggable
      id={`${STAGE_ID}${editorId}`}
      className={styles.wrapper}
      innerRef={wrapper}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onDragDelayStart={handleDragDelayStart}
      onDragStart={handleDragStart}
      onDrag={handleMouseDrag}
      onDragEnd={handleDragEnd}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      stageState={{ scale, translate }}
      style={{ cursor: ctrlIsPressed && controlToPan ? "grab" : "" }}
      disabled={disablePan || (controlToPan && !ctrlIsPressed)}
      data-flume-stage={true}
    >
      {menuOpen ? (
        <Portal>
          <ContextMenu
            x={menuCoordinates.x}
            y={menuCoordinates.y}
            options={menuOptions}
            onRequestClose={closeContextMenu}
            onOptionSelected={o => addNode(o.node.type, true, o.internalType)}
            label="Add Node"
          />
        </Portal>
      ) : null}
      <div
        ref={translateWrapper}
        className={styles.transformWrapper}
        style={{ transform: `translate(${-translate.x}px, ${-translate.y}px)` }}
      >
        <div
          className={styles.scaleWrapper}
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
      {outerStageChildren}
    </Draggable>
  );
};
export default Stage;
