import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddService, InputRow, Loading } from "../components";
import { getCompanyServices, setEdit } from "../redux/adminSlice";
import { toast } from "react-toastify";
import { addService } from "../redux/adminSlice";
import { capitalLetter } from "../utils/data";

const Product = () => {
  const { adminLoading, companyProducts, isEditing, locationId } = useSelector(
    (store) => store.admin
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const openEdit = (item) => {
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return toast.error("Please provide Product Name");

    dispatch(addService({ productName: capitalLetter(name) }));
    setName("");
  };

  return (
    <div>
      {adminLoading && <Loading />}
      <div className="add-client">
        <h3 className="text-center ">
          {isEditing ? "Edit Product" : "Add Product"}
        </h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <InputRow
                type="text"
                labelText="Product Name"
                name="name"
                value={name}
                handleChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button
                type="submit"
                className="btn btn-success mt-5"
                onClick={handleSubmit}
                disabled={adminLoading}
              >
                {isEditing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <table className="table table-striped table-bordered border-primary mt-3">
        <thead>
          <tr>
            <th style={{ width: 300 }} className="text-center">
              Product Name
            </th>
            <th style={{ width: 100 }} className="text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {companyProducts.map((item) => (
            <tr key={item._id}>
              <td>{item.productName}</td>
              <td className="text-center">
                <button
                  className="btn edit-btn btn-sm me-2"
                  onClick={() => openEdit(item)}
                >
                  Edit
                </button>
                {/* <DeleteModal
                  handleDelete={() => dispatch(deleteService(item._id))}
                  name={item.serviceName}
                  title="Service"
                /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Product;
