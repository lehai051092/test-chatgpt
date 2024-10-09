import { useEffect, useState } from "react";

import styles from "./styles.module.css";

const FreeStoryInterrupt = ({ processTag }) => {
  const [flg, setFlg] = useState(false);
  useEffect(() => {
    setFlg(processTag);
  }, [processTag]);

  return (
    <div>
      <button
        className={`${!flg ? styles.video_chat_terminate_btn_cursor_not_allowed : styles.video_chat_terminate_btn_no_icon}`}
      >
        中断する
      </button>
    </div>
  );
};

export default FreeStoryInterrupt;
