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



// Função para verificar se uma string contém um email
function isEmail(text: string): boolean  {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  return emailRegex.test(text);
}

bot.on('message', async (msg) => {

  const chatId = msg.chat.id.toString();
 

  
    // Obtém o horário da mensagem
    const messageTime = new Date(msg.date * 1000); 
    
    // Verifica se o horário da mensagem está entre 9h e 18h
    const hour = messageTime.getHours();

    if (hour >= 9 && hour < 18) {
        bot.sendMessage(msg.chat.id, 'https://uvv.br');

        if (msg.text !== undefined) {
          const text: string = msg.text;
          // Verifica se a mensagem contém um email
            const email = text;
            
            // Envia uma mensagem solicitando confirmação
            bot.sendMessage(chatId, `Você escreveu o email ${email}. Você confirma que está correto? (sim/não)`);
            
            if (msg.text !== undefined) {
              const text: string = msg.text.toLowerCase();
              if (text === 'sim') {
                  // Salvar o email no banco de dados
                  const email = msg.text;

                  const user = await prisma.user.upsert({
                    where:{
                      id_telegram: chatId,
                    },
                    update: {
                      name: `${msg.chat.first_name} ${msg.chat.last_name}`,
                      email: `${email}`
                    },
                    create: {
                      name: `${msg.chat.first_name} ${msg.chat.last_name}`,
                      id_telegram: msg.chat.id.toString(),
                    },
                  });
                  bot.sendMessage(
                    // msg.chat.id,
                    // `${user.name}, seu usuário já esta cadastrado no nosso sistema!`,
                    msg.chat.id,
                    `${user.email}, email`
                  );

                  bot.sendMessage(chatId, 'Email confirmado e salvo com sucesso no banco de dados.');
              } else if (text === 'não' ||text === 'nao') {
                  bot.sendMessage(chatId, 'Por favor, envie o email novamente.');
              }else {
                console.log('Texto recebido:', text); // Para depuração, verifique o texto recebido
            }

            }
            

          
        }
        
        
    } else {
        bot.sendMessage(msg.chat.id, 'O funcionamento da empresa (9h às 18h).');

        if (msg.text !== undefined) {
          const text: string = msg.text;
          // Verifica se a mensagem contém um email
          if (isEmail(text)) {
            const email = text;
            const messageId = msg.message_id;
            // Envia uma mensagem solicitando confirmação
            bot.sendMessage(chatId, `Você escreveu o email ${email}. Você confirma que está correto? (sim/não)`);
            
            if (msg.text !== undefined) {
              const text: string = msg.text.toLowerCase();
              if (text === 'sim') {
                  // Salvar o email no banco de dados
                  const email = msg.text;

                  const user = await prisma.user.upsert({
                    where:{
                      id_telegram: chatId,
                    },
                    update: {
                      name: `${msg.chat.first_name} ${msg.chat.last_name}`,
                      email: `${email}`
                    },
                    create: {
                      name: `${msg.chat.first_name} ${msg.chat.last_name}`,
                      id_telegram: msg.chat.id.toString(),
                    },
                  });

                  bot.sendMessage(chatId, 'Email confirmado e salvo com sucesso no banco de dados.');
              } else if (text === 'não') {
                  bot.sendMessage(chatId, 'Por favor, envie o email novamente.');
              }

            }
            

          } else {
            bot.sendMessage(msg.chat.id, 'Por favor, envie um email válido.');
          }
        }
    
    }


  // const user = await prisma.user.upsert({
  //   where:{
  //     id_telegram: chatId,
  //   },
  //   update: {
  //     name: `${msg.chat.first_name} ${msg.chat.last_name}`  
  //   },
  //   create: {
  //     name: `${msg.chat.first_name} ${msg.chat.last_name}`,
  //     id_telegram: msg.chat.id.toString(),
  //   },
  // });

  
 

});

