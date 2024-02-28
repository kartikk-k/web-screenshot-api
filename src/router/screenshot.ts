import express from 'express';
import { multipleScreenshot } from '../controllers/multipleScreenshots';

export default (router: express.Router) => {
    router.get('/screenshot', multipleScreenshot)
}