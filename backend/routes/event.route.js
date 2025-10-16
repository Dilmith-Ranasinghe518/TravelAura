// routes/eventRoutes.js
const express = require("express");
const {
  getEvents,
  getEvent,
  getRelatedEvents,
  createEvent,
  updateEvent,
  updateEventStatus,
  updateEventTrending,
  deleteEvent,
  incrementEventView,
  likeEvent,
  unlikeEvent,
  recomputeAllTrending,
} = require("../controllers/event.controller"); // <-- use require

const router = express.Router();

router.get("/", getEvents);
router.get("/:identifier", getEvent);
router.get("/:identifier/related", getRelatedEvents);

router.post("/", createEvent);
router.put("/:id", updateEvent);
router.patch("/:id/status", updateEventStatus);

router.post("/:id/view", incrementEventView);
router.post("/:id/like", likeEvent);
router.post("/:id/unlike", unlikeEvent);

router.patch("/:id/trending", updateEventTrending);
router.patch("/trending/recompute", recomputeAllTrending);

router.delete("/:id", deleteEvent);

module.exports = router;
