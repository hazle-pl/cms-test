// import * as express from 'express';
// import puppeteer from 'puppeteer';

// const router = express.Router();

// router.get('/api/facebook-ads/:name', async (req, res) => {
//     const name = req.params.name;

//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         const searchUrl = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${name}&search_type=keyword_unordered&media_type=all`;

//         await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36');

//         await page.goto(searchUrl, { waitUntil: 'networkidle2' });
//         const searchHtml = await page.content();

//         await browser.close();

//         res.json(searchHtml);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// export default router;
