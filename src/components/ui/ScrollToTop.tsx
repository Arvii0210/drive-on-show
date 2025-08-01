// src/components/ui/ScrollToTop.tsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // you can remove `behavior: "smooth"` if you want instant scroll
  }, [pathname]);

  return null;
};

export default ScrollToTop;
