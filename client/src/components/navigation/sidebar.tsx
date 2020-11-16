import React from 'react';
import { Drawer, Toolbar, List, ListItemText, ListItemIcon, Divider } from '@material-ui/core';
import { useNavigationStyles } from './styles';
import HiddenJs from '@material-ui/core/Hidden/HiddenJs';
import { ListItemLink } from './list-item-link';
import { Dashboard, Apps, People } from '@material-ui/icons';
import { UserProfile } from './user-profile';
import { Perms, userCan } from '../../utils';

export interface SidebarProps {
  mobileDrawerOpen: boolean;
  onMobileDrawerToggle: () => void;
  onMobileDrawerClose: () => void;
}

const routes = [
  [
    { to: '/app', label: 'Dashboard', icon: <Dashboard color="inherit"/>, perm: [] },
  ],
  [
    { to: '/app/clients', label: 'Clients', icon: <Apps color="inherit"/>, perm: ['client', 'read:any'] },
    { to: '/app/users', label: 'Users', icon: <People color="inherit"/>, perm: ['user', 'read:any'] },
  ]
]

export const SideBar: React.FC<SidebarProps> = ({ mobileDrawerOpen, onMobileDrawerToggle, onMobileDrawerClose }) => {
  const classes = useNavigationStyles();

  const drawerContent = (
    <>
      <div className={classes.drawerContainer}>
        <UserProfile/>
        <Divider/>
        {routes.map((routeGroup, idx) => (
          <React.Fragment key={idx}>
            <List>
              {routeGroup.filter(route => {
                if (!route.perm.length) {
                  return true;
                }
                return userCan(route.perm[0], route.perm[1] as Perms);
              }).map(route => (
                <ListItemLink
                  key={route.to}
                  to={route.to}
                  onClick={onMobileDrawerClose}
                  className={classes.linkItem}
                  classes={{gutters: classes.gutters}}
                >
                  <ListItemIcon>
                    {route.icon}
                  </ListItemIcon>
                  <ListItemText primary={route.label} primaryTypographyProps={{color: 'inherit'}}/>
                </ListItemLink>
              ))}
            </List>
            <Divider hidden={idx === routes.length - 1}/>
          </React.Fragment>
        ))}
      </div>
    </>
  )

  return (
    <nav className={classes.drawer}>
      <HiddenJs smUp>
        <Drawer
          className={classes.drawer}
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={onMobileDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawerContent}
        </Drawer>
      </HiddenJs>
      <HiddenJs xsDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <Toolbar/>
          {drawerContent}
        </Drawer>
      </HiddenJs>
    </nav>
  )
}
