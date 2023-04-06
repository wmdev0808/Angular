import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  authError: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.authSuccess,
    (state, { email, userId, token, expirationDate }) => {
      const user = new User(email, userId, token, expirationDate);

      return {
        ...state,
        authError: null,
        user,
        loading: false,
      };
    }
  ),
  on(AuthActions.logout, (state) => ({ ...state, user: null })),
  on(AuthActions.loginStart, AuthActions.signupStart, (state) => ({
    ...state,
    authError: null,
    loading: true,
  })),
  on(AuthActions.authFail, (state, { payload }) => ({
    ...state,
    user: null,
    authError: payload,
    loading: false,
  })),
  on(AuthActions.clearError, (state) => ({ ...state, authError: null }))
);
