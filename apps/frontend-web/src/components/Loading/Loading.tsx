'use client';

import React from 'react';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.content}>
        <p className={styles.loadingText}>CARGANDO APOLOWARE</p>
      </div>
    </div>
  );
};

export default Loading;
