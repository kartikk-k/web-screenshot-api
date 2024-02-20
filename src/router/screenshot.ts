import express from 'express';
import { takeScreenshot } from '../controllers/screenshot';

export default (router: express.Router) => {
    router.get('/screenshot', takeScreenshot);
}