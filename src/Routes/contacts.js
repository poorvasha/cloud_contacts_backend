const express = require("express");

const contactModel = require("../Models/contact_model");

const router = express.Router();

router.get("/", (req, res) => {});

router.get("/:contactId", (req, res) => {});

router.post("/", (req, res) => {});

router.patch("/:contactId", (req, res) => {});

router.delete("/:contactId", (req, res) => {});

router.patch("/", (req, res) => {});


module.exports = router;