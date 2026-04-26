import { Card, CardContent } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";
import { CheckCircle } from "lucide-react";

const InvoiceDashboard = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="p-6 max-w-lg mx-auto shadow-lg border border-gray-300 bg-white rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Update 2.4.0 - New Features Soon
          </h2>
          <p className="text-gray-600 mb-3 text-center">
            Users will get the following features
          </p>
          <List className="space-y-3">
            {[
              "Enhanced QR Code Generation",
              "Improved Print Functionality",
              "Search Functionality",
              "History",
              "Updated UI/UX",
              "Better Performance",
              "Added Support for Multiple Invoices",
              "Added Support for Multiple Earnings Categories",
              "Added Support for Multiple Earnings Subcategories",
            ].map((feature, index) => (
              <ListItem key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
                <CheckCircle className="text-green-500 w-6 h-6" />
                <span className="text-gray-700 text-lg">{feature}</span>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDashboard;