export type ImageAsset = {
  src: string;
  alt: string;
  label?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  overview: string;
  heroImage: string;
  duration: string;
  area: string;
  focus: string;
  materials: string[];
  gallery: ImageAsset[];
  drawings: ImageAsset[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    rating: number;
  };
  details: {
    title: string;
    body: string;
  }[];
};

export type PortfolioData = {
  owner: {
    name: string;
    studio: string;
    tagline: string;
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    socials: { label: string; href: string }[];
  };
  hero: {
    headline: string;
    description: string;
    cta: string;
    image: string;
  };
  about: {
    label: string;
    heading: string;
    bio: string[];
    experienceStartYear: number;
    education: string;
    school: string;
    coursework: string[];
    skills: string[];
    specialties: string[];
    certifications: string[];
  };
  services: {
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  testimonials: {
    quote: string;
    author: string;
    role: string;
    rating: number;
  }[];
  process: { title: string; description: string }[];
  categories: string[];
  projects: Project[];
};

export const portfolioData: PortfolioData = {
  owner: {
    name: "Diya Jain",
    studio: "Diya Jain Studio",
    tagline: "Luxury interiors shaped by light, material, and intention.",
    email: "studio@diyajain.com",
    phone: "+91 98765 43210",
    whatsapp: "+919876543210",
    location: "Lower Parel, Mumbai, India",
    socials: [
      { label: "Instagram", href: "#" },
      { label: "Pinterest", href: "#" },
      { label: "LinkedIn", href: "#" }
    ]
  },
  hero: {
    headline: "Spaces that breathe and endure",
    description:
      "Crafting interiors where beauty meets intention, each project a dialogue between light, material, and the people who inhabit them.",
    cta: "View selected works",
    image: "/media/extra/1.png"
  },
  about: {
    label: "About the Designer",
    heading: "Designing with soul and precision",
    bio: [
      "Diya Jain is an interior designer whose work bridges the tactile warmth of organic materials with the discipline of architectural thinking. Her studio creates residences, hospitality projects, and refined cultural spaces with a quiet luxury point of view.",
      "Each commission begins with listening: how a client moves through space, what textures they seek, and what kind of calm they need. The result is interiors that feel deeply personal and beautifully resolved."
    ],
    experienceStartYear: 2024,
    education: "Bachelor of Interior Design",
    school: "NIFD Global, Indore",
    coursework: [
      "Interior Design Principles",
      "Space Planning",
      "Color Theory",
      "Materials and Textiles",
      "CAD Drafting",
      "Design History"
    ],
    skills: [
      "AutoCAD technical drawings",
      "SketchUp 3D spatial visualization",
      "Detailed floor plans and architectural elevations",
      "Advanced 3D renderings and presentation graphics"
    ],
    specialties: [
      "Material selection and specification",
      "Finishes and surface treatments",
      "Furniture and fixture curation",
      "Space planning and flow optimization"
    ],
    certifications: ["Interior Design, NIFD Global", "CAD Drafting", "3D Visualization"]
  },
  services: {
    title: "Design services and expertise",
    description:
      "From a single room to an entire estate, the studio offers a considered, full-spectrum approach to interior design.",
    items: [
      {
        title: "Interior Design Consultation",
        description:
          "Bespoke guidance on aesthetic direction, layout priorities, palette, and material strategy."
      },
      {
        title: "Space Planning",
        description:
          "Thoughtful spatial organisation that maximises flow, light, storage, and daily comfort."
      },
      {
        title: "3D Visualization",
        description:
          "Immersive renderings and presentation visuals that help clients see the design before execution."
      },
      {
        title: "Renovation and Styling",
        description:
          "Expert guidance on finishes, fixtures, furniture, contractor coordination, and final styling."
      },
      {
        title: "Hospitality and Commercial",
        description:
          "Hotels, restaurants, studios, and offices that balance brand identity with human comfort."
      },
      {
        title: "Furniture and Object Curation",
        description:
          "Sourcing pieces with provenance, personality, and proportion for a layered interior."
      }
    ]
  },
  testimonials: [
    {
      quote:
        "Diya did not just design our home, she gave it a soul. Every room feels like it was always meant to be exactly as it is.",
      author: "Priya & Ravi Mehta",
      role: "The Amber Residence, Mumbai",
      rating: 5
    },
    {
      quote:
        "The home theater feels cinematic without feeling heavy. The acoustics, lighting, and materials are beautifully balanced.",
      author: "Private Client",
      role: "Home Theater",
      rating: 5
    }
  ],
  process: [
    {
      title: "Discovery",
      description:
        "An intimate conversation about how you inhabit space, your needs, desires, and the life you want to live."
    },
    {
      title: "Concept",
      description:
        "A visual and material narrative is crafted: mood, palette, proportion, and atmosphere defined."
    },
    {
      title: "Design",
      description:
        "Detailed plans, 3D visualisations, and curated selections bring the concept to life with precision."
    },
    {
      title: "Realisation",
      description:
        "Hands-on oversight of every installation detail, ensuring the vision is executed with clarity."
    }
  ],
  categories: ["Residential", "Commercial", "Hospitality", "Renovation", "Entertainment"],
  projects: [
    {
      slug: "amber-residence",
      title: "The Amber Residence",
      category: "Residential",
      location: "Mumbai, India",
      year: "2023-2024",
      summary:
        "A contemporary residence celebrating warm earth tones, natural materials, and abundant natural light.",
      overview:
        "A contemporary residential project celebrating warm earth tones, natural materials, and abundant natural light. The Amber Residence features open living spaces that flow into intimate zones for relaxation, with a luxurious master bedroom, custom furnishings, and elegant finishing details.",
      heroImage: "/media/project1/3d/1.png",
      duration: "8-12 Months",
      area: "3,200 sq ft",
      focus: "Contemporary Luxury",
      materials: [
        "Teak wood flooring",
        "Cream marble countertops",
        "Brass fixtures",
        "Linen upholstery",
        "Handwoven textiles"
      ],
      gallery: [
        { src: "/media/project1/3d/1.png", alt: "Master Bedroom", label: "Master Bedroom" },
        {
          src: "/media/project1/3d/c.png",
          alt: "Bedroom and Wardrobe",
          label: "Bedroom and Wardrobe"
        }
      ],
      drawings: [
        {
          src: "/media/project1/2d/1.png",
          alt: "Elevation A - Master Bedroom",
          label: "Elevation A - Master Bedroom"
        },
        {
          src: "/media/project1/2d/2.png",
          alt: "Elevation C - Wardrobe Storage",
          label: "Elevation C - Wardrobe Storage"
        }
      ],
      testimonial: {
        quote:
          "Every detail feels considered, from the light to the texture under hand. The home is calm, warm, and deeply personal.",
        author: "Priya & Ravi Mehta",
        role: "Residential client",
        rating: 5
      },
      details: [
        {
          title: "Design Concept",
          body:
            "Amber hues create a cohesive narrative connected to natural surroundings. Each room flows with carefully curated artwork and bespoke furniture."
        },
        {
          title: "Materials and Finishes",
          body:
            "Warm ambers, soft creams, deep terracotta, teak flooring, cream marble, brass details, linen, and handwoven textiles."
        },
        {
          title: "Craftsmanship",
          body:
            "Custom headboard geometry, tailored wardrobe systems, pendant lighting, and ambient cove lighting bring depth and comfort."
        }
      ]
    },
    {
      slug: "home-theater",
      title: "Home Theater",
      category: "Entertainment",
      location: "Private Residence",
      year: "2024",
      summary:
        "A sophisticated private entertainment space with acoustic optimization, premium seating, and ambient lighting.",
      overview:
        "A sophisticated home theater designed for the ultimate cinematic experience. Acoustically optimized interiors, premium seating, and ambient lighting create an immersive atmosphere that balances technical excellence with refined aesthetic design.",
      heroImage: "/media/project2/3d/1.png",
      duration: "4-6 Months",
      area: "600 sq ft",
      focus: "Luxury Entertainment",
      materials: [
        "Acoustic fabric panels",
        "Blackout velvet curtains",
        "Leather seating",
        "Walnut accents",
        "Brushed metal details"
      ],
      gallery: [
        { src: "/media/project2/3d/1.png", alt: "Theater rendering 1", label: "Theater View 1" },
        { src: "/media/project2/3d/2.png", alt: "Theater rendering 2", label: "Theater View 2" }
      ],
      drawings: [
        { src: "/media/project2/2d/1.png", alt: "Floor Plan Layout", label: "Floor Plan Layout" },
        { src: "/media/project2/2d/2.png", alt: "Wall Elevation", label: "Wall Elevation" }
      ],
      testimonial: {
        quote:
          "It feels immersive and polished, with every technical requirement hidden inside a very elegant room.",
        author: "Private Client",
        role: "Entertainment space",
        rating: 5
      },
      details: [
        {
          title: "Design Concept",
          body:
            "The theater focuses on acoustic excellence and visual sophistication, pairing sound-absorbing treatments with premium finishes."
        },
        {
          title: "Materials and Finishes",
          body:
            "Acoustic panels, blackout velvet, custom tiered seating, walnut wood accents, brushed metal, and integrated ambient lighting."
        },
        {
          title: "Technical Excellence",
          body:
            "Professional acoustic treatment, infrared control systems, motorized coverings, integrated cable management, and optimized climate control."
        }
      ]
    }
  ]
};
