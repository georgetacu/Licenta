import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stări filtrare
  const [selectedAutoService, setSelectedAutoService] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

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

  // Extragem service-uri auto unice
  const uniqueAutoServices = Array.from(
    new Set(reviews.map(r => r.auto_service_name).filter(Boolean))
  );

  // Extragem servicii unice
  const uniqueServices = Array.from(
    new Set(reviews.map(r => r.service_title).filter(Boolean))
  );

  // Filtrare recenzii
  const filteredReviews = reviews.filter((r) => {
    const userMatch = r.user_name?.toLowerCase().includes(userFilter.toLowerCase());
    const ratingMatch = selectedRating === "" || Number(r.rating) === Number(selectedRating);
    const autoServiceMatch = selectedAutoService === "" || r.auto_service_name === selectedAutoService;
    const serviceMatch = selectedService === "" || r.service_title === selectedService;
    return userMatch && ratingMatch && autoServiceMatch && serviceMatch;
  });

  return (
    <div className="container py-5">
      <h3 className="mb-4">Recenzii de la utilizatori</h3>

      {/* Filtre inline */}
      <div className="d-flex gap-3 mb-4 flex-wrap" style={{ maxWidth: 900 }}>
        <div>
          <select
            className="form-select"
            value={selectedAutoService}
            onChange={(e) => setSelectedAutoService(e.target.value)}
            aria-label="Select service auto"
          >
            <option value="">Service Auto</option>
            {uniqueAutoServices.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            className="form-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            aria-label="Select service"
          >
            <option value="">Service</option>
            {uniqueServices.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Utilizator"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            aria-label="Filtru utilizator"
          />
        </div>

        <div>
          <select
            className="form-select"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            aria-label="Select rating"
          >
            <option value="">Rating</option>
            {[5,4,3,2,1].map((r) => (
              <option key={r} value={r}>
                {r} stele
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="alert alert-info text-center">Se incarca recenziile...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="alert alert-warning text-center">
          Nu exista recenzii disponibile pentru filtrele selectate.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredReviews.map((review) => (
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
