export default class FileImport
{
    fileArr = {};
    fileKey = [];

    importAll(r) {
        this.fileKey = r.keys();
        return r.keys().map(r);
    }

    arrKeyReplace()
    {
        let cloneObj = {}

        this.fileArr.map((val, key) => {
            // remove in string ./key_file
            let objKey = (this.fileKey[key]).replace('./','');
            // remove file extensions
            if(objKey.includes("gif"))
            {
                objKey = objKey.replace('.gif','');
            }else{
                objKey = objKey.replace('.png','');
            }
            cloneObj[objKey] = val.default;
        })

        this.fileArr = cloneObj;
    }

    f_20S_F()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/20S_F', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()

        return this.fileArr;
    }

    f_20S_M()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/20S_M', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }

    f_30S_F()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/30S_F', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }

    f_30S_M()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/30S_M', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }

    f_40S_F_a()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/40S_F_a', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }

    f_40S_F_b()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/40S_F_b', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }

    f_40S_M()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/40S_M', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }

    f_50S_F()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/50S_F', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }

    f_50S_M()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/50S_M', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }

    f_60S_M()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/60S_M', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }

    f_0S_F()
    {
        //get all file from under one folder
        let images = this.importAll(require.context('../property/phase3_avatars/0S_F', false, /\.(png|jpe?g|gif)$/));

        // append fileArr
        this.fileArr = [...images];

        // arr key replace
        this.arrKeyReplace()
        
        return this.fileArr;
    }
}