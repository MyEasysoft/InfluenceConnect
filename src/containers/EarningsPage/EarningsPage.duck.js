import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const EARNINGS_REQUEST =
  'app/EARNINGSPage/EARNINGS_REQUEST';
export const EARNINGS_SUCCESS =
  'app/EARNINGSPage/EARNINGS_SUCCESS';
export const EARNINGS_ERROR =
  'app/EARNINGSPage/EARNINGS_ERROR';
export const EARNINGS_CLEANUP =
  'app/EARNINGSPage/EARNINGS_CLEANUP';

export const EARNINGS_CLEAR =
  'app/EARNINGSPage/EARNINGS_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/EARNINGSPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/EARNINGSPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/EARNINGSPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  earningsError: null,
  earningsInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case EARNINGS_REQUEST:
      return {
        ...state,
        earningsInProgress: true,
        earningsError: null,
        accountDeleted: false,
      };
    case EARNINGS_SUCCESS:
      return { ...state, earningsInProgress: false, accountDeleted: true };
    case EARNINGS_ERROR:
      return {
        ...state,
        earningsInProgress: false,
        earningsError: payload,
      };

    case EARNINGS_CLEAR:
      return { ...initialState };

    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        resetPasswordInProgress: true,
        resetPasswordError: null,
      };
    case RESET_PASSWORD_SUCCESS:
      return { ...state, resetPasswordInProgress: false };
    case RESET_PASSWORD_ERROR:
      console.error(payload); // eslint-disable-line no-console
      return {
        ...state,
        resetPasswordInProgress: false,
        resetPasswordError: payload,
      };

    default:
      return state;
  }
}

// ================ Action creators ================ //

export const earningsRequest = () => ({ type: EARNINGS_REQUEST });
export const earningsSuccess = () => ({ type: EARNINGS_SUCCESS });
export const earningsError = error => ({
  type: EARNINGS_ERROR,
  payload: error,
  error: true,
});

export const earningsClear = () => ({ type: EARNINGS_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const earnings = params => (dispatch, getState, sdk) => {
  dispatch(earningsRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(earningsSuccess());
      return;
    })
    .catch(e => {
      dispatch(earningsError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on earnings submit handler
      throw e;
    });
};

export const resetPassword = email => (dispatch, getState, sdk) => {
  dispatch(resetPasswordRequest());
  return sdk.passwordReset
    .request({ email })
    .then(() => dispatch(resetPasswordSuccess()))
    .catch(e => dispatch(resetPasswordError(storableError(e))));
};