import {
  BrowserRouter as Router,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { UserLayout, AdminLayout } from "./components/Layout.jsx";
import LoginContextProvider from "./context/userContext/UserContextProvider.jsx";
import LoginContext from "./context/userContext/userContext.js";
import Test from "./pages/admin/Test.jsx";
import { LoadingProvider } from "./context/Loading.jsx";

// User Pages
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Products = lazy(() => import("./pages/Products"));
const Profile = lazy(() => import("./pages/Profile"));
const Signup = lazy(() => import("./pages/Signup"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const Thank = lazy(() => import("./pages/Thanks"));
const NotFound = lazy(() => import("./pages/NotFount.jsx"));
const Loading = lazy(() => import("./components/Loading.jsx"));
const ProfileUpdate = lazy(() => import("./pages/ProfileUpdate.jsx"));
const UserForm = lazy(() => import("./pages/UserForm.jsx"));

// Admin Pages
const D_Product = lazy(() => import("./pages/admin/Product.jsx"));
const D_Category = lazy(() => import("./pages/admin/Category.jsx"));
const DAdd_Category = lazy(() => import("./pages/admin/AddCategory.jsx"));
const DUpdate_Category = lazy(() => import("./pages/admin/UpdateCategory.jsx"));
const DAdd_Product = lazy(() => import("./pages/admin/AddProduct.jsx"));
const DUpdate_Product = lazy(() => import("./pages/admin/UpdateProduct.jsx"));
const D_Orders = lazy(() => import("./pages/admin/Orders.jsx"));
const D_Transaction = lazy(() => import("./pages/admin/Transcation.jsx"));
const D_User = lazy(() => import("./pages/admin/Users.jsx"));
const History = lazy(() => import("./pages/admin/History.jsx"));
const Form = lazy(() => import("./pages/admin/Form.jsx"));
import PaymentSuccess from "./pages/PaymentSuccess.jsx";

import CheckoutForm from "./components/CheckoutForm.jsx";
import ThankYou from "./components/ThankYou.jsx";
import { OrderProvider } from "./context/orderContext/OrderContext.jsx";

import Loader from "./components/Loader.jsx";

function App() {
  const AfterLogin = ({ element }) => {
    const { loggedIn } = useContext(LoginContext);
    const userId = localStorage.getItem("userId");
    const backend_url = import.meta.env.VITE_BASE_API_URL;
    if (loggedIn && userRole === "admin") {
      return <Navigate to="/admin" replace={true} />;
    }

    return !loggedIn ? element : <Navigate to="/" replace={true} />;
  };

  const BeforeLogin = ({ element }) => {
    const { loggedIn } = useContext(LoginContext);
    return !loggedIn ? <Navigate to="/" replace={false} /> : element;
  };

  const userId = localStorage.getItem("userId") || null;
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch(
          `${backend_url}/user/single-user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const result = await response.json();
        setUserRole(result.data.role);
      } catch (error) {
        console.log("Error fetching user details");
      }
    };
    if (userId) fetchUserRole();
  }, [userId]);

  const CheckAdmin = ({ element }) => {
    const navigate = useNavigate();
    const { loggedIn } = useContext(LoginContext);
    const userId = localStorage.getItem("userId");
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
      const storedUserRole = localStorage.getItem("userRole");
      if (storedUserRole) {
        setUserRole(storedUserRole);
      }
    }, []); // Run this once on mount to load userRole from localStorage

    useEffect(() => {
      if (!loggedIn || !userId) {
        navigate("/login", { replace: true });
      } else if (userRole === "user") {
        navigate("/home", { replace: true });
      } else if (userRole === "admin") {
        navigate("/admin", { replace: true });
      }
    }, [userRole, loggedIn, userId, navigate]); // Watch all dependencies

    if (userRole === null) return <p>Loading...</p>; // Loading state while waiting for userRole

    return element;
  };

  useEffect(() => {
    if (userRole !== null && userRole !== "") {
      // console.log(userRole);
    }
  }, [userRole]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* User side routing */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<AfterLogin element={<Login />} />} />
          <Route path="home" element={<AfterLogin element={<Home />} />} />
          <Route path="paymentsuccess" element={<PaymentSuccess />} />
          <Route
            path="profile"
            element={
              userId ? <Profile /> : <Navigate to="/login" replace={false} />
            }
          />
          <Route
            path="profile-update"
            element={
              userId ? (
                <ProfileUpdate />
              ) : (
                <Navigate to="/login" replace={false} />
              )
            }
          />
          <Route path="signup" element={<AfterLogin element={<Signup />} />} />
          <Route path="product-details/:id" element={<SingleProduct />} />
          <Route path="thank" element={<Thank />} />
          <Route path="product" element={<Products />} />
          <Route path="cart" element={<BeforeLogin element={<Cart />} />} />
          <Route
            path="checkout"
            element={<BeforeLogin element={<Checkout />} />}
          />
          <Route path="checkout-form" element={<CheckoutForm />} />
          <Route
            path="/delivery-details"
            element={
              <CheckoutForm
                cartItems={[{ product: "123", price: 50, quantity: 2 }]}
              />
            }
          />
          <Route path="/thank-you/:orderId" element={<ThankYou />} />
          <Route path="/form" element={<UserForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Admin Side Routing */}
        <Route
          path="/admin/"
          element={<CheckAdmin element={<AdminLayout />} />}
          // element={<CheckAdmin element={<AdminLayout />} />}
        >
          <Route index element={<CheckAdmin element={<Dashboard />} />} />
          <Route
            path="product"
            element={<CheckAdmin element={<D_Product />} />}
          />
          <Route
            path="add-product"
            element={<CheckAdmin element={<DAdd_Product />} />}
          />
          <Route
            path="product-detail/:id"
            element={<CheckAdmin element={<DUpdate_Product />} />}
          />
          <Route
            path="category"
            element={<CheckAdmin element={<D_Category />} />}
          />
          <Route
            path="add-category"
            element={<CheckAdmin element={<DAdd_Category />} />}
          />
          <Route
            path="update-category/:id"
            element={<CheckAdmin element={<DUpdate_Category />} />}
          />
          <Route path="users" element={<CheckAdmin element={<D_User />} />} />
          <Route
            path="orders"
            element={<CheckAdmin element={<D_Orders />} />}
          />
          <Route
            path="transcation"
            element={<CheckAdmin element={<D_Transaction />} />}
          />
          <Route
            path="history"
            element={<CheckAdmin element={<History />} />}
          />
          <Route path="form" element={<CheckAdmin element={<Form />} />} />
          <Route path="test" element={<CheckAdmin element={<Test />} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </>
    )
  );

  return (
    <>
      <LoadingProvider>
        <Loader />
        <OrderProvider>
          <LoginContextProvider>
            <Suspense
              fallback={
                <div className="bg-danger h-100 w-100 d-flex align-items-center justify-content-center">
                  Loading...
                </div>
              }
            >
              <RouterProvider router={router} />
            </Suspense>
          </LoginContextProvider>
        </OrderProvider>
      </LoadingProvider>
    </>
  );
}

export default App;
