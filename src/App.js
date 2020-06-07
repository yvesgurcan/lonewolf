import React, { Fragment, Suspense, lazy, useEffect } from 'react';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Helmet } from 'react-helmet';
import { store } from './store/store';

const CharacterSheet = lazy(() => import('./views/CharacterSheet'));

export default () => {
    const { t } = useTranslation();
    useEffect(() => {
        let storedState = localStorage.getItem('GameState');
        if (storedState !== null) {
            const { CharacterSheet } = JSON.parse(storedState);
            i18next.changeLanguage(CharacterSheet.Language);
        }
    }, []);
    return (
        <Fragment>
            <Helmet>
                <html lang={t('locale')} />
                <title>{t('CharacterSheet')}</title>
                <meta name="description" content={t('Site description')} />
            </Helmet>
            <Provider store={store}>
                <Suspense fallback={t('Loading')}>
                    <CharacterSheet />
                </Suspense>
            </Provider>
        </Fragment>
    );
};
