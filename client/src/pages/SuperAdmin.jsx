import { useDispatch, useSelector } from "react-redux";
import { InputRow, Loading, Navbar } from "../components";
import { handleSuperAdmin, registerCompany } from "../redux/superAdminSlice";
import { toast } from "react-toastify";
import { capitalLetter } from "../utils/data";

const SuperAdmin = () => {
  const {
    companyName,
    companyAddress,
    companyEmail,
    companyContact,
    superAdminLoading,
  } = useSelector((store) => store.superAdmin);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!companyName || !companyAddress || !companyEmail || !companyContact)
      return toast.error("Please fill all the details");

    dispatch(
      registerCompany({
        companyName: capitalLetter(companyName),
        companyAddress,
        companyEmail,
        companyContact,
      })
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleSuperAdmin({ name, value }));
  };

  return (
    <>
      {superAdminLoading && <Loading />}
      <Navbar />
      <div className="add-client mb-3">
        <div className="container">
          <h3 className="text-center ">Register Company</h3>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-center">
              <InputRow
                type="text"
                labelText="Company Name"
                name="companyName"
                value={companyName}
                handleChange={handleChange}
              />

              <InputRow
                type="text"
                labelText="Company Address"
                name="companyAddress"
                value={companyAddress}
                handleChange={handleChange}
              />

              <InputRow
                type="text"
                labelText="Company Email"
                name="companyEmail"
                value={companyEmail}
                handleChange={handleChange}
              />

              <InputRow
                type="text"
                labelText="Company Contact"
                name="companyContact"
                value={companyContact}
                handleChange={handleChange}
              />

              <button
                type="submit"
                className="btn btn-primary me-2"
                onClick={handleSubmit}
                disabled={superAdminLoading}
              >
                Register Company
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default SuperAdmin;
