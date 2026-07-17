import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaBars, FaTimes} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/images/learnovahub-logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();

  const {
    token,
    user,
    setUser,
    logoutUser,
  } = useAuth();

  function handleLogout() {
    logoutUser();

    setProfileOpen(false);

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
    if (!token){
      return;
    }
    
    api.get("/notifications")
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  const [readNotifications, setReadNotifications] =
    useState([]);

  const readKey = user
    ? `readNotifications_${user.id}`
    : "readNotifications_guest";
  
  useEffect(() => {
    const storedReads =
      JSON.parse(
        localStorage.getItem(readKey)
      ) || [];

    setReadNotifications(storedReads);
  }, [readKey]);

  const unreadCount = notifications.filter(
    (notification) =>
      !readNotifications.includes(notification.id)
  ).length;

  function handleProfilePictureUpload(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const formData = new FormData();

    formData.append("profile_picture", file);

    api
      .post("/profile-picture",
            formData,
            {
          headers: {
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

        sessionStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
        setProfileOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function closeMenus() {
    setProfileOpen(false);
    setNotificationsOpen(false);
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">

      <div className="navbar-left">

        <Link to="/" className="logo-section" onClick={closeMenus}>
          <img
            src={logo}
            alt="LearnovaHub"
            className="navbar-logo"
          />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenus}>Home</Link>
          
          {!token && (
            <>
              <Link to="/courses" onClick={closeMenus}>
                Courses
              </Link>

              <Link to="/pricing" onClick={closeMenus}>
                Pricing
              </Link>
            </>
          )}
          
          {token && user?.role === "learner" && (
            <>
              <Link to="/courses" onClick={closeMenus}>
                Courses
              </Link>

              <Link to="/dashboard" onClick={closeMenus}>
                Dashboard
              </Link>
            </>
          )}

          {token && user?.role === "teacher" && (
            <>
              <Link to="/teacher" onClick={closeMenus}>
                Teacher Dashboard
              </Link>

              <Link to="/teacher/courses" onClick={closeMenus}>
                My Courses
              </Link>

              <Link to="/teacher/lessons" onClick={closeMenus}>
                My Lessons
              </Link>
            </>
          )}

          {token && user?.role === "admin" && (
            <>
              <Link to="/admin" onClick={closeMenus}>
                Admin Panel
              </Link>

              <Link to="/admin/learners" onClick={closeMenus}>
                User Management
              </Link>
              <Link to="/admin/system-health" onClick={closeMenus}>
                System Health
              </Link>
            </>
          )}
          
        </div>

      </div>

      <div className="navbar-right">
        {token && (
          <div className="notification-wrapper">
              <button
                className="icon-btn"
                onClick={() => 
                  setNotificationsOpen(!notificationsOpen)
                }
              >
                <FaBell />

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount}
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
                        className={readNotifications.includes(notification.id)
                          ? "notification-item read"
                          : "notification-item unread"
                        }
                        onClick={() => {

                          const updatedReads = [
                            ...new Set([
                              ...readNotifications,
                              notification.id
                            ])
                          ];

                          setReadNotifications(updatedReads);

                          localStorage.setItem(
                            readKey,
                            JSON.stringify(updatedReads)
                          );

                          navigate(
                            `/announcements/${notification.id}`
                          );

                          setNotificationsOpen(false);
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
          )}
          
        {token && (
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
                    <Link to="/admin" onClick={closeMenus}>Admin Dashboard</Link>
                    <Link to="/admin/learners" onClick={closeMenus}>User Management</Link>
                    <Link to="/admin" onClick={closeMenus}>Announcements</Link>
                    <Link to="/admin" onClick={closeMenus}>Subscriptions</Link>
                  </>
                ) : user?.role === "teacher" ? (
                  <>
                    <Link to="/teacher" onClick={closeMenus}>Teacher Dashboard</Link>
                    <Link to="/teacher/courses" onClick={closeMenus}>My Courses</Link>
                    <Link to="/teacher/lessons" onClick={closeMenus}>My Lessons</Link>
                    <Link to="/teacher" onClick={closeMenus}>My Quizzes</Link>
                    <Link to="/teacher" onClick={closeMenus}>My Learners</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={closeMenus}>Dashboard</Link>
                    <Link to="/progress" onClick={closeMenus}>My Progress</Link>
                    <Link to="/pricing" onClick={closeMenus}>Subscription</Link>
                  </>
                )}
                {token && (
                  <label className="upload-profile-label">
                    Upload Profile Picture

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                    />
                  </label>
                )}

                <button onClick={handleLogout}>
                  Logout
                </button>

              </div>
            )}
          </div>
        )}  

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