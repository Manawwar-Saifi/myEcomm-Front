import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { errorMessage, successMessaage } from "../Utils/Toastify";

import { NavLink, useNavigate } from "react-router-dom";

const Products = () => {
  const [myProducts, setProducts] = useState([]);

  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const allProductApi = `${backend_url}/product/all`;

  // Fetch products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(allProductApi);
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

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

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
          `Failed to add to cart (Maybe your are not login): ${result.message}`
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      errorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="products">
      <div className="container">
        <div className="row justify-content-end">
          <h1 className="mainHeading">Products</h1>

          <div className="col-lg-3 col-xl-3 col-md-6 col-sm-6"></div>

          {myProducts.length > 0 ? (
            myProducts.map((product) => (
              <div
                key={product.sku}
                className="col-sm-6 col-md-6 col-lg-3 col-xl-3  mt-4"
              >
                <div className="card">
                  <Card.Img
                    variant="top"
                    src={`${product.featuredImage.imageUrl}`}
                    style={{
                      width: "100%",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <h6>Regular Price &#8377;{product.regular_price}</h6>
                    <h5>Special Price &#8377;{product.selling_price}</h5>
                    <Card.Text>{product.description}</Card.Text>

                    <div className="row justify-content-evenly">
                      <Button
                        variant="outline-danger text-uppercase rounded-5 btn-sm px-2 col-6"
                        onClick={() =>
                          handleAddToCart(
                            product._id,
                            product.name,
                            product.featuredImage,
                            product.selling_price
                          )
                        }
                        style={{ fontSize: "11px" }}
                      >
                        Add to Cart
                      </Button>

                      <NavLink
                        className="btn btn-outline-warning col-4 rounded-5 text-uppercase"
                        to={`/product-details/${product._id}`}
                        style={{ fontSize: "12px" }}
                      >
                        View
                      </NavLink>
                    </div>
                  </Card.Body>
                </div>
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

export default Products;
