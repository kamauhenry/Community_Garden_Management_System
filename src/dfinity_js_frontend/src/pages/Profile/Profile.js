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
import Loader from "../../components/utils/Loader";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const isAuthenticated = window.auth.isAuthenticated;

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUserProfileByOwner();
      console.log('User profile response:', res); // Debugging step
      if (res.Ok) {
        setUser(res.Ok);
      } else {
        console.error('Failed to fetch user profile:', res);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated, fetchUserProfile]);

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        !loading ? (
          user ? (
            <>
              <Nav className="justify-content-end pt-3 pb-5 mr-4">
                <Nav.Item>
                  <Wallet />
                </Nav.Item>
              </Nav>
              <main>
                <UserProfile1 user={user} />
                <UserDashboard user={user} />
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
