export default function prettyError(error) {
  console.log(error.toString().split('\n')[0].replace(/Error: /g, ''));
  return error.toString().split('\n')[0].replace(/Error: /g, '');
}
