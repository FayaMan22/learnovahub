import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

export default function AnnouncementsPage() {
  usePageTitle("Announcement");
  
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const { announcementId } = useParams();

  const selectedAnnouncement = announcementId
    ? announcements.find(
        (item) => String(item.id) === announcementId
        )
    : null;
    
  useEffect(() => {
    api
      .get("/notifications")
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (announcementId && selectedAnnouncement) {
    return (
        <section className="page-section">
        <button
            className="btn btn-secondary back-btn"
            onClick={() => navigate("/announcements")}
        >
            ← Back to Announcements
        </button>

        <div className="card announcement-card">
            <h1>{selectedAnnouncement.title}</h1>

            <p>{selectedAnnouncement.message}</p>

            {selectedAnnouncement.link && (
            <button
                className="btn btn-primary"
                onClick={() =>
                navigate(selectedAnnouncement.link)
                }
            >
                Open Link
            </button>
            )}
        </div>
        </section>
    );
  }

  return (
    <section className="page-section">
      <h1>Announcements</h1>

      {announcements.length === 0 && (
        <div className="card empty-state">
          <h2>No announcements yet</h2>
          <p>Please check again later.</p>
        </div>
      )}

      <button
        className="btn btn-secondary back-btn"
          onClick={() => navigate("/admin")}
      >
          ← Back to Admin Dashboard
      </button>

      <div className="grid-auto">
        {announcements.map((item) => (
          <div key={item.id} className="card announcement-card">
            <h2>{item.title}</h2>

            <p>{item.message}</p>

            {item.link && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  window.location.href = item.link;
                }}
              >
                Open Link
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}