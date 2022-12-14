import express from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes';
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string';

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
  log: ['query']
})

app.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  });

  return response.json(games);
});

// 201 - Item criado
app.post('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;
  const body: any = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,  
      name: body.name,       
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel
    }
  });

  return response.status(201).json(ad);
});

app.get('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      cheatedAt: 'desc'
    }
  });

  return response.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd)
    }
  }));
});

app.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id: adId
    }
  });

  return response.json({
    discord: ad.discord
  });
});

app.listen(3333);

/*
  HTTP Codes:
  - Iniciados com 2 represetam SUCESSO
  - Iniciados com 3 representam REDIRECIONAMENTO
  - Iniciados com 4 represetam C??DIGO COM ERRO GERADO PELA APLICA????O
  - Iniciados com 5 representam ERROS INESPERADOS

  Tipos de par??metros:
  - Ao todo s??o 3...

    1. Query params
      - Veem para a aplica????o a partir do ponto de interroga????o na URL
      - S??o nomeados. Ex?? page=20&sort=desc
      - S??o utilizandos quandodo precisamos persistir estados
      (Interessante para filtros, ordena????o e valores n??o senss??veis)
      (podem ser enviados em conjunto com a URL para outros individuos)
  
    2. Route params
      - Tamb??m s??o apresentados na URL, mas n??o a partir do ponto de interroga????o
      - N??o s??o nomeados. Ex localhost:3000/games/5
      - Utilizado para identificar recursos, como um id que representa um elemento espec??fico.
  
    3. Body params
      - Enviado no corpo
      - Utilizado para enviar v??rias informa????es em uma s?? requisi????o
      - Fica escondido
      - Bastante utilizado para informa????es senss??veis de formul??rios
*/