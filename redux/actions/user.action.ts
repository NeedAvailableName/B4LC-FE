export function LOGIN(payload: any) {
    return {
      type: 'LOGIN',
      payload,
    };
  }
  
  export function LOGIN_SUCCESS(payload: any) {
    return {
      type: 'LOGIN_SUCCESS',
      payload,
    };
  }
  
  export function LOGIN_FAIL(payload: any) {
    return {
      type: 'LOGIN_FAIL',
      payload,
    };
  }
  
  export function LOGOUT(payload: any) {
    return {
      type: 'LOGOUT',
      payload,
    };
  }
  
  export function CHECK_VALID_TOKEN(payload: any) {
    return {
      type: 'CHECK_VALID_TOKEN',
      payload,
    };
  }
  export function CHECK_VALID_TOKEN_SUCCESS(payload: any) {
    return {
      type: 'CHECK_VALID_TOKEN_SUCCESS',
      payload,
    };
  }
  export function CHECK_VALID_TOKEN_FAIL(payload: any) {
    return {
      type: 'CHECK_VALID_TOKEN_FAIL',
      payload,
    };
  }
  export function RESET_CHECK_VALID_TOKEN(payload: any) {
    return {
      type: 'RESET_CHECK_VALID_TOKEN',
      payload,
    };
  }