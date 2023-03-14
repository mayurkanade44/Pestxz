import Report from "../models/Report.js";
import Location from "../models/Location.js";
import mongoose from "mongoose";
import exceljs from "exceljs";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const addRecord = async (req, res) => {
  const { reportData } = req.body;
  const { id } = req.params;
  try {
    if (!reportData || reportData.length < 1)
      return res.status(400).json({ msg: "Please select appropriate options" });

    const locationExists = await Location.findById(id);
    if (!locationExists)
      return res
        .status(404)
        .json({ msg: "Given location not found, contact admin" });

    req.body.shipTo = locationExists.shipTo;
    req.body.location = id;
    req.body.user = req.user.userId;

    await Report.create(req.body);
    return res.status(201).json({ msg: "Record has been saved" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const generateServiceReport = async (req, res) => {
  const { shipTo, fromDate, toDate, serviceId, location, floor } = req.query;
  try {
    if (!shipTo)
      return res.status(400).json({ msg: "Please select premises." });

    let endDate = new Date(toDate);
    endDate.setDate(endDate.getDate() + 1);

    const query = [
      {
        $lookup: {
          from: "shiptos",
          localField: "shipTo",
          foreignField: "_id",
          as: "shipTo",
        },
      },
      {
        $unwind: "$shipTo",
      },
      {
        $match: {
          "shipTo._id": new mongoose.Types.ObjectId(shipTo),
        },
      },
      { $unwind: "$reportData" },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $unwind: "$location",
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(fromDate),
            $lte: endDate,
          },
        },
      },
    ];

    if (serviceId) query.push({ $match: { "reportData.id": serviceId } });
    if (floor && location) {
      query.push({
        $match: {
          "location.floor": floor,
          "location.location": location,
        },
      });
    } else if (floor) {
      query.push({
        $match: {
          "location.floor": floor,
        },
      });
    } else if (location) {
      query.push({
        $match: {
          "location.location": location,
        },
      });
    }

    query.push({
      $project: {
        _id: 0,
        shipTo: "$shipTo.shipToName",
        floor: "$location.floor",
        location: "$location.location",
        services: "$reportData",
        createdAt: 1,
      },
    });

    // const queryObject = { shipTo: shipTo };
    // let reportData;
    // if (location) queryObject.location = location;
    // if (serviceId) {
    //   queryObject.reportData = { $elemMatch: { id: serviceId } };
    //   reportData = { "reportData.$": 1 };
    // }

    const data = await Report.aggregate(query);

    if (data.length === 0)
      return res
        .status(400)
        .json({ msg: "No data not found on selected fields" });

    const workbook = new exceljs.Workbook();
    let worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = [
      { header: "Premises", key: "shipTo" },
      { header: "Date/Time", key: "time" },
      { header: "Floor", key: "floor" },
      { header: "Location", key: "location" },
      { header: "Service", key: "service" },
      { header: "Activity", key: "activity" },
    ];

    data.map((item) => {
      console.log(item.createdAt.toString());
      worksheet.addRow({
        shipTo: item.shipTo,
        time: item.createdAt.toString(),
        floor: item.floor,
        location: item.location,
        service: item.services.serviceName,
        activity: item.services.action,
      });
    });

    // const newRows = worksheet.addRows(data);
    // console.log(newRows);

    // data.map((item) =>
    //   worksheet.addRow({ name: item.shipTo, floor: item.floor })
    // );

    await workbook.xlsx.writeFile(`./files/${data[0].shipTo}.xlsx`);

    const result = await cloudinary.uploader.upload(
      `files/${data[0].shipTo}.xlsx`,
      {
        resource_type: "raw",
        use_filename: true,
        folder: "service-cards",
      }
    );

    fs.unlinkSync(`./files/${data[0].shipTo}.xlsx`);

    return res
      .status(200)
      .json({ msg: "Report has been generated.", link: result.secure_url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
