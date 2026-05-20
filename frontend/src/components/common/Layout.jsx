import Navbar from "./Navbar.jsx";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}