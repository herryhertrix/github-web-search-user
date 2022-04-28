import * as React from 'react';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { repositorie, User } from '../../components/model/basic';
import { RootState } from '@/app/store';

export interface UserState {
  id: number;
  detail: User,
  repositories: repositorie[],
  followings: User[],
  followers: User[],
  favorite: User[],
  status: 'idle' | 'loading' | 'failed' | 'ready';
}

const initialState: UserState = {
  id: 0,
  detail: {
    login: "",
    name: "",
    company: "",
    public_repos: 0,
    id: 0,
    avatar_url: "",
    url: "",
    followers: 0,
    following: 0,
    isFavorite: false,
    followers_url: "",
    following_url: "",
    repos_url: "",
    text_matches: []
  },
  repositories: [],
  followers: [],
  followings: [],
  favorite: [],
  status: "idle"
};

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    isFollowersFavorite: (state, action) => {
      const findUser = state.followers.findIndex(function (user: User) {
        return user.id === action.payload.id
      })
      if (findUser != -1) {
        const tempUser: User = state.followers[findUser]
        tempUser.isFavorite = !tempUser.isFavorite
      }
    },
    isFollowingFavorite: (state, action) => {
      const findUser = state.followings.findIndex(function (user: User) {
        return user.id === action.payload.id
      })
      if (findUser != -1) {
        const tempUser: User = state.followings[findUser]
        tempUser.isFavorite = !tempUser.isFavorite
      }
    },
    updateUser: (state, action) => {
      state.detail = action.payload.user
      state.favorite = action.payload.favorite
      state.repositories = action.payload.repositories
      state.followers = action.payload.followers
      state.followings = action.payload.followings
      state.status = 'ready'
    },
    cleanUser: (state) => {
      state = initialState
    },
    updateFollowers: (state, action) => {
      if (state.followers[action.payload.index] != undefined) {
        const findFavorite = action.payload.favorite.findIndex(function (user: User) {
          return user.id === action.payload.user.id
        })
        state.followers[action.payload.index].followers = action.payload.user.followers
        state.followers[action.payload.index].following = action.payload.user.following
        state.followers[action.payload.index].isFavorite = findFavorite == -1 ? false : true;
      }
    },
    updateFollowings: (state, action) => {
      if (state.followings[action.payload.index] != undefined) {
        const findFavorite = action.payload.favorite.findIndex(function (user: User) {
          return user.id === action.payload.user.id
        })
        state.followings[action.payload.index].followers = action.payload.user.followers
        state.followings[action.payload.index].following = action.payload.user.following
        state.followings[action.payload.index].isFavorite = findFavorite == -1 ? false : true;
      }
    },
  }
});

export const { cleanUser, isFollowingFavorite, isFollowersFavorite, updateUser, updateFollowers, updateFollowings } = userSlice.actions;

export const getUser = (state: RootState) => state.user;


export default userSlice.reducer;