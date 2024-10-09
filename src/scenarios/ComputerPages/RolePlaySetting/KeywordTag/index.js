import React, { useState } from "react";

import classes from "./styles.module.css";

const KeywordTag = ({
  title,
  className,
  style,
  id,
  disabled,
  onChange,
  dataIndex1,
  dataIndex2,
  removeKeyword,
}) => {
  const [edit, setEdit] = useState(true);
  return (
    <div
      className={`${classes.add_keyword_btn} ${className}`}
      id={id}
      name={id}
      disabled={disabled}
      style={style}
    >
      {/* {edit?
            <span>{title}</span>
            : */}
      <input
        type="text"
        placeholder={title}
        value={title}
        onChange={onChange}
        data-index1={dataIndex1}
        data-index2={dataIndex2}
        id={`${id}_input`}
        name={`${id}_input`}
      />
      {/* } */}
      <button onClick={() => removeKeyword(dataIndex1, dataIndex2)}> x</button>
    </div>
  );
};

export default KeywordTag;
