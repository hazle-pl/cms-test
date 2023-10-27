import * as express from 'express';
import puppeteer from 'puppeteer';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

router.get('/api/tiktok/:name', async (req, res) => {
    const name = req.params.name;

    try {
        const searchUrl = `https://www.google.com/search?q=${name}+tiktok`;

        const customHeaders: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
        };

        const searchResponse = await axios.get(searchUrl, {
            headers: customHeaders,
        });

        if (searchResponse.status === 200) {
            const searchHtml = searchResponse.data;
            const $ = cheerio.load(searchHtml);

            const tiktok1 = $("a.cz3goc").first().attr('href');
            const tiktok_prelink_2 = $("div.NyChAd a").attr('href');
            const parts = tiktok_prelink_2?.split('/');
            const tiktok2 = parts?.slice(0, 4).join('/');

            const chosenTikTokUrl = tiktok2 || tiktok1;

            if (chosenTikTokUrl) {
                const tiktokBrowser = await puppeteer.launch({ headless: true });
                const tiktokPage = await tiktokBrowser.newPage();
                await tiktokPage.goto(chosenTikTokUrl);

                const bio_link = await tiktokPage.evaluate(() => {
                    const link = document.querySelector('.eht0fek2');
                    return link ? link.textContent : null;
                });

                const account_likes = await tiktokPage.evaluate(() => {
                    const element = document.querySelector('[data-e2e="followers-count"]');
                    return element ? element.textContent : null;
                });

                const account_followers = await tiktokPage.evaluate(() => {
                    const element = document.querySelector('[data-e2e="likes-count"]');
                    return element ? element.textContent : null;
                });

                const account_avatar = await tiktokPage.evaluate(() => {
                    const img = document.querySelector('img.tiktok-1zpj2q-ImgAvatar');
                    return img ? img.getAttribute('src') : null;
                });

                const tiktokElements: any[] = await tiktokPage.evaluate(() => {
                    const tiktoks = document.querySelectorAll('[data-e2e="user-post-item-list"] > *');
                    const tiktokData: any[] = [];
                    tiktoks.forEach(tiktok => {
                        const imgSrc = tiktok.querySelector('img')?.getAttribute('src');
                        const videoCount = tiktok.querySelector('.video-count')?.textContent;
                        const title = tiktok.querySelector('.tiktok-1wrhn5c-AMetaCaptionLine')?.getAttribute('title');

                        if (imgSrc || videoCount) {
                            tiktokData.push({
                                title,
                                views: videoCount,
                                img: imgSrc,
                            });
                        }
                    });

                    return tiktokData;
                });

                await tiktokBrowser.close();

                const tiktok_count = tiktokElements.length;

                const customResponse = {
                    url: chosenTikTokUrl,
                    bio: bio_link,
                    tiktok_count,
                    account_likes,
                    account_followers,
                    account_avatar,
                    tiktok: tiktokElements,
                };

                res.json(customResponse);
            } else {
                res.json(null);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

export default router;
