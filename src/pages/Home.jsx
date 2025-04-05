import { NavLink, useNavigate } from "react-router-dom";
import Banner2 from "../../public/RBanner2.webp";
import laptop from "../../public/categories/laptops.webp";
import phone from "../../public/categories/phones.webp";
import shoes from "../../public/categories/Shoes.webp";
import tshirts from "../../public/categories/Tshirt.webp";
import watches from "../../public/categories/watches.webp";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useEffect, useReducer, useState } from "react";

import { errorMessage, successMessaage } from "../Utils/Toastify";

const Home = () => {
  const [myProducts, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const allProductApi = "product/all";
  const categoriesApi = "category/all";
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${backend_url}/${allProductApi}`);
        const result = await response.json();
        // Filter only active products
        const activeProducts = result.products.filter(
          (product) => product.status === "active"
        );
        setProducts(activeProducts);
      } catch (err) {
        console.error(`Error fetching products: ${err}`);
      }
    };

    fetchAllProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${backend_url}/${categoriesApi}`);
        const result = await response.json();
        // Create a map of category ID to category name
        const categoryMap = result.categories.reduce((acc, category) => {
          acc[category._id] = category.name;
          return acc;
        }, {});
        setCategories(result.categories);
        // console.log(result, "::respone of cate");
      } catch (err) {
        console.log(`Error fetching categories ${err}`);
      }
    };

    fetchCategories();
  }, [categoriesApi]);

  // useEffect(()=>{
  //   console.log(categories,"::category")
  // },[categories])

  const userId = localStorage.getItem("userId");
  // console.log(userId);
  const handleAddToCart = async (
    productId,
    productName,
    productImage,
    price
  ) => {
    // console.log(productImage, productImage, productId);

    if (!userId) {
      errorMessage("User not logged in! Please log in to add items to cart.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }

    const cartData = {
      userId,
      productId,
      name: productName,
      image: productImage,
      price,
      quantity: 1,
    };

    try {
      const response = await fetch(`${backend_url}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });

      // console.log("add to cart response::", response);

      const result = await response.json();
      if (response.ok) {
        successMessaage("Product added to cart successfully!");
      } else {
        errorMessage(`Failed to add to cart123: ${result.message}`);
      }
    } catch (error) {
      console.error("Error adding to cart789:", error);
      errorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="home">
      {/* Banner */}
      <div className="banner">
        <img src={Banner2} alt="Banner" className="w-100" />
      </div>

      {/* Categories */}
      <div className="categorySection">
        <div className="container">
          <h1 className="mainHeading">Categories</h1>
          <div className="row justify-content-center">
            {categories &&
              categories.map((category, index) => (
                <div
                  className="col-lg-2 col-xl-2 col-md-3 col-sm-4"
                  key={index}
                >
                  <NavLink to={""}>
                    <img
                      src={`${category.photo}`}
                      alt={category.name || "Category"}
                    />
                    <h4>{category.name}</h4>
                  </NavLink>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container home-products my-5">
        <h4 className="text-center p-5">Our Products</h4>
        <div className="row justify-content-center">
          {myProducts.length > 0 ? (
            myProducts.map((product) => (
              <div
                key={product.sku}
                className="col-lg-3 col-md-4 col-sm-6 mb-4"
              >
                <Card style={{ width: "18rem" }}>
                  <Card.Img
                    variant="top"
                    src={`${product.featuredImage.imageUrl}`}
                    alt={product.name}
                  />
                  <Card.Body className="text-center">
                    <Card.Title className="category-home-product">
                      {product.categories &&
                        product.categories.map((categoryId, index) => (
                          <span key={index} className="mx-1">
                            {categories[categoryId] || "Unknown Category"}
                          </span>
                        ))}
                    </Card.Title>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="price">
                      <span className="regular-price">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                        {product.regular_price}
                      </span>
                      {product.selling_price && (
                        <span className="selling-price mx-2">
                          <i className="fa-solid fa-indian-rupee-sign"></i>
                          {product.selling_price}
                        </span>
                      )}
                    </Card.Text>
                    <Card.Text className="home-product-description">
                      {product.description}
                    </Card.Text>
                    <Button
                      variant="outline-primary mx-2 rounded-5 px-4"
                      style={{ fontSize: "12px" }}
                      onClick={() =>
                        handleAddToCart(
                          product._id,
                          product.name,
                          product.featuredImage.imageUrl,
                          product.selling_price
                        )
                      }
                    >
                      Add To Cart
                    </Button>
                    <NavLink
                      className="btn btn-outline-warning rounded-5 px-4"
                      to={`product-details/${product._id}`}
                      style={{ fontSize: "12px" }}
                    >
                      View Product
                    </NavLink>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p className="text-center">No active products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
