import { combineReducers } from 'redux';
import { createRouterReducer } from '@lagunovsky/redux-react-router';
// import userReducer from './user.reducer';
// import notifyReducer from './notify.reducer';
// import analyzeReducer from './analyze.reducer';
// import notificationReducer from './notification.reducer';
// import themeReducer from './theme.reducer';
import { browserHistory } from '../../helpers/history';

export default (asyncReducers: any) => {
    return combineReducers({
        router: createRouterReducer(browserHistory),
        // user: userReducer,
        // notify: notifyReducer,
        // analyzeData: analyzeReducer,
        // notification: notificationReducer,
        // theme: themeReducer,
        ...asyncReducers,
    });
};
