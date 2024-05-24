import React from 'react';
import Sidebar from '../components/Sidebar';
import Search from '../components/Search';
import styles from '../styles/SearchPage.module.scss';

function SearchPage() {
    return (
        <div className={styles.search}>
            <Sidebar/>
            <Search/>
        </div>

    );
}


export default SearchPage;