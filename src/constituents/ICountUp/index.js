
import { useEffect, useState } from "react";
import store from '../../storage'
import { CURRENT_SECTION_COUNT_DOWN } from '../../storage/consts'

const CountUp = (startOverTimes, cacheTimeSpent) => {
    const [minutes, setMinutes] = useState('');
    const [seconds, setSeconds] = useState('');
    const [startDate, setStartDate] = useState(0);
    const [timeTrigger, setTimeTrigger] = useState(0);
    const [timeSpan, setTimeSpan] = useState(0);

    useEffect(()=>{
        setStartDate(new Date().getTime());
        setTimeTrigger(new Date().getTime());
    },[])

    useEffect(()=>{
        setTimeSpan(((new Date().getTime() - startDate)/1000).toFixed(0))

        setSeconds(timeSpan%60)
        setMinutes(Math.floor(timeSpan/60));
        
    }, [timeTrigger])

    useEffect(()=>{
        setTimeout(()=>{
            setTimeTrigger(timeTrigger + 1)
        }, 1000)
    },[timeTrigger])

    useEffect(()=>{
        
    }, [startOverTimes])

    useEffect(()=>{
        store.dispatch({type: CURRENT_SECTION_COUNT_DOWN, time: timeSpan});
    }, [cacheTimeSpent])

    return (
        <>
            <div>{minutes + ':' + seconds}</div>
        </>
    );
}

export default CountUp;