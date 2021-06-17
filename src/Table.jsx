import React, { useState, useRef, useEffect } from "react";

// tell direction after drag start, the first dirction that reach 5px offset
const DRAG_DIRECTION_NONE = "";
const DRAG_DIRECTION_ROW = "row";
const DRAG_DIRECTION_COLUMN = "column";

const defaultDrageState = {
  column: -1,
  row: -1,
  startPoint: null,
  direction: DRAG_DIRECTION_NONE, // row=move up down/column=move left right,
  dropIndex: -1 // drag target
}

export default function ReactTableDragColumnRow (props) {
  let { heads = [], rows = [], onDragEnd } = props;
  let [dragState, setDragState] = useState({ ...defaultDrageState });
  const preview = useRef(null);

    function offsetIndex(from, to, arr = []) {
      if (from < to) {
        let start = arr.slice(0, from),
          between = arr.slice(from + 1, to + 1),
          end = arr.slice(to + 1);
        return [...start, ...between, arr[from], ...end];
      }
      if (from > to) {
        let start = arr.slice(0, to),
          between = arr.slice(to, from),
          end = arr.slice(from + 1);
        return [...start, arr[from], ...between, ...end];
      }
      return arr;
    }

  useEffect(()=>{
    if (dragState.direction === DRAG_DIRECTION_COLUMN) {
      heads = offsetIndex(dragState.column, dragState.dropIndex, heads);
      rows = rows.map(x => offsetIndex(dragState.column, dragState.dropIndex, x));
    }

    if (dragState.direction === DRAG_DIRECTION_ROW) {
      rows = offsetIndex(dragState.row, dragState.dropIndex, rows);
    }
  }, [dragState])


  return (
    <div>
      <table id="table">
        <thead>
          <tr>
            {heads.map((x, i) => (
              <th key={i}>{x}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((x = [], i) => (
            <tr key={i}>
              {x.map((y, j) => (
                <td
                  key={j}
                  style={{
                    cursor: dragState.direction ? "move" : "grab",
                    opacity:
                      dragState.direction === DRAG_DIRECTION_COLUMN
                        ? dragState.dropIndex === j
                          ? 0.5
                          : 1
                        : dragState.direction === DRAG_DIRECTION_ROW
                        ? dragState.dropIndex === i
                          ? 0.5
                          : 1
                        : 1
                  }}
                  draggable="true"
                  onDragStart={e => {
                    console.log(`onDragStart`);
                    e.dataTransfer.setDragImage(preview.current, 0, 0);
                    setDragState({
                      ...dragState,
                      row: i,
                      column: j,
                      startPoint: {
                        x: e.pageX,
                        y: e.pageY
                      }
                    });
                  }}
                  onDragEnter={e => {
                    console.log(`onDragEnter`);
                    if (!dragState.direction) {
                      if (dragState.column !== j) {
                        setDragState({
                          ...dragState,
                          direction: DRAG_DIRECTION_COLUMN,
                          dropIndex: j
                        });
                        return;
                      }
                      if (dragState.row !== i) {
                        setDragState({
                          ...dragState,
                          direction: DRAG_DIRECTION_ROW,
                          dropIndex: i
                        });
                        return;
                      }
                      return;
                    }

                    if (dragState.direction === DRAG_DIRECTION_COLUMN) {
                      if (j !== dragState.dropIndex) {
                        setDragState({
                          ...dragState,
                          dropIndex: j
                        });
                      }
                      return;
                    }
                    if (dragState.direction === DRAG_DIRECTION_ROW) {
                      if (i !== dragState.dropIndex) {
                        setDragState({
                          ...dragState,
                          dropIndex: i
                        });
                      }
                      return;
                    }
                  }}
                  onDragEnd={() => {
                    console.log(`onDragEnd`);
                    onDragEnd(
                      dragState.direction,
                      dragState.direction === DRAG_DIRECTION_COLUMN
                        ? dragState.column
                        : dragState.row,
                      dragState.dropIndex,
                      { heads, rows }
                    );
                    setDragState({ ...defaultDrageState });
                  }}
                >
                  {y}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        ref={preview}
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden"
        }}
      />
    </div>
  );
};
