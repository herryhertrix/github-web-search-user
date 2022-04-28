import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Box from '@mui/material/Box';
import { Favorite, Search } from '@mui/icons-material';
import { Provider } from 'react-redux'

import { store } from '../../app/store'
import { ShowUser } from '@/features/favorite/favoriteFunction';
import Link from 'next/link';

export default function Liked() {
  return (
    <Layout page={"favorite"}>
      <Seo />
      <Box className='pt-[32px] tablet:pt-[64px] h-full mt-[-84px] font-jost' sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Provider store={store}><ShowUser></ShowUser></Provider>
        <Box className='flex fixed w-[466px] tablet:w-[586px] desktop:bottom-0 tablet:bottom-0 h-[72px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]' sx={{ flexGrow: 1, color: 'text.primary', bgcolor: 'background.default' }}>
          <Link href={"/"}>
            <div className='w-1/2 text-center m-auto cursor-pointer' >
              <Search className='w-full m-auto ' ></Search>
              <div >Search</div>
            </div>
          </Link>
          <div className='w-1/2 text-center m-auto'>
            <Favorite className='w-full m-auto' sx={{ path: { color: "#1976D2" } }}></Favorite>
            <div className='text-[#1976D2]'>Favorite</div>
          </div>
        </Box>
      </Box>
    </Layout>
  );
}
