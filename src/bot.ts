//const TelegramBot = require('node-telegram-bot-api');

//const  dotenv  =  require ( 'dotenv' ) ;
//require('dotenv').config();

import TelegramBot from "node-telegram-bot-api";

import { config } from "dotenv";

import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

declare global {
  namespace NodeJS {
      interface ProcessEnv {
        Bot_Token: string
      }
  }
}

const bot = new TelegramBot(process.env.Bot_Token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  
  const chatId = msg.chat.id;
  if(match){
    const resp = match[1];
    bot.sendMessage(chatId, resp);
  }else{
    bot.sendMessage(chatId, "Ocorreu um erro na comunicação");
  }
});



bot.on('message', async (msg) => {

  const chatId = msg.chat.id.toString();

  
  console.log(msg);
  bot.sendMessage(chatId, 'oieeee');

  const user = await prisma.user.upsert({
    where:{
      id_telegram: chatId,
    },
    update: {
      name: `${msg.chat.first_name} ${msg.chat.last_name}`
    },
    create: {
      name: `${msg.chat.first_name} ${msg.chat.last_name}`,
      id_telegram: msg.chat.id.toString(),
    },
  });

  
  bot.sendMessage(
    msg.chat.id,
    `${user.name}, seu usuário já esta cadastrado no nosso sistema!`
  );

});

