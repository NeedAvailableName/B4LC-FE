import { all } from 'redux-saga/effects';
// import analyzeSaga from './analyze.saga';
import userSaga from './user.saga';
// import notificationSaga from './notification.saga';
// import themeSaga from './theme.saga';
export default function* () {
    yield all([
        userSaga(), 
        // analyzeSaga(), 
        // notificationSaga(), 
        // themeSaga()
    ]);
}
