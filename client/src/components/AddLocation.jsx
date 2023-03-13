import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLocation,
  getCompanyServices,
  handleAdmin,
} from "../redux/adminSlice";
import { InputRow } from ".";
import { capitalLetter } from "../utils/data";

const AddLocation = ({ id }) => {
  const dispatch = useDispatch();
  const { adminLoading, companyServices, floor, location, isEditing } =
    useSelector((store) => store.admin);

  const [allServices, setAllServices] = useState(null);
  const [addServices, setAddServices] = useState({
    name: [],
    services: [],
  });

  useEffect(() => {
    if (!location) dispatch(getCompanyServices());

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!adminLoading) {
      setAllServices(companyServices);
      setAddServices({ name: [], services: [] });
    }

    // eslint-disable-next-line
  }, [adminLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let services = addServices.services;
    dispatch(
      addLocation({
        locationId: id,
        location: { floor: capitalLetter(floor), location, services },
      })
    );
  };

  const addService = (ser) => {
    setAllServices((allServices) =>
      allServices.filter((item) => item._id !== ser._id)
    );
    setAddServices((prev) => ({
      ...prev,
      name: [...prev.name, ser],
      services: [...prev.services, ser._id],
    }));
  };

  const removeService = (ser) => {
    setAddServices((prev) => ({
      ...prev,
      name: prev.name.filter((item) => item._id !== ser._id),
      services: prev.services.filter((item) => item !== ser._id),
    }));

    setAllServices((allServices) => [...allServices, ser]);
  };

  const handleLocationInput = (e) => {
    let name = e.target.name,
      value = e.target.value;

    dispatch(handleAdmin({ name, value }));
  };

  return (
    <div className="add-client">
      {allServices && (
        <>
          <span className="service-span">Available Services :</span>
          {allServices.map((item) => {
            return (
              <button
                type="button"
                className="btn btn-sm position-relative ms-3"
                key={item._id}
                onClick={() => addService(item)}
              >
                {item.serviceName}
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  +
                </span>
              </button>
            );
          })}
        </>
      )}
      <form className="row mt-4" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <InputRow
            type="text"
            labelText="Floor"
            name="floor"
            value={floor}
            handleChange={handleLocationInput}
          />
        </div>
        <div className="col-md-6">
          <InputRow
            type="text"
            labelText="Location"
            name="location"
            value={location}
            handleChange={handleLocationInput}
          />
        </div>
        <div className="col-md-12 my-2">
          <p className="mb-1">Added Services</p>
          {addServices.name.map((item) => {
            return (
              <button
                type="button"
                className="btn btn-sm btn-success position-relative me-3 mb-1"
                key={item._id}
                onClick={() => removeService(item)}
              >
                {item.serviceName}
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  +
                </span>
              </button>
            );
          })}
        </div>
        <div className="col-md-12 mt-3">
          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-lg btn-primary"
              onClick={handleSubmit}
              disabled={adminLoading}
            >
              Add Location
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddLocation;
