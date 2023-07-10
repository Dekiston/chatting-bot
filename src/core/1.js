const translate = require('google-translate-api');
 async function reverselang (chain)  {
    let reverse;
    await translate(chain, {from: 'ru', to: 'en'}).then(res => {
        console.log ("reverse1: " + res.text);
        reverse = res.text;
    }).catch(err => {
        console.error(err);
    });

    await translate(reverse, {from: 'en', to: 'ru'}).then(res => {
        console.log ("reverse2: " + res.text);
        reverse = res.text;
    }).catch(err => {
        console.error(err);
    });
    
    return reverse.trimEnd() + ".";
  }

  exports.reverselang = reverselang;