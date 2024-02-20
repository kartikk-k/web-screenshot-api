import express from 'express';
import { chromium, devices, BrowserContext } from 'playwright'

let browser: BrowserContext | null = null;

export const takeScreenshot = async (req: express.Request, res: express.Response) => {

    if (!browser) await launchBrowser();

    try {
        let url = req.query.url;

        if (!url) return Error('url is required');
        url = url.toString();

        const page = await browser.newPage();
        await page.goto(url.toString(), { waitUntil: 'load' });

        // console.log('scrolling to trigger lazy loading');
        await page.evaluate(() => {
            return new Promise((resolve) => {
                let totalHeight = 0;
                let distance = window.innerHeight;
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve(console.log(''));
                    }
                }, 100);
            });
        });

        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });

        let result = await page.screenshot({
            fullPage: true,
            scale: 'device',
        });

        await page.close();

        console.log('closing browser');

        await browser.close();
        browser = null;
        // const users = await getUsers();
        return res.json({ data: result.toString('base64') }).status(200).end();

    } catch (error) {
        console.log('error', error);
        return res.send({ error }).status(400).end();
    }

}

async function launchBrowser() {
    let context = await chromium.launch({
        headless: true,
    });

    browser = await context.newContext({
        viewport: {
            width: 1440,
            height: 720
        }
    })
}

