export const idFromUrl = (input) => {
  let result = input;
  result = result.replace('https://soundcloud.com/', '');
  result = result.replace('/', '-');
  return result;
};
