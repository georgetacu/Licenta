import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost/Licenta/backend/getUserReviewsForOwners.php");
      if (Array.isArray(res.data)) {
        setReviews(res.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Eroare la incarcarea recenziilor", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4">Recenzii de la utilizatori</h3>

      {loading ? (
        <div className="alert alert-info text-center">Se incarca recenziile...</div>
      ) : reviews.length === 0 ? (
        <div className="alert alert-warning text-center">
          Nu exista recenzii disponibile.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {reviews.map((review) => (
            <div key={review.id} className="card shadow-sm w-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2">Rating: {review.rating} / 5</h5>
                <p className="card-text mb-2">{review.review_text || "Fara comentariu"}</p>
                <p className="mb-1"><strong>Utilizator:</strong> {review.user_name || "Necunoscut"}</p>
                <p className="mb-1"><strong>Service:</strong> {review.service_title || "Nespecificat"}</p>
                <p className="mb-1"><strong>Service Auto:</strong> {review.auto_service_name || "Nespecificat"}</p>
                <p className="text-muted small mt-auto mb-0">
                  Recenzie din: {new Date(review.created_at).toLocaleDateString('ro-RO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
