# chatting-bot

<a href="https://codeclimate.com/github/Dekiston/Bot_VK/maintainability"><img src="https://api.codeclimate.com/v1/badges/d88067db483d4be7b44a/maintainability" /></a>
<img src="/codecov/c/:vcsName/:user/:repo/:branch?flag=flag_name&token=a1b2c3d4e5" /></a>
## Установка и запуск

```sh
clone repository
npm install
npm start
```

## Как работает

```sh
1. создать сообщество в вк и включить в настройках Long Poll API
2.  вставить в файл "src/core/token.js" токен сообщества
3. добавьте своё сообщество в беседу на правах администратора
---------------------------------------------------
Если вы все правильно сделали, то после включения бота, он начнет учиться на ваших сообщениях в беседе и отвечать на них.
```

## Примечание 
```sh
Так как в начале он знает не так много слов, то слова будут повторяться, а сообщения работать некорректно, но чем больше вы общаетесь, тем более осмысленней будет диалог с ботом.

Обязательно поиграйте с настройками бота через команды size и link - это может улучшить ваш опыт взаимодействия, так как данные настройки напрямую влияют на качество ответов
---------------------------------------------------
Это мой pet-проект, но он не идеален. Он подойдет тому кто хочет сам создать нечто подобное, так как материалов по созданию такого бота, я нашел недостаточным и малоинформативным. Другое применение я вижу использование в дружеской беседе.
Глупенький друг бот
```
