import getGifImage from "./newMapFIle";

export const getScoreParamsDetail = (vPrecisionPercent, vBestUserPrecision, vAiScore)=>{
    let replyRes = {
        execute:false,
        vPrecisionPercent:0,
        vBestUserPrecision:0,
        vAiScore:[]
    };
    let count = 0;
    if(vPrecisionPercent!=null && !isNaN(vPrecisionPercent) && typeof(vPrecisionPercent) === "number"){
        replyRes.vPrecisionPercent = vPrecisionPercent;
        count++;
    }
    if(vBestUserPrecision!=null && !isNaN(vBestUserPrecision) && typeof(vBestUserPrecision) === "number"){
        replyRes.vBestUserPrecision = vBestUserPrecision;
        count++;
    }
    if(vAiScore!=null && vAiScore.length>0){
        replyRes.vAiScore = vAiScore;
        count++;
    }
    if(count === 3){
        replyRes.execute = true;
    }
    return replyRes;
}

export const getAvatarDetail = (replyRes, setAvatar, setAvatarText, isMultiScenarios, setShrinkAvatar,vAvatarName) => {
    if(!replyRes.execute){
        return false;
    }
    let vPrecisionPercent = replyRes.vPrecisionPercent;
    let vBestUserPrecision = replyRes.vBestUserPrecision;
    let vAiScore = replyRes.vAiScore;

    // if all data was fetched
    if (vPrecisionPercent != null && vBestUserPrecision != null && vAiScore && vAiScore.length > 0) {
        // filter second highest during 0 ~ 69%, 70% ~ 84%, 85% ~ 100%
        let secHighestScore = 0;
        if(!isMultiScenarios){
            vAiScore.forEach((record) => {
                let curScore = parseInt((record.score.precision * 100).toFixed(0));
                if (curScore >= secHighestScore && curScore < vBestUserPrecision) {
                    secHighestScore = curScore;
                }
            });
        } else {
            vAiScore.forEach((record) => {
                let curScore = parseInt((record.precision * 100).toFixed(0));
                if (curScore >= secHighestScore && curScore < vBestUserPrecision) {
                    secHighestScore = curScore;
                }
            });
        }
        let getAvataValue =(key,value)=> (async () => {
            var data = await getGifImage(key,value);
            return data;
        })();
        // personal best record
        if (vPrecisionPercent && vBestUserPrecision && vPrecisionPercent >= vBestUserPrecision ) {
            // add exceptions
            let lengthCheck = false;
            if(!isMultiScenarios){
                lengthCheck = !(vAiScore.filter((record) => parseInt((record.score.precision * 100).toFixed(0)) == vBestUserPrecision ).length > 1) && vAiScore.length > 1;
            } else {
                lengthCheck = !(vAiScore.filter((record) => parseInt((record.precision * 100).toFixed(0)) == vBestUserPrecision ).length > 1) && vAiScore.length > 1;
            }

            if (lengthCheck) {
                // not score like 0, 20, 20 or 0, 20
                if ( 84 > vPrecisionPercent && vPrecisionPercent >= 70 && 70 > secHighestScore ) {
                    // if pass 70 for first time
                    setShrinkAvatar(true);
                    (async () => {
                        let avatarValue = await getAvataValue(vAvatarName,'Excellent_Animated')
                        setAvatar(avatarValue)
                    })();
                    setAvatarText("合格！");
                } else if (vPrecisionPercent >= 84 && 70 > secHighestScore) {
                    // if pass 70 for first time
                    setShrinkAvatar(true);
                    (async () => {
                        let avatarValue = await getAvataValue(vAvatarName,'Perfect_Animated')
                        setAvatar(avatarValue)
                    })();
                    setAvatarText("完ペキ！");
                } else if ( vPrecisionPercent >= 84 && 84 > secHighestScore && secHighestScore > 70) {
                    // if cross 84 for first time
                    (async () => {
                        let avatarValue = await getAvataValue(vAvatarName,'Perfect_Animated')
                        setAvatar(avatarValue)
                    })();
                    setAvatarText("完ペキ！");
                } else {
                    setShrinkAvatar(true);
                    (async () => {
                        let avatarValue = await getAvataValue(vAvatarName,'Track_Record_Animated')
                        setAvatar(avatarValue)
                    })();
                    setAvatarText("自己ベスト更新！");
                    setTimeout(() => {
                        setShrinkAvatar(false);
                        (async () => {
                            let avatarValue = await getAvataValue(vAvatarName,'Track_Record')
                            setAvatar(avatarValue)
                        })();
                    }, 2000);
                }
                return;
            }
        }

        if (vPrecisionPercent <= 69) {
            (async () => {
                let avatarValue = await getAvataValue(vAvatarName,'Nice_Try')
                setAvatar(avatarValue)
            })();
            setAvatarText("もう少し！");
        } else if (vPrecisionPercent >= 70 && vPrecisionPercent <= 84) {
            (async () => {
                let avatarValue = await getAvataValue(vAvatarName,'Excellent')
                setAvatar(avatarValue)
            })();
            //excellent
            setAvatarText("合格！");
        } else if (vPrecisionPercent >= 85 && vPrecisionPercent <= 100) {
            (async () => {
                let avatarValue = await getAvataValue(vAvatarName,'Perfect')
                setAvatar(avatarValue)
            })();
            //perfect
            setAvatarText("完ペキ！");
        }
    }
}
