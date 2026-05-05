import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface RawSalary {
  company: string;
  role: string;
  level: string;
  location: string;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  confidence_score: number;
}

const salaries: RawSalary[] = [
  { company: "google", role: "Software Engineer", level: "L3", location: "Bangalore", experience_years: 1, base_salary: 1800000, bonus: 200000, stock: 300000, confidence_score: 0.9 },
  { company: "google", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 3, base_salary: 2800000, bonus: 400000, stock: 600000, confidence_score: 0.88 },
  { company: "google", role: "Senior Engineer", level: "L5", location: "Hyderabad", experience_years: 6, base_salary: 4500000, bonus: 600000, stock: 1200000, confidence_score: 0.92 },
  { company: "microsoft", role: "Software Engineer", level: "SDE1", location: "Hyderabad", experience_years: 1, base_salary: 1600000, bonus: 150000, stock: 200000, confidence_score: 0.85 },
  { company: "microsoft", role: "Software Engineer", level: "SDE2", location: "Hyderabad", experience_years: 4, base_salary: 2600000, bonus: 350000, stock: 700000, confidence_score: 0.87 },
  { company: "microsoft", role: "Senior Engineer", level: "Senior", location: "Bangalore", experience_years: 7, base_salary: 4000000, bonus: 500000, stock: 1500000, confidence_score: 0.91 },
  { company: "amazon", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 2, base_salary: 1700000, bonus: 180000, stock: 250000, confidence_score: 0.86 },
  { company: "amazon", role: "Software Engineer", level: "SDE2", location: "Chennai", experience_years: 5, base_salary: 2900000, bonus: 400000, stock: 800000, confidence_score: 0.89 },
  { company: "flipkart", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 1, base_salary: 1400000, bonus: 100000, stock: 150000, confidence_score: 0.83 },
  { company: "flipkart", role: "Senior Engineer", level: "SDE2", location: "Bangalore", experience_years: 4, base_salary: 2400000, bonus: 300000, stock: 600000, confidence_score: 0.85 },
  { company: "swiggy", role: "Backend Engineer", level: "L4", location: "Bangalore", experience_years: 3, base_salary: 2200000, bonus: 250000, stock: 400000, confidence_score: 0.84 },
  { company: "razorpay", role: "Full Stack Engineer", level: "L4", location: "Bangalore", experience_years: 3, base_salary: 2500000, bonus: 300000, stock: 500000, confidence_score: 0.88 },
];

async function main() {
  try {
    const dataWithTotal: Prisma.SalaryCreateManyInput[] = salaries.map(s => ({
      ...s,
      total_compensation: s.base_salary + s.bonus + s.stock
    }));

    const result = await prisma.salary.createMany({
      data: dataWithTotal
    });

    console.log(`Seeded ${result.count} records`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
