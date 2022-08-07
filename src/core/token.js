const {VK} = require("vk-io");
const tokenLongPollAPI = '937a07a228fdf17ec8049f4943b5ffa0168147655c4dbc9fefc13d0c55527a71e82c6b71c33d52c251195'; //токен беседы
const vk = new VK({ token: tokenLongPollAPI });

exports.vk = vk;