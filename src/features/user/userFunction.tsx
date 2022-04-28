
import { Apartment, Favorite, FavoriteBorder, People } from '@mui/icons-material';
import { Avatar, Box, Card, Grid, Tab, Tabs } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  updateUser,
  updateFollowers,
  updateFollowings,
  cleanUser,
  getUser
} from './userSlice';
import parseHtml from 'html-react-parser'
import { getFavorites } from '../favorite/favoriteSlice';
import { repositorie, User } from '@/components/model/basic';
import NextImage from '@/components/NextImage';
import { useRouter } from 'next/router';
import { ActionLike } from '../favorite/favoriteFunction';

export function RepoHtml(option: repositorie) {

  return <Grid item xs={8} key={option.name} sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
    <Card sx={{ boxShadow: 4, display: 'flex', height: 80, width: 180 }}>
      <div className='pl-[10px] text-f14h21 cursor-pointer' >
        {option.name}
        <div className='pt-[10px]'>
          {option.stargazers_count != undefined && option.stargazers_count != 0 ? <div className='text-f12h16'>{option.stargazers_count} stars</div> : ""}
          {option.forks_count != undefined && option.forks_count != 0 ? <div className='text-f12h16'>{option.forks_count} forks</div> : ""}
        </div>
      </div>
    </Card>
  </Grid>
}



export function GetUserDetail({ username, user, repositories, followers, followings }: any) {
  const dispatch = useAppDispatch();
  const favorite = useAppSelector(getFavorites)
  const router = useRouter()
  React.useEffect(() => {
    dispatch(cleanUser())
    dispatch(updateUser({ user, favorite, repositories, followers, followings }))
  }, [username]);
  const userInformation = useAppSelector(getUser);
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  function linkUserDetail(username: string) {
    return router.push("/users/" + username)
  }

  async function generateFollowersData() {
    for (var i = 0; i < userInformation.followers.length; i++) {

      await fetch(userInformation.followers[i].url, {
        headers: {
          'Accept': 'application/vnd.github.v3.text-match+json'
        }
      }).then(response => response.json(
      )).then(result => {
        dispatch(updateFollowers({ user: result, favorite: favorite, index: i }))

      })
    }
  }
  async function generateFollowingsData() {
    for (var i = 0; i < userInformation.followings.length; i++) {

      await fetch(userInformation.followings[i].url, {
        headers: {
          'Accept': 'application/vnd.github.v3.text-match+json'
        }
      }).then(response => response.json(
      )).then(result => {
        dispatch(updateFollowings({ user: result, favorite: favorite, index: i }))

      })
    }
  }

  React.useEffect(() => {
    if (userInformation.followers.length != 0) {
      generateFollowersData()
    }

  }, [userInformation.followers]);

  React.useEffect(() => {
    if (userInformation.followings.length != 0) {
      generateFollowingsData()
    }

  }, [userInformation.followings]);

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
    <Box className='min-h-[88vh]' sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      {userInformation.status == "ready" ? <>
        <Avatar alt="Remy Sharp" src={userInformation.detail.avatar_url} sx={{ height: 160, width: 160 }} className='m-auto' />
        <div className='w-1/2  m-auto text-center'>
          <div className='text-f26h36 font-bold'>{userInformation.detail.name}</div>
          <div className='f24h32'>{userInformation.detail.login}</div>
          {userInformation.detail.company != null ? <div className='f16h24'><Apartment></Apartment> {userInformation.detail.company}</div> : ""}
        </div>

        <Box className='pt-[23px]' sx={{ width: '100%', typography: 'body1', bgcolor: 'background.default', color: 'text.primary' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" variant="fullWidth">
                <Tab label={parseHtml("REPOSITORIES <br/> (" + userInformation.detail.public_repos + ")")} wrapped value="1" sx={{}} />
                <Tab label={parseHtml("FOLLOWERS <br/> (" + userInformation.detail.followers + ")")} value="2" />
                <Tab label={parseHtml("FOLLOWINGS <br/> (" + userInformation.detail.following + ")")} value="3" />
              </TabList>
            </Box>

            <TabPanel value="1">
              {userInformation.detail.id != 0 && userInformation.repositories.length != 0 ? <Grid container columns={16} spacing={1} className="pt-[12px] px-[16px]" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>{userInformation.repositories.map((repositorie: repositorie) => { return RepoHtml(repositorie) })}</Grid> : ""}</TabPanel>
            <TabPanel value="2" >
              <Grid container columns={16} spacing={1} className="pt-[12px] px-[16px]" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
                {userInformation.detail.id != 0 && userInformation.followers.length != 0 ? userInformation.followers.map((follower: User) => {
                  return UserHtml(follower)
                }) : ""}
              </Grid>
            </TabPanel>
            <TabPanel value="3">
              <Grid container columns={16} spacing={1} className="pt-[12px] px-[16px]" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
                {userInformation.detail.id != 0 && userInformation.followings.length != 0 ? userInformation.followings.map((following: User) => {
                  return UserHtml(following)
                }) : ""}
              </Grid>
            </TabPanel>
          </TabContext>
        </Box></> : ""}
    </Box>
  )
}

