const est = require('zxcvbn');

const pass = 'horse caps line field';

const result = est(pass);

console.log(result);
