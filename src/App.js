import React from "react";
import { useState } from "react";
import ReactTableDragColumnRow from "./Table";

import "./styles.css";

export default function App() {
  let [data, setData] = useState({
    heads: ["id", "first name", "last name", "date", "duration"],
    rows: [
      [0, "yoav", "sharon", '17-06-21', 2],
      [1, "yoav", "sharon", '17-06-21', 2],
      [2, "yoav", "sharon", '17-06-21', 3],
      [3, "yoav", "sharon", '17-06-21', 2]
    ]
  });
  return (
    <div>
      <div className="heading">
        <h1>React table drag column row</h1>
      </div>
      <ReactTableDragColumnRow
        heads={data.heads}
        rows={data.rows}
        onDragEnd={(type, from, to, newData) => {
          console.log({
            type,
            from,
            to,
            newData
          });
          setData(newData);
        }}
      />
    </div>
  );
}
