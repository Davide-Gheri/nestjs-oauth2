import React, { memo, PropsWithChildren, useCallback, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { NavBar, SideBar } from '../navigation';
import { Breadcrumb } from '../breadcrumb';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
}));

export const AppLayout = memo<PropsWithChildren<{ hasSidebar: boolean }>>(({ hasSidebar, children }) => {
  const classes = useStyles();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setMobileDrawerOpen(v => !v);
  }, [setMobileDrawerOpen]);

  const closeDrawer = () => setMobileDrawerOpen(false);

  return (
    <div className={classes.root}>
      <NavBar onMobileDrawerToggle={toggleDrawer} hasSidebar={hasSidebar}/>
      {hasSidebar && <SideBar onMobileDrawerToggle={toggleDrawer} mobileDrawerOpen={mobileDrawerOpen} onMobileDrawerClose={closeDrawer}/>}
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <Breadcrumb/>
        {children}
      </main>
    </div>
  )
});
