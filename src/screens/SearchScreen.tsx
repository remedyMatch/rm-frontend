import React from 'react';
import {Theme} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import BasicTable from '../components/BasicTable';

interface Props {
}

function createData(kategorie: string, produkt: string, menge: number, anbieter: string, standort: string) {
    return {kategorie, produkt, menge, anbieter, standort};
}

const useStyles = makeStyles((theme: Theme) => ({}));

const SearchScreen: React.FC<Props> = () => {
    const classes = useStyles();
    const rows = [
        createData('Kategorie 1', 'Produkt 1', 3000, 'Anbieter 1', 'Neustadt'),
        createData('Kategorie 2', 'Produkt 2', 3000, 'Anbieter 1', 'Köln'),
    ];
    return (
        <div>
            <p>Search</p>
            <BasicTable rows={rows}/>
        </div>

    );
};

export default SearchScreen;
