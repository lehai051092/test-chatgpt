import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';
import {useTranslation} from 'react-i18next';


import eventShuttle from '../../eventShuttle';

const SnackBar = () => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        eventShuttle.on("show_snack", (data) => {
            enqueueSnackbar(data.message, {
                variant: data.type,
                autoHideDuration: 5000,
                preventDuplicate: true,
                anchorOrigin: {
                    vertical: 'right',
                    horizontal: 'bottom',
                },
                TransitionComponent: Slide,
            });
        });

        eventShuttle.on("something_went_wrong", () => {
            enqueueSnackbar(t('something_went_wrong'), {
                variant: 'error',
                autoHideDuration: 5000,
                preventDuplicate: true,
                anchorOrigin: {
                    vertical: 'right',
                    horizontal: 'bottom',
                },
                TransitionComponent: Slide,
            });
        });

    }, [t, enqueueSnackbar]);

    return (
        <>
        </>
    );
}

export default SnackBar;
