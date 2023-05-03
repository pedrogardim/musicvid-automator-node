export const processVideoTitle = (input) => {
  let result = input;
  result = result.split('(')[0].trim();
  result = result.split('(')[0].trim();
  result = result.split('[')[0].trim();
  return result;
};
