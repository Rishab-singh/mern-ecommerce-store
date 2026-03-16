import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(false);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {

      setLoading(true);
      setMessage("");
      setType("");

      const { data } = await API.get(`/products/${id}`);

      if (!data) {
        throw new Error("Product not found");
      }

      setProduct(data);

      // Fetch related products
      const res = await API.get("/products");

      const productsArray = res.data?.products || res.data || [];

      const related = productsArray.filter(
        (p) => p.category === data.category && p._id !== data._id
      );

      setRelatedProducts(related.slice(0, 4));

    } catch (err) {

      setType("error");
      setMessage("Failed to load product");

    } finally {

      setLoading(false);

    }
  };

  const addToCart = async () => {
    try {

      await API.post("/cart", {
        productId: id,
        quantity: 1
      });

      setType("success");
      setMessage("Added to cart ✅");

    } catch (err) {

      navigate("/login");

    }
  };

  const submitReview = async (e) => {

    e.preventDefault();

    try {

      await API.post(`/products/${id}/reviews`, {
        rating,
        comment
      });

      setType("success");
      setMessage("Review submitted ⭐");

      setRating(0);
      setComment("");

      fetchProduct();

    } catch (err) {

      setType("error");
      setMessage(
        err.response?.data?.message || "Failed to submit review"
      );

    }
  };

  const renderStars = (value) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {value >= i ? "⭐" : "☆"}
        </span>
      );
    }

    return stars;
  };

  if (loading) return <Loader />;

  if (!product) return <Message type="error" text="Product not found" />;

  return (

    <div className="max-w-6xl mx-auto p-6">

      {message && <Message type={type} text={message} />}

      {/* PRODUCT SECTION */}

      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE WITH ZOOM */}

        <div
          className="overflow-hidden rounded shadow"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
        >

          <img
            src={product.image || "https://via.placeholder.com/400"}
            alt={product.name}
            className={`w-full transition-transform duration-300 ${
              zoom ? "scale-125" : "scale-100"
            }`}
          />

        </div>

        {/* PRODUCT INFO */}

        <div>

          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-600 mt-2">
            {product.description}
          </p>

          <p className="text-2xl font-bold mt-4">
            ₹{product.price}
          </p>

          {/* Rating */}

          <div className="text-yellow-500 text-lg mt-2">
            {renderStars(product.rating || 0)}
          </div>

          <p className="text-sm text-gray-600">
            {product.numReviews || 0} reviews
          </p>

          {/* Stock */}

          {product.countInStock > 5 && (
            <p className="text-green-600 font-semibold mt-2">
              In Stock
            </p>
          )}

          {product.countInStock > 0 && product.countInStock <= 5 && (
            <p className="text-yellow-600 font-semibold mt-2">
              Only {product.countInStock} left
            </p>
          )}

          {product.countInStock === 0 && (
            <p className="text-red-600 font-semibold mt-2">
              Out of Stock
            </p>
          )}

          <button
            onClick={addToCart}
            className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Add to Cart
          </button>

          {/* REVIEW FORM */}

          <div className="mt-6 border-t pt-4">

            <h3 className="text-lg font-semibold mb-2">
              Write a Review
            </h3>

            <form
              onSubmit={submitReview}
              className="flex flex-col gap-3"
            >

              {/* STAR SELECTOR */}

              <div className="flex gap-2 text-3xl">

                {[1, 2, 3, 4, 5].map((star) => (

                  <span
                    key={star}
                    className={`cursor-pointer ${
                      (hover || rating) >= star
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </span>

                ))}

              </div>

              <textarea
                placeholder="Write your review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border p-2 rounded"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Submit Review
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* REVIEWS */}

      <div className="mt-12">

        <h2 className="text-2xl font-bold mb-4">
          Customer Reviews
        </h2>

        {!product.reviews || product.reviews.length === 0 ? (

          <p className="text-gray-500">
            No reviews yet
          </p>

        ) : (

          product.reviews.map((review) => (

            <div
              key={review._id}
              className="border-b py-4"
            >

              <strong>{review.name}</strong>

              <div className="text-yellow-500">
                {renderStars(review.rating)}
              </div>

              <p className="text-gray-600">
                {review.comment}
              </p>

            </div>

          ))

        )}

      </div>

      {/* RELATED PRODUCTS */}

      <div className="mt-16">

        <h2 className="text-2xl font-bold mb-6">
          Related Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {relatedProducts.map((p) => (

            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              className="border rounded p-3 cursor-pointer hover:shadow"
            >

              <img
                src={p.image || "https://via.placeholder.com/200"}
                className="h-32 w-full object-cover rounded"
              />

              <p className="font-semibold mt-2">
                {p.name}
              </p>

              <p className="text-sm text-gray-600">
                ₹{p.price}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}