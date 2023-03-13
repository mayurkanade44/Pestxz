import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { InputSelect } from "../components";
import { addLocationRecord, getLocation } from "../redux/adminSlice";

const QRLocation = () => {
  const dispatch = useDispatch();
  const { adminLoading, singleLocation } = useSelector((store) => store.admin);
  const [state, setState] = useState({});

  const { id } = useParams();

  useEffect(() => {
    dispatch(getLocation(id));

    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = [];
    for (let item of singleLocation.services) {
      if (!state[item.serviceName] || state[item.serviceName] === "Select")
        return toast.error("Please select valid service action");
      reportData.push({
        id: item._id,
        serviceName: item.serviceName,
        action: state[item.serviceName],
      });
    }

    await dispatch(addLocationRecord({ id, reportData }));
    setState({});
  };

  return (
    <div className="location">
      {singleLocation && (
        <div>
          <div className="details">
            <h5>Floor - {singleLocation.floor}</h5>
            <h5>Location - {singleLocation.location}</h5>
          </div>
          <hr />
          <form className="location-form" onSubmit={handleSubmit}>
            <div className="form-center">
              {singleLocation.services?.map((item) => {
                return (
                  <div key={item._id}>
                    <InputSelect
                      labelText={item.serviceName}
                      name={item.serviceName}
                      id={item._id}
                      value={state[item.serviceName]}
                      handleChange={handleChange}
                      list={["Select", ...item.serviceOption]}
                    />
                  </div>
                );
              })}
              <button
                type="submit"
                className="btn btn-success my-3"
                disabled={adminLoading}
              >
                {adminLoading ? "Submitting...": "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default QRLocation;
