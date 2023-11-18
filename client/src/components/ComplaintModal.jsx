import { useState } from "react";
import InputRow from "./InputRow";
import InputSelect from "./InputSelect";

const ComplaintModal = ({
  handleSubmit,
  name,
  reportLoading,
  id,
  complaintId,
}) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("Select");
  const [image, setImage] = useState("");

  const submit = (e) => {
    e.preventDefault();

    let form = new FormData();
    form.set("comment", comment);
    form.append("image", image);

    handleSubmit({ id, complaintId, form });
    setOpen(!open);
  };

  return (
    <>
      {!open ? (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => setOpen(!open)}
        >
          {name}
        </button>
      ) : (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Complaint Box</h4>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setOpen(!open)}
                ></button>
              </div>
              <div className="modal-body">
                <form className="row" onSubmit={submit}>
                  <div className="col-12">
                    <InputSelect
                      labelText="Comment *"
                      qr={true}
                      value={comment}
                      required={true}
                      handleChange={(e) => setComment(e.target.value)}
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
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      <span className="btn btn-sm">
                        {image.name ? "Uploaded" : "Image Upload"}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ComplaintModal;
