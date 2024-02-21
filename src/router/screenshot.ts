import express from 'express';
import { takeScreenshot } from '../controllers/screenshot';
import { multipleScreenshot } from '../controllers/multipleScreenshots';

export default (router: express.Router) => {
    router.get('/screenshot', takeScreenshot);
    router.get('/screenshot/multiple', multipleScreenshot)
}