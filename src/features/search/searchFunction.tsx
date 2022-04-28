import { CloseRounded, Search } from '@mui/icons-material';
import { Card, Grid, IconButton, Input, InputAdornment, Pagination, Stack } from '@mui/material';
import React from 'react';
import { text_match, User } from '@/components/model/basic';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import parseHtml from 'html-react-parser'
import {
  searching,
  getSearch,
  searchAsync,
  updateUser,
  clear,
  goPage,
} from './searchSlice';
import {
  getFavorites
} from '../favorite/favoriteSlice';
import NextImage from '@/components/NextImage';
import _, { debounce } from 'lodash';
import { ActionLike } from '../favorite/favoriteFunction';
import { useRouter } from 'next/router';

export function SearchBar(props: any) {
  const search = useAppSelector(getSearch);
  const favorite = useAppSelector(getFavorites)
  const router = useRouter()

  const dispatch = useAppDispatch();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searching(event.target.value))
  };
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(goPage(value))
  };
  const handleClear = () => {
    dispatch(clear())
  };
  const getData = React.useMemo(
    () =>
      debounce(
        async (
          request: { input: string, page: number }
        ) => {
          dispatch(searchAsync(request))
        },
        200,
      ),
    [],
  );
  React.useEffect(() => {
    if (search.value != "") {
      getData({ input: search.value, page: search.page })
    }

  }, [search.value, search.page]);
  function getName(text_matches: text_match[]) {
    let result = ""
    text_matches.map((text_match: text_match) => {
      if (text_match.fragment.toLowerCase().includes(search.value.toLowerCase())) {
        result = text_match.fragment
        return
      }
    })
    return result
  }

  async function generateData() {
    for (var i = 0; i < search.users.length; i++) {

      await fetch(search.users[i].url, {
        headers: {
          'Accept': 'application/vnd.github.v3.text-match+json'
        }
      }).then(response => response.json(
      )).then(result => {
        dispatch(updateUser({ user: result, favorite: favorite, index: i }))

      })
    }
  }

  React.useEffect(() => {
    generateData()

  }, [search.users]);

  function linkUserDetail(username: string) {
    return router.push("/users/" + username)
  }


  function UserHtml(option: User, index: number) {
    let name = option.text_matches.length != 0 ? getName(option.text_matches) : option.login
    let replaceString = "<b className='font-black text-f20h24'>" + search.value.toLowerCase() + "</b>"
    let replaceName = name.toLowerCase().replace(search.value.toLowerCase(), replaceString)
    return <Grid item xs={8} key={option.id} sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Card sx={{ boxShadow: 4, display: 'flex' }}>
        <NextImage onClick={() => linkUserDetail(option.login)} src={option.avatar_url} height={64} width={64} alt="avatar" className='m-[8px] cursor-pointer'></NextImage>
        <div className='w-[103px] pl-[10px] pt-[8px] text-f16h24 text-current cursor-pointer' onClick={() => linkUserDetail(option.login)}>
          {parseHtml(replaceName)}
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
    <div>
      <Input
        id="githubSearch"
        value={search.value}
        className='w-full font-jost pt-[84px] px-[16px]'
        sx={{ bgcolor: 'background.default', color: 'text.primary', input: { bgcolor: 'background.default', color: 'text.primary' } }}
        onChange={handleChange}
        placeholder="Enter GitHub username, i.e. gaearon"
        endAdornment={
          <InputAdornment position="end" >
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClear}
              edge="end"
            >
              {search.value != "" ? <CloseRounded /> : ""}
            </IconButton>
          </InputAdornment>
        }
      />
      {search.totalUsers != 0 ? <div className='p-[16px]'>{search.totalUsers} GitHub users found</div> : ""}
      {search.users.length != 0 ? <Grid container columns={16} spacing={1} className="pt-[12px] px-[16px]" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        {search.users.map((option: User, index: number) => {
          return UserHtml(option, index)
        })}
        <Stack spacing={2} className="m-auto py-[16px]">
          <Pagination count={search.totalPage} variant="outlined" shape="rounded" onChange={handlePageChange} />
        </Stack>
      </Grid> : ""}
      <div className='mt-[20%]  w-full' hidden={search.value == "" && search.users.length == 0 ? false : true}>
        <NextImage src="/svg/GitHub-Mark-120px-plus.svg" height={120} width={120} alt="github-mark" className='m-auto' useSkeleton></NextImage>
        <NextImage src="/svg/GitHub_Logo.svg" height={57} width={139} alt="github-mark" className='m-auto' useSkeleton></NextImage>
        <div className='text-f14h20 text-center font-[400] text-[#7e7e7e]'>
          <div>Enter GitHub username and search users</div>
          <div>matching the input like Google Search, click</div>
          <div>avatars to view more details, including</div>
          <div>repositories, followers and following.</div>
        </div>
      </div>
      <div className='mt-[20%] w-full' hidden={search.notFound.status}>
        <Search className='w-full m-auto'></Search>
        <div className='text-f14h20 text-center font-[400] text-[#7e7e7e]'>
          <div>No search result found for </div>
          <div>{search.notFound.value}</div>
        </div>
      </div>
    </div>
  );
}
