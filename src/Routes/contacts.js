const express = require("express");

const Contacts = require("../Models/contact_model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // DB operation
    const userId = req.user._id;
    const contacts = await Contacts.find({ userId: userId });

    if (!contacts)
      return res.status(500).json({ message: "sonething went wrong" });

    //send response
    res.json(contacts);
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

    const userId = req.user._id;
    const phoneAlreadyExist = await Contacts.findOne({
      userId: userId,
      phoneNumber: req.body.phoneNumber,
    });
    if (phoneAlreadyExist)
      return res.status(400).json({ message: "contact already exist" });

    // convert to contacts object
    const contact = new Contacts({
      userId: req.user._id,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
    });

    // DB operation
    const savedContact = await contact.save();
    if (!savedContact)
      return res.status(500).json({ message: "sonething went wrong" });

    const contacts = await Contacts.find({ userId: userId });

    //send response
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
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
    if (!updatedContact)
      return res.status(500).json({ message: "something went wrong" });
    const userId = req.user._id;
    const contacts = await Contacts.find({ userId: userId });

    //send response
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.delete("/:contactId", async (req, res) => {
  try {
    //validation
    if (req.params.contactId == null)
      return res.status(400).json({ message: "invalid contact id" });
    // DB operation
    const deleteResult = await Contacts.deleteOne({
      _id: req.params.contactId,
    });

    if (!deleteResult)
      return res.status(500).json({ message: "something went wrong" });
    const userId = req.user._id;
    const contacts = await Contacts.find({ userId: userId });

    //send response
    res.json(contacts);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.delete("/", async (req, res) => {
  try {
    // DB operation
    const deleteResult = await Contacts.deleteMany({ userId: userId });
    res.json(deleteResult);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
