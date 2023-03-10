import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputRow } from "../components";
import {
  addService,
  getCompanyServices,
  handleAdmin,
} from "../redux/adminSlice";
import { capitalLetter } from "../utils/data";

const AddService = () => {
  const { shipToName, shipToAddress, adminLoading, companyServices } =
    useSelector((store) => store.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCompanyServices());

    // eslint-disable-next-line
  }, []);

  const handleServiceInput = (e) => {
    let name = e.target.name,
      value = e.target.value;
    dispatch(handleAdmin({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serviceName = capitalLetter(shipToName),
      serviceOption = capitalLetter(shipToAddress.split(","));

    dispatch(addService({ serviceName, serviceOption }));
  };

  return (
    <div className="add-client">
      <table className="table table-striped table-bordered border-primary">
        <thead>
          <tr>
            <th className="text-center">
              Service Name
            </th>
            <th className="text-center">
              Service Options
            </th>
            <th style={{ width: 150 }} className="text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {companyServices.map((item) => (
            <tr key={item._id}>
              <td>{item.serviceName}</td>
              <td>{item.serviceOption.join(", ")}</td>
              <td>
                <button className="btn btn-sm me-2">Edit</button>
                <button className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className="form" onSubmit={handleSubmit}>
        <h3 className="text-center">Add Service</h3>
        <div className="form-center">
          <InputRow
            type="text"
            labelText="Service Name"
            name="shipToName"
            value={shipToName}
            handleChange={handleServiceInput}
          />
          <InputRow
            type="text"
            labelText="Service Options"
            placeholder="options must be separated by comma"
            name="shipToAddress"
            value={shipToAddress}
            handleChange={handleServiceInput}
          />
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={adminLoading}
            >
              Add Service
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddService;
