import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddService, InputRow, Loading } from "../components";
import { editService, getCompanyServices, setEdit } from "../redux/adminSlice";
import { toast } from "react-toastify";
import { addService } from "../redux/adminSlice";
import { capitalLetter } from "../utils/data";

const Product = () => {
  const { adminLoading, companyProducts, isEditing, locationId } = useSelector(
    (store) => store.admin
  );
  const dispatch = useDispatch();
  const [alreadyService, setAlreadyService] = useState(null);

  useEffect(() => {
    dispatch(getCompanyServices());

    // eslint-disable-next-line
  }, []);

  const openEdit = (item) => {
    
    dispatch(
      setEdit({
        locationId: item._id,
        isEditing: true,
      })
    );
    setAlreadyService({ name: item.productName, options: item.serviceOption });
  };

  return (
    <div>
      {adminLoading && <Loading />}
      <AddService
        type="Product"
        alreadyService={alreadyService}
        adminLoading={adminLoading}
        isEditing={isEditing}
        id={locationId}
      />
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Product;
