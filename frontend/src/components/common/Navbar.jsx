import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

import logo from "../../assets/images/learnovahub-logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();

  const token = localStorage.getItem("token");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  useEffect(() => {

    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    axios
      .get("https://learnovahub.onrender.com/notifications")
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleProfilePictureUpload(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("profile_picture", file);

    axios
      .post(
        "https://learnovahub.onrender.com/profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("Upload response:", response.data)
        const updatedUser = {
          ...user,
          profile_pic_url: response.data.profile_pic_url,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <nav className="navbar">

      <div className="navbar-left">

        <Link to="/" className="logo-section">
          <img
            src={logo}
            alt="LearnovaHub"
            className="navbar-logo"
          />
        </Link>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/lessons">Lessons</Link>
          <Link to="/pricing">Pricing</Link>

          {token && user?.role !== "admin" && (
            <Link to="/dashboard">
              Dashboard
            </Link>
          )}

          {token && user?.role === "admin" && (
            <>
              <Link to="/admin">
                Admin Panel
              </Link>

              <Link to="/admin/learners">
                Learner Management
              </Link>

              <Link to="/admin/lessons">
                Lesson Management
              </Link>
            </>
          )}
          
        </div>
      </div>

      <div className="navbar-right">

        <div className="notification-wrapper">
          <button
            className="icon-btn"
            onClick={() =>
              setNotificationsOpen(!notificationsOpen)
            }
          >
            <FaBell />

            {notifications.length > 0 && (
              <span className="notification-badge">
                {notifications.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="notification-dropdown">
              <h3>Announcements</h3>

              {notifications.length === 0 ? (
                <p>No announcements yet.</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="notification-item"
                    onClick={() => {
                      if (notification.link) {
                        navigate(notification.link);
                        setNotificationsOpen(false);
                      }
                    }}
                  >
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <small>Link: {notification.link || "No link found"}</small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div
          className="profile-wrapper"
          ref={profileRef}
        >

          <button
            className="user-profile"
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
          >
            {user?.profile_pic_url ? (
              <img
                src={user.profile_pic_url}
                alt={user.full_name}
                className="profile-image"
              />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}

            {user && (
              <span>
                {user.full_name?.split(" ")[0]}
              </span>
            )}
          </button>

          {profileOpen && (
            <div className="profile-dropdown">

              {user?.role === "admin" ? (
                <>
                  <Link to="/admin">
                    Admin Dashboard
                  </Link>

                  <Link to="/admin/learners">
                    Learner Management
                  </Link>

                  <Link to="/admin/lessons">
                    Lesson Management
                  </Link>

                  <Link to="/admin">
                    Announcements
                  </Link>

                  <Link to="/admin">
                    Subscriptions
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    Dashboard
                  </Link>

                  <Link to="/progress">
                    My Progress
                  </Link>

                  <Link to="/pricing">
                    Subscription
                  </Link>
                </>
              )}
              <label className="upload-profile-label">
                Upload Profile Picture

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                />
              </label>

              <button onClick={handleLogout}>
                Logout
              </button>

            </div>
          )}
        </div>

        {token ? (
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

      </div>
    </nav>
  );
}