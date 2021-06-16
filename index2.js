const puppeteer = require('puppeteer');

const BASEURL = 'https://heellife.unc.edu';

const fetchData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(BASEURL + '/events');

  const eventUrls = await page.evaluate(() => {
    let urls = [];
    let anchorTags = document.querySelectorAll('#event-discovery-list a');
    anchorTags.forEach((item) => {
      urls.push(item.getAttribute('href'));
    });
    return urls;
  });

  let data = [];

  for (const url of eventUrls) {
    await Promise.all([
      page.waitForNavigation(),
      page.goto(BASEURL + url),
      page.waitForSelector('.engage-application'),
    ]);

    const pageData = await page.evaluate(() => {
      const title = document.querySelector('h1').innerText;
      const description = document.querySelector('.DescriptionText').innerText;
      return { title, description };
    });
    data.push({ ...pageData, url: BASEURL + url });
  }
  await browser.close();
  console.log(data);
};

fetchData();
