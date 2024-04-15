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

  let messageSent = false;
  

  
  // Obtém o horário da mensagem
  const messageTime = new Date(msg.date * 1000); 
    
  // Verifica se o horário da mensagem está entre 9h e 18h
  const hour = messageTime.getHours();
  

    if (hour >= 9 && hour < 18) {
        bot.sendMessage(chatId, 'https://uvv.br');
          
    } else {

      if (!messageSent) {
        bot.sendMessage(msg.chat.id, 'O funcionamento da empresa (9h às 18h).');
        messageSent = true;
      }
        
      if (msg.text !== undefined) {

        const text: string = msg.text.toLowerCase();;
        // Verifica se a mensagem contém um email
          if (!text.includes('@') && text != 'sim') { 
            bot.sendMessage(chatId, 'Por favor, digite o seu email:');
          } else if(text != 'sim') {
            // confirmação do email
            const email = text;
            console.log(email);
            bot.sendMessage(chatId, `Você escreveu o email ${email}. Você confirma que está correto? (sim/não)`);
            
            bot.once('message', async (msg) => {
              const confirmation = msg.text ? msg.text.toLowerCase() : '';
    
              if (confirmation === 'sim') {
                // Salvar o email no banco de dados
                const user = await prisma.user.upsert({
                  where: {
                    id_telegram: chatId,
                  },
                  update: {
                    name: `${msg.chat.first_name} ${msg.chat.last_name}`,
                    email: email,
                  },
                  create: {
                    name: `${msg.chat.first_name} ${msg.chat.last_name}`,
                    id_telegram: chatId,
                    email: email,
                  },
                });
    
                bot.sendMessage(chatId, 'Email salvo.');
              } else {
                bot.sendMessage(chatId, 'Escreve o email novamente.');
              }
            });
          }   
      } 
    }

});