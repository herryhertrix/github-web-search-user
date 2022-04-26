import * as React from 'react';
import Header from './Header';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

export default function Layout({ children, page }: { children: React.ReactNode, page: any }) {

  // Put Header or Footer Here
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );
  function handleToggleColorMode(value: any) {
    setMode(mode == "light" ? "dark" : "light")
  }
  return <div className={mode == 'light' ? 'bg-[#E5E5E5]' : 'bg-black'} >
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <div className='m-auto h-screen mobile:w-[428px] tablet:w-[587px] desktop:w-[466px] '>
          <Header toggleColorMode={handleToggleColorMode} page={page}></Header>
          {children}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  </div>;
}
