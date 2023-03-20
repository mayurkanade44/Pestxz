import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { InputRow, InputSelect } from "../components";
import { getLocation } from "../redux/adminSlice";
import { addLocationRecord } from "../redux/reportSlice";

const QRLocation = () => {
  const dispatch = useDispatch();
  const { adminLoading, singleLocation } = useSelector((store) => store.admin);
  const { reportLoading } = useSelector((store) => store.report);
  const [inputField, setInputField] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getLocation(id));

    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (singleLocation) {
      singleLocation.services?.map((item) =>
        inputField.push({
          id: item._id,
          serviceName: item.serviceName,
          action: "",
          value: "",
        })
      );
    }
  }, [singleLocation]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;

    let data = [...inputField];
    data[index][name] = value;
    setInputField(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputField.filter((item => item.action)).length < 1){
       return toast.error("Please select valid service action");
    }
    
    // for (let item of singleLocation.services) {
    //   if (!state[item.serviceName] || state[item.serviceName] === "Select")
    //     return toast.error("Please select valid service action");
    //   reportData.push({
    //     id: item._id,
    //     serviceName: item.serviceName,
    //     action: state[item.serviceName],
    //   });
    // }

    await dispatch(addLocationRecord({ id, reportData: inputField }));
    setInputField([]);
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
              {singleLocation.services?.map((item, index) => {
                return (
                  <div key={item._id}>
                    <InputSelect
                      labelText={item.serviceName}
                      name="action"
                      id={item._id}
                      value={inputField.action}
                      handleChange={(e) => handleChange(index, e)}
                      list={["Select", ...item.serviceOption]}
                    />
                    <InputRow
                      type="text"
                      labelText="Value"
                      name="value"
                      value={item.value}
                      handleChange={(e) => handleChange(index, e)}
                    />
                    <hr className="hr" />
                  </div>
                );
              })}
              <button
                type="submit"
                className="btn btn-success my-3"
                disabled={reportLoading}
              >
                {reportLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default QRLocation;
