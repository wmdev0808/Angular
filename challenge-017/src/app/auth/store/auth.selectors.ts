import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.reducer';

export const authFeatureKey = 'auth';
export const selectAuth = createFeatureSelector<AuthState>(authFeatureKey);
export const selectAuthUser = createSelector(selectAuth, (state) => state.user);
