import { useState } from "react";
import axios from "axios";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/subscribe", { email });
      setFeedback("Subscribed successfully!");
      setEmail("");
    } catch {
      setFeedback("Failed to subscribe.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h2>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Subscribe
        </button>
      </form>
      {feedback && <p className="mt-2">{feedback}</p>}
    </div>
  );
}
