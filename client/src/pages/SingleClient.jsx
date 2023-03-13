import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AddLocation } from "../components";
import { singleClient } from "../redux/adminSlice";
import { saveAs } from "file-saver";

const SingleClient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { singleClientDetails, singleClientLocations, adminLoading } =
    useSelector((store) => store.admin);

  useEffect(() => {
    if (!open) dispatch(singleClient(id));

    // eslint-disable-next-line
  }, [open]);

  const downloadImage = (url, name) => {
    saveAs(url, `${name}.jpg`); // Put your image url here.
  };

  return (
    <div className="row">
      <div className="col-4">
        <h4>Client Name: {singleClientDetails.shipToName}</h4>
      </div>
      <div className="col-8">
        <h4>Client Address: {singleClientDetails.shipToAddress}</h4>
      </div>
      <div className="col-4">
        <button className="btn mb-3" onClick={() => setOpen(!open)}>
          {open ? "Back" : "Add New Location"}
        </button>
      </div>
      {open ? (
        <AddLocation id={id} />
      ) : (
        singleClientLocations && (
          <div className="col-12">
            <table className="table table-striped table-bordered border-primary">
              <thead>
                <tr>
                  <th style={{ width: 150 }} className="text-center">
                    Floor
                  </th>
                  <th className="text-center">Location</th>
                  <th style={{ width: 110 }} className="text-center">
                    QR Code
                  </th>
                  <th style={{ width: 170 }} className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {singleClientLocations.map((item) => (
                  <tr key={item._id}>
                    <td>{item.floor}</td>
                    <td>{item.location}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => downloadImage(item.qr, item.location)}
                      >
                        Download
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-sm me-2">Edit</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};
export default SingleClient;
