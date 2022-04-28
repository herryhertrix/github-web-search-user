import * as React from 'react';
import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../components/model/basic';
import { RootState } from '@/app/store';

const initialState: User[] = []

export const userFavsSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    like: (state, action) => {
      state.push(action.payload)
    },
    dislike: (state, action) => {
      const findUser = state.findIndex(function (user: User) {
        return user.id === action.payload.id
      })
      state.splice(findUser, 1)
    },
  },

});

export const { like, dislike } = userFavsSlice.actions;

export const getFavorites = (state: RootState) => state.favorite;


export default userFavsSlice.reducer;