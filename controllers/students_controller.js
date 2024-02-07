const Student = require("../models/student");
const Interview = require("../models/interview");

// Render add student page
module.exports.addStudent = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("add_student", {
      title: "Add Student",
    });
  }

  return res.redirect("/");
};

// Render edit student page
module.exports.editStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (req.isAuthenticated()) {
      return res.render("edit_student", {
        title: "Edit Student",
        studentDetails: student,
      });
    }

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while processing your request.");
    return res.redirect("back");
  }
};

// Creation of a new student
module.exports.create = async (req, res) => {
  try {
    const {
      name,
      email,
      batch,
      college,
      placement_status,
      dsa_score,
      react_score,
      webdev_score,
    } = req.body;

    // Check if the student already exists
    const existingStudent = await Student.findOne({ email }).exec();

    if (!existingStudent) {
      // If the student doesn't exist, create a new one
      await Student.create({
        name,
        email,
        college,
        batch,
        dsa_score,
        react_score,
        webdev_score,
        placement_status,
      });

      req.flash("success", "Student added!");
      return res.redirect("back");
    } else {
      // If the student already exists, display an error message
      req.flash("error", "Student already exists!");
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while processing your request.");
    return res.redirect("back");
  }
};

// Deletion of a student
module.exports.destroy = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      req.flash("error", "Couldn't find student");
      return res.redirect("back");
    }

    const interviewsOfStudent = student.interviews;

    // Delete reference of the student from companies in which this student is enrolled
    if (interviewsOfStudent.length > 0) {
      for (const interview of interviewsOfStudent) {
        await Interview.findOneAndUpdate(
          { company: interview.company },
          { $pull: { students: { student: studentId } } }
        );
      }
    }

    await student.remove();
    req.flash("success", "Student deleted!");
    return res.redirect("back");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while processing your request.");
    return res.redirect("back");
  }
};

// Update student details
module.exports.update = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const {
      name,
      college,
      batch,
      dsaScore,
      reactScore,
      webdevScore,
      placementStatus,
    } = req.body;

    if (!student) {
      req.flash("error", "Student does not exist!");
      return res.redirect("back");
    }

    student.name = name;
    student.college = college;
    student.batch = batch;
    student.dsaScore = dsaScore;
    student.reactScore = reactScore;
    student.webdevScore = webdevScore;
    student.placementStatus = placementStatus;

    await student.save();
    req.flash("success", "Student updated!");
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while processing your request.");
    return res.redirect("back");
  }
};
