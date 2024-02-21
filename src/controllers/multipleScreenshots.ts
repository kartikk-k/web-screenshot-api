import express from 'express';
import * as z from 'zod';
import { chromium, Browser } from 'playwright'
import CONSTANTS from '../helpers/constants';
import captureMultipleScreen from './captureMultipleScreen';

let browserContext: Browser | null = null;

export const multipleScreenshot = async (req: express.Request, res: express.Response) => {

    // check if browser is already running otherwise launch it
    if (!browserContext) await launchBrowser();

    // validate request params
    const paramsSchema = z.object({
        urls: z.string().url().array(),
        height: z.number().optional().default(CONSTANTS.height),
        width: z.number().optional().default(CONSTANTS.width),
        timeout: z.number().max(15000).optional().default(CONSTANTS.timeout), // max timeout is 15 seconds
        fullPage: z.boolean().optional().default(true),
        darkMode: z.boolean().optional().default(false),
    })

    const urlSchema = z.string().url()

    // get request params
    let { urls, height, width, timeout, fullPage, darkMode } = req.query

    if (!urls.toString().trim()) return res.status(400).json({ error: 'urls is required' })

    // list of valid urls
    let validUrls: string[] = []

    // loop through urls and validate them
    urls.toString().split(',').forEach(url => {
        const parsedUrl = urlSchema.safeParse(url.trim())
        if (parsedUrl.success) validUrls.push(parsedUrl.data)
    })

    if (validUrls.length === 0) return res.status(400).json({ error: 'No valid url found' })


    const convertedHeight: number = parseInt(height as string) || CONSTANTS.height
    const convertedWidth: number = parseInt(width as string) || CONSTANTS.width

    // parse and validate request params
    const parsedParams = paramsSchema.safeParse({ urls: validUrls, height: convertedHeight, width: convertedWidth, timeout: timeout, fullPage: fullPage, darkMode: darkMode?.toString().toLowerCase() === 'true' })

    // throw error if request params are invalid
    if (parsedParams.success === false) return res.status(400).json({ error: parsedParams.error.errors[0].message })


    // return res.status(200).json({ urls: parsedParams.data.urls })
    // loop here

    // capture screenshot
    // await captureMultipleScreen({ response: res, urls: parsedParams.data.urls, height: parsedParams.data.height, width: parsedParams.data.width, timeout: parsedParams.data.timeout, darkMode: parsedParams.data.darkMode, fullPage: parsedParams.data.fullPage, browserContext })
    //     .then(binaryData => {
    //         res.json({ result: binaryData })
    //     })
    //     .catch(err => {
    //         res.status(400).json({ error: err });
    //     })

    // start capturing multiple screenshots
    await captureMultipleScreen({ response: res, urls: parsedParams.data.urls, height: parsedParams.data.height, width: parsedParams.data.width, timeout: parsedParams.data.timeout, darkMode: parsedParams.data.darkMode, fullPage: parsedParams.data.fullPage, browserContext })
        .then(binaryData => {
            res.json({
                results: binaryData,
                succeed: `${binaryData.length}/${validUrls.length}`
            })
        })
        .catch(err => {
            res.status(400).json({ error: err });
        })


    // return res.status(200).json({ urls: validUrls })

}

async function launchBrowser() {
    browserContext = await chromium.launch({
        headless: true,
    });
}

