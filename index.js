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
      //pulling the titles for every event (under h3 element)
      const title = card.querySelector('h3').innerText
      //pulling the links (a) to get to specific events
      const url = card.querySelector('a')
      //pulling the description for every event 
      //const description = card.getElementsByTagName('meta[og:description]')
      const description = card.getElementsByClassName('DescriptionText')
      for (var i = 0; i < description.length; i++) {
        const d = description[i].innerText;
        alert("description: " + d)
    }
      const newEvent = {
        title: title,
        url: url,
        description: description,
      }
      events.push(newEvent)
    })
    return events
  })

  console.log(eventData)
  
}


//

fetchEvents()
