import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allComplaints, updateComplaint } from "../redux/reportSlice";
import { ComplaintModal, InputSelect, Loading } from "../components";
import { getCompanyServices } from "../redux/adminSlice";

const Complaints = () => {
  const dispatch = useDispatch();
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("Open");
  const { complaints, reportLoading } = useSelector((store) => store.report);
  const { allClients, adminLoading } = useSelector((store) => store.admin);

  useEffect(() => {
    dispatch(allComplaints({ client, status }));
    dispatch(getCompanyServices());

    // eslint-disable-next-line
  }, [client, status]);

  const update = ({ id, complaintId }) => {
    dispatch(updateComplaint({ id, complaintId }));
  };

  return (
    <div>
      {reportLoading && <Loading />}
      <h4 style={{ margin: 0 }} className="text-center">
        All Complaints
      </h4>
      <div className="d-flex ">
        <div className="w-50 me-3">
          <InputSelect
            labelText="Client Name*"
            name="client"
            value={client}
            handleChange={(e) => setClient(e.target.value)}
            list={["Select", ...allClients]}
          />
        </div>
        <div className="w-50 ">
          <InputSelect
            labelText="Action*"
            name="status"
            value={status}
            handleChange={(e) => setStatus(e.target.value)}
            list={["Open", "Close"]}
          />
        </div>
      </div>
      {complaints?.length < 1 && (
        <h5 className="text-center text-danger">No Complaint Found</h5>
      )}
      {complaints && (
        <div className="col-12 ">
          <table className="table table-striped table-bordered border-primary">
            <thead>
              <tr>
                <th className="text-center">Client</th>
                <th className="text-center">Location</th>
                <th className="text-center">Pest Issue</th>
                <th style={{ width: 135 }} className="text-center">
                  Contact Number
                </th>
                <th style={{ width: 80 }} className="text-center">
                  Image
                </th>
                <th style={{ width: 80 }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints?.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      {item.comp.floor} / {item.comp.location}
                    </td>
                    <td>{item.comp.pest}</td>
                    <td className="text-center">{item.comp.number}</td>
                    <td>
                      <button className="btn btn-sm btn-success">
                        <a
                          style={{ textDecoration: "none", color: "inherit" }}
                          href={item.comp.image}
                        >
                          Download
                        </a>
                      </button>
                    </td>
                    <td className="text-center">
                      <ComplaintModal
                        name={item.comp.status}
                        handleSubmit={update}
                        id={item.id}
                        complaintId={item.comp._id}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Complaints;
