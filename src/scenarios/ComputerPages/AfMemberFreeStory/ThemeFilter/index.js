import React, { useState, useEffect, useRef } from "react";
import classes from "./styles.module.css";
import { Row, Col } from "reactstrap";
import { getLessonCategories } from "../../../../request/backendApi/api";
import logger from "redux-logger";
import up_arrow from "../../../../property/images/up_arrow.png";
import down_arrow from "../../../../property/images/down_arrow.png";
import down_arrow_white from "../../../../property/images/drop_down_white.png";
import { browserRedirect } from '../../../../utils/util';
import store from "../../../../storage";

function ThemeFilter({
  f_getSelectedTheme,
  vControlTheme,
  setControlTheme,
  vHasAngentCode,
}) {
  const [vSelectedscenario, setSelectedscenario] = useState(null);
  const [vSelectedCategories, setSelectedCategories] = useState(null);
  const [vCategories, setCategories] = useState([]);
  const [vResponseError, setResponseError] = useState(false);
  const [vErrorMessage, setErrorMessage] = useState();
  const [vSelectedTheme, setSelectedTheme] = useState();
  const [vSelectedScen, setSelectedScen] = useState();
  const [vLessonCategories, setLessonCategories] = useState();

  const list = useRef();
  const scenarioList = useRef();

  const [openScenario, setOpenScenario] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (vControlTheme) {
      setSelectedTheme("all");
      setSelectedScen("all");
      vLessonCategories && f_getSelectedTheme(null, null, vLessonCategories);
      setSelectedCategories(null);
      setSelectedscenario(null);
    }
  }, [vControlTheme]);
  const f_getLessonCategories = async () => {
    try {
      const data = getLessonCategories(
        "/lessons/category?type=employeeHistory&specialAS="+store.getState().user_special_as
      ).then((res) => {
        if (res.data) {
          setCategories(res.data);

          let resData = res.data;
          let scenarioList = [];
          // let filterDefault = resData.filter(item => item.themeCode === "proposal");
          resData.map((item, key) => {
            item?.scenario.map((item1, key1) => {
              scenarioList.push({ scenario: item1, themeName: item.themeName });
            });
          });

          setLessonCategories(scenarioList);
          // setSelectedCategories(defaultTheme);
          // setSelectedscenario(defaultScenario);
          f_getSelectedTheme(null, null, scenarioList);
          // f_getSelectedTheme(
          //     res.data[0]?.themeCode,
          //     res.data[0]?.scenario[0].scenarioCode
          // );
        } else {
          logger.error("Error occured when get API /lessons");
        }
      });
    } catch (error) {
      setResponseError(true);
      setErrorMessage("エラーが発生しました。確認してもう一度お試しください。");
      console.log(
        `Error occured when get API /lessons/category: ${JSON.stringify(error)}`
      );
    }
  };

  useEffect(() => {
    !vHasAngentCode && f_getLessonCategories();
  }, []);

  const itemClick = (event) => {
    setOpen(false);
    setControlTheme(false);
    if (event.target.dataset.code != "all") {
      let theme = JSON.parse(event.target.dataset.items);
      setSelectedTheme(theme.themeCode);
      setSelectedCategories(JSON.parse(event.target.dataset.items));
      setSelectedscenario(null);

      let scenarioList = [];
      theme?.scenario.map((item1, key1) => {
        scenarioList.push({ scenario: item1, themeName: theme.themeName });
      });

      f_getSelectedTheme(theme.themeCode, null, scenarioList);
    } else {
      setSelectedTheme("all");
      setSelectedScen("all");
      setSelectedCategories(null);
      setSelectedscenario(null);

      let scenarioList = [];
      vCategories.map((item, key) => {
        item?.scenario.map((item1, key1) => {
          scenarioList.push({ scenario: item1, themeName: item.themeName });
        });
      });

      f_getSelectedTheme(null, null, scenarioList);
    }
  };

  const itemClickScenario = (event) => {
    setOpenScenario(false)
    setControlTheme(false);
    if (event.target.dataset.code != "all") {
      let scenario = JSON.parse(event.target.dataset.items);
      setSelectedScen(scenario.scenarioCode);
      setSelectedscenario(JSON.parse(event.target.dataset.items));

      let passScenario = [
        { scenario: scenario, themeName: vSelectedCategories.themeName },
      ];

      f_getSelectedTheme(
        vSelectedCategories?.themeCode,
        scenario?.scenarioCode,
        passScenario
      );
    } else {
      setSelectedScen("all");
      setSelectedscenario(null);
      if (vSelectedCategories) {
        let scenarioList = [];
        vSelectedCategories?.scenario.map((item1, key1) => {
          scenarioList.push({
            scenario: item1,
            themeName: vSelectedCategories?.themeName,
          });
        });
        f_getSelectedTheme(vSelectedCategories?.themeCode, null, scenarioList);
      } else {
        let scenarioList = [];
        vCategories.map((item, key) => {
          item?.scenario.map((item1, key1) => {
            scenarioList.push({ scenario: item1, themeName: item.themeName });
          });
        });
        f_getSelectedTheme(null, null, scenarioList);
      }
    }
  };

  const onOpenScenario = () => {
    setOpenScenario(true);
    scenarioList.current.focus();
  };
  const closeScenario = () => {
    setOpenScenario(false);
  };
  const onOpen = () => {
    setOpen(true);
    list.current.focus();
  };
  const close = () => {
    setOpen(false);
  };
  return (
    <>
      {/* <Row className="ml-0 mr-0">
      <div className={`${classes.label_box} mr-3`}>学習テーマ</div>
      <div className={`${classes.label_box} mr-3`}>シナリオ</div>
      </Row> */}
      <Row className={`ml-0 mr-0 ${browserRedirect()!=1 ? browserRedirect() === 3 ? classes.tablet_view : classes.mobile_view : classes.pc_view} ${classes.select_wrappers}`}>      
      
        <div className={classes.select_wrapper}>
          <div className={`${classes.label_box}`}>学習テーマ</div>
          <div
            className={`${classes.select_box} mr-3`}
            id={`wrapper`}
            name={`wrapper`}
          >   
            <div
              onClick={onOpen}
              className={`${open && classes.select_box_close_radius} `}
            >
              <span id={`select_data`} name={`select_data`} className={classes.select_span_wrapper}>
                <span>{vSelectedCategories
                  ? vSelectedCategories.themeName
                  : "全学習テーマ"}</span>
              </span>
              <span><img
                src={`${open ? up_arrow : down_arrow_white} `}
                className={`${classes.arrows} `}
              /></span>
            </div>
            <div
              tabIndex="0"
              ref={list}
              onBlur={close}
              id={`list_select_box`}
              name={`list_select_box`}
            >
              <ul
                className={`${open ? classes.showbox : classes.hidebox} `}
                id={`list_data`}
                name={`list_data`}
              >
                <li data-code={"all"} onClick={itemClick}>
                全学習テーマ
                </li>
                {!vHasAngentCode &&
                  vCategories &&
                  vCategories.map((option, index) => {
                    return (
                      <li
                        key={index}
                        data-code={option.themeCode}
                        data-items={JSON.stringify(option)}
                        onClick={itemClick}
                      >
                        {option.themeName}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>

        
        <div className={classes.select_wrapper}>
          <div className={`${classes.label_box}`}>シナリオ</div>
        <div
          className={`${classes.select_box}`}
          id={`wrapper_scenario`}
          name={`wrapper_scenario`}
        >
          <div
            onClick={onOpenScenario}
            className={`${openScenario && classes.select_box_close_radius} `}
          >
            <span id={`select_data`} name={`select_data`} className={classes.select_span_wrapper}>
              <span>
              {vSelectedscenario
                ? vSelectedscenario.scenarioName
                : "全シナリオ"}
              </span>
            </span>
            <span><img
              src={`${openScenario ? up_arrow : down_arrow_white} `}
              className={`${classes.arrows} `}
            /></span>
          </div>
          <div
            tabIndex="1"
            ref={scenarioList}
            onBlur={closeScenario}
            id={`list_select_box_scenario`}
            name={`list_select_box_scenario`}
          >
            <ul
              className={`${openScenario ? classes.showbox : classes.hidebox} `}
              id={`list_data_scenario`}
              name={`list_data_scenario`}
            >
              <li data-code={"all"} onClick={itemClickScenario}>
                全シナリオ
              </li>

              {vSelectedCategories &&
                vSelectedCategories?.scenario.map((option, index) => {
                  return (
                    <li
                      key={index}
                      data-code={option.scenarioCode}
                      data-items={JSON.stringify(option)}
                      onClick={itemClickScenario}
                    >
                      {option.scenarioName}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        </div>
        

      </Row>
    </>
  );
}

export default ThemeFilter;
