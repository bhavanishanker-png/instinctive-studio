
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config();

const studentsData = [
    {
      "StudentName": "Alyssa Davis",
      "Cohort": "AY 2024-25",
      "Courses": ["CBSE 9 Math"],
      "DateJoined": "2024-02-07T10:00:00", // Added time
      "LastLogin": "2024-12-13T14:30:00", // Added time
      "Status": "Inactive"
    },
    {
      "StudentName": "Michael Curry",
      "Cohort": "AY 2024-25",
      "Courses": ["CBSE 10 Science", "CBSE 10 Math"],
      "DateJoined": "2024-04-02T08:00:00", // Added time
      "LastLogin": "2024-12-19T16:15:00", // Added time
      "Status": "Active"
    },
    {
      "StudentName": "Dr. Jason Velazquez",
      "Cohort": "AY 2023-24",
      "Courses": ["CBSE 11 Physics", "CBSE 11 Chemistry"],
      "DateJoined": "2024-04-06T09:30:00", // Added time
      "LastLogin": "2024-11-27T12:45:00", // Added time
      "Status": "Active"
    },
    {
      "StudentName": "Jeremy White",
      "Cohort": "AY 2023-24",
      "Courses": ["CBSE 11 Biology"],
      "DateJoined": "2024-05-10T11:00:00", // Added time
      "LastLogin": "2024-11-25T09:00:00", // Added time
      "Status": "Inactive"
    },
    {
      "StudentName": "Jason Moore",
      "Cohort": "AY 2024-25",
      "Courses": ["CBSE 12 Math"],
      "DateJoined": "2024-09-24T14:00:00", // Added time
      "LastLogin": "2024-11-28T10:00:00", // Added time
      "Status": "Active"
    },
    {
      "StudentName": "Marie House",
      "Cohort": "AY 2024-25",
      "Courses": ["CBSE 12 Computer Science", "CBSE 12 Math"],
      "DateJoined": "2024-01-26T10:30:00", // Added time
      "LastLogin": "2024-12-02T17:30:00", // Added time
      "Status": "Active"
    },
    {
      "StudentName": "Sarah Lozano",
      "Cohort": "AY 2024-25",
      "Courses": ["CBSE 11 Physics", "CBSE 11 Math"],
      "DateJoined": "2024-04-04T12:00:00", // Added time
      "LastLogin": "2024-12-08T08:00:00", // Added time
      "Status": "Inactive"
    },
    {
      "StudentName": "Logan Romero",
      "Cohort": "AY 2023-24",
      "Courses": ["CBSE 9 Social Studies", "CBSE 9 Math"],
      "DateJoined": "2023-11-22T07:45:00", // Added time
      "LastLogin": "2024-12-07T15:30:00", // Added time
      "Status": "Inactive"
    },
    {
      "StudentName": "Bryce Adkins",
      "Cohort": "AY 2023-24",
      "Courses": ["CBSE 10 Math"],
      "DateJoined": "2023-10-05T13:30:00", // Added time
      "LastLogin": "2024-11-29T11:45:00", // Added time
      "Status": "Inactive"
    },
    {
      "StudentName": "Jennifer Banks",
      "Cohort": "AY 2024-25",
      "Courses": ["CBSE 12 Biology"],
      "DateJoined": "2024-03-06T09:15:00", // Added time
      "LastLogin": "2024-12-07T16:00:00", // Added time
      "Status": "Inactive"
    },
    {
      "StudentName": "Emily Taylor",
      "Cohort": "AY 2023-24",
      "Courses": ["CBSE 9 Math", "CBSE 10 Science"],
      "DateJoined": "2023-11-27T11:30:00", // Added time
      "LastLogin": "2024-12-04T17:00:00", // Added time
      "Status": "Inactive"
    },
    {
      "StudentName": "Johnathan Price",
      "Cohort": "AY 2024-25",
      "Courses": ["CBSE 12 Physics"],
      "DateJoined": "2024-02-25T10:15:00", // Added time
      "LastLogin": "2024-12-04T14:45:00", // Added time
      "Status": "Active"
    },
    {
      "StudentName": "Ryan Woods",
      "Cohort": "AY 2023-24",
      "Courses": ["CBSE 11 Artificial Intelligence"],
      "DateJoined": "2023-12-12T08:00:00", // Added time
      "LastLogin": "2024-12-03T09:30:00", // Added time
      "Status": "Active"
    },
    {
      "StudentName": "Rebecca Villa",
      "Cohort": "AY 2024-25",
      "Courses": ["CBSE 12 Full Stack Development"],
      "DateJoined": "2024-11-10T10:00:00", // Added time
      "LastLogin": "2024-12-11T13:30:00", // Added time
      "Status": "Active"
    }
  ];  

async function seedDatabase() {
    console.log("Clearing old data...");
  
    await prisma.student.deleteMany({});
    await prisma.cohortCourse.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.cohort.deleteMany({});
  
    console.log("Seeding new data...");
  
    const cohorts = [];
    const courses = [];
  
    for (const student of studentsData) {
      // Upsert cohort
      let cohort = cohorts.find(c => c.name === student.Cohort);
      if (!cohort) {
        cohort = await prisma.cohort.upsert({
          where: { name: student.Cohort },
          create: { name: student.Cohort },
          update: {},
        });
        cohorts.push(cohort);
      }
  
      // Upsert courses and create relations
      for (const courseName of student.Courses) {
        let course = courses.find(c => c.name === courseName);
        if (!course) {
          course = await prisma.course.upsert({
            where: { name: courseName },
            create: { name: courseName },
            update: {},
          });
          courses.push(course);
        }
  
        // Create cohort-course relation
        await prisma.cohortCourse.upsert({
          where: { cohortId_courseId: { cohortId: cohort.id, courseId: course.id } },
          create: { cohortId: cohort.id, courseId: course.id },
          update: {},
        });
      }
  
      // Create student
      await prisma.student.create({
        data: {
          StudentName: student.StudentName,
          CohortId: cohort.id,
          DateJoined: new Date(student.DateJoined),
          LastLogin: student.LastLogin ? new Date(student.LastLogin) : null,
          Status: student.Status,
        },
      });
    }
  
    console.log("Database seeded successfully!");
  }
  
  
seedDatabase()
  .catch((error) => console.error("Error seeding database:", error))
  .finally(async () => {
    await prisma.$disconnect();
  });
