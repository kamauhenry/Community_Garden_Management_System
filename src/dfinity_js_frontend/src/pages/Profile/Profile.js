import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from "../../utils/auth";
import { Notification } from "../../components/utils/Notifications";
import Wallet from "../../components/Wallet";
import UserDashboard from "./UserDashboard";
import UserProfile1 from "../../components/UserManager/UserProfile";
import CreateUserProfile from "../../components/UserManager/CreateUserProfile";
import { getUserProfileByOwner } from "../../utils/communityGarden";
import Login from "./Login";
import { Nav } from "react-bootstrap";
import SignUser from "../../components/UserManager/SignUser";
import Loader from "../../components/utils/Loader";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const isAuthenticated = window.auth.isAuthenticated;

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserProfileByOwner();
      const userProfile = response.Ok; // Adjusting to fetch the nested Ok object
      console.log("User Profile Fetched:", userProfile); // Debug log
      setUser(userProfile);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        !loading ? (
          user?.name ? (
            <>
              <Nav className="justify-content-end pt-3 pb-5 mr-4">
                <Nav.Item>
                  <Wallet />
                </Nav.Item>
              </Nav>
              <main>
                <UserProfile1 user={user} />
                <UserDashboard user={user}/>
                <ToastContainer />
              </main>
            </>
          ) : (
            <CreateUserProfile fetchUserProfile={fetchUserProfile} />
          )
        ) : (
          <Loader />
        )
      ) : (
        <Login login={login} />
      )}
    </>
  );
};

export default UserProfile;
