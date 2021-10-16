const  { VK } = require('vk-io')
const  { HearManager } = require('@vk-io/hear')

const vk = new VK({
  token: 'fdc21b21d644e5e732188a14fac7f61a474efe3e7228bde12a5ddcfab6b5102d7e0d856ac9c0805dc4ec7'
});

const bot = new HearManager(); 

vk.updates.on('message', bot.middleware);


bot.hear (/привет/i, async message => {
  await message.send('привет, я работаю');
});

console.log('Бот запущен!');
vk.updates.start().catch(console.error);
  
