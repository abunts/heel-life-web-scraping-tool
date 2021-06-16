const puppeteer = require('puppeteer');
//homebase url to grab heel life events
const homeURL = 'https://heellife.unc.edu/events';

//fetching events async function
  const fetchEvents = async () => {
    //launching browser using puppeteer
  const browser = await puppeteer.launch();
  //opening new page in browser
  const page = await browser.newPage();
  // use { waitUntil: 'networkidle2' } to have network request for 0.5 sec before proceeding
  await page.goto(homeURL + '/events');

  const eventData = await page.evaluate(() => {
    //creating an array for event urls
    let urls = [];
    //pulling the events from the main event page on heel life website
    let anchorTags = document.querySelectorAll('#event-discovery-list a');
    /* ADDED:
    //after clicking on "load more" button
    page.click('button'),
    page.waitForSelector('button')
    */
    anchorTags.forEach((card) => {
      //pulling url from specific event (getting its href) and adding it to event(s) array 
      urls.push(card.getAttribute('href'));
    });
    return urls;
  });
//array holding other data for event info (description, title, etc.)
  let data = [];
  //gets urls of all event cards
  for(const url of eventData){
    //fulfills all of the events in the array
    await Promise.all([
      //waiting for the page to load everything
      page.waitForNavigation(),
      //redirecting to heel life events page and then a specific event
      page.goto(homeURL + url),
      page.waitForSelector('.engage-application'),
    ]);
  const pageData = await page.evaluate(() => {
    //pulling title from the event card (found in h1 tag)
  const title = document.querySelector('h1').innerText;
  //pulling description from the event card (found in a div with class name DescriptionText)
  const description = document.querySelector('.DescriptionText').innerText;
  /* ADDED:
  //sorting through events and pulling events related to data science 
  const dataScience = document.document.querySelector('#event-discovery-list a[href*="data science="]');
  if(document.contains(dataScience)){
    data.push({...pageData, url: homeURL + url});
  }*/
  return {title, description};
});
//adding new info to the data array
data.push({...pageData, url: homeURL + url});
}
  await browser.close();
  console.log(data);
  };

//

fetchEvents(); 

