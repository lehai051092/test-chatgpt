function getTheme(){
    let themes = localStorage.getItem("theme");
    if(themes){
        return themes;
    }
    return "default";
}

function getBackgroundColor(){
    return `${getTheme()}_background`;
}
 
function getFontColor(){
    return `${getTheme()}_font_color`;
}

function changeTheame(){
    let themes = localStorage.getItem("theme");
    if(!themes){
        themes = "default";
    }
    let eles = [...document.getElementsByClassName(`${themes}_background`),...document.getElementsByClassName(`${themes}_font_color`)];

    if(eles.length>0){
        for (let index = 0; index < eles.length; index++) {
            const element = eles[index];
            let t_className = element.className;
            if(themes == "dark"){
                t_className = t_className.replace(`${themes}_background`,"default_background");
                t_className = t_className.replace(`${themes}_font_color`,"default_font_color");
                localStorage.setItem("theme","default");
            }else{
                t_className = t_className.replace(`${themes}_background`,"dark_background");
                t_className = t_className.replace(`${themes}_font_color`,"dark_font_color");
                localStorage.setItem("theme","dark");
            }
            element.className = t_className;
        }
    }
    // localStorage.setItem("theme","dark");

}

export {
    getBackgroundColor,
    getFontColor,
    changeTheame
};