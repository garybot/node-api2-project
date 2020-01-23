const express = require('express');
const db = require('./data/db.js');

const router = express.Router();

//-----------------------------------------------------------------------------
// Creates a post using the information sent inside the request body
//-----------------------------------------------------------------------------

router.post('/', async (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  } else {
    try {
      const dbRes = await db.insert(req.body);
      const post = await db.findById(dbRes.id);
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ error: "There was an error while saving the post to the database" });
    }
  }
});

//-----------------------------------------------------------------------------
// Creates a comment for the post with the specified id using information sent 
// inside of the request body.
//-----------------------------------------------------------------------------

router.post('/:id/comments', async (req, res) => {
  const commentObj = { ...req.body, "post_id": req.params.id }
  const post = await db.findById(req.params.id);
  if (!post.length) {
    res.status(404).json({ message: "The post with the specified ID does not exist." });
  } else if (!req.body.text) {
    res.status(400).json({ errorMessage: "Please provide text for the comment." });
  } else {
    try {
      const dbRes = await db.insertComment(commentObj);
      const comment = await db.findCommentById(dbRes.id);
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: "There was an error while saving the comment to the database" });
    }
  }
});

//-----------------------------------------------------------------------------
// Returns an array of all the post objects contained in the database.
//-----------------------------------------------------------------------------

router.get("/", async (req,res) => {
  try {
    const posts = await db.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "The posts information could not be retrieved." });
  }
});

//-----------------------------------------------------------------------------
// Returns the post object with the specified id.
//-----------------------------------------------------------------------------

router.get('/:id', async (req, res) => {
  try {
    const post = await db.findById(req.params.id);
    if (post.length) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  } catch (err) {
    res.status(500).json({ error: "The post information could not be retrieved." });
  }
});

//-----------------------------------------------------------------------------
// Returns an array of all the comment objects associated with the post with 
// the specified id.
//-----------------------------------------------------------------------------

router.get('/:id/comments', async (req, res) => {
  const post = await db.findById(req.params.id);
  if (!post.length) {
    res.status(404).json({ message: "The post with the specified ID does not exist." });
  } else {
    try {
      const comments = await db.findPostComments(req.params.id);
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: "The comments information could not be retrieved." });
    }
  }
});

//-----------------------------------------------------------------------------
// Removes the post with the specified id and returns the deleted post object. 
// You may need to make additional calls to the database in order to satisfy 
// this requirement.
//-----------------------------------------------------------------------------

router.delete('/:id', async (req, res) => {
  const post = await db.findById(req.params.id);
  if (!post.length) {
    res.status(404).json({ message: "The post with the specified ID does not exist." });
  } else {
    try {
      const success = await db.remove(req.params.id);
      if (success) {
        res.status(200).json(post);
      } // else?
    } catch (err) {
      res.status(500).json({ error: "The post could not be removed" });
    }
  }
});

//-----------------------------------------------------------------------------
// Updates the post with the specified id using data from the request body. 
// Returns the modified document, NOT the original.
//-----------------------------------------------------------------------------

router.put('/:id', async (req, res) => {
  const post = await db.findById(req.params.id);
  if (!post.length) {
    res.status(404).json({ message: "The post with the specified ID does not exist." });
  } else if (!req.body.title || !req.body.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  } else {
    try {
      const success = await db.update(req.params.id, req.body);
      if (success) {
        const updated = await db.findById(req.params.id);
        res.status(200).json(updated);
      } // else?
    } catch (err) {
      res.status(500).json({ error: "The post information could not be modified." });
    }
  }
})

module.exports = router;