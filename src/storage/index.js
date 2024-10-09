import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { createLogger } from 'redux-logger';

// import { environment } from '../configuration/environments';
import { customerFrontEnd } from './reduxrReducers/index';
import { composeWithDevTools } from 'redux-devtools-extension';
// const environment = 'dev'

const logger = createLogger({});

let middleware = [];

// environment = 'dev' for development; 'stg' for stage; 'prod' for production
// open if you need this log
// if (environment !== 'prod') {
//     middleware = [...middleware, logger];
// }

const persistConfig = {
    key: 'root',
    storage: sessionStorage
}

const persistreducer = persistReducer(persistConfig, customerFrontEnd);

const store = createStore(persistreducer, composeWithDevTools(applyMiddleware(...middleware)));

export const persistor = persistStore(store);

export default store;