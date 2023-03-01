const express = require("express");

const Contacts = require("../Models/contact_model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // DB operation
    const contacts = await Contacts.find();
    res.json(contacts);
    //send response
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    //validation
    if (req.params.contactId == null)
      return res.status(400).json({ message: "invalid contact id" });
    // DB operation
    const contacts = await Contacts.findById(req.params.contactId);
    res.json(contacts);
    //send response
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/", async (req, res) => {
  try {
    //validation
    if (
      req.body == null ||
      req.body.name == null ||
      req.body.phoneNumber == null
    )
      return res.status(400).json({ message: "invalid data" });

    const phoneAlreadyExist = await Contacts.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (phoneAlreadyExist)
      return res.status(200).json({ message: "contact already exist" });

    // convert to contacts object
    const contacts = new Contacts({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
    });

    // DB operation
    const savedContact = await contacts.save();

    //send response
    res.json(savedContact);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.patch("/:contactId", async (req, res) => {
  try {
    //validation
    if (
      req.body == null ||
      req.body.name == null ||
      req.body.phoneNumber == null
    )
      return res.status(400).json({ message: "invalid data" });
    if (req.params.contactId == null)
      return res.status(400).json({ message: "invalid contact id" });

    const contactExist = await Contacts.findById(req.params.contactId);
    if (!contactExist)
      return res.status(200).json({ message: "contact does not exsist" });

    // DB operation
    const updatedContact = await Contacts.updateOne(
      { _id: req.params.contactId },
      { $set: { name: req.body.name, phoneNumber: req.body.phoneNumber } }
    );

    //send response
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.delete("/:contactId", async (req, res) => {
  try {
    //validation
    if (req.params.contactId == null)
      return res.status(400).json({ message: "invalid contact id" });
    // DB operation
    const deleteResult = await Contacts.deleteOne(req.params.contactId);
    res.json(deleteResult);
    //send response
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.delete("/", async (req, res) => {
  try {
    //validation
    if (req.params.contactId == null)
      return res.status(400).json({ message: "invalid contact id" });
    // DB operation
    const deleteResult = await Contacts.deleteMany({});
    res.json(deleteResult);
    //send response
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
