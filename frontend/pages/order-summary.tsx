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
    return <div style={{ fontSize: "1.25rem", fontWeight: "600" }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "1.5rem", gap: "2rem" }}>
      <div
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: "1.5rem",
          backgroundColor: "white",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb" }}>Order Summary</h1>
        </div>

        <div style={{ gap: "1rem" }}>
          <div>
            <h2 style={{ fontWeight: "600", fontSize: "1.25rem" }}>
              Order Number: {orderDetails.orderNumber}
            </h2>
            <p style={{ fontSize: "1rem" }}>Customer Name: {orderDetails.customerName}</p>
            <p style={{ fontSize: "1rem" }}>Phone: {orderDetails.phone}</p>
            <p style={{ fontSize: "1rem" }}>Mobile: {orderDetails.mobile}</p>
            <p style={{ fontSize: "1rem" }}>Event Type: {orderDetails.type}</p>
            <p style={{ fontSize: "1rem" }}>
              Special Request: {orderDetails.specialRequest || "N/A"}
            </p>
            <p style={{ fontSize: "1rem" }}>
              Order Date: {new Date(orderDetails.orderDate).toLocaleDateString()}
            </p>
          </div>

          <div style={{ borderBottom: "1px solid #d1d5db", padding: "1rem 0" }}>
            <h3 style={{ fontWeight: "600", fontSize: "1.25rem" }}>Items:</h3>
            {orderDetails.items.map((item: Item, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0",
                  borderBottom: index < orderDetails.items.length - 1 ? "1px solid #d1d5db" : "none",
                }}
              >
                <span style={{ fontWeight: "500", fontSize: "1rem" }}>
                  {item.itemName} ({item.quantity} {item.unit})
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1rem", fontWeight: "600" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  {item.cutWanted && (
                    <span style={{ fontSize: "0.875rem", color: "#16a34a" }}>(Cut Wanted)</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "1.25rem", marginTop: "1rem" }}>
            <span>Packaging Fee</span>
            <span style={{ fontSize: "1rem" }}>${orderDetails.packagingFee.toFixed(2)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.5rem", marginTop: "1rem" }}>
            <span>Total</span>
            <span style={{ fontSize: "1.5rem" }}>${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button
            onClick={handlePrint}
            style={{
              cursor: "pointer",
              padding: "0.5rem 1.5rem",
              backgroundColor: "#2563eb",
              color: "white",
              fontSize: "1rem",
              fontWeight: "700",
              borderRadius: "0.375rem",
              border: "none",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}
