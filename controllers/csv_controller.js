const Student = require("../models/student");
const fs = require("fs");

module.exports.downloadCSVReport = async function (req, res) {
  try {
    const allStudents = await Student.find({});
    let report =
      "Student Id, Student name,Student college, Student email, Student status, DSA Final Score, WebD Final Score, React Final Score, Interview date, Interview company, Interview result";
    let studentData1 = "";

    for (let student of allStudents) {
      studentData1 =
        student.id +
        "," +
        student.name +
        "," +
        student.college +
        "," +
        student.email +
        "," +
        student.placement_status +
        "," +
        student.dsa_score +
        "," +
        student.webdev_score +
        "," +
        student.react_score;
      if (student.interviews.length > 0) {
        for (let interview of student.interviews) {
          let studentData2 = "";
          studentData2 +=
            "," +
            interview.date.toString() +
            "," +
            interview.company +
            "," +
            interview.result;
          report += "\n" + studentData1 + studentData2;
        }
      }
    }

    const filePath = "downloads/studentsReport.csv";

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File doesn't exist, create it.
        const csvFile = fs.writeFile(filePath, report, (err) => {
          if (err) {
            console.error(`Error creating file: ${err}`);
            return res.redirect("back");
          } else {
            console.log(`File created: ${filePath}`);
            req.flash("success", "Successfully downloaded CSV report!");
            return res.download(filePath);
          }
        });
      } else {
        // File exists, proceed with writing.
        const csvFile = fs.writeFile(filePath, report, (err, data) => {
          if (err) {
            console.log(err);
            return res.redirect("back");
          }
          req.flash("success", "Successfully downloaded CSV report!");
          return res.download(filePath);
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
