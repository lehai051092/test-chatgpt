import  './styles.css'
const MouthHabitChip = ({text,count,isbg,className,status="default"})=>{
    return(
        <div className={`mouth_habit_free_story ${className} w-100`}>
            <div className={`mouth_habit_name_free_story text-center ${isbg ? `is_custom_bg` :``}`}>{text}</div>
            <div className=" text-center mount_habit_count">{count}</div>
        </div>
    )
}
export default MouthHabitChip;