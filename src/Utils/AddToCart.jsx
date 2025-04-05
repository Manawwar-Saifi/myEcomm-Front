const addToCart = async (product) => {
  try {
    // Make an API call to add the product to the cart
    const response = await fetch("/api/cart/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "USER_ID", // Replace with the actual user ID
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1, // Default quantity
      }),
    });

    // Parse the JSON response
    const data = await response.json();

    // Check if the response is successful
    if (response.ok) {
      console.log("Product added to cart:", data.message);
    } else {
      console.error("Failed to add product to cart:", data.message);
    }
  } catch (error) {
    // Handle any network or other unexpected errors
    console.error("Error adding to cart:", error.message);
  }
};
