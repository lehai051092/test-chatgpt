import React from 'react'
import classes from './styles.module.css'

function PersonaScenioChartResult() {
    return (
        <div className={classes.persona_scenio_chart_result}>
            <div className={classes.chart_result_content}>
                <div className="chart_result_percentage">
                    <p className={classes.text}>Result</p>
                    <p className={classes.head_text}>Total answer accuracy: 91%</p>
                    <ul className={classes.percentage_lists}>
                        <li className={classes.percentage_list}>
                            <span className={`${classes.circle_li} ${classes.circle_green}`}></span>
                            90-100% accuracy answer: 8
                        </li>
                        <li className="percentage_list">
                            <span className={`${classes.circle_li} ${classes.circle_yellow}`}></span>
                            90-100% accuracy answer: 8
                        </li>
                        <li className="percentage_list">
                            <span className={`${classes.circle_li} ${classes.circle_red}`}></span>
                            90-100% accuracy answer: 8
                        </li>
                    </ul>
                    <p className={classes.under_head_text}>Average accuracy of scenario 4: 87%</p>
                    <p className={classes.under_text}>Based on the mark of 42 people who completed Scenario 4</p>
                </div>
                <div>
                    Bubble chart
                </div>
                <div>
                    Pine chart
                </div>
            </div>
        </div>
    )
}

export default PersonaScenioChartResult
