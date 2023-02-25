const qrcode = require('qrcode-terminal');
const { get } = require('axios');

const { Client, MessageMedia } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});


client.on('message_create', async (msg) => {
  console.log(msg);
  const command = msg.body.split(' ')[0];
  const sender = msg.from.includes('85443042') ? msg.to : msg.from;

  if (command === '/sticker' || command === '/s') {
    await generateSticker(msg, sender);
  }
});

const generateSticker = async (msg, sender) => {
  if (msg.type === 'image' || (msg.quoted && msg.quoted.type.includes('image'))) {
    try {
      const { data } = await msg.downloadMedia();
      const image = await new MessageMedia('image/jpeg', data, 'image.jpg');

      await msg.reply(client.sendMessage(sender, image, {
        sendMediaAsSticker: true, stickerName: 'Dsantos', stickerAuthor: '😎',
      }));

    } catch (e) {
      await msg.reply('❌ Erro ao processar imagem');
      console.log(e);
    }
  }
};

module.exports = { client };
