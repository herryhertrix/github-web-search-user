import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { debounce, unset } from 'lodash';
import NextImage from '@/components/NextImage';
import { BottomNavigation, Card, IconButton, Input, InputAdornment } from '@mui/material';
import { CloseRounded, Favorite, FavoriteBorder, Search } from '@mui/icons-material';
import parseHtml from 'html-react-parser'
import { notFound, text_match, User } from '@/components/model/basic';
import { store } from '@/app/store';
import { Provider } from 'react-redux';
import Link from 'next/link';
import { SearchBar } from '@/features/search/searchFunction';

export default function HomePage() {
  // const dispatch = useAppDispatch();
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
      </Card>
    </Grid>
  }

  return (
    <Provider store={store}>
      <Layout page={"home"}>
        <Seo />
        <Box className='pt-[32px] tablet:pt-[64px] h-full mt-[-84px] font-jost' sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
          <SearchBar></SearchBar>
          <Box className='flex fixed w-[466px] tablet:w-[586px] desktop:bottom-0 tablet:bottom-0 h-[72px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]' sx={{ flexGrow: 1, color: 'text.primary', bgcolor: 'background.default' }}>
            <div className='w-1/2 text-center m-auto'>
              <Search className='w-full m-auto ' sx={{ path: { color: "#1976D2" } }} ></Search>
              <div className='text-[#1976D2]'>Search</div>
            </div>
            <Link href={"/liked"} >
              <div className='w-1/2 text-center m-auto cursor-pointer'>
                <Favorite className='w-full m-auto'></Favorite>
                <div>Favorite</div>
              </div>
            </Link>
          </Box>
        </Box>
      </Layout>
    </Provider>
  );
}
