import React, {useCallback, useEffect, useRef, useState} from "react";
import {IsIE, resumeScroll, suspendScroll, useWindowDimensions} from "./util";
import store from "../storage";
import {updateTalkScriptDialogPosition} from "../storage/reduxActions";

export const useDragAndDrop = ({
                                 onClose,
                                 startPosition,
                               }) => {
  const isIE = IsIE();
  const divRef = useRef(null);
  const [state, setState] = useState({
    // ドラッグとみなす
    isDrag: false,
    // クリックとみなす
    isClick: false,
    // オブジェクトの位置
    x: 0,
    y: 0
  });
  const { width, height } = useWindowDimensions();
  const prevWidth = useRef();
  const prevHeight = useRef();
  const [position, setPosition] = useState();

  const displayChatRight = useCallback((e) => {
    if (onClose) {
      if (!e.target) return false;
      const target = e.target;
      if (
          target instanceof HTMLImageElement &&
          ['dragAndDropChatHeaderCloseButton'].some((val) => val === target.id)
      ) {
        if (position) {
          store.dispatch(updateTalkScriptDialogPosition({
            x: {
              direction: "left",
              quantity: position.left.toString() + 'px'
            },
            y: {
              direction: "top",
              quantity: position.top.toString() + 'px'
            }
          }))
        }
        onClose()
      }
    }
  }, [onClose, position]);


  const checkUseElementEvent = useCallback(
      (e) => {
        if (!e.target) return false;
        const target = e.target;
        if (
            target instanceof HTMLDivElement ||
            target instanceof HTMLImageElement ||
            target instanceof HTMLSpanElement ||
            target instanceof HTMLButtonElement
        ) {
          return ['dragAndDropChatHeader', 'dragAndDropChatHeaderTitle', 'dragAndDropChatHeaderCloseButton'].some((val) => val === target.id);
        } else return false;
      },
      []
  );

  /**
   * ドラッグ開始イベント
   */
  const handleDown = useCallback((e) => {
    e.preventDefault();
    if (!checkUseElementEvent(e)) return;
    let event
    if (e.type === "mousedown") {
      event = e
    } else {
      const touchEvent = e
      event = touchEvent.changedTouches[0];
    }
    if (divRef.current) {
      // ドラッグ中はスクロールを止める
      suspendScroll();
      setState({
        isDrag: true,
        isClick: true,
        x: event.pageX - divRef.current.offsetLeft,
        y: event.pageY - divRef.current.offsetTop
      });
    }
  }, [checkUseElementEvent]);

  /**
   * ドラッグ移動中のイベント
   * @param e イベントソース
   */
  const handleMove = useCallback(
      (e) => {
        e.preventDefault();
        let event
        if (e.type === "mousemove" || e.type === "mouseleave") {
          event = e
        } else {
          const touchEvent = e
          event = touchEvent.changedTouches[0];
        }
        if (state.isDrag && divRef.current) {
          setPosition({
            top: event.pageY - state.y,
            left: event.pageX - state.x
          });
          setState({ ...state, isClick: false });
        }
      },
      [state]
  );

  /**
   * ドラッグ終了イベント
   */
  const handleUp = useCallback(
      (e) => {
        e.preventDefault();
        if (!checkUseElementEvent(e)) return;
        // ドラッグ終了時、スクロールを再開させる
        resumeScroll();
        if (state.isClick) {
          displayChatRight(e);
        }
        if (state.isDrag) {
          // 初期化
          setState({ ...state, isDrag: false, isClick: false });
        }
      },
      [displayChatRight, state, checkUseElementEvent]
  );
  const createStartPosition = useCallback(
      (
          ref,
          position
      ) => {
        if (ref.current) {
          switch (position.direction) {
            case "top": {
              ref.current.style.top = position.quantity;
              break;
            }
            case "bottom": {
              ref.current.style.bottom = position.quantity;
              break;
            }
            case "left": {
              ref.current.style.left = position.quantity;
              break;
            }
            case "right": {
              ref.current.style.right = position.quantity;
            }
          }
        }
      },
      []
  );

  /**
   * 副作用フック（座標の変更を画面に反映する）
   */
  useEffect(() => {
    if (divRef.current && width <= 767) {
      return;
    }
    if (divRef.current) {
      if (position) {
        // ドラッグによる位置変更は指定座標に表示
        divRef.current.style.removeProperty("bottom");
        divRef.current.style.removeProperty("right");
        divRef.current.style.top = `${position.top}px`;
        divRef.current.style.left = `${position.left}px`;

        // ウィンドウを超えている場合、位置を補正
        const result = {
          top: position.top,
          left: position.left
        };

        divRef.current.style.top = `${result.top}px`;
        divRef.current.style.left = `${result.left}px`;
      } else {
        // 初回起動
        divRef.current.style.removeProperty("bottom");
        divRef.current.style.removeProperty("right");
        divRef.current.style.removeProperty("top");
        divRef.current.style.removeProperty("left");
        createStartPosition(divRef, startPosition.x);
        createStartPosition(divRef, startPosition.y);
        divRef.current.style.visibility = 'visible'
      }
      document.body.style.overflow = "auto";
    }
  }, [
    position,
    width,
    height,
    createStartPosition
  ]);

  /**
   * 副作用フック（画面リサイズ時）
   */
  useEffect(() => {
    if (divRef.current) {
      return;
    }
    if (divRef.current && position) {
      // 現在値
      const result = {
        top: position.top,
        left: position.left
      };

      if (divRef.current.style.display !== "none") {
        // ウィンドウを超えている場合、位置を補正
        if (
            width < divRef.current.getBoundingClientRect().right &&
            prevWidth.current
        ) {
          result.left -= prevWidth.current - width;
        }
        if (
            height < divRef.current.getBoundingClientRect().bottom &&
            prevHeight.current
        ) {
          result.top -= prevHeight.current - height;
        }
      }
      setPosition(result);
    }
    // 前回値を設定
    prevWidth.current = width;
    prevHeight.current = height;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);
  /**
   * 副作用フック（初期起動時、イベントを追加する）
   */
  useEffect(() => {
    // イベント追加
    const addEvent = () => {
      if (!isIE) {
        divRef.current?.addEventListener("mousedown", handleDown, {
          passive: false
        });
        divRef.current?.addEventListener("touchstart", handleDown, {
          passive: true
        });
        divRef.current?.addEventListener("mousemove", handleMove, {
          passive: false
        });
        divRef.current?.addEventListener("touchmove", handleMove, {
          passive: true
        });
        divRef.current?.addEventListener("mouseup", handleUp, {
          passive: false
        });
        divRef.current?.addEventListener("touchend", handleUp, {
          passive: true
        });
        divRef.current?.addEventListener("mouseleave", handleMove, {
          passive: false
        });
      }
    };

    // イベント削除
    const removeEvent = () => {
      if (!isIE) {
        divRef.current?.removeEventListener("mousedown", handleDown);
        divRef.current?.removeEventListener("touchstart", handleDown);
        divRef.current?.removeEventListener("mousemove", handleMove);
        divRef.current?.removeEventListener("touchmove", handleMove);
        divRef.current?.removeEventListener("mouseup", handleUp);
        divRef.current?.removeEventListener("touchend", handleUp);
        divRef.current?.removeEventListener("mouseleave", handleMove);
      }
    };

    // イベント追加
    addEvent();
    // イベント削除
    return () => {
      removeEvent();
    };
  }, [handleDown, handleMove, handleUp, isIE, position]);
  return {
    divRef
  };
};
