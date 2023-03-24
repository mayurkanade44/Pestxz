import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddService } from "../components";
import { getCompanyServices, setEdit } from "../redux/adminSlice";

const Services = () => {
  const { adminLoading, companyServices, isEditing, locationId } = useSelector(
    (store) => store.admin
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [alreadyService, setAlreadyService] = useState(null);

  useEffect(() => {
    if (!open) {
      dispatch(getCompanyServices());
    }

    // eslint-disable-next-line
  }, [open]);

  const openEdit = (item) => {
    setOpen(true);
    dispatch(
      setEdit({
        locationId: item._id,
      })
    );
    setAlreadyService({ name: item.serviceName, options: item.serviceOption });
  };

  return (
    <div>
      {open ? (
        <AddService
          alreadyService={alreadyService}
          adminLoading={adminLoading}
          isEditing={isEditing}
          id={locationId}
          toggle={setOpen}
        />
      ) : (
        <>
          <button
            className="btn btn-lg btn-success mb-3"
            onClick={() => (setOpen(true), setAlreadyService(null))}
          >
            Add New Service
          </button>
          <table className="table table-striped table-bordered border-primary">
            <thead>
              <tr>
                <th className="text-center">Service Name</th>
                <th className="text-center">Service Options</th>
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
                    <button
                      className="btn edit-btn btn-sm me-2"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
export default Services;
