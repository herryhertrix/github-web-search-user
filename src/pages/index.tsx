import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { throttle, debounce, result, delay, clone } from 'lodash';
import NextImage from '@/components/NextImage';
import { Card, Container, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import { AccountCircle, CloseRounded, Favorite, FavoriteBorder, Search } from '@mui/icons-material';
import parseHtml from 'html-react-parser'


interface User {
  login: string,
  id: number,
  avatar_url: string,
  url: string,
  followers: number,
  following: number,
  text_matches: text_match[]
}

interface text_match {
  object_url: string,
  object_type: string,
  property: string,
  fragment: string,
}

interface optionModel {
  users: User[],
  trigger: number,
  totalUsers: number,
}

interface notFound {
  inputValue: string,
  show: boolean
}

export default function HomePage() {
  const [value, setValue] = React.useState<User | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [options, setOptions] = React.useState<User[]>([]);
  const [optionsRaw, setOptionsRaw] = React.useState<User[]>([]);
  const loaded = React.useRef(false);
  const [notFound, setNotFound] = React.useState<notFound>({ inputValue: "", show: true })

  const getData = React.useMemo(
    () =>
      debounce(
        async (
          request: { input: string }
        ) => {
          await fetch('https://api.github.com/search/users?q=' + request.input + '&per_page=2&page=1', {
            headers: {
              'Accept': 'application/vnd.github.v3.text-match+json'
            }
          }).then(response => response.json(
          )).then(results => {
            let newUsers: User[] = []

            if (results.items) {

              setTotalUsers(results.total_count)
              newUsers = [...newUsers, ...results.items];
            }

            setOptionsRaw(newUsers);
            if (results.items == 0) {
              setNotFound({ inputValue: request.input, show: false })
            }
          })
        },
        200,
      ),
    [],
  );


  async function generateData() {
    let tempOption: User[] = []
    for (var i = 0; i < optionsRaw.length; i++) {

      await fetch(optionsRaw[i].url, {
        headers: {
          'Accept': 'application/vnd.github.v3.text-match+json'
        }
      }).then(response => response.json(
      )).then(result => {
        let tempUser: User = optionsRaw[i]
        tempUser.followers = result.followers
        tempUser.following = result.following

        tempOption.push(tempUser)

      })
    }
    setOptions(tempOption)
  }

  React.useEffect(() => {
    generateData()

  }, [optionsRaw]);

  React.useEffect(() => {
    let active = true;
    if (inputValue === '') {
      setOptionsRaw([])
      setOptions([]);
      setTotalUsers(0)
      return undefined;
    }

    setOptionsRaw([])
    setOptions([])
    setTotalUsers(0)
    loaded.current = true;
    getData({ input: inputValue })

    return () => {
      active = false;
    };
  }, [inputValue]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  };

  const handleClear = () => {
    setInputValue("")
  };

  function getName(text_matches: text_match[]) {
    let result = ""
    text_matches.map((text_match: text_match) => {
      if (text_match.fragment.toLowerCase().includes(inputValue.toLowerCase())) {
        result = text_match.fragment
        return
      }
    })
    return result
  }

  function UserHtml(option: User) {
    let name = option.text_matches.length != 0 ? getName(option.text_matches) : option.login
    let replaceString = "<b>" + inputValue.toLowerCase() + "</b>"
    let replaceName = name.toLowerCase().replace(inputValue.toLowerCase(), replaceString)

    return <Grid item xs={8} key={option.id} sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Card sx={{ boxShadow: 4, display: 'flex' }}>
        <NextImage src={option.avatar_url} height={64} width={64} alt="avatar" className='m-[8px]'></NextImage>
        <div className='w-[103px] pl-[10px] text-f16h24'>
          {parseHtml(replaceName)}
          <div className='pt-[10px]'>
            {option.followers != undefined && option.followers != 0 ? <div className='text-f12h16'>{option.followers} followers</div> : ""}
            {option.following != undefined && option.following != 0 ? <div className='text-f12h16'>{option.following} followings</div> : ""}
          </div>
        </div>
        <FavoriteBorder className='p-[4px]' sx={{ path: { color: '#F44336' } }} />
      </Card>
    </Grid>
  }

  return (
    <Layout page={"home"}>
      <Seo />
      <Card className='pt-[32px] tablet:pt-[64px] h-full mt-[-84px] font-jost' sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Input
          id="githubSearch"
          value={inputValue}
          className='w-full font-jost'
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
                {inputValue != "" ? <CloseRounded /> : ""}
              </IconButton>
            </InputAdornment>
          }
        />
        {totalUsers != 0 ? <div className='p-[16px]'>{totalUsers} GitHub users found</div> : ""}
        {options.length != 0 ? <Grid container columns={16} spacing={1} className="pt-[12px]" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
          {options.map((option: User) => {
            return UserHtml(option)
          })}
          {options.map((option: User) => {
            return UserHtml(option)
          })}
        </Grid> : ""}
        <div className='mt-[50%] tablet:mt-[30%] w-full' hidden={inputValue == "" && options.length == 0 ? false : true}>
          <NextImage src="/svg/GitHub-Mark-120px-plus.svg" height={120} width={120} alt="github-mark" className='m-auto' useSkeleton></NextImage>
          <NextImage src="/svg/GitHub_Logo.svg" height={57} width={139} alt="github-mark" className='m-auto' useSkeleton></NextImage>
          <div className='text-f14h20 text-center font-[400] text-[#7e7e7e]'>
            <div>Enter GitHub username and search users</div>
            <div>matching the input like Google Search, click</div>
            <div>avatars to view more details, including</div>
            <div>repositories, followers and following.</div>
          </div>
        </div>
        <div className='mt-[50%] tablet:mt-[30%] w-full' hidden={notFound.show}>
          <Search className='w-full m-auto'></Search>
          <div className='text-f14h20 text-center font-[400] text-[#7e7e7e]'>
            <div>No search result found for </div>
            <div>{notFound.inputValue}</div>
          </div>
        </div>
        <Box className='flex absolute w-[466px] tablet:w-[555px] bottom-0 h-[72px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]' sx={{ flexGrow: 1, color: 'text.primary', bgcolor: 'background.default' }}>
          <div className='w-1/2 text-center m-auto'>
            <Search className='w-full m-auto ' sx={{ path: { color: "#1976D2" } }} ></Search>
            <div className='text-[#1976D2]'>Search</div>
          </div>
          <div className='w-1/2 text-center m-auto'>
            <Favorite className='w-full m-auto'></Favorite>
            <div>Favorite</div>
          </div>
        </Box>
      </Card>
    </Layout>
  );
}
