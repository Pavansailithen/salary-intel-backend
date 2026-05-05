import { Request, Response, NextFunction } from 'express';

const VALID_LEVELS = ["L3", "L4", "L5", "SDE1", "SDE2", "Senior"];

export const validateSalaryInput = (req: Request, res: Response, next: NextFunction) => {
  const {
    company,
    role,
    level,
    location,
    experience_years,
    base_salary,
    confidence_score,
    bonus,
    stock
  } = req.body;

  // Required fields check
  const requiredFields = [
    'company', 'role', 'level', 'location', 
    'experience_years', 'base_salary', 'confidence_score'
  ];

  for (const field of requiredFields) {
    if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // Level check
  if (!VALID_LEVELS.includes(level)) {
    return res.status(400).json({ error: `Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}` });
  }

  // Base salary check
  if (typeof base_salary !== 'number' || base_salary <= 0) {
    return res.status(400).json({ error: "base_salary must be a positive number" });
  }

  // Experience years check
  if (!Number.isInteger(experience_years) || experience_years < 0) {
    return res.status(400).json({ error: "experience_years must be a non-negative integer" });
  }

  // Confidence score check
  if (typeof confidence_score !== 'number' || confidence_score < 0 || confidence_score > 1) {
    return res.status(400).json({ error: "confidence_score must be between 0 and 1" });
  }

  // Set defaults for optional fields
  req.body.bonus = bonus ?? 0;
  req.body.stock = stock ?? 0;

  next();
};
