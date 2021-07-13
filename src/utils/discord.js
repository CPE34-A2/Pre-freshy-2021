const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK

export function alertBet(challenger, challenged, items) {
  if (!DISCORD_WEBHOOK) {
    console.log(`Discord notification won't work, please define DISCORD_WEBHOOK environment variable on .env.local`)
    return
  }

  const planets = items.planet_ids.join(', ') || '-'

  fetch(DISCORD_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: '',
      embeds: [{
        title: ':fireworks: มีการเดิมพันเกิดขึ้น',
        color: 3286641,
        fields: [
          {
            name: ':crossed_swords: แคลนผู้ท้าดวล',
            value: challenger,
            inline: true
          },
          {
            name: ':shield: แคลนผู้ถูกท้าดวล',
            value: challenged,
            inline: true
          },
          {
            name: '\u200B',
            value: '\u200B',
            inline: true
          },
          {
            name: ':moneybag: เงิน',
            value: numberWithCommas(items.money || 0),
            inline: true,
          },
          {
            name: ':oil: น้ำมัน',
            value: numberWithCommas(items.fuel || 0),
            inline: true
          },
          {
            name: ':star: ดาว',
            value: planets,
            inline: true
          }
        ],
        timestamp: new Date()
      }]
    })
  })
}

function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}