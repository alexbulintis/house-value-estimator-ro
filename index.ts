const request = require('request');
const cheerio = require('cheerio');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('House Value Estimator RO');
console.log('-------------------------');
console.log('Pasul 1) accesează https://imobiliare.ro')
console.log('Pasul 2) alege orașul, zona și tipul de imobil');
console.log('Pasul 3) filtrează căutarea după caracteristicile imobilului (nr camere, suprafață utilă, etc)');

readline.question('Pasul 4) copiază link-ul de sus aici: ', (resultsPage) => {
  console.log('-------------------------');
  request(resultsPage, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }
    if(response.statusCode === 200) {
      const $ = cheerio.load(body);
      const numberOfResults = Number($('.total_anunturi_js').first().text());
      console.log(`Se caută în pagina ${$('title').text()}`);
      console.log(`${numberOfResults} anunțuri găsite`);
      console.log('-------------------------');
      let prices = [];
      $('.pret-mare').each(function() {
        prices.push(Number($(this).text().replace(".","")));
      })
      prices = prices.splice(0, numberOfResults);

      console.log("Medie: " + prices.reduce((a, b) => a + b, 0) / prices.length);
      console.log("Mediană: " + prices[Math.floor(prices.length / 2)]);
      console.log("Min: " + Math.min(...prices));
      console.log("Max: " + Math.max(...prices));
    }
  });
});