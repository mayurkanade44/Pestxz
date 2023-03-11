import Location from "../models/Location.js";
import ShipTo from "../models/ShipTo.js";

export const addLocation = async (req, res) => {
  const { floor, location, count } = req.body;
  const { id } = req.params;
  try {
    if (!floor || !location)
      return res.status(400).json({ msg: "Please provide all values" });

    const ship = await ShipTo.findById(id);
    if (!ship)
      return res.status(404).json({ msg: "Selected ship to not found" });

    req.body.shipTo = id;

    await Location.create(req.body);
    return res.status(201).json({ msg: "Location has been added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getLocationServices = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id).populate({
      path: "services",
      select: "serviceName serviceOption",
    });
    if (!location)
      return res
        .status(404)
        .json({ msg: "Given location not found, contact admin" });

    return res.status(200).json({ location });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const editLocation = async (req, res) => {
  const { id } = req.params;
  const { services } = req.body;
  try {
    const location = await Location.findById(id);
    if (!location) return res.status(404).json({ msg: "No location found" });

    location.services = services;
    await location.save();

    return res.status(200).json({ msg: "Successfully updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getSingleShipTo = async (req, res) => {
  const { id } = req.params;
  try {
    const clientDetails = await ShipTo.findById(id);
    if (!clientDetails)
      return res.status(404).json({ msg: "Client details not found" });

    const clientLocations = await Location.find({ shipTo: id }).select(
      "floor location"
    ).sort("floor")
    return res.status(200).json({ clientDetails, clientLocations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
