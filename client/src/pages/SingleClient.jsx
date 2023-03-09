import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { singleClient } from "../redux/adminSlice";

const SingleClient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleClientDetails, singleClientLocations, adminLoading } =
    useSelector((store) => store.admin);
  useEffect(() => {
    dispatch(singleClient(id));

    // eslint-disable-next-line
  }, []);

  return (
    <div className="row">
      <div className="col-4">
        <h4>Client Name: {singleClientDetails.shipToName}</h4>
      </div>
      <div className="col-4">
        <h4>Client Address: {singleClientDetails.shipToAddress}</h4>
      </div>
      {singleClientLocations && (
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
                    <button className="btn btn-sm btn-success">Download</button>
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
      )}
    </div>
  );
};
export default SingleClient;
