import { Router } from 'express';
import CompetitionService from "./competitionService";

const router = Router();

/**
 * @swagger
 * /competitions:
 *   get:
 *     tags:
 *       - Competitions
 *     name: Login
 *     summary: Get all competitions
 *     responses:
 *       200:
 *         description: All competitions returned
 */
router.get('/', async (req, res) => {
	const competitions = await new CompetitionService(req).allCompetitions();
	await res.status(200).json({ error: false, msg: 'OK', competitions: competitions});
});

/**
 * @swagger
 * /competitions/{id_competition}:
 *   get:
 *     tags:
 *       - Competitions
 *     name: Login
 *     summary: Get a competition by id_competition
 *     produces: application/json
 *     parameters:
 *       - name: id_competition
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All competitions returned
 */
router.get('/:id_competition', async (req, res) => {
	const { id_competition } = req.params;
	const competitions = await new CompetitionService(req).getCompetition(id_competition);
	await res.status(200).json({ error: false, msg: 'OK', competitions: competitions});
});

export default router;
