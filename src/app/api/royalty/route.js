export async function GET() {
  const royaltyData = {
    title: "Royalty Card",
    status: "Premium",
    icon: "👑",
    memberType: "Royal Member",
    description: "Exclusive Benefits",
    benefits: [
      "Priority Access",
      "Exclusive Events",
      "Special Discounts",
      "VIP Treatment",
      "Early Access to New Features",
    ],
  };

  return Response.json(royaltyData);
}
