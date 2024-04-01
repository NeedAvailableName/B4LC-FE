import Cookies from 'js-cookie';
export const appStorage = {
    setItem: (key: any, value: any, options = {}) => {
        return Cookies.set(key, value, {
            sameSite: 'strict',
            secure: true,
            ...options
        });
    },
    getItem: (key: any) => {
        return Cookies.get(key);
    },
    removeItem: (key: any) => {
        return Cookies.remove(key);
    }
}