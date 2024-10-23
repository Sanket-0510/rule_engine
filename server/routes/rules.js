import express from 'express';
const rulesRouter = express.Router();
import { auth } from '../utils/auth.js';
import { createRule, evaluateData, mergeRule} from '../controllers/rules.js';


rulesRouter.post('/evaluate', auth, evaluateData)
rulesRouter.post('/create', auth, createRule)
rulesRouter.post('/merge', auth, mergeRule)


export default rulesRouter;