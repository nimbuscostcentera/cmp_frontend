import React from "react";
import "./PageNotFound.css";
import "bootstrap/dist/css/bootstrap.min.css";

function PageNotFound() {
  return (
    <section className="page_404">
      <div className="container text-center">
        <div className="four_zero_four_bg">
          <h1>404</h1>
        </div>

        <div className="contant_box_404">
          <h3>Oops! Page Not Found</h3>
          <p>The page you’re looking for doesn’t exist or has been moved.</p>

          <a href="/auth/home" className="link_404">
            Go Back Home
          </a>
        </div>
      </div>
    </section>
  );
}

export default PageNotFound;
