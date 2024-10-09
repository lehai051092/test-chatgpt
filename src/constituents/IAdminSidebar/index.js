import React, { useState, useEffect, useRef, createContext } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

// import logo from "../../property/images/logo.png";
// import icon01 from "../../property/images/sidebar_icon/icon01.svg";
// import icon02 from "../../property/images/sidebar_icon/icon02.svg";
// import HistorycheckIcon from "../../property/images/sidebar_icon/historycheck.svg";
// import EvluationIcon from "../../property/images/sidebar_icon/evaluation.svg";
// import EditScoringIcon from "../../property/images/sidebar_icon/edit_scoring_icon.svg";
// import RegisterSynonymsIcon from "../../property/images/sidebar_icon/register_synonyms_icon.svg";
import { connect } from "react-redux";
// import sidebarList from './sidebarList';
import { adminSidebarList } from "./sidebarList";

import "./styles.css";
import { setLocationState } from "../../utils/util";
const AdminSidebar = ({
  isOpen,
  setIsOpen,
  className,
  style,
  login_task_all,
}) => {
  const [height, setHeight] = useState();
  const elementRef = useRef(null);
  const [roleList, setRoleList] = useState([]);
  const [userRole, setUserRole] = useState();
  const [removeSidebar, setRemoveSidebar] = useState([]);

  useEffect(() => {
    setHeight(elementRef.current.clientHeight);
    if (login_task_all) {
      // console.log(login_task_all.aanetRoles[0], "logRoles")
      // setUserRole(login_task_all.aanetRoles[1])
      // setRoleList(login_task_all.aanetRoles)
    }
  }, []); //empty dependency array so

  const { t } = useTranslation();

  useEffect(() => {
    if (userRole) {
      let arr = [];
      //need to add this condition if api get response for role
      // if(userRole == "EVALUATOR"){
      //     arr.push("HistoryCheck","Evalutaion","aa")
      // }
      // if(userRole == "ADMINISTRATOR"){
      //     arr.push("Evalutaion","aa")
      // }
      setRemoveSidebar(arr);
    }
  }, [userRole]); //handle sidebar

  return (
    <>
      <div id="sidebar" name="sidebar" className="sidebar-large over-height">
        <div>
          <div className="logo-sec">
            <NavLink
              to="/start-new-role-play"
              activeClassName={`current`}
              id="sidebar_link"
              name="sidebar_link"
              onClick={()=>{
                setLocationState('','start-new-role-play');
              }}
            >
              {/* <img
                src={logo}
                className="mw-100"
                alt="logo"
                id="sidebar_icon"
                name="sidebar_icon"
              /> */}
            </NavLink>{" "}
            <h6 className="" id="sidebar_header" name="sidebar_header">
              {t("sidebar.recruiter_training_ai")}
            </h6>
          </div>

          <ul className="sidebar-menu" ref={elementRef}>
            {adminSidebarList.map((menu, index) => {
              if (!removeSidebar.includes(menu.name)) {
                return (
                  <li key={index} id={menu.name} name={menu.name}>
                    <NavLink
                      id={`link_${menu.name}`}
                      name={`link_${menu.name}`}
                      to={menu.url}
                      activeClassName={`current`}
                      onClick={() => {
                        setLocationState(null, (menu.url).substring(1))
                      }}
                    >
                      <img
                        id={`icon_${menu.name}`}
                        name={`icon_${menu.name}`}
                        src={menu.icon}
                        alt="sidebar icon"
                        className={`${menu.icon == "export"?'d-none':'d-block'}`}
                      />
                      {/* <span id={`text_${menu.name}`} name={`text_${menu.name}`}>
                        {t(menu.text)}
                      </span> */}

                      <span id={`text_${menu.name}`} name={`text_${menu.name}`} dangerouslySetInnerHTML={{ __html: t(menu.text) }} />
                    </NavLink>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

const stateToProps = (state) => {
  return {
    login_task_all: state.login_task_all,
  };
};

export default connect(stateToProps, null)(AdminSidebar);
