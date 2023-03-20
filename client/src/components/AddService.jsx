import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { InputRow } from ".";
import { addService, editService, handleAdmin } from "../redux/adminSlice";
import { capitalLetter } from "../utils/data";

const AddService = ({
  shipToName,
  shipToAddress,
  adminLoading,
  isEditing,
  id,
  toggle,
}) => {
  const dispatch = useDispatch();

  const handleServiceInput = (e) => {
    let name = e.target.name,
      value = e.target.value;
    dispatch(handleAdmin({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shipToName || !shipToAddress) {
      toast.error("Please provide all fields");
      return;
    }

    if (isEditing) {
      dispatch(
        editService({
          serviceId: id,
          service: {
            serviceName: capitalLetter(shipToName),
            serviceOption: capitalLetter(shipToAddress.split(",")),
          },
        })
      );
      return;
    }

    dispatch(
      addService({
        serviceName: capitalLetter(shipToName),
        serviceOption: capitalLetter(shipToAddress.split(",")),
      })
    );
  };

  return (
    <div className="add-client">
      <div className="back">
        <button className="btn btn-dark" onClick={() => toggle(false)}>
          Back
        </button>
        <h3 className="text-center ">
          {isEditing ? "Edit Service" : "Add Service"}
        </h3>
        <span></span>
      </div>
      <form className="form" onSubmit={handleSubmit}>
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
            labelText="Application Options"
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
              {isEditing ? "Save" : "Add Service"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddService;
