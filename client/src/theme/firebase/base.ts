import { createMuiTheme } from '@material-ui/core';

let firebaseBase: any = createMuiTheme({});

firebaseBase = {
  ...firebaseBase,
  typography: {
    ...firebaseBase.typography,
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    ...firebaseBase.shape,
    borderRadius: 8,
  },
  props: {
    ...firebaseBase.props,
    MuiTab: {
      ...firebaseBase.props.MuiTab,
      disableRipple: true,
    },
  },
  mixins: {
    ...firebaseBase.mixins,
    // toolbar: {
    //   minHeight: 48,
    // },
    drawerItem: {
      color: 'rgba(255, 255, 255, 0.7)',
      '&:hover, &:focus': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
    drawerToolbar: {
      color: 'rgba(255, 255, 255, 0.7)',
      backgroundColor: '#232f3e',
    }
  },
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#18202c',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: firebaseBase.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [firebaseBase.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: firebaseBase.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    // MuiDivider: {
    //   root: {
    //     backgroundColor: '#404854',
    //   },
    // },
    MuiListItemText: {
      primary: {
        fontWeight: firebaseBase.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
};

export default firebaseBase;
