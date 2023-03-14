import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../redux/userSlice";

const Profile = () => {
  const { userLoading, allUsers } = useSelector((store) => store.user);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  return (
    <div className="profile">
      <div className="row">
        {allUsers[0] && (
          <>
            <h3 className="text-center mt-0">Company Details</h3>
            <div className="col-md-4">
              <h5>Name - {allUsers[0].company.companyName} </h5>
            </div>
            <div className="col-md-8">
              <h5>Address - {allUsers[0].company.companyAddress} </h5>
            </div>
            <div className="col-md-6">
              <h5>Contact - {allUsers[0].company.companyContact} </h5>
            </div>
            <div className="col-md-6">
              <h5>Email Id - {allUsers[0].company.companyEmail} </h5>
            </div>
          </>
        )}
      </div>
      <div className="add-client">
        <table className="table table-striped table-bordered border-warning">
          <thead>
            <tr>
              <th className="text-center">User Login</th>
              <th className="text-center">Role</th>
              <th style={{ width: 240 }} className="text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {allUsers?.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.role}</td>
                <td>
                  <button className="btn edit-btn btn-sm me-2">Forgot Password</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Profile;
