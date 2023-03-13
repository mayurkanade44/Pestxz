import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputSelect } from "../components";
import {
  createReport,
  getCompanyServices,
  handleAdmin,
  singleClient,
} from "../redux/adminSlice";

const Report = () => {
  const [location, setLocation] = useState([]);
  const dispatch = useDispatch();
  const {
    allClients,
    companyServices,
    shipToName,
    shipToAddress,
    shipToEmail,
    singleClientLocations,
  } = useSelector((store) => store.admin);

  useEffect(() => {
    dispatch(getCompanyServices());

    if (shipToName && shipToName !== "Select") {
      dispatch(singleClient(shipToName));
    }
  }, [shipToName]);

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

    dispatch(handleAdmin({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createReport({ shipToName, shipToAddress, shipToEmail }));
  };

  return (
    <div className="add-client">
      <form className="form">
        <h4 className="text-center">Report Generation Form</h4>
        <div className="form-center">
          {/* search position */}

          {/* search by status */}
          <InputSelect
            labelText="Client Name"
            name="shipToName"
            value={shipToName}
            handleChange={handleSearch}
            list={["Select", ...allClients]}
          />

          {/* search by type*/}
          <InputSelect
            labelText="Floor / Location"
            name="shipToAddress"
            value={shipToAddress}
            handleChange={handleSearch}
            list={["all", ...location]}
          />

          <InputSelect
            labelText="Service"
            name="shipToEmail"
            value={shipToEmail}
            handleChange={handleSearch}
            list={["all", ...companyServices]}
          />

          <button className="btn btn-block mt-3" onClick={handleSubmit}>
            Generate Report
          </button>
        </div>
      </form>
    </div>
  );
};
export default Report;
