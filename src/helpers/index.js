
// strip characters
export const replaceWithoutSpace = (string) => string.replace(/[!@#$%^&*(),.?"':{}|<>]/g, '');

// strip 2 spaces or greater back to 1
export const replaceWithSpace = (string) => string.replace(/\s\s+|\n|-/g, ' ');

// set string to lowercase
export const setToLowerCase = (string) => string.toLowerCase();

// split words by space
export const splitStringBySpace = (string) => string.split(' ');
