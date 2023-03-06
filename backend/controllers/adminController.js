import Admin from "../models/Admin.js";

export const addService = async (req, res) => {
  const { serviceName, serviceOption, company } = req.body;
  try {
    if (!serviceName || !serviceOption)
      return res.status(400).json({ msg: "Please provide all values" });

    const alreadyExists = await Admin.findOne({ serviceName, company });
    if (alreadyExists)
      return res
        .status(400)
        .json({ msg: `${serviceName} service already exists` });

    const service = await Admin.create(req.body);
    return res
      .status(201)
      .json({ msg: `${service.serviceName} service has been added` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getService = async (req, res) => {
  const { company } = req.body;
  try {
    const services = await Admin.find({ company });
    return res.status(200).json({ services });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
