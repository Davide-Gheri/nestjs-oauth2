import React, { useCallback, useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar, Menu, MenuItem, Divider } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { useNavigationStyles } from './styles';
import HiddenCss from '@material-ui/core/Hidden/HiddenCss';
import { useAppCurrentUser, useAppData, useCsrf } from '../../hooks';
import { UserProfile } from './user-profile';
import { Link } from 'react-router-dom';

export interface NavBarProps {
  onMobileDrawerToggle: () => void;
  hasSidebar: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ onMobileDrawerToggle, hasSidebar }) => {
  const classes = useNavigationStyles();
  const csrf = useCsrf();
  const user = useAppCurrentUser();
  const { appName } = useAppData();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const formRef = useRef<null | HTMLFormElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.submit();
    }
  }, []);

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
      elevation={0}
      style={{ zIndex: 1205 }}
    >
      <Toolbar color="primary">
        {hasSidebar && (
          <HiddenCss smUp>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMobileDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon/>
            </IconButton>
          </HiddenCss>
        )}
        <Typography variant="h6" noWrap color="inherit">
          {appName} - Management
        </Typography>
        <Box ml="auto">
          <Box ml={2}>
            <Button color="inherit" className={classes.profileButton} onClick={handleClick}>
              <Avatar src={user?.picture} className={classes.avatarSmall}/>
              <Typography variant="h6" color="inherit">
                {user?.nickname}
              </Typography>
            </Button>
            <Menu
              MenuListProps={{
                disablePadding: true,
              }}
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              autoFocus={false}
            >
              <UserProfile p={1} minWidth="200px"/>
              <Divider/>
              <MenuItem onClick={handleClose} component={Link} to="/app/me">Profile</MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
            <form action="/auth/logout" method="post" ref={formRef}>
              <input type="hidden" name="_csrf" value={csrf}/>
            </form>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
