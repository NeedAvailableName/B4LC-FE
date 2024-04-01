// @ts-nocheck
import { createRouterMiddleware } from '@lagunovsky/redux-react-router';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import rootSaga from './saga';
import { configureStore } from '@reduxjs/toolkit';
import { browserHistory } from '../helpers/history';

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger();

function createSagaInjector(runSaga: any, rootSaga: any) {
  const injectedSagas = new Map();
  const isInjected = (key: any) => injectedSagas.has(key);
  const injectSaga = (key: any, saga: any) => {
    if (isInjected(key)) return;
    const task = runSaga(saga);
    injectedSagas.set(key, task);
  };
  injectSaga('root', rootSaga);
  return injectSaga;
}

function myConfigureStore(initialState = {}) {
  const rootReducer = createReducer();
  const middlewares = [createRouterMiddleware(browserHistory), sagaMiddleware];
//   if (import.meta.env.VITE_NODE_ENV === 'development') middlewares.push(logger); // actually recommend using "Redux DevTools" instead
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
    // devTools: import.meta.env.VITE_NODE_ENV === 'development',
    // preloadedState: import.meta.env.VITE_NODE_ENV === 'development' ? initialState : {},
  });

  store.asyncReducers = {};
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  store.injectSaga = createSagaInjector(sagaMiddleware.run, rootSaga);
  return store;
}

const store = myConfigureStore();

export default store;
