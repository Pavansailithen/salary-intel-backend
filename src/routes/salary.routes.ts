import { Router } from 'express';
import { validateSalaryInput } from '../middleware/validate';
import { ingestSalary, getSalaries, getCompany, compareSalaries } from '../controllers/salary.controller';

const router = Router();

router.post('/ingest-salary', validateSalaryInput, ingestSalary);
router.get('/salaries', getSalaries);
router.get('/company/:company', getCompany);
router.get('/compare', compareSalaries);

export default router;
