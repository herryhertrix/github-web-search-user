import * as React from 'react';
import Header from './Header';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';

export default function Layout({ children, page }: { children: React.ReactNode, page: any }) {
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
    <ThemeProvider theme={theme}>
      <div className='m-auto h-screen mobile:w-[428px] tablet:w-[587px] desktop:w-[466px] '>
        <Header toggleColorMode={handleToggleColorMode} page={page}></Header>
        {children}
      </div>
    </ThemeProvider>
  </div>;
}
