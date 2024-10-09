import  './styles.css'
const CustomChip = ({text,icon,onClick,className,id="default_chip",status="default"})=>{
    return(
        <span className={`chip_free_story ${className}`} id={id}>
            {text}
            {icon && <span onClick={onClick} id={`${id}_icon`}><img src={icon} id={`${id}_delete_icon`}></img></span>}
        </span>
    )
}
export default CustomChip;