import express from 'express'
import { Browser } from 'playwright'


interface ScreenshotOptions {
    response: express.Response

    url: string
    width: number
    height: number
    timeout: number
    fullPage: boolean
    darkMode: boolean

    browserContext: Browser
}

async function captureScreen({ response, url, width, height, darkMode, browserContext, timeout, fullPage }: ScreenshotOptions) {

    console.log('captureScreen', url, width, height, timeout, fullPage)

    // create a new browser context
    const browser = await browserContext.newContext({
        viewport: {
            width: width,
            height: height
        }, colorScheme: darkMode ? 'dark' : 'light'

    })

    // open/create new page
    const page = await browser.newPage();

    // try {
    await page.goto(url,
        timeout ? { waitUntil: 'load', timeout: timeout }
            : { waitUntil: 'load' })
        .catch((err) => {
            throw Error(err);
        })

    // scroll to trigger lazy loading
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

    // add delay for loading assets
    await page.waitForTimeout(1000);

    // capture screenshot
    let result = await page.screenshot({
        fullPage: fullPage,
    });

    // ---- clean-up ----
    response.on('finish', async () => {
        console.log("cleaning up function")
        await page.close();
        await browser.close();
    });

    return result.toString('base64');

    // send response
    // response.status(200).json({ result: result.toString('base64') });

}

export default captureScreen;