import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InputRow } from "../components";
import {
  clientRegister,
  handleAdmin,
  updateClient,
} from "../redux/adminSlice";
import { capitalLetter } from "../utils/data";

const RegisterClient = () => {
  const {
    shipToName,
    shipToAddress,
    shipToEmail,
    shipToNumber,
    adminLoading,
    clientId,
    locationId,
    isEditing,
  } = useSelector((store) => store.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (clientId) {
      setTimeout(() => {
        navigate(`/dashboard/client/${clientId}`);
      }, 1000);
    }

    // eslint-disable-next-line
  }, [clientId]);
  const handleClientInput = (e) => {
    let name = e.target.name,
      value = e.target.value;
    dispatch(handleAdmin({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shipToName || !shipToAddress)
      return toast.error("Please provide client name");

    if (isEditing) {
      dispatch(
        updateClient({
          id: locationId,
          form: {
            shipToName: capitalLetter(shipToName),
            shipToAddress,
            shipToEmail,
            shipToNumber,
          },
        })
      );
      return;
    }

    dispatch(
      clientRegister({
        shipToName: capitalLetter(shipToName),
        shipToAddress,
        shipToEmail,
        shipToNumber,
      })
    );
  };

  return (
    <div className="add-client">
      <form className="form">
        <h3 className="text-center">
          {isEditing ? "Client Update" : "Add New Client"}
        </h3>
        <div className="form-center">
          <InputRow
            type="text"
            labelText="Client Name*"
            name="shipToName"
            value={shipToName}
            handleChange={handleClientInput}
          />
          <InputRow
            type="email"
            labelText="Client Email"
            name="shipToEmail"
            value={shipToEmail}
            handleChange={handleClientInput}
          />
          <InputRow
            type="text"
            labelText="Client Contact Number"
            name="shipToNumber"
            value={shipToNumber}
            handleChange={handleClientInput}
          />
          <div>
            <label htmlFor="cd">Client Address*</label>
            <textarea
              className="form-textarea"
              name="shipToAddress"
              value={shipToAddress}
              onChange={handleClientInput}
              rows="4"
              cols="40"
            />
          </div>
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn mb-2"
              onClick={handleSubmit}
              disabled={adminLoading}
            >
              {isEditing ? "Update Client" : "Add Client"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default RegisterClient;
