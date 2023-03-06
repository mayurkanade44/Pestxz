import ShipTo from "../models/ShipTo.js";

export const addShipTo = async (req, res) => {
  const { shipToName, shipToAddress } = req.body;
  try {
    if (!shipToName || !shipToAddress)
      return res.status(400).json({ msg: "Please provide all values" });

    const shipTo = await ShipTo.create(req.body);
    return res
      .status(201)
      .json({ msg: `${shipTo.shipToName} has been added` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
