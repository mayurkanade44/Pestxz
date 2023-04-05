import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLocation,
  deleteLocation,
  editLocation,
  getCompanyServices,
  handleAdmin,
  setEdit,
} from "../redux/adminSlice";
import { DeleteModal, InputRow } from ".";
import { capitalLetter } from "../utils/data";
import { toast } from "react-toastify";

const AddLocation = ({ clientId, alreadyService, toggle }) => {
  const dispatch = useDispatch();
  const {
    adminLoading,
    companyServices,
    companyProducts,
    floor,
    location,
    isEditing,
    locationId,
  } = useSelector((store) => store.admin);

  const [allServices, setAllServices] = useState(null);
  const [allProducts, setAllProducts] = useState(null);
  const [addServices, setAddServices] = useState({
    name: [],
    services: [
      {
        service: "",
        count: "",
      },
    ],
    products: [],
  });
  const [disable, setDisable] = useState({
    service: false,
    product: false,
  });
  const [count, setCount] = useState("");

  useEffect(() => {
    if (!location || isEditing) dispatch(getCompanyServices());

    // eslint-disable-next-line
  }, [isEditing]);

  useEffect(() => {
    if (!adminLoading) {
      setAllServices(companyServices);
      setAllProducts(companyProducts);
    }
    if (!location) {
      setAddServices({ name: [], services: [], products: [] });
    }

    // eslint-disable-next-line
  }, [adminLoading]);

  useEffect(() => {
    if (alreadyService) {
      setAddServices({ name: [], services: [], products: [] });
      const service = allServices.some(
        (ser) => ser._id === alreadyService[0].service._id
      );
      if (service) setDisable({ service: false, product: true });
      else setDisable({ service: true, product: false });

      for (let item of alreadyService) {
        setAddServices((prev) => ({
          ...prev,
          name: [...prev.name, item.service],
          services: [
            ...prev.services,
            { service: item.service._id, count: item.count },
          ],
        }));
        setCount(item.count);
      }
    }

    // eslint-disable-next-line
  }, [alreadyService]);

  const clearAll = () => {
    dispatch(
      setEdit({
        isEditing: false,
        floor: "",
        location: "",
        locationId: "",
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteLocation({ clientId, locationId }));
    clearAll();
  };

  const addService = (ser, type) => {
    if (type === "service") {
      setDisable({ service: false, product: true });

      setAllServices((allServices) =>
        allServices.filter((item) => item._id !== ser._id)
      );

      const itemExists = addServices.name.some((item) => item._id === ser._id);
      if (!itemExists) {
        setAddServices((prev) => ({
          ...prev,
          name: [...prev.name, ser],
          services: [...prev.services, { service: ser._id }],
        }));
      }
    } else {
      setDisable({ service: true, product: false });

      const itemExists = addServices.name.some((item) => item._id === ser._id);
      if (!itemExists) {
        setAddServices((prev) => ({
          ...prev,
          name: [ser],
          services: [{ service: ser._id }],
        }));
      }
    }
  };

  const removeService = (ser) => {
    if (disable.product) {
      setAddServices((prev) => ({
        ...prev,
        name: prev.name.filter((item) => item._id !== ser._id),
        services: prev.services.filter((item) => item.service !== ser._id),
      }));

      const itemExists = allServices.some((item) => item._id === ser._id);
      if (!itemExists) setAllServices((allServices) => [...allServices, ser]);
    } else {
      setAddServices((prev) => ({
        ...prev,
        name: prev.name.filter((item) => item._id !== ser._id),
        services: prev.services.filter((item) => item.service !== ser._id),
      }));

      const itemExists = allProducts.some((item) => item._id === ser._id);
      if (!itemExists) setAllProducts((allProducts) => [...allProducts, ser]);
    }

    if (addServices.name.length === 1)
      setDisable({ service: false, product: false });
  };

  const handleLocationInput = (e) => {
    let name = e.target.name,
      value = e.target.value;

    dispatch(handleAdmin({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let services = addServices.services;
    if (count) services[0].count = count;

    if (!location || !floor || services.length < 1) {
      toast.error("Please fill all the details");
      return;
    }

    if (isEditing) {
      dispatch(
        editLocation({
          clientId,
          locationId,
          location: { floor: capitalLetter(floor), location, services },
        })
      );
      setDisable({ service: false, product: false });
      setCount("");
      return;
    }

    dispatch(
      addLocation({
        clientId,
        location: {
          floor: capitalLetter(floor),
          location,
          services,
        },
      })
    );
    setCount("");
    setDisable({ service: false, product: false });
  };

  return (
    <div className="add-client mb-3">
      <div className="back">
        <button className="btn btn-dark" onClick={() => toggle(false)}>
          Back
        </button>
        <h3 className="text-center ">
          {isEditing ? "Edit Location" : "Add Location"}
        </h3>
        <span></span>
      </div>
      {allServices && (
        <div className="row">
          <span className="service-span col-2">Available Services :</span>
          <div className="col-10 ps-0">
            {allServices.map((item) => {
              return (
                <button
                  type="button"
                  className="btn btn-sm me-2 mb-1"
                  key={item._id}
                  disabled={disable.service}
                  onClick={() => addService(item, "service")}
                >
                  {item.serviceName}
                </button>
              );
            })}
          </div>
          <span className="service-span col-2 mt-3">Available Products :</span>
          <div className="col-10 mt-3 ps-0">
            {allProducts.map((item) => {
              return (
                <button
                  type="button"
                  className="btn btn-sm btn-warning me-2 mb-1"
                  key={item._id}
                  disabled={disable.product}
                  onClick={() => addService(item, "product")}
                >
                  {item.productName}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <form className="row" onSubmit={handleSubmit}>
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
        <div className="col-md-12 mt-3 mb-2">
          <span className="mb-1 service-span">Added Services: </span>
          {addServices.name.map((item) => {
            return (
              <div key={item._id}>
                <button
                  type="button"
                  className="btn btn-sm btn-success ms-2"
                  onClick={() => removeService(item)}
                >
                  {item.serviceName || item.productName}
                </button>
                {disable.service && (
                  <input
                    type="text"
                    value={count}
                    name="count"
                    className="ms-2 ps-2"
                    onChange={(e) => setCount(e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="col-md-12">
          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary me-2"
              onClick={handleSubmit}
              disabled={adminLoading}
            >
              {adminLoading ? "saving..." : isEditing ? "Save" : "Add Location"}
            </button>
            {isEditing && (
              <>
                <button
                  type="button"
                  className="btn me-2"
                  onClick={() => clearAll()}
                >
                  Clear Values
                </button>
                <DeleteModal
                  handleDelete={() => handleDelete()}
                  name={location}
                  title="Location"
                />
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddLocation;
