import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Autoplay,
  Pagination,
  Thumbs,
  FreeMode,
} from "swiper/modules";
import { useEffect, useState } from "react";
import "swiper/css/free-mode";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import { errorMessage, successMessaage } from "../Utils/Toastify";

const SingleProduct = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const { id } = useParams(); //product Id

  const singleProductApi = `${backend_url}/product/product-details/${id}`;
  const categoryApi = `${backend_url}/category/all`;
  const reviewApi = `${backend_url}/review/add`;
  useEffect(() => {
    const singleProduct = async () => {
      const response = await fetch(singleProductApi);
      // console.log(await response.json());
      const result = await response.json();
      if (!response.ok) {
        console.log("Soemthing went wrong while fetch single product");
      }

      setProduct(result.product);
    };
    singleProduct();
  }, []);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(categoryApi);
        const result = await response.json();

        if (!response.ok) {
          console.error("Something went wrong while fetching categories.");
          return;
        }

        setCategories(result.categories); // Assuming API returns { categories: [...] }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (product.categories && categories.length > 0) {
      const matchedNames = [];

      product.categories.forEach((prodCat) => {
        categories.map((allcate) => {
          if (allcate._id == prodCat) {
            // console.log(allcate.name, allcate._id, prodCat);
            matchedNames.push(allcate.name);
          }
        });
      });

      setCategoryNames(matchedNames); // Set the matched names in categoryNames state
    }
  }, [product, categories]);

  // image
  useEffect(() => {
    if (product && (product.images || product.featuredImage)) {
      const featuredImage = product.featuredImage || "";

      // Combine featuredImage (or empty string) with other images
      const updatedImages = [featuredImage, ...(product.images || [])];
      setImages(updatedImages);
    }
  }, [product]);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const image = localStorage.getItem("photo");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");

  const handleAddToCart = async (
    productId,
    productName,
    productImage,
    price
  ) => {
    if (!userId) {
      errorMessage("User not logged in! Please log in to add items to cart.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    const cartData = {
      userId,
      productId,
      name: productName,
      image: productImage,
      price,
      quantity: 1,
    };
    console.log(cartData, "cart data single produdt cldfja");

    try {
      const response = await fetch(`${backend_url}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });

      const result = await response.json();
      if (response.ok) {
        successMessaage("Product added to cart successfully!");
      } else {
        errorMessage(
          `Failed to add to cart (Maybe your are not login--77): ${result.message}`
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      errorMessage("Something went wrong. Please try again later.");
    }
  };

  // Add Revie
  const handleAddReview = async () => {
    try {
      const newReview = {
        user: userId,
        product: id,
        review,
        image,
        email,
        name,
      };

      const response = await fetch(reviewApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      const data = await response.json();

      if (response.ok) {
        successMessaage("Review added successfully!");

        // Clear the input field
        setReview("");

        // Update the state immediately by adding the new review
        setReviews((prevReviews) => [...prevReviews, newReview]);
      } else {
        errorMessage(`Failed to add review: ${data.message}`);
      }
    } catch (error) {
      errorMessage(`Error adding review: ${error.message}`);
    }
  };

  useEffect(() => {
    const gettingReview = async () => {
      const response = await fetch(`${backend_url}/review/get/${id}`);
      const result = await response.json();
      setReviews(result.data);
    };
    gettingReview();
  }, []);

  return (
    <div className="singleProduct">
      <div className="container">
        <div className="row justify-content-center gap-3">
          <div className="col-lg-5 col-xl-5 col-md-12 col-sm-12">
            <div className="left">
              <Swiper
                slidesPerView={1}
                speed={1000}
                centeredSlides={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay, Pagination, Navigation, Thumbs, FreeMode]}
                className="mySwiper2 mainDiv"
                loop={true}
                navigation={true}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
              >
                {images &&
                  images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img src={`${image.imageUrl}`} alt={product.name} />
                    </SwiperSlide>
                  ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper thumbaiDiv"
              >
                {images &&
                  images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img src={`${image.imageUrl}`} alt={product.name} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6 col-md-12 col-sm-12 p-3">
            <div className="product-details-page">
              <h5 className="breadcrum-detaill-page">
                <NavLink to="/">Home</NavLink> / <span>{product.name}</span>
              </h5>
              <h3 className="productNam">{product.name}</h3>
              <p className="stars">⭐⭐⭐⭐⭐</p>
              <h4 className="price">
                <span className="sellingPrice">
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                  {product.selling_price}
                </span>
                <span className="regularPrice">
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                  {product.regular_price}
                </span>
              </h4>
              <p className="description">{product.description}</p>
              <h4 className="category">
                {categoryNames ? (
                  categoryNames.map((category, index) => (
                    <div key={index}>
                      <span>{category}</span>
                    </div>
                  ))
                ) : (
                  <span>uncategorized</span>
                )}
              </h4>
              <p className="sku">sku:{product.sku}</p>

              <NavLink
                className="btn btn-outline-danger text-uppercase rounded-5 btn-sm px-5"
                onClick={() =>
                  handleAddToCart(
                    product._id,
                    product.name,
                    product.featuredImage.imageUrl,
                    product.selling_price
                  )
                }
                style={{ fontSize: "11px" }}
              >
                Add to Cart
              </NavLink>
              <button
                className="buyNowSignleProduct btn btn-outline-success text-uppercase rounded-5 btn-sm px-5 mx-2"
                style={{ fontSize: "11px" }}
              >
                Buy Now
              </button>
              <ul className="SocialLins d-flex gap-3 mt-4 p-0">
                <li>
                  <i className="fa-brands fa-whatsapp"></i>
                </li>
                <li>
                  <i className="fa-brands fa-whatsapp"></i>
                </li>
                <li>
                  <i className="fa-brands fa-whatsapp"></i>
                </li>
                <li>
                  <i className="fa-brands fa-whatsapp"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container product-detail-review-section mt-3 pt-5">
        <div className="row">
          <div className="col-12 inputSection">
            <h4>Add Review</h4>
            <input
              type="text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <button onClick={handleAddReview}>Add Review</button>
          </div>
          <div className="col-12d">
            {reviews?.length > 0 ? (
              reviews.map((review, index) => (
                <div className="ClientReview_Card border rounded" key={index}>
                  <div className="ClientReview_Top">
                    <div className="ClientReview_Pfp"></div>
                    <img
                      src={`${review?.uimage}`}
                      alt="userImage"
                    />
                  </div>
                  <div className="ClientReview_Name">{review?.name}</div>
                  <p className="userEmail">{review?.email}</p>
                  <div className="ClientReview_Body">{review?.review}</div>
                </div>
              ))
            ) : (
              <h5 className="fw-normal fs-2 p-5 text-center text-uppercase">
                No Reviews
              </h5>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
