import { call, put, takeLeading } from 'redux-saga/effects';
import { apiLogin } from '../../app-data/auth';
import { REFRESH_TOKEN_KEY, REQUEST_STATE, TOKEN_KEY } from '../../app-configs';
import { appStorage } from '../../services/AppStorage';
import { CHECK_VALID_TOKEN, LOGIN, LOGIN_FAIL, LOGIN_SUCCESS } from '../actions/user.action';

function* handleLogin(action: {payload: any}): any {
    const { payload } = action;
    try {
        const response = yield call(apiLogin, payload);
        if(response?.state === REQUEST_STATE.SUCCESS) {
            appStorage.setItem(TOKEN_KEY, response?.data?.access_token);
            appStorage.setItem(REFRESH_TOKEN_KEY, response?.data?.refresh_token);
            yield put(LOGIN_SUCCESS(payload));
            yield put(CHECK_VALID_TOKEN(payload));
        }
        if(response?.state === REQUEST_STATE.ERROR) {
            yield put(LOGIN_FAIL(payload));
            // if (isObject(response?.error) && response?.error?.toJSON().message === 'Network Error') {
            //     yield put(
            //       NOTIFY_ERROR({
            //         description: 'Vui lòng kết nối máy tính với internet trước khi thực hiện việc đăng nhập',
            //       }),
            //     );
            //   } else {
            //     yield put(
            //       NOTIFY_ERROR({
            //         description: 'Tài khoản hoặc mật khẩu không chính xác!',
            //       }),
            //     );
            //   }
        }
    }
    catch(e) {
        yield put(LOGIN_FAIL(payload));
        // yield put(
        //     NOTIFY_ERROR({
        //       description: 'Tài khoản hoặc mật khẩu không chính xác!',
        //     }),
        //   );
    }
}

export default function* userSaga() {
    yield takeLeading(LOGIN().type, handleLogin);
}