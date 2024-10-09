import React from "react";
import Table from "react-bootstrap/Table";
import classes from './styles.module.css'
import ellipse from '../../../property/icons/ellipse.png';
import MandatoryTitle from '../../IMandatoryTitle'
import {useTranslation} from 'react-i18next'

function AgencyList() {
  const {t} = useTranslation();
  return (
    <>
      <div className={`table-responsive ${classes.container}`}>
      <Table className={`table ${classes.agency_list}`}>
        <thead>
          <tr>
            <th>{t('training.table_head_text_trainee')}</th>
            <th>{t('training.table_head_text_persona')}</th>
            <th>{t('training.table_head_text_scenario')}</th>
            <th>{t('training.table_head_text_date')}</th>
            <th colspan="3"><MandatoryTitle title={t('training.table_head_text_rate')} className="mb-0"/></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>120078</td>
            <td>Jiro Suzuki</td>
            <td>Letter problem</td>
            <td>2020/10/5 9:30</td>
            <td><img className="card_image" src={ellipse} /> 95% </td>
            <td><a href="javascript:void(0);" className="scenariolink" >{t('training.scenario_selection')}</a></td>
            <td><a className="historylink" href="javascript:void(0);">{t('training.scenario_history')}</a></td>
          </tr>
          <tr>
            <td>120078</td>
            <td>Jiro Suzuki</td>
            <td>Conservation Proposal Intro</td>
            <td>2020/10/5 9:30</td>
            <td><img className="card_image" src={ellipse} /> 75% </td>
            <td><a href="javascript:void(0);" className="scenariolink" >{t('training.scenario_selection')}</a></td>
            <td><a className="historylink" href="javascript:void(0);">{t('training.scenario_history')}</a></td>
          </tr>
          <tr>
            <td>120078</td>
            <td>Jiro Suzuki</td>
            <td>Recipient confirmation intro</td>
            <td>2020/10/5 9:30</td>
            <td><img className="card_image" src={ellipse} /> 55% </td>
            <td><a href="javascript:void(0);" className="scenariolink" >{t('training.scenario_selection')}</a></td>
            <td><a className="historylink" href="javascript:void(0);">{t('training.scenario_history')}</a></td>
          </tr>
        </tbody>
      </Table>
      </div>
    </>
  );
}

export default AgencyList;
