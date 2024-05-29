import React, { useState } from "react";
import { createUserProfile } from "../../utils/communityGarden";

const CreateUserProfile = ({ fetchUserProfile }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const isFormFilled = () => name && email && phoneNumber;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const user = {
        name,
        email,
        phoneNumber,
      };
      const res = await createUserProfile(user); // Wait for the promise to resolve
      console.log(res);
      fetchUserProfile(); // Fetch the user profile after successful creation
    } catch (error) {
      console.log("Failed to create user profile:", error);
    }
  };

  return (
    <div>
      <section className="vh-100 ">
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-5">
                    <h2 className="text-uppercase text-center mb-5">
                      Create an account
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form3Example1cg">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="form3Example1cg"
                          className="form-control form-control-lg"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form3Example3cg">
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="form3Example3cg"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form3Example4cg">
                          Your Phone Number
                        </label>
                        <input
                          type="text"
                          id="form3Example4cg"
                          className="form-control form-control-lg"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                          }}
                        />
                      </div>

                      <div className="d-flex justify-content-center">
                        <button
                          disabled={!isFormFilled()}
                          type="submit"
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                        >
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateUserProfile;
