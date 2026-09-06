export type Special = {
  id: string;
  price: string;
  title: string;
  description: string;
  icon: string;
  href?: string;
  footnote?: "combo" | "cleanout";
};

// Update monthly. Keep in sync with the printed door-hanger specials.
export const specials: Special[] = [
  {
    id: "drain-cleaning",
    price: "$99",
    title: "Drain Cleaning",
    description: "Cable clearing for any accessible clean-out, most homes done same visit.",
    icon: "Droplets",
    href: "/services/drain-cleaning",
    footnote: "cleanout",
  },
  {
    id: "service-call",
    price: "$50 off",
    title: "Any Service Call",
    description: "Applied to any repair, inspection, or cleaning we quote on site.",
    icon: "Wrench",
    footnote: "combo",
  },
  {
    id: "camera-inspection",
    price: "$149",
    title: "Camera Inspection",
    description: "Full HD video survey of your line, plain-language findings included.",
    icon: "Camera",
    href: "/services/sewer-inspection",
    footnote: "combo",
  },
];

export const specialsFootnotes: Record<NonNullable<Special["footnote"]>, string> = {
  combo: "Offers cannot be combined and must be mentioned when scheduling.",
  cleanout: "Cable clearing only, from an accessible clean-out.",
};
