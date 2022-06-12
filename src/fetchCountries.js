
export function fetchCountries(name){

  return fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
  .catch(error => console.log(error))
}