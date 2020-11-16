import merge from 'lodash/merge';
import firebaseBase from './base';

const light = {
  palette: {
    type: 'light',
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db',
    }
  }
}

export default merge({}, firebaseBase, light);
