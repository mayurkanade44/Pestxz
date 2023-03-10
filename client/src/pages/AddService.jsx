import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputRow } from "../components";
import { addService, handleAdmin } from "../redux/adminSlice";
import { capitalLetter } from "../utils/data";

const AddService = () => {
  const { shipToName, shipToAddress, adminLoading } = useSelector(
    (store) => store.admin
  );
  const [option, setOption] = useState([]);
  const dispatch = useDispatch();

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
