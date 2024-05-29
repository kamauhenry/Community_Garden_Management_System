import React, {useState} from "react";
import { createUserProfile } from "../../utils/communityGarden";

const SignUser = ({ fetchUserProfile }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    
    const isFormFilled = name && email && phoneNumber;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUserProfile({ name, email, phoneNumber });
            fetchUserProfile();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={!isFormFilled}
            >
                Submit
            </button>
        </form>
    );  
}

export default SignUser;