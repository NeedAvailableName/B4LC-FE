import { REQUEST_STATE } from "../../app-configs";
import { GET, PATCH, POST, PUT } from '../../app-data/fetch';

export const apiUserInfo = async (params: any) => {
    try {
        const response = await POST('/user', params, { isFullPath: false });
        return {
            state: REQUEST_STATE.SUCCESS,
            data: response,
        };
    } catch (error) {
        console.log('error', error);
        return {
            error: error,
            state: REQUEST_STATE.ERROR,
            data: {},
        };
    }
};