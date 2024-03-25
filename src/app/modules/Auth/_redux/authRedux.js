import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "./authCrud";

export const actionTypes = {
  Login: "[Login] Action",
  LoginStaff: "[LoginStaff] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API"
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
  privileges: []
};

export const reducer = persistReducer(
  {
    storage,
    key: "v705-demo1-auth",
    whitelist: ["user", "authToken", "privileges"]
  },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;

        return { authToken, user: undefined };
      }

      case actionTypes.LoginStaff: {
        const { authToken, privileges } = action.payload;

        return { authToken, user: undefined, privileges };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { authToken, user: undefined };
      }

      case actionTypes.Logout: {
        // TODO: Change this code. Actions in reducer aren't allowed.
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;
        return { ...state, user };
      }

      case "[Privileges] Updated": {
        const { privileges } = action.payload;
        return { ...state, privileges };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: (authToken) => ({ type: actionTypes.Login, payload: { authToken } }),
  loginStaff: (authToken, privileges) => ({
    type: actionTypes.LoginStaff,
    payload: { authToken, privileges }
  }),
  register: (authToken) => ({
    type: actionTypes.Register,
    payload: { authToken }
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: (user) => ({
    type: actionTypes.UserRequested,
    payload: { user }
  }),
  fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
  updatePrivileges: (privileges) => ({
    type: "[Privileges] Updated",
    payload: { privileges }
  })
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.LoginStaff, function* loginStaffSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const { data } = yield getUserByToken();
    const user = data.data;

    yield put(actions.fulfillUser(user));
  });
}
