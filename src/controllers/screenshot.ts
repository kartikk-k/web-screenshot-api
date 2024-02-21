import express from 'express';
import { chromium, devices, BrowserContext, Browser } from 'playwright'
import captureScreen from './captureScreen';
import CONSTANTS from '../helpers/constants';
import * as z from 'zod';

let browserContext: Browser | null = null;

export const takeScreenshot = async (req: express.Request, res: express.Response) => {

    // check if browser is already running otherwise launch it
    if (!browserContext) await launchBrowser();

    // validate request params
    const paramsSchema = z.object({
        url: z.string().url(),
        height: z.number().optional().default(CONSTANTS.height),
        width: z.number().optional().default(CONSTANTS.width),
        timeout: z.number().max(15000).optional().default(CONSTANTS.timeout), // max timeout is 15 seconds
        fullPage: z.boolean().optional().default(true),
        darkMode: z.boolean().optional().default(false)
    })

    // get request params
    let { url, height, width, timeout, fullPage, darkMode } = req.query

    const convertedHeight: number = parseInt(height as string) || CONSTANTS.height
    const convertedWidth: number = parseInt(width as string) || CONSTANTS.width

    // parse and validate request params
    const parsedParams = paramsSchema.safeParse({ url: url, height: convertedHeight, width: convertedWidth, timeout: timeout, fullPage: fullPage?.toString().toLowerCase() === 'true', darkMode: darkMode?.toString().toLowerCase() === 'true' })

    // throw error if request params are invalid
    if (parsedParams.success === false) return res.status(400).json({ error: parsedParams.error.errors[0].message })


    // capture screenshot
    await captureScreen({ response: res, url: parsedParams.data.url, height: parsedParams.data.height, width: parsedParams.data.width, timeout: parsedParams.data.timeout, darkMode: parsedParams.data.darkMode, fullPage: parsedParams.data.fullPage, browserContext })
        .then(binaryData => {
            res.json({ result: binaryData })
        })
        .catch(err => {
            res.status(400).json({ error: err });
        })
}

async function launchBrowser() {
    browserContext = await chromium.launch({
        headless: true,
    });
}

