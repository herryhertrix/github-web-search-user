import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { Switch, Tooltip } from '@mui/material';

const links = [
  { href: '/', label: 'Route 1' },
  { href: '/', label: 'Route 2' },
];
export default function Header(props: any) {
  const [checked, setChecked] = React.useState(false);

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();
  function toggleColorMode() {
    props.toggleColorMode()
    setChecked(!checked);
  }
  return (
    <header className='sticky top-0 z-50'>
      <Box sx={{ flexGrow: 1, color: 'text.primary', bgcolor: 'background.default' }}>
        <AppBar position="static" className="shadow-none " sx={{ bgcolor: 'background.default', color: 'text.primary' }} >
          <Toolbar>
            <Typography className='bg-inherit' variant="h6" component="div" sx={{ flexGrow: 1, bgcolor: 'background.default', color: 'text.primary', height: 84 }}>
              <div className='pt-[32px]' hidden={props.page == "home" ? false : true}>Search</div>
              <div className='pt-[32px]' hidden={props.page == "favorite" ? false : true}>Favorite</div>
            </Typography>
            <Tooltip title="Toggle dark mode">
              <Switch
                checked={checked}
                sx={{ input: { height: 20, marginTop: 1 } }}
                onChange={() => toggleColorMode()}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Tooltip>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
}
