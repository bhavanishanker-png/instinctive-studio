const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add a student and associate them with a cohort and courses
exports.addStudent = async (data) => {
  const { StudentName, Cohort, DateJoined, LastLogin, Status, Courses } = data;

  // Find the cohort by name
  const cohort = await prisma.cohort.findUnique({
    where: { name: Cohort },
  });

  if (!cohort) {
    throw new Error(`Cohort with name ${Cohort} does not exist.`);
  }

  // Ensure valid courses and check if they belong to the cohort
  if (!Courses || Courses.length === 0) {
    throw new Error('At least one course is required.');
  }

  const validCourses = await prisma.course.findMany({
    where: {
      name: { in: Courses }, // Filter courses by names provided
      cohorts: {
        some: {
          cohortId: cohort.id, // Ensure the course belongs to the specified cohort
        },
      },
    },
  });

  if (validCourses.length !== Courses.length) {
    throw new Error('One or more courses do not exist or do not belong to the specified cohort.');
  }

  // Create the student
  const student = await prisma.student.create({
    data: {
      StudentName,
      CohortId: cohort.id,
      DateJoined: new Date(DateJoined),
      LastLogin: LastLogin ? new Date(LastLogin) : null,
      Status,
    },
  });

  // Check if the associations already exist in CohortCourse
  const existingAssociations = await prisma.cohortCourse.findMany({
    where: {
      cohortId: cohort.id,
      courseId: { in: validCourses.map(course => course.id) },
    },
  });

  const existingCourseIds = existingAssociations.map(association => association.courseId);
  const newCourses = validCourses.filter(course => !existingCourseIds.includes(course.id));

  // Create the association between the student and courses only if it doesn't already exist
  if (newCourses.length > 0) {
    await prisma.cohortCourse.createMany({
      data: newCourses.map(course => ({
        cohortId: cohort.id,
        courseId: course.id,
      })),
    });
  }

  return student;  // Return the student with the cohort and courses
};


// Fetch all students with their cohort and courses they are enrolled in
exports.getStudents = async () => {
  const students = await prisma.student.findMany({
    include: {
      cohort: {
        include: {
          courses: {
            select: {
              course: {
                select: {
                  name: true, // Fetch only the course name
                },
              },
            },
          },
        },
      },
    },
  });

  // Format the response to include only the relevant data
  return students.map(student => ({
    StudentName: student.StudentName,
    Cohort: student.cohort.name, // Cohort name
    Courses: student.cohort.courses
      .map(cohortCourse => cohortCourse.course.name), // Extract only the course names
    DateJoined: student.DateJoined ? student.DateJoined.toISOString().split('T').join(' ') : null, // Format date and time as "YYYY-MM-DD HH:mm:ss"
    LastLogin: student.LastLogin ? student.LastLogin.toISOString().split('T').join(' ') : null, // Format date and time if available
    Status: student.Status,
  }));
};
exports.getStudentById = async (id) => {
    // Convert ID to integer
    const studentId = parseInt(id, 10);
  
    if (isNaN(studentId)) {
      throw new Error("Invalid student ID. ID must be a number.");
    }
  
    // Fetch the student, including their cohort and courses
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        cohort: {
          include: {
            courses: {
              select: {
                course: {
                  select: {
                    name: true, // Fetch only the course name
                  },
                },
              },
            },
          },
        },
      },
    });
  
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found.`);
    }
  
    // Format the response
    return {
      StudentName: student.StudentName,
      Cohort: student.cohort.name, // Cohort name
      Courses: student.cohort.courses.map(cohortCourse => cohortCourse.course.name), // Extract course names
      DateJoined: student.DateJoined ? student.DateJoined.toISOString().split('T').join(' ') : null, // Format date
      LastLogin: student.LastLogin ? student.LastLogin.toISOString().split('T').join(' ') : null, // Format date
      Status: student.Status,
    };
  };
  
// Update student details
exports.updateStudent = async (id, data) => {
  const { CohortName, CourseIds, ...updateData } = data;

  // Handle cohort update if provided
  if (CohortName) {
    const cohort = await prisma.cohort.findUnique({
      where: { name: CohortName },
    });

    if (!cohort) {
      throw new Error(`Cohort with name ${CohortName} does not exist.`);
    }

    updateData.CohortId = cohort.id;
  }

  // Handle course updates if provided
  if (CourseIds && CourseIds.length > 0) {
    // Check if courses exist and belong to the student's cohort
    const validCourses = await prisma.course.findMany({
      where: {
        id: { in: CourseIds },
      },
    });

    if (validCourses.length !== CourseIds.length) {
      throw new Error('One or more courses do not exist.');
    }

    updateData.courses = {
      set: validCourses.map(course => ({ id: course.id })), // Update the student with new courses
    };
  }

  // Update student details
  return prisma.student.update({
    where: { id: parseInt(id) },
    data: updateData,
  });
};

exports.deleteStudent = async (id) => {
    // Convert id to an integer
    const studentId = parseInt(id, 10);
  
    if (isNaN(studentId)) {
      throw new Error("Invalid student ID. ID must be a number.");
    }
  
    // First, check if the student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
  
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found.`);
    }
  
    // Now delete the student
    return prisma.student.delete({
      where: { id: studentId },
    });
  };
  