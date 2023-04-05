import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddServiceProduct, Loading, ServProdTable } from "../components";
import { getCompanyServices, setEdit } from "../redux/adminSlice";
import { useParams } from "react-router-dom";

const ServiceProduct = () => {
  const {
    adminLoading,
    companyServices,
    companyProducts,
    isEditing,
    locationId,
  } = useSelector((store) => store.admin);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [alreadyService, setAlreadyService] = useState(null);
  const [type, setType] = useState("");

  useEffect(() => {
    dispatch(getCompanyServices());
    if (id === "products") setType("Product");
    else setType("Service");

    // eslint-disable-next-line
  }, [id]);

  const openEdit = (item) => {
    dispatch(
      setEdit({
        locationId: item._id,
        isEditing: true,
      })
    );
    setAlreadyService({
      name: item.serviceName || item.productName,
      options: item.serviceOption,
    });
  };

  return (
    <div>
      {adminLoading && <Loading />}
      <AddServiceProduct
        type={type}
        alreadyService={alreadyService}
        adminLoading={adminLoading}
        isEditing={isEditing}
        id={locationId}
      />
      <ServProdTable
        type={type}
        data={type === "Product" ? companyProducts : companyServices}
        openEdit={openEdit}
      />
    </div>
  );
};
export default ServiceProduct;
