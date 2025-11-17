import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  // Also scroll to top on component mount (page reload)
  useEffect(() => {
    window.scrollTo(0, 0);
    // Force scroll after a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
