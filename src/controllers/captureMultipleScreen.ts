import express from 'express'
import { Browser } from 'playwright'


interface ScreenshotOptions {
    response: express.Response

    urls: string[]
    width: number
    height: number
    timeout: number
    fullPage: boolean
    darkMode: boolean

    browserContext: Browser
}

async function captureMultipleScreen({ response, urls, width, height, darkMode, browserContext, timeout, fullPage }: ScreenshotOptions) {

    const browser = await browserContext.newContext({
        viewport: {
            width: width,
            height: height
        }, colorScheme: darkMode ? 'dark' : 'light'

    })


    let listOfImages: string[] = []

    await Promise.all(urls.map(async (url, index) => {
        console.log(`${index + 1} of ${urls.length} - ${url}`)
        try {
            // open/create new page
            const page = await browser.newPage();

            // await page.goto(url,
            //     timeout ? { waitUntil: 'load', timeout: timeout }
            //         : { waitUntil: 'load' })
            //     .catch((err) => {
            //         throw Error(err);
            //     })

            await page.goto(url, { waitUntil: 'load' })
                .catch((err) => {
                    throw Error(err);
                })


            if (fullPage) {
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
                        }, 200);
                    });
                });

                // scroll to top
                await page.evaluate(() => {
                    window.scrollTo(0, 0);
                });
            }

            // added delay for loading assets
            await page.waitForTimeout(2000);

            // capture screenshot
            let result = await page.screenshot({
                fullPage: fullPage,
            });

            console.log('screenshot captured: ', result.toString('base64').substring(0, 50))

            listOfImages.push(result.toString('base64'))

            // temp
            // listOfImages.push(result.toString('base64').substring(0, 50))

        } catch (err) {
            console.log(`error fetching ${url}: ${err}`)
            // console.log('Error:', err)
        }
    }))

    // ---- clean-up ----
    // response.on('finish', async () => {
    //     console.log("cleaning up function")
    //     await browser.close();
    // });

    return listOfImages;
}

export default captureMultipleScreen;