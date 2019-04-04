
export const FetchMovie = async() => {

  console.log('[FetchMovie] start');

  // Perform an example HTTP request.
  // Important:  await asychronous tasks when using HeadlessJS.
  let response = await fetch('https://facebook.github.io/react-native/movies.json');
  let responseJson = await response.json();
  console.log('[FetchMovie] response: ', responseJson);

  return responseJson;
}