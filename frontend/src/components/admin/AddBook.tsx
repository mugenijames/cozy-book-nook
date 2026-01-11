import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = import.meta.env.VITE_API_URL;

export default function AddBook({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
  });

  const submit = async () => {
    await axios.post(`${API}/books`, {
      ...form,
      price: Number(form.price),
    });
    onAdded();
    setForm({ title: "", author: "", description: "", price: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Add New Book</h2>

      <div className="space-y-4">
        <Input placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <Input placeholder="Author" value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })} />

        <Textarea placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <Input placeholder="Price" type="number" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />

        <Button onClick={submit} className="w-full">
          Add Book
        </Button>
      </div>
    </div>
  );
}
