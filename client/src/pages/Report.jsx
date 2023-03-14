import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { InputRow, InputSelect } from "../components";
import {
  createReport,
  getCompanyServices,
  handleAdmin,
  singleClient,
} from "../redux/adminSlice";

const Report = () => {
  const [location, setLocation] = useState([]);
  const [reportField, setReportField] = useState({
    client: "",
    subLocation: "",
    service: "",
    fromDate: "",
    toDate: "",
    user: "",
  });
  const { client, subLocation, service, fromDate, toDate, user } = reportField;

  const dispatch = useDispatch();
  const {
    adminLoading,
    allClients,
    companyServices,
    singleClientLocations,
    id,
  } = useSelector((store) => store.admin);

  useEffect(() => {
    dispatch(getCompanyServices());

    if (client && client !== "Select") {
      dispatch(singleClient(client));
    }
  }, [client]);

  useEffect(() => {
    singleClientLocations.map((item) =>
      setLocation((location) => [
        ...location,
        `${item.floor} / ${item.location}`,
      ])
    );
  }, [singleClientLocations]);

  const handleSearch = (e) => {
    const { name, value } = e.target;
    setReportField({ ...reportField, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!client || !fromDate || !toDate)
      return toast.error("Please select all required fields");
    dispatch(createReport({ client, subLocation, service, fromDate, toDate }));
  };

  return (
    <div className="add-client">
      <form className="form">
        <h4 className="text-center">Report Generation Form</h4>
        <div className="form-center">
          {/* search position */}

          {/* search by status */}
          <InputSelect
            labelText="Client Name*"
            name="client"
            value={client}
            handleChange={handleSearch}
            list={["Select", ...allClients]}
          />
          <InputRow
            type="date"
            labelText="From Date*"
            name="fromDate"
            value={fromDate}
            handleChange={handleSearch}
          />
          <InputRow
            type="date"
            labelText="To Date*"
            name="toDate"
            value={toDate}
            handleChange={handleSearch}
          />
          {/* search by type*/}
          <InputSelect
            labelText="Floor / Location"
            name="subLocation"
            value={subLocation}
            handleChange={handleSearch}
            list={["All", ...location]}
          />
          <InputSelect
            labelText="Service"
            name="service"
            value={service}
            handleChange={handleSearch}
            list={["All", ...companyServices]}
          />
          <InputSelect
            labelText="User"
            name="user"
            value={user}
            handleChange={handleSearch}
            list={["All", ...companyServices]}
          />
          <button className="btn btn-primary mt-3" onClick={handleSubmit}>
            {adminLoading ? "Generating..." : "Generate Report"}
          </button>
          {id && (
            <button
              className="btn btn-success mt-3"
              disabled={id ? false : true}
            >
              <a href={id} style={{ textDecoration: "none", color: "white" }}>
                Download Report
              </a>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
export default Report;
