const {VK} = require("vk-io");
const tokenLongPollAPI = ''; //токен беседы
const vk = new VK({ token: tokenLongPollAPI });

exports.vk = vk;