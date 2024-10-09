import React from 'react'
import classes from './styles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import {useTranslation} from 'react-i18next'

function SearchButton() {
    const {t} = useTranslation();
    return (
        <>
            <button className={`${classes.search_button}`}><FontAwesomeIcon icon={faSearch} /> {t('training.training_search_button')}</button>
        </>
    )
}

export default SearchButton
