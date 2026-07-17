import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>

      <p>
        Sorry, the page you're looking for doesn't exist.
      </p>

      <Link to="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
}