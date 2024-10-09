import React, {useEffect, useState} from 'react'
import { VictoryBar, VictoryLabel,VictoryAxis, VictoryChart,VictoryLine, VictoryZoomContainer } from 'victory';
import { useTranslation } from 'react-i18next';

const LineChart = ({aiScore}) => {

  const { t } = useTranslation();
  const [vChartData, setchartData] = useState([])
  const [vTickValues, setTickValues] = useState([])
  const [vTickLabels, setTickLabels] = useState([])


  const date = (item) => {
    let date = new Date(item);
    return `${date.getMonth()+1}${t('general.date.month')}${date.getDate()}${t('general.date.day')}` 
  }

  const percentage = (item) => {
    if(item.score)
    {
      return parseFloat(item.score.precision).toFixed(0) * 100;
    }
    return 0;
  }

  useEffect(() => {
    let arrayData = []
    let tickArrayData = []
    let tickLabelArrayData = []
    for (const [key, value] of Object.entries(aiScore)) {
      arrayData.push({date: key, percent: percentage(value)})
      tickArrayData.push(parseInt(key)+1)
      tickLabelArrayData.push(date(value.start))
    }
    setchartData(arrayData)
    setTickValues(tickArrayData)
    setTickLabels(tickLabelArrayData)
  }, [aiScore])

  const shiftColor = (value) => {
    if(value >= 0 && value <= 69)
    {
      return '#E2242C'
    }else if(value >= 70 && value <= 84)
    {
      return '#E98300'
    }else if(value >= 85 && value <= 100)
    {
      return '#00A5D9'
    }
  }

  const getChartWidth = () => {
    return (100/vChartData.length).toFixed(0);
  }

  return (
    <>
      <VictoryChart 
        domainPadding={25}
      >
        <VictoryAxis 
          tickValues={[vTickValues]}
          tickFormat={vTickLabels}
          style={{
            axis: {stroke: "transparent"},
            tickLabels: {
              fontSize: 9,
              fill: '#333333'
            }
          }}
        />

        <VictoryAxis 
          dependentAxis
          tickValues={[0, 25, 50, 75, 100]}
          tickFormat={(t) => `${t}%`}
          style={{
            axis: {stroke: "transparent"},
            grid: {stroke: "#e5e5e5", border: "dotted"}
          }}
        />
        <VictoryBar
          data={vChartData}
          labels={ ({datum}) => `${datum.percent}%` }
          style={{
            data:{
              fill: ({datum}) => shiftColor(datum.percent),
              width: 35,
              overflowX: 'scroll'
            },
            labels: {
              fontSize: 6,
              fill: "white"
            }
          }}
          labelComponent={<VictoryLabel dy={19} />}
          x="date"
          y="percent" 
        />
        <VictoryLine 
          y={() => 70}
          style={{
            data: { stroke: "#E2242C" },
            labels: { fill: "#E2242C", fontSize: 15 }
          }}
          labels={[`${t('aiscore.chartbar.line_header')}(70%)`]}
          labelComponent={<VictoryLabel x={220}/>}
        />
        
      </VictoryChart>
    </>
  )
}
export default LineChart