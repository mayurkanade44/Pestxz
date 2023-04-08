import Report from "../models/Report.js";
import Location from "../models/Location.js";
import mongoose from "mongoose";
import exceljs from "exceljs";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import PDFDocument from "pdfkit";

export const addRecord = async (req, res) => {
  const { action } = req.body;
  const { id } = req.params;
  try {
    if (!action || action.length < 1)
      return res.status(400).json({ msg: "Please select appropriate options" });

    const locationExists = await Location.findById(id);
    if (!locationExists)
      return res
        .status(404)
        .json({ msg: "Given location not found, contact admin" });

    const images = [];
    if (req.files) {
      let temp = [],
        uploaded = req.body.uploaded;
      if (req.files.image.length > 1) temp = req.files.image;
      else temp.push(req.files.image);
      for (let i = 0; i < uploaded.length; i++) {
        if (uploaded[i] === "false") images.push("false");
        else images.push(temp.shift());
      }
    }

    const reportData = [];
    for (let i = 1; i < req.body.id.length; i++) {
      let temp = {};
      if (req.body.action[i] === "false") continue;
      temp.id = req.body.id[i];
      temp.serviceName = req.body.serviceName[i];
      temp.action = req.body.action[i];
      temp.value = req.body.value[i];
      temp.comment = req.body.comment[i];
      if (req.body.uploaded[i] === "true") {
        const result = await cloudinary.uploader.upload(
          images[i].tempFilePath,
          {
            use_filename: true,
            folder: "reports",
            quality: 30,
          }
        );
        temp.image = result.secure_url;
        fs.unlinkSync(images[i].tempFilePath);
      }
      reportData.push(temp);
    }
    req.body.shipTo = locationExists.shipTo;
    req.body.location = id;
    req.body.user = req.user.userId;
    req.body.reportData = reportData;

    await Report.create(req.body);
    return res.status(201).json({ msg: "Record has been saved" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const generateServiceReport = async (req, res) => {
  const { shipTo, fromDate, toDate, serviceId, location, floor, user } =
    req.query;
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
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
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

    if (user && user !== "All")
      query.push({ $match: { "user._id": new mongoose.Types.ObjectId(user) } });
    if (serviceId && serviceId !== "All")
      query.push({ $match: { "reportData.id": serviceId } });
    // if (floor && location) {
    //   query.push({
    //     $match: {
    //       "location.floor": floor,
    //       "location.location": location,
    //     },
    //   });
    // } else if (floor) {
    //   query.push({
    //     $match: {
    //       "location.floor": floor,
    //     },
    //   });
    // }
    if (location && location !== "All") {
      console.log(location);
      query.push({
        $match: {
          "location._id": new mongoose.Types.ObjectId(location),
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
        user: "$user",
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
      { header: "Service/Product", key: "service" },
      { header: "Activity", key: "activity" },
      { header: "Value", key: "value" },
      { header: "Operator Comment", key: "comment" },
      { header: "Image Link", key: "image" },
      { header: "Serviced By", key: "user" },
    ];

    data.map((item) => {
      worksheet.addRow({
        shipTo: item.shipTo,
        time: new Date(item.createdAt).toLocaleString(undefined, {
          timeZone: "Asia/Kolkata",
        }),
        floor: item.floor,
        location: item.location,
        service: item.services.serviceName,
        activity: item.services.action,
        value: item.services.value,
        comment: item.services.comment,
        image: item.services.image,
        user: item.user.name,
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

export const weeklyReport = async (req, res) => {
  try {
    const data = await Report.aggregate([
      // {
      //   $lookup: {
      //     from: "shiptos",
      //     localField: "shipTo",
      //     foreignField: "_id",
      //     as: "shipTo",
      //   },
      // },
      // {
      //   $unwind: "$shipTo",
      // },
      {
        $match: {
          shipTo: new mongoose.Types.ObjectId("642d62c33fa94fb3a9b46e3c"),
        },
      },
      { $unwind: "$reportData" },
      { $match: { "reportData.id": "64311499688d8d09b01ee077" } },
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
    ]);

    const locations = [
      {
        name: "Location A",
        users: [
          {
            companyName: "Company 1",
            name: "John Doe",
            department: "Marketing",
            id: 123,
          },
          {
            companyName: "Company 2",
            name: "Jane Smith",
            department: "Sales",
            id: 456,
          },
        ],
      },
      {
        name: "Location B",
        users: [
          {
            companyName: "Company 3",
            name: "Bob Johnson",
            department: "Engineering",
            id: 789,
          },
          {
            companyName: "Company 4",
            name: "Alice Brown",
            department: "Finance",
            id: 101,
          },
        ],
      },
    ];

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF document to a writable stream
    const stream = fs.createWriteStream("users.pdf");
    doc.pipe(stream);

    // Loop through each location
    locations.forEach((location) => {
      // Add location name as a title
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(location.name, { align: "center" })
        .moveDown();

      // Calculate column widths
      const tableWidth = 450;
      const columnWidth = tableWidth / 4;

      // Create a table header
      doc.font("Helvetica-Bold").fontSize(12);
      doc.text("Company Name", 50, doc.y);
      doc.text("User Name", 50 + columnWidth, doc.y);
      doc.text("User Department", 50 + columnWidth, doc.y);
      doc.text("User ID", 50 + columnWidth, doc.y);
      doc.moveDown();

      // Loop through each user in the location
      location.users.forEach((user) => {
        // Add user information to the table
        doc.font("Helvetica").fontSize(10);
        doc.text(user.companyName, 50, doc.y);
        doc.text(user.name, columnWidth, doc.y);
        doc.text(user.department, columnWidth, doc.y);
        doc.text(user.id.toString(), columnWidth, doc.y);
        doc.moveDown();
      });

      // Add a border around the table
      const tableHeight = (location.users.length + 1) * 15;
      doc.rect(50, doc.y - tableHeight, tableWidth, tableHeight + 10).stroke();
      doc.moveDown();
    });

    // Finalize the PDF and close the stream
    doc.end();
    stream.on("finish", () => {
      console.log("PDF created successfully!");
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
