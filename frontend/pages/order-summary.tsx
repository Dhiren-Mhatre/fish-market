import { useEffect, useState } from "react";

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
    return <div className="text-xl font-semibold">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Order Summary</h1>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-xl">Order Number: {orderDetails.orderNumber}</h2>
            <p className="text-lg">Customer Name: {orderDetails.customerName}</p>
            <p className="text-lg">Phone: {orderDetails.phone}</p>
            <p className="text-lg">Mobile: {orderDetails.mobile}</p>
            <p className="text-lg">Order Type: {orderDetails.type}</p>
            <p className="text-lg">Special Request: {orderDetails.specialRequest || "N/A"}</p>
            <p className="text-lg">
              Order Date: {new Date(orderDetails.orderDate).toLocaleDateString()}
            </p>
          </div>

          <div className="border-b border-gray-300 py-4">
            <h3 className="font-semibold text-xl">Items:</h3>
            {orderDetails.items.map((item: Item, index: number) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="font-medium text-lg">
                  {item.itemName} ({item.quantity} {item.unit})
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  {item.cutWanted && <span className="text-sm text-green-500">(Cut Wanted)</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-xl mt-4">
            <span>Packaging Fee</span>
            <span className="text-lg">${orderDetails.packagingFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-2xl mt-4">
            <span>Total</span>
            <span className="text-2xl">${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handlePrint}
            className="cursor-pointer py-2 px-6 bg-blue-600 text-white text-lg font-bold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}
