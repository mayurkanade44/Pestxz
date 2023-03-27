import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { setEdit } from "../redux/adminSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { id } = useParams();
  
  useEffect(() => {
    dispatch(setEdit({ locationId: id }));
  }, [id]);

  if (!user) return <Navigate to="/" />;
  return children;
};
export default ProtectedRoute;
