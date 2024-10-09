import moment from 'moment'
export function changeDateformat(date) {
    return date.replaceAll('-', '/')
}

export function formatTime(nss) {
    if (!nss) {
        return '00:00:00'
    }
    let mss = parseInt(nss) / 1000 / 1000
    var tempTime = moment.duration(mss);
    var hours = tempTime.hours() + ''
    var minutes = tempTime.minutes() + ''
    var seconds = tempTime.seconds() + ''
    return hours.padStart(2, '0') + ":" + minutes.padStart(2, '0') + ":" + seconds.padStart(2, '0');

}
export function NanoSecondToMinute (nss){
    let minutes = nss/60000000000 
    return minutes;
}