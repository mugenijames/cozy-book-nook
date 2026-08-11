// frontend/src/data/testimonials.ts

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  organization?: string;
  quote: string;
  rating: number;
  image: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "John Mwangi",
    role: "School Administrator",
    organization: "Education & Youth Development",
    quote:
      "David's approach to mentorship goes beyond motivation. He connects with young people, challenges them to think differently, and gives them practical tools they can apply in everyday life.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },

  {
    id: 2,
    name: "Grace Wanjiku",
    role: "Youth Mentor",
    organization: "Community Development",
    quote:
      "The conversations around identity, purpose and personal responsibility are incredibly relevant. David has a unique way of making difficult subjects simple and meaningful.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },

  {
    id: 3,
    name: "Peter Otieno",
    role: "Leadership Coach",
    organization: "Leadership & Transformation",
    quote:
      "What stands out about David is his passion for seeing people become better versions of themselves. His message is practical, inspiring and deeply focused on transformation.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },

  {
    id: 4,
    name: "Mary Njeri",
    role: "Program Coordinator",
    organization: "Youth Empowerment",
    quote:
      "David brings energy, clarity and authenticity whenever he speaks. His ability to engage young people and create meaningful conversations makes his work especially impactful.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },

  {
    id: 5,
    name: "Samuel Kariuki",
    role: "Community Leader",
    organization: "Community Outreach",
    quote:
      "His message about purpose and responsibility is something that people can carry with them long after an event is over. David genuinely cares about the people he serves.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  },

  {
    id: 6,
    name: "Anne Achieng",
    role: "Educator",
    organization: "Education & Mentorship",
    quote:
      "The sessions are engaging, practical and thought-provoking. David creates an environment where people feel encouraged to reflect, grow and take responsibility for their journey.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
  },
];