import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddService } from "../components";
import { getCompanyServices, setEdit } from "../redux/adminSlice";

const Services = () => {
  const {
    shipToName,
    shipToAddress,
    adminLoading,
    companyServices,
    isEditing,
    id,
  } = useSelector((store) => store.admin);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

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
        shipToName: item.serviceName,
        shipToAddress: item.serviceOption.join(", "),
        id: item._id,
      })
    );
  };

  return (
    <div>
      {open ? (
        <AddService
          shipToName={shipToName}
          shipToAddress={shipToAddress}
          adminLoading={adminLoading}
          isEditing={isEditing}
          id={id}
          toggle={setOpen}
        />
      ) : (
        <>
          <button
            className="btn btn-lg btn-success mb-3"
            onClick={() => setOpen(true)}
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
