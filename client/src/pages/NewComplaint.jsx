import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../redux/adminSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InputRow, InputSelect, Loading } from "../components";
import { newComplaint } from "../redux/reportSlice";
import { toast } from "react-toastify";

const NewComplaint = () => {
  const dispatch = useDispatch();
  const { adminLoading, singleLocation } = useSelector((store) => store.admin);
  const { reportLoading } = useSelector((store) => store.report);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    pest: "",
    image: "",
  });

  const { id } = useParams();

  useEffect(() => {
    dispatch(getLocation(id));

    // eslint-disable-next-line
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image || !formData.pest || !formData.number)
      return toast.error("Please provide all values");

    if (formData.number.length < 10)
      return toast.error("Please provide valid phone number");

    const form = new FormData();

    form.set("pest", formData.pest);
    form.set("number", formData.number);
    form.append("image", formData.image);

    await dispatch(newComplaint({ id, form })).unwrap();
    setOpen(true);
  };

  return (
    <div className="location">
      {(adminLoading || reportLoading) && <Loading />}
      <h4 className="text-center pt-4">
        {!open ? (
          <b>New Complaint</b>
        ) : (
          <b>
            Thank You. <br></br>Your complaint has been raised. <br></br>our
            service team will get back to you on your given number.
          </b>
        )}
      </h4>
      {!open && singleLocation && (
        <div className="details">
          <h5>Floor - {singleLocation.floor}</h5>
          <h5>Location - {singleLocation.location}</h5>
          <hr />
          <form className="location-form row" onSubmit={handleSubmit}>
            <div className="col-12">
              <InputRow
                type="number"
                labelText="Phone Number"
                value={formData.number}
                handleChange={(e) =>
                  setFormData((item) => ({ ...item, number: e.target.value }))
                }
              />
            </div>
            <div className="col-12">
              <InputSelect
                labelText="Pest Name"
                qr={true}
                value={formData.pest}
                required={true}
                handleChange={(e) =>
                  setFormData((item) => ({ ...item, pest: e.target.value }))
                }
                list={[
                  "Select",
                  "Cockroach",
                  "Ants",
                  "Mosquitoes",
                  "Flies",
                  "Termites",
                ]}
              />
            </div>
            <div className="col-12 mt-4">
              <label>
                <input
                  type="file"
                  className="upload"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((item) => ({
                      ...item,
                      image: e.target.files[0],
                    }))
                  }
                />
                <span className="btn btn-sm">
                  {formData.image.name ? "Uploaded" : "Image Upload"}
                </span>
              </label>
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-success mt-5"
                  disabled={reportLoading}
                >
                  {reportLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default NewComplaint;
