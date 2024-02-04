const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");

// Route3:add a new Note to the User: Put "/api/notes/:id". Login requires
router.put("/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    // FInd node note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server error");
  }
});

// Route3:Delete a note by User: Delete "/api/notes/:id". Login requires
router.delete("/:id", fetchUser, async (req, res) => {
  try {
    // FInd node note to be Delete and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    // check user id
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server error");
  }
});

// Route1:Get all Notes of the User: GET "/api/notes/". Login requires
router.get("/", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server error");
  }
});

// Route2:add a new Note to the User: GET "/api/notes/". Login requires
router.post(
  "/",
  fetchUser,
  [
    body("title", "enter valid name").isLength({ min: 3 }),
    body("description", "enter valid email").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return Bad requests and th errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

module.exports = router;
