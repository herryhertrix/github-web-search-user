import { Favorite, FavoriteBorder, People } from '@mui/icons-material';
import { Box, Card, Grid, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { notFound, text_match, User } from '@/components/model/basic';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  like,
  getFavorites,
  dislike
} from './favoriteSlice';
import {
  isFavorite
} from '../search/searchSlice';
import NextImage from '@/components/NextImage';
import { clone, debounce } from 'lodash';
import { useRouter } from 'next/router'
import { isFollowersFavorite, isFollowingFavorite } from '../user/userSlice';

export function ActionLike(props: any) {
  const user: User = props.user
  const dispatch = useAppDispatch();
  const actionLike = React.useMemo(
    () =>
      debounce(
        async (
          request: { user: User }
        ) => {
          dispatch(isFavorite({ id: request.user.id }))
          dispatch(isFollowingFavorite({ id: request.user.id }))
          dispatch(isFollowersFavorite({ id: request.user.id }))
          const tempUser = clone(request.user)
          if (tempUser.isFavorite) {
            dispatch(dislike({ id: tempUser.id }))
          } else {
            tempUser.isFavorite = true
            dispatch(like(tempUser))
          }
        },
        200,
      ),
    [],
  );
  return (
    <IconButton
      onClick={() => actionLike({ user: user })}
      size="small"
      className='mb-auto'
    >
      {user.isFavorite == true ? <Favorite className='p-[4px]' sx={{ path: { color: '#F44336' } }} /> : <FavoriteBorder className='p-[4px]' sx={{ path: { color: '#F44336' } }} />}
    </IconButton>
  )
}


export function ShowUser() {
  const users = useAppSelector(getFavorites);
  const router = useRouter()

  function linkUserDetail(username: string) {
    return router.push("/users/" + username)
  }
  function UserHtml(option: User) {
    return <Grid item xs={8} key={option.id} sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Card sx={{ boxShadow: 4, display: 'flex' }}>
        <NextImage onClick={() => linkUserDetail(option.login)} src={option.avatar_url} height={64} width={64} alt="avatar" className='m-[8px] cursor-pointer'></NextImage>
        <div className='w-[103px] pl-[10px] text-f16h24 cursor-pointer' onClick={() => linkUserDetail(option.login)}>
          {option.login}
          <div className='pt-[10px]'>
            {option.followers != undefined && option.followers != 0 ? <div className='text-f12h16'>{option.followers} followers</div> : ""}
            {option.following != undefined && option.following != 0 ? <div className='text-f12h16'>{option.following} followings</div> : ""}
          </div>
        </div>
        <ActionLike user={option}></ActionLike>
      </Card>
    </Grid>
  }

  return (
    <Box className='px-[16px] pt-[84px]' sx={{ flexGrow: 1, color: 'text.primary', bgcolor: 'background.default' }}>
      {users.length != 0 ? <Grid container columns={16} spacing={1} className="pt-[12px]" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        {users.map((option: User) => {
          return UserHtml(option)
        })}
      </Grid> : ""}
      <div className='mt-[30%] w-full' hidden={users.length == 0 ? false : true}>
        <People className='w-full m-auto'></People>
        <div className='text-f14h20 text-center font-[400] text-[#7e7e7e]'>
          <div>Once you like people, you'll see them here.</div>
        </div>
      </div>
    </Box>
  )
}
