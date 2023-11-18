import ShipTo from "../models/ShipTo.js";
import Report from "../models/Report.js";
import Location from "../models/Location.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const addShipTo = async (req, res) => {
  const { shipToName, shipToAddress } = req.body;
  try {
    if (!shipToName || !shipToAddress)
      return res.status(400).json({ msg: "Please provide all values" });

    const alreadyShipTo = await ShipTo.findOne({
      shipToName: { $regex: shipToName, $options: "i" },
      company: req.user.company,
    });
    if (alreadyShipTo)
      return res.status(400).json({ msg: `${shipToName} already exists` });

    req.body.company = req.user.company;
    const shipTo = await ShipTo.create(req.body);

    return res
      .status(201)
      .json({ msg: `${shipTo.shipToName} has been added`, id: shipTo._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const updateShipTo = async (req, res) => {
  const { id } = req.params;
  const { shipToName, shipToAddress } = req.body;
  try {
    if (!shipToName || !shipToAddress)
      return res.status(400).json({ msg: "Please provide all values" });

    const client = await ShipTo.findById(id);
    if (!client)
      return res.status(404).json({ msg: "Selected client not found" });

    await ShipTo.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ msg: "Successfully updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const deleteShipTo = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await ShipTo.findById(id);
    if (!client)
      return res.status(404).json({ msg: "Selected client not found" });

    await Report.deleteMany({ shipTo: id });
    await Location.deleteMany({ shipTo: id });
    await client.deleteOne();

    return res.status(200).json({ msg: "Client Successfully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getAllComplaints = async (req, res) => {
  const { client, status } = req.query;
  try {
    let query = {
      company: req.user.company,
    };
    if (client && client !== "Select") query._id = client;

    let complaints = await ShipTo.find(query).select("complaints shipToName");

    const filteredComplaints = [];

    complaints.map((item) =>
      item.complaints.map(
        (comp) =>
          comp.status === status &&
          filteredComplaints.push({ name: item.shipToName, id: item._id, comp })
      )
    );

    return res.json({ complaints: filteredComplaints });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const updateComplaint = async (req, res) => {
  const { id } = req.params;
  const { complaintId } = req.query;
  try {
    const complaint = await ShipTo.findOne({
      _id: id,
    }).select("complaints");

    let image = "";
    if (req.files) {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: "Pestxz",
          quality: 40,
        }
      );
      image = result.secure_url;
      fs.unlinkSync(req.files.image.tempFilePath);
    }

    console.log(image);
    console.log(req.body);

    for (let item of complaint.complaints) {
      if (item._id.toString() === complaintId) {
        item.status = "Close";
        item.update.comment = req.body.comment;
        item.update.image = image;
        item.update.createdAt = new Date();
        break;
      }
    }

    await complaint.save();

    res.status(200).json({ msg: "Complaint updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
