import express from 'express';
import screenshot from './screenshot';

const router = express.Router();

export default (): express.Router => {
    screenshot(router);
    return router;
}