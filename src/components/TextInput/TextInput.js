import React from "react";
import styles from "./TextInput.css";
import { RecalculateStageRectContext } from "../../context";

const TextInput = ({
  placeholder,
  updateNodeConnections,
  onChange,
  data,
  type
}) => {
  const textInput = React.useRef();
  const numberInput = React.useRef();
  const recalculateStageRect = React.useContext(RecalculateStageRectContext);

  const handleDragEnd = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  const handleMouseMove = e => {
    e.stopPropagation();
    updateNodeConnections();
  };

  const handlePossibleResize = e => {
    e.stopPropagation();
    recalculateStageRect();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleDragEnd);
  };

  return (
    <div className={styles.wrapper}>
      {type === "number" ? (
        <input
          onKeyDown={e => {
            if (e.keyCode === 69) {
              e.preventDefault();
              return false;
            } 
            else if (e.key === "Escape") {
              numberInput.current.value = 0;
              onChange(0);
            }
          }}
          onChange={e => {
            const inputValue = e.target.value.replace(/[^0-9.]+/g, "");
            if (!!inputValue) {
              const value = parseFloat(inputValue, 10);
              onChange(value);
            }
          }}
          onBlur={e => {
            if (!e.target.value) {
              onChange(0);
              numberInput.current.value = 0;
            }
          }}
          onMouseDown={handlePossibleResize}
          type="number"
          placeholder={placeholder}
          className={styles.input}
          defaultValue={data}
          onDragStart={e => e.stopPropagation()}
          ref={numberInput}
        />
      ) : (
        <input
          ref={textInput}
          onKeyDown={e => {
            if (e.key === "Escape") {
              textInput.current.value = "";
              onChange("");
            }
          }}
          onChange={e => onChange(e.target.value)}
          onMouseDown={handlePossibleResize}
          type="text"
          placeholder={placeholder}
          className={styles.input}
          value={data}
          spellCheck={false}
          onDragStart={e => e.stopPropagation()}
        ></input>
        // <textarea
        //   onChange={e => onChange(e.target.value)}
        //   onMouseDown={handlePossibleResize}
        //   type="text"
        //   placeholder={placeholder}
        //   className={styles.input}
        //   value={data}
        //   onDragStart={e => e.stopPropagation()}
        // />
      )}
    </div>
  );
};

export default TextInput;
