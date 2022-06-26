const procent = (Id) => {
  let procent = [];
  procent.push(fs.readFileSync(fileProcent(Id), "utf8"));
  return procent[0].slice(8, 12);
}; //чтение процента из файла

bot.hear(/^minfo$/i, (context) => {
  context.send(fs.readFileSync(fileProcent(context.chatId), "utf8"));
}); //информация по беседе

bot.hear(/^mclear$/i, (context) => {
  fs.unlink(fileProcent(context.chatId), (err) => {
    if (err) {console.log("path/file.txt was deleted")}
  });
  fs.unlink(fileDict(context.chatId), (err) => {
    if (err) {console.log("path/file.txt was deleted")}
  });
  context.send("Очищено.");
}); //удаление файлов беседы

bot.hear(/^mp....|mp...$/i, (context) => {
  //изменение процента ответов
  let procent = fs.readFileSync(fileProcent(context.chatId), "utf8");
  let lastProcent = procent.slice(9, 12);
  procent = procent.replace(lastProcent, context.text.slice(3));
  fs.writeFileSync(fileProcent(context.chatId), procent);
  context.send("Процент изменен.");
}); //изменение процента



bot.hear(/./, async (context) => {
  //любое сообщение
  let time = performance.now();
  
  time = performance.now() - time;
  console.log("Время выполнения: " + time.toFixed(3)); //сколько времени выполнялся запрос
});

