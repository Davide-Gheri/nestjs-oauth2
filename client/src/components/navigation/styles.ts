import { makeStyles } from '@material-ui/core/styles';

export const drawerWidth = 240;

export const useNavigationStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  avatarSmall: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
  profileButton: {
    textTransform: 'none',
  },
  gutters: theme.mixins.gutters(),
  linkItem: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    ...(theme.mixins as any).drawerItem,
  },
}))
