const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { body, validationResult, check } = require("express-validator");

const Project = require("../models/project");
const Faculty = require("../models/faculty");
const Student = require("../models/student");

const Board = require("../models/board");
const List = require("../models/list");
const Card = require("../models/card");

const {
  uniqueNamesGenerator,
  colors,
  adjectives,
  starWars,
} = require("unique-names-generator");

// @route   GET api/projects
// @desc    Get project of logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "student" && req.user.role !== "faculty") {
      return res.status(401).json({ msg: "Not authorized 1" });
    }
    console.log(req.user.project_id);
    console.log(req.user.isLeader);
    let project = await Project.findById(req.user.project_id);
    // get object of project
    project = project.toObject();
    //get name of leader
    const leader = await Student.findById(project.leader);
    project.leader = leader.name;
    project.leader_email = leader.email;
    project.leader_phoneNumber = leader.phoneNumber;
    //get name of faculty
    const faculty = await Faculty.findById(project.faculty);
    project.faculty = faculty.name;
    //get name of students
    const students = await Student.find({ _id: { $in: project.students } });
    project.students = students.map((student) => student.name);
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/projects/project/:id
// @desc    Get project by ID
// @access  Private
router.get("/project/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "student" && req.user.role !== "faculty") {
      return res.status(401).json({ msg: "Not authorized 2" });
    }
    const project = await Project.findById(req.params.id).populate("student");
    if (!project) {
      return res.status(404).json({ msg: "Project not found from :id api 65" });
    }
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found 71" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("semester", "Semester is required").not().isEmpty(),
      check("faculty_id", "Faculty is required").not().isEmpty(),
      check("project_type", "Project type is required").not().isEmpty(),
      check("frontendTechnologies", "Frontend technologies is required")
        .not()
        .isEmpty(),
      check("backendTechnologies", "Backend technologies is required")
        .not()
        .isEmpty(),
      check("database", "Database is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      description,
      semester,
      faculty_id,
      project_type,
      frontendTechnologies,
      backendTechnologies,
      database,
      company,
      company_email,
      capacity,
    } = req.body;
    if (!faculty_id)
      return res.status(400).json({ msg: "Faculty is required" });
    try {
      if (req.user.role !== "student") {
        return res.status(401).json({ msg: "Not authorized 3" });
      }
      if (req.user.project_id) {
        return res.status(401).json({ msg: "You already have a project" });
      }
      let groupname = generateGroupName() + "---" + title;
      //remove space in groupname
      groupname = groupname.replace(/\s/g, "_");

      const newProject = new Project({
        title,
        description,
        leader: req.user._id,
        faculty: faculty_id,
        semester,
        //push user._id to student array
        students: [req.user._id],
        invite_code: generateInviteCode(),
        groupName: groupname,
        project_type,
        frontendTechnologies,
        backendTechnologies,
        database,
        company,
        company_email,
        capacity,
      });
      const project = await newProject.save();

      // Add project to student
      console.log(req.user._id);
      const student = await Student.findById(req.user._id);
      student.project_id = project._id;
      student.isLeader = true;
      await student.save();

      // Add project to faculty
      if (faculty_id) {
        const faculty = await Faculty.findById(faculty_id);
        faculty.projectCount += 1;
        faculty.projects.push(project._id);
        await faculty.save();
      }
      const newBoard = new Board({
        project: project._id,
      });
      const list1 = new List({
        name: "To Do",
        board: newBoard._id,
      });
      const list2 = new List({
        name: "In Progress",
        board: newBoard._id,
      });
      const list3 = new List({
        name: "In Review",
        board: newBoard._id,
      });
      const list4 = new List({
        name: "Done",
        board: newBoard._id,
      });
      await list1.save();
      await list2.save();
      await list3.save();
      await list4.save();
      newBoard.lists.push(list1._id);
      newBoard.lists.push(list2._id);
      newBoard.lists.push(list3._id);
      newBoard.lists.push(list4._id);
      await newBoard.save();
      //push board._id to project
      project.board = newBoard._id;
      res.status(200).json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//generate random name for group
const generateGroupName = () => {
  let name = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, starWars],
    length: 2,
  });
  return name;
};
// generate invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 15);
};

// @route   PUT api/projects/:id
// @desc    Update project
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const {
    title,
    description,
    status,
    repository_link,
    report_link,
    frontendTechnologies,
    backendTechnologies,
    database,
    presentation_link,
    groupName,
    company,
    company_email,
  } = req.body;
  // Build project object
  const projectFields = {};
  if (title) projectFields.title = title;
  if (description) projectFields.description = description;
  // if (faculty_id) projectFields.faculty_id = faculty_id;
  if (status) projectFields.status = status;
  // if (capacity) projectFields.capacity = capacity;
  if (repository_link) projectFields.repository_link = repository_link;
  if (report_link) projectFields.report_link = report_link;
  if (frontendTechnologies)
    projectFields.frontendTechnologies = frontendTechnologies;
  if (backendTechnologies)
    projectFields.backendTechnologies = backendTechnologies;
  if (database) projectFields.database = database;
  if (presentation_link) projectFields.presentation_link = presentation_link;
  if (groupName) projectFields.groupName = groupName;
  if (company) projectFields.company = company;
  if (company_email) projectFields.company_email = company_email;

  try {
    if (req.user.role !== "student") {
      return res.status(401).json({ msg: "Not authorized 4" });
    }
    console.log(req.user.project_id);
    if (req.user.project_id.toString() !== req.params.id) {
      return res.status(401).json({ msg: "Not authorized 5" });
    }
    if (req.user.isLeader === false) {
      return res.status(401).json({ msg: "Not authorized 6" });
    }

    let project = await Project.findById(req.params.id);
    if (project) {
      // Update
      project = await Project.findByIdAndUpdate(
        req.params.id,
        { $set: projectFields },
        { new: true }
      );
      return res.status(200).json(project);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error updating project --> " + err.message);
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete project
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(401).json({ msg: "Not authorized 7" });
    }
    if (req.user.project_id.toString() !== req.params.id) {
      return res.status(401).json({ msg: "Not authorized 8" });
    }
    if (req.user.isLeader === false) {
      return res.status(401).json({ msg: "Not authorized 9" });
    }
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found 199 " });
    }
    //can only delete project if project is not approved
    if (project.isApproved === true) {
      return res.status(401).json({ msg: "Project is already approved" });
    }
    // Remove project from all students
    for (let i = 0; i < project.students.length; i++) {
      const student = await Student.findById(project.students[i]);
      student.project_id = null;
      student.isLeader = false;
      await student.save();
    }

    // Remove project from faculty
    if (project.faculty) {
      const faculty = await Faculty.findById(project.faculty);
      //firstly find thee project in faculty.projects array if it exists then remove it and decrement projectCount else do nothing
      const index = faculty.projects.indexOf(project._id);
      if (index > -1) {
        faculty.projects.splice(index, 1);
        faculty.projectCount -= 1;
      }
      await faculty.save();
    }

    await project.deleteOne({ _id: req.params.id });
    res.status(200).json({ msg: "Project removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found 228" });
    }
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   POST api/projects/join/
// @desc    Join project
// @access  Private
router.post("/join", auth, async (req, res) => {
  const { invite_code } = req.body;
  try {
    if (req.user.role !== "student" && req.user.role !== "faculty") {
      return res.status(401).json({ msg: "Not authorized 10" });
    }
    if (req.user.isLeader === true) {
      return res.status(401).json({ msg: "You are already a leader" });
    }
    if (req.user.project_id) {
      return res.status(401).json({ msg: "You already have a project" });
    }
    const project = await Project.findOne({ invite_code: invite_code });
    if (!project) {
      return res.status(404).json({ msg: "Invite code is invalid" });
    }
    // Add project to student
    const student = await Student.findById(req.user._id);
    student.project_id = project._id;
    await student.save();
    // Add student to project
    project.students.push(req.user._id);
    //change invite code
    project.invite_code = generateInviteCode();
    // if project has reached max number of students, set invite code to null
    if (project.students.length === project.capacity) {
      project.invite_code = null;
    }
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   GET api/projects/leave/
// @desc    Leave project
// @access  Private
router.get("/leave", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(401).json({ msg: "Not authorized 11" });
    }
    if (req.user.isLeader === true) {
      return res.status(401).json({ msg: "You are a leader" });
    }
    if (!req.user.project_id) {
      return res.status(401).json({ msg: "You are not in a project" });
    }
    const project = await Project.findById(req.user.project_id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found 289" });
    }
    // Remove project from student
    const student = await Student.findById(req.user._id);
    student.project_id = null;
    await student.save();
    // Remove student from project
    project.students = project.students.filter(
      (student) => student._id !== req.user._id
    );
    //change invite code
    project.invite_code = generateInviteCode();
    // if project has reached max number of students, set invite code to null
    if (project.students.length === project.capacity) {
      project.invite_code = null;
    }
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found 310" });
    }
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   DELETE api/projects/remove/:id
// @desc    Remove student from project
// @access  Private
router.delete("/remove/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "faculty" && req.user.role !== "student") {
      return res.status(401).json({ msg: "Not authorized 12" });
    }
    if (req.user.isLeader === false) {
      return res.status(401).json({ msg: "You are not a leader" });
    }
    if (req.user._id === req.params.id) {
      return res.status(401).json({
        msg: "You cannot remove yourself as you are the leader for this project",
      });
    }
    const project = await Project.findById(req.user.project_id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found 329" });
    }
    // Remove project from student
    const student = await Student.findById(req.params.id);
    student.project_id = null;
    await student.save();
    // Remove student from project
    //find the index of student in the student array
    const index = project.students.indexOf(req.params.id);
    if (index > -1) {
      project.students.splice(index, 1);
    }
    //change invite code
    project.invite_code = generateInviteCode();
    // if project has reached max number of students, set invite code to null
    if (project.students.length === project.capacity) {
      project.invite_code = null;
    }
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found 350" });
    }
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   POST api/projects/approve/:id
// @desc    Approve project
// @access  Private
router.post("/approve/:id", auth, async (req, res) => {
  try {
    const { comments } = req.body;
    if (req.user.role !== "faculty") {
      return res.status(401).json({ msg: "Not authorized from role if" });
    }
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found 367" });
    }
    //can only approve project if project is not approved
    if (project.isApproved === true) {
      return res.status(401).json({ msg: "Project is already approved" });
    }
    //can only approve project if project has user logged in as faculty
    const facultyId = project.faculty.toString();
    const loggedUser = req.user._id.toString();
    if (facultyId !== loggedUser) {
      return res.status(401).json({ msg: "Not authorized from tostring if ?" });
    }
    // return res.status(401).json({ msg: "Not authorized from tostring if" });
    // }
    //can only approve project if project has a title
    if (!project.title) {
      return res.status(401).json({ msg: "Project has no title" });
    }
    //can only approve project if project has a description
    if (!project.description) {
      return res.status(401).json({ msg: "Project has no description" });
    }
    const faculty = await Faculty.findById(project.faculty);

    // Add project to faculty
    faculty.projects.push(project._id);
    faculty.projectCount += 1;
    await faculty.save();
    // Approve project
    project.isApproved = true;
    // if comments are provided, add them to project as comments array
    if (comments) {
      // push comments to project
      project.comments.push({
        text: comments,
        name: req.user.name,
        user: req.user._id,
      });
    }

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found 412" });
    }
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   POST api/projects/reject/:id
// @desc    Reject project
// @access  Private
router.post("/reject/:id", auth, async (req, res) => {
  try {
    const { comments } = req.body;
    // if no comments are provided, return error
    if (!comments) {
      return res.status(400).json({ msg: "Comments are required" });
    }
    if (req.user.role !== "faculty") {
      return res.status(401).json({ msg: "Not authorized 13" });
    }
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found 433" });
    }
    //can only reject project if project is not approved
    if (project.isApproved === true) {
      return res.status(401).json({ msg: "Project is already approved" });
    }
    //can only reject project if project has user logged in as faculty
    const facultyId = project.faculty.toString();
    const loggedUser = req.user._id.toString();
    if (facultyId !== loggedUser) {
      return res.status(401).json({ msg: "Not authorized 14" });
    }
    //can only reject project if project has a title
    if (!project.title) {
      return res.status(401).json({ msg: "Project has no title" });
    }
    //can only reject project if project has a description
    if (!project.description) {
      return res.status(401).json({ msg: "Project has no description" });
    }
    project.status = "rejected";
    // Reject project
    project.isApproved = false;
    //add comment to project with faculty's name
    project.comments.push({
      text: comments,
      name: req.user.name,
      user: req.user._id,
    });
    await project.save();
    //remove project from faculty
    const faculty = await Faculty.findById(project.faculty);
    faculty.projects = faculty.projects.filter(
      (project) => project._id !== req.params.id
    );
    faculty.projectCount -= 1;
    await faculty.save();
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found 467" });
    }
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   POST api/projects/comment/:id
// @desc    Comment on a project
// @access  Private
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ msg: "Text is required" });
    }
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found 484" });
    }
    //add comment to project with user's name
    project.comments.push({
      text,
      name: req.user.name,
      user: req.user._id,
      email: req.user.email,
    });
    await project.save();
    project = await getProjectLeaderFacultyStudents(project);
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found 509" });
    }
    res.status(500).send("Server Error --> " + err.message);
  }
});

async function getProjectLeaderFacultyStudents(project) {
  project = project.toObject();
  let leader = await Student.findById(project.leader);
  let faculty = await Faculty.findById(project.faculty);
  let students = [];
  for (let i = 0; i < project.students.length; i++) {
    let student = await Student.findById(project.students[i]);
    students.push(student);
  }
  project.leader = leader;
  project.faculty = faculty;
  project.students = students;
  return project;
}

// @route   DELETE api/projects/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found 522" });
    }
    // Pull out comment
    const comment = project.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    // Check user
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "User not authorized 15" });
    }
    // Get remove index
    const removeIndex = project.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user._id);
    project.comments.splice(removeIndex, 1);
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found 546" });
    }
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   GET api/projects/:id/comments
// @desc    Get all comments for a project
// @access  Private
router.get("/:id/comments", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found 559" });
    }
    res.status(200).json(project.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found 565" });
    }
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   GET api/projects/all/projects
// @desc    Get all projects
// @access  Private
router.get("/all/projects", auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    //get leader name, student name and faculty name
    let data = {};
    for (let i = 0; i < projects.length; i++) {
      const leader = await Student.findById(projects[i].leader);
      console.log(leader);
      for (let j = 0; j < projects[i].students.length; j++) {
        const student = await Student.findById(projects[i].students[j]);
        let studentdata = {
          id: student._id,
          name: student.name,
          email: student.email,
        };
        data[projects[i]._id] = {
          project: projects[i],
          leader: leader.name,
          student: studentdata,
        };
      }
    }
    res.status(200).json(data);
    // res.status(200).json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   GET api/projects/setProjectStatus
// @desc    Set project status
// @access  Private
router.post("/set/ProjectStatus", auth, async (req, res) => {
  try {
    const { status } = req.body;
    // get project id from user session
    const project = await Project.findById(req.user.project_id.toString());
    if (!project) {
      return res.status(404).json({ msg: "Project not found 670" });
    }
    project.status = status;
    await project.save();
    res.status(200).json({ msg: "Project status updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   POST api/projects/submit/submission
// @desc    Submit project report, presentation and repository link
// @access  Private
router.post("/submit/submission", auth, async (req, res) => {
  try {
    const { report, presentation, repository } = req.body;
    // get project id from user session
    const project = await Project.findById(req.user.project_id.toString());
    if (!project) {
      return res.status(404).json({ msg: "Project not found 712" });
    }
    // check if report link is there in body
    if (report) {
      project.report = report;
    }
    // check if presentation link is there in body
    if (presentation) {
      project.presentation = presentation;
    }
    // check if repository link is there in body
    if (repository) {
      project.repository = repository;
    }
    await project.save();
    res.status(200).json({ msg: "Project submission updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   PUT api/projects/submit/submission
// @desc    Update project report, presentation and repository link
// @access  Private
router.put("/submit/submission", auth, async (req, res) => {
  try {
    const { report, presentation, repository } = req.body;
    // get project id from user session
    let project = await Project.findById(req.user.project_id.toString());
    if (!project) {
      return res.status(404).json({ msg: "Project not found 743" });
    }
    // check if report link is there in body
    if (report) {
      project.report_link = report;
    }
    // check if presentation link is there in body
    if (presentation) {
      project.presentation_link = presentation;
    }
    // check if repository link is there in body
    if (repository) {
      project.repository_link = repository;
    }
    // update project
    if(report){
      project = await Project.findByIdAndUpdate(
        req.user.project_id.toString(),
        { $set: { report_link: report } },
        { new: true }
      );
    }
    if(presentation){
      project = await Project.findByIdAndUpdate(
        req.user.project_id.toString(),
        { $set: { presentation_link: presentation } },
        { new: true }
      );
    }
    if(repository){
      project = await Project.findByIdAndUpdate(
        req.user.project_id.toString(),
        { $set: { repository_link: repository } },
        { new: true }
      );
    }
    await project.save();
    res.status(200).json({ msg: "Project submission updated", project });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error --> " + err.message);
  }
});

// @route   GET api/projects/submit/submission
// @desc    Get project report, presentation and repository link
// @access  Private
router.get("/submit/submission", auth, async (req, res) => {
  try {
    // get project id from user session
    const project = await Project.findById(
      req.user.project_id.toString()
    ).select("_id presentation_link report_link repository_link");

    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error --> " + err.message);
  }
});

module.exports = router;
