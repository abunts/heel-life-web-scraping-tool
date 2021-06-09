const puppeteer = require('puppeteer')

const URL = 'https://heellife.unc.edu/events'

// const fetchEvents = async function() {}
const fetchEvents = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // `networkIdle2` waits until there are no (<2 ?)
  // network requests for 0.5 sec before proceeding
  await page.goto(URL, { waitUntil: 'networkidle2' })

  const eventData = await page.evaluate(() => {
    let events = []
    const eventCards = [...document.querySelectorAll('.MuiPaper-root.MuiCard-root.MuiPaper-elevation3.MuiPaper-rounded')]
    
    eventCards.forEach(card => {
      const title = card.querySelector('h3').innerText
      const url = card.querySelector('a')
      const newEvent = {
        title: title,
        url: url,
      }
      events.push(newEvent)
    })
    return events
  })

  console.log(eventData)
}

//

fetchEvents()
