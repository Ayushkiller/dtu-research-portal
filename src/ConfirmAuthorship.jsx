import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom"; 
import API from "./api/axios";

const ConfirmAuthorship = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmAuthorship = async () => {
      setLoading(true);

      const submissionId = searchParams.get("submissionId");
      const token = searchParams.get("token");

      if (!submissionId || !token) {
        setStatus("Invalid confirmation link.");
        setLoading(false);
        return;
      }

      try {
        // Make API call to confirm authorship
        const response = await API.post("/research-author-email/confirm-authorship", {
          submissionId,
          token,
        });

        if (response.data.success) {
          setStatus("Authorship successfully confirmed! 🎉");
        } else {
          setStatus(response.data.message || "Failed to confirm authorship.");
        }
      } catch (error) {
        setStatus("An error occurred while confirming authorship.");
      }

      setLoading(false);
    };

    confirmAuthorship();
  }, [searchParams]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {loading ? (
        <p>Processing your confirmation...</p>
      ) : (
        <div>
          <h1>{status}</h1>
          {status === "Authorship successfully confirmed! 🎉" && (
            <p>Thank you for confirming your authorship!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfirmAuthorship;
