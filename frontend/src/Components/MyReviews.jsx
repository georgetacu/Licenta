import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyReviews({ user }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) return;

    axios.post("http://localhost/Licenta/backend/getUserReviews.php", {
      user_id: user.id,
    })
    .then(res => {
      if (Array.isArray(res.data)) {
        setReviews(res.data);
      } else {
        setReviews([]);
      }
    })
    .catch(err => {
      console.error("Eroare la incarcarea recenziilor", err);
    });
  }, [user]);

  return (
    <div className="container py-5">
      <h3 className="mb-4">Comentariile mele</h3>
      {reviews.length === 0 ? (
        <div className="alert alert-info text-center">
          Nu ai nicio recenzie scrisa.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {reviews.map((review) => (
            <div key={review.id} className="card shadow-sm w-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2">Rating: {review.rating} / 5</h5>
                <p className="card-text mb-2">{review.comment || "Fara comentariu"}</p>
                <p className="mb-1"><strong>Service Auto:</strong> {review.auto_service_name || "Nespecificat"}</p>
                <p className="text-muted small mb-0 mt-auto">
                  Programare la: {new Date(review.appointment_datetime).toLocaleDateString('ro-RO', {
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
