import { Request, Response } from 'express';
import {Salary} from '@prisma/client';
import { PrismaClient, Prisma, } from '@prisma/client';
import { normalizeCompany } from '../utils/normalize';

const prisma = new PrismaClient();

export const ingestSalary = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      company,
      role,
      level,
      location,
      experience_years,
      base_salary,
      bonus,
      stock,
      confidence_score
    } = req.body;

    const normalizedCompany = normalizeCompany(company);

    const total_compensation =
      Number(base_salary) +
      Number(bonus) +
      Number(stock);

    const salary = await prisma.salary.create({
      data: {
        company: normalizedCompany,
        role,
        level,
        location,
        experience_years: Number(experience_years),
        base_salary: Number(base_salary),
        bonus: Number(bonus),
        stock: Number(stock),
        total_compensation,
        confidence_score: Number(confidence_score)
      }
    });

    return res.status(201).json(salary);
  } catch (error) {
    console.error('Error ingesting salary:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const getSalaries = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { company, role, level, location } = req.query;

    const where: any = {};

    if (typeof company === 'string') {
      where.company = {
        contains: company,
        mode: 'insensitive'
      };
    }

    if (typeof role === 'string') {
      where.role = {
        contains: role,
        mode: 'insensitive'
      };
    }

    if (typeof level === 'string') {
      where.level = level;
    }

    if (typeof location === 'string') {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    const [data, count] = await Promise.all([
      prisma.salary.findMany({
        where,
        orderBy: {
          total_compensation: 'desc'
        }
      }),
      prisma.salary.count({ where })
    ]);

    return res.status(200).json({
      count,
      data
    });
  } catch (error) {
    console.error('Error fetching salaries:', error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const getCompany = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { company } = req.params;

    if (!company) {
      return res.status(400).json({
        error: 'Company name required'
      });
    }

    const normalizedCompany =
      normalizeCompany(company);

    const salaries: Salary[] =
      await prisma.salary.findMany({
        where: {
          company: normalizedCompany
        },
        orderBy: {
          created_at: 'desc'
        }
      });

    if (!salaries.length) {
      return res.status(404).json({
        error: 'Company not found'
      });
    }

    const compensations = salaries
      .map(
        (salary: Salary) =>
          salary.total_compensation
      )
      .sort(
        (a: number, b: number) =>
          a - b
      );

    const count = compensations.length;

    let median: number;

    if (count % 2 === 0) {
      median =
        (
          compensations[count / 2 - 1] +
          compensations[count / 2]
        ) / 2;
    } else {
      median =
        compensations[
          Math.floor(count / 2)
        ];
    }

    const levelDistribution:
      Record<string, number> = {};

    salaries.forEach(
      (salary: Salary) => {
        levelDistribution[
          salary.level
        ] =
          (
            levelDistribution[
              salary.level
            ] || 0
          ) + 1;
      }
    );

    return res.status(200).json({
      company:
        normalizedCompany,
      total_entries: count,
      median_compensation:
        Number(
          median.toFixed(2)
        ),
      level_distribution:
        levelDistribution,
      salaries
    });
  } catch (error) {
    console.error(
      'Error fetching company:',
      error
    );

    return res.status(500).json({
      error:
        'Internal server error'
    });
  }
};

export const compareSalaries = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      salaryId1,
      salaryId2
    } = req.query;

    if (
      typeof salaryId1 !==
        'string' ||
      typeof salaryId2 !==
        'string'
    ) {
      return res.status(400).json({
        error:
          'Both salary ids required'
      });
    }

    const [
      salary1,
      salary2
    ] = await Promise.all([
      prisma.salary.findUnique({
        where: {
          id: salaryId1
        }
      }),
      prisma.salary.findUnique({
        where: {
          id: salaryId2
        }
      })
    ]);

    if (!salary1 || !salary2) {
      return res.status(404).json({
        error:
          'Salary not found'
      });
    }

    return res.status(200).json({
      salary1,
      salary2,

      difference: {
        base:
          salary1.base_salary -
          salary2.base_salary,

        bonus:
          salary1.bonus -
          salary2.bonus,

        stock:
          salary1.stock -
          salary2.stock,

        total:
          salary1.total_compensation -
          salary2.total_compensation,

        level_difference:
          salary1.level ===
          salary2.level
            ? 'Same level'
            : `${salary1.level} vs ${salary2.level}`
      }
    });
  } catch (error) {
    console.error(
      'Error comparing salaries:',
      error
    );

    return res.status(500).json({
      error:
        'Internal server error'
    });
  }
};