import { Router } from 'express';
import { leadController } from '../controllers/lead.controller';

const router = Router();

router.post('/webhook', leadController.handleWebhook);

export const leadRoutes = router;
