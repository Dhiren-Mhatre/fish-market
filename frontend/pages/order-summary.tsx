import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Item {
  itemName: string;
  quantity: number;
  unit: string;
  price: number;
  cutWanted?: boolean;
}

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  phone: string;
  mobile: string;
  type: string;
  specialRequest?: string;
  orderDate: string;
  items: Item[];
  packagingFee: number;
  total: number;
}

export default function OrderSummaryPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const storedOrderDetails = localStorage.getItem("orderDetails");
    if (storedOrderDetails) {
      setOrderDetails(JSON.parse(storedOrderDetails) as OrderDetails);
    }
  }, []);

  const handlePrint = () => {
    window.print();
    window.location.href = "/"; // Redirect to main page after printing
  };

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-lg">Order Number: {orderDetails.orderNumber}</h2>
              <p className="text-sm">Customer Name: {orderDetails.customerName}</p>
              <p className="text-sm">Phone: {orderDetails.phone}</p>
              <p className="text-sm">Mobile: {orderDetails.mobile}</p>
              <p className="text-sm">Order Type: {orderDetails.type}</p>
              <p className="text-sm">Special Request: {orderDetails.specialRequest || "N/A"}</p>
              <p className="text-sm">
                Order Date: {new Date(orderDetails.orderDate).toLocaleDateString()}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg">Items:</h3>
              {orderDetails.items.map((item: Item, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="font-medium">
                    {item.itemName} ({item.quantity} {item.unit})
                  </span>
                  <div className="flex items-center space-x-2">
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                    {item.cutWanted && <span className="text-sm text-green-500">(Cut Wanted)</span>}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Packaging Fee</span>
              <span>${orderDetails.packagingFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={handlePrint} className="w-full mt-4">
            Print Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
