import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

const Dashboard = () => {
  return (
    <div className="home-dashboard">
      <i className="fa-solid fa-bars hamMenu"></i>
      <h1>My Dashboard</h1>

      <div className="container-fluid firstDiv">
        <div className="row">
          <div className="col-lg-3 col-xl-3 col-md-6 col-sm-12">
            <div className="innerDivs">
              <p>Total Sale</p>
              <h6>&#8377;8888888</h6>
              <span>
                <div>
                  <i className="fa-solid fa-arrow-up"></i>14%
                </div>{" "}
                in last month
              </span>
            </div>
          </div>
          <div className="col-lg-3 col-xl-3 col-md-6 col-sm-12">
            <div className="innerDivs">
              <p>Total</p>
              <h6>&#8377;8888888</h6>
              <span>
                <div>
                  <i className="fa-solid fa-arrow-up"></i>14%
                </div>{" "}
                in last month
              </span>
            </div>
          </div>
          <div className="col-lg-3 col-xl-3 col-md-6 col-sm-12">
            <div className="innerDivs">
              <p>Total Revenue</p>
              <h6>&#8377;8888888</h6>
              <span>
                <div>
                  <i className="fa-solid fa-arrow-up"></i>14%
                </div>{" "}
                in last month
              </span>
            </div>
          </div>
          <div className="col-lg-3 col-xl-3 col-md-6 col-sm-12">
            <div className="innerDivs">
              <p>Total Customer</p>
              <h6>&#8377;8888888</h6>
              <span>
                <div>
                  <i className="fa-solid fa-arrow-up"></i>14%
                </div>{" "}
                in last month
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid secondDiv">
        <div className="row">
          <div className="col-lg-6 col-xl-6 col-md-5 col-sm-12">
            <div className="innerDivs">
              <p>
                <span>Revenue</span> |<span>Current Week &#8377;888</span> |
                <span>Previous Week</span>
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-xl-3 col-md-3 col-sm-12">
            <div className="innerDivs">
              <p>
                <span>Revenue</span>
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-xl-3 col-md-3 col-sm-12">
            <div className="innerDivs">
              <p>
                <span>Revenue</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid thirdDiv">
        <div className="row">
          <div className="col-lg-7 col-xl-7 col-md-6 col-sm-12">
            <div className="innerDivs">
              <p>
                Top Selling Products
              </p>
            </div>
          </div>
          <div className="col-lg-5 col-xl-5 col-md-6 col-sm-12">
            <div className="innerDivs">
              <p>
                Monthly Targets
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
