"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import Logo from "@/components/logo.png";
const generateOrderNumber = () =>
  Math.floor(10000 + Math.random() * 90000).toString();

interface OrderItem {
  quantity: number;
  price: number;
  cutWanted: boolean;
  unit: string;
}

interface OrderItems {
  [category: string]: {
    [item: string]: OrderItem;
  };
}
interface OrderDetailItem {
  itemName: string;
  quantity: number;
  price: number;
  cutWanted: boolean;
  unit: string;
}

interface Item {
  _id: string;
  itemName: string;
  isActive: boolean;
  unit: string;
  price?: number;
}

interface Category {
  _id: string;
  categoryName: string;
  isActive: boolean;
  items: Item[];
}

export function ComprehensiveOrderForm() {
  const [orderItems, setOrderItems] = useState<OrderItems>({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [xmasChecked, setXmasChecked] = useState(false);
  const [nyeChecked, setNyeChecked] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [phone, setPhone] = useState("")
  const [mobile, setMobile] = useState("")
  const [phoneError, setPhoneError] = useState(false)
  const [mobileError, setMobileError] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhone(value)
    setPhoneError(value.length !== 10 && value.length > 0)
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setMobile(value)
    setMobileError(value.length !== 10 && value.length > 0)
  }

  const handlePhoneBlur = () => {
    if (phone.length !== 10 && phone.length > 0) {
       
      const phoneInput = document.getElementById("phone") as HTMLInputElement;
      phoneInput.focus();
    }
  }
  
  const handleMobileBlur = () => {
    if (mobile.length !== 10 && mobile.length > 0) {
       
      const mobileInput = document.getElementById("mobile") as HTMLInputElement;
    mobileInput.focus();
    }
  }
  

  

  const handleXmasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setXmasChecked(e.target.checked);
    if (e.target.checked) setNyeChecked(false);
  };

  const handleNyeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNyeChecked(e.target.checked);
    if (e.target.checked) setXmasChecked(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);

      try {
        const categoriesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
        );

        // Include prices in items if provided by backend
        const updatedCategories = categoriesResponse.data.map(
          (category: Category) => ({
            ...category,
            items: category.items.map((item: Item) => ({
              ...item,
              price: item.price || 0, // Add a default price if not included in response
            })),
          })
        );

        setCategories(updatedCategories);

        const uniqueOrderNumber = await generateOrderNumber();
        setOrderNumber(uniqueOrderNumber);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const calculateTotal = () => {
    let total = 0;
    Object.values(orderItems).forEach((category) => {
      Object.values(category).forEach((item) => {
        total += (item.quantity || 0) * (item.price || 0); // Multiply quantity by price from backend
      });
    });
    return total + 10; // Add packaging fee
  };

  const handleItemChange = (
    category: string,
    item: string,
    quantity: number,
    price: number,
    cutWanted: boolean = false,
    unit: string
  ) => {
    if (quantity < 0 || quantity > 100 || isNaN(quantity)) {
      alert("Item quantity must be numeric and less than or equal to 100.");
      return;
    }

    setOrderItems((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: {
          quantity: quantity || 0,
          price: price || 0, // Use price provided from backend
          cutWanted,
          unit,
        },
      },
    }));
  };

  const handleSubmit = async () => {
    const customerName = (
      document.getElementById("customer-name") as HTMLInputElement
    )?.value;
    const phone = (document.getElementById("phone") as HTMLInputElement)?.value;
    const mobile = (document.getElementById("mobile") as HTMLInputElement)
      ?.value;
    const specialRequest = (
      document.getElementById("special") as HTMLInputElement
    )?.value;

    const isValidPhoneNumber = (num: string) => /^\d{10}$/.test(num);

    if (!customerName || !phone || !mobile || (!xmasChecked && !nyeChecked)) {
      alert("Please fill all the required fields and acknowledge the terms!");
      return;
    }

    if (!isValidPhoneNumber(phone) || !isValidPhoneNumber(mobile)) {
      alert("Phone and mobile numbers must be numeric and exactly 10 digits.");
      return;
    }

    // Order details object with UUID
    const orderDetailsData = {
      orderNumber,
      customerName,
      phone,
      mobile,
      type: xmasChecked ? "XMAS" : "NYE",
      orderDate: new Date(date),
      specialRequest,
      items: [] as OrderDetailItem[], // Explicitly define the type for items
      subtotal: calculateTotal() - 10,
      packagingFee: 10,
      total: calculateTotal(),
    };

    // Add items to the orderDetailsData
    Object.entries(orderItems).forEach(([category, items]) => {
      Object.entries(items).forEach(([item, details]) => {
        orderDetailsData.items.push({
          itemName: item,
          quantity: details.quantity,
          price: details.price,
          cutWanted: details.cutWanted,
          unit: details.unit,
        });
      });
    });

    // Save user and order data
    const userData = {
      name: customerName,
      phone,
      mobile,
      orders: [orderNumber],
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        userData
      );
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order-details`,
        orderDetailsData
      );
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order-history`,
        {
          orderNumber,
          name: orderDetailsData.customerName,
          phone: orderDetailsData.phone,
          orderTotal: orderDetailsData.total,
          type: orderDetailsData.type,
        }
      );

      alert("Order submitted successfully!");
      setIsOrderSubmitted(true);

      // Store the order in localStorage for the Order Summary page
      localStorage.setItem("orderDetails", JSON.stringify(orderDetailsData));

      window.location.href = "/order-summary";
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-blue-200  space-y-8">
      <div className="border rounded-lg p-6">
        <div className="flex justify-center mb-6">
          <Image
            src={Logo} // Path relative to the 'public' directory
            alt="Logo"
            width={150} // Adjust width as needed
            height={150} // Adjust height as needed
            priority // Ensures the logo is loaded quickly
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ORDER FORM</h1>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              <Label htmlFor="xmas" className="font-bold">
                XMAS
              </Label>
              <input
                type="checkbox"
                id="xmas"
                checked={xmasChecked}
                onChange={handleXmasChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="nye" className="font-bold">
                NYE
              </Label>
              <input
                type="checkbox"
                id="nye"
                checked={nyeChecked}
                onChange={handleNyeChange}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input id="customer-name" className="w-full" />
            </div>
            <div>
            <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="text"
          value={phone}
          maxLength={10}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          className={`w-full ${phoneError ? "border-red-500" : ""}`}
        />
        {phoneError && (
          <p className="text-red-500 text-sm mt-1">
            Phone number must be exactly 10 digits.
          </p>
        )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
            <Label htmlFor="mobile">Mobile</Label>
        <Input
          id="mobile"
          type="text"
          value={mobile}
          maxLength={10}
          onChange={handleMobileChange}
          onBlur={handleMobileBlur}
          className={`w-full ${mobileError ? "border-red-500" : ""}`}
        />
        {mobileError && (
          <p className="text-red-500 text-sm mt-1">
            Mobile number must be exactly 10 digits.
          </p>
        )}
            </div>
            <div>
              <Label>Pick up Time</Label>
              <Input
                readOnly
                defaultValue="10am till 1pm"
                className="bg-gray-200 cursor-not-allowed w-full"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                readOnly
                value={date}
                className="bg-gray-200 cursor-not-allowed w-full"
              />
            </div>
          </div>

          <Separator />

          {categories
            .filter((category) => category.isActive)
            .map((category) => (
              <div key={category._id} className="space-y-4">
                <h3 className="font-bold text-xl">{category.categoryName}</h3>
                {category.items
                  .filter((item) => item.isActive)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-wrap items-center gap-2 sm:gap-4"
                    >
                      <Label className="w-full sm:w-auto text-lg flex-shrink-0 sm:flex-grow">
                        {item.itemName}
                      </Label>
                      <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                        <Input
                          className="w-20"
                          placeholder="Quantity"
                          type="number"
                          onChange={(e) =>
                            handleItemChange(
                              category.categoryName,
                              item.itemName,
                              parseInt(e.target.value, 10) || 0,
                              item.price || 0, // Pass the backend-provided price
                              false,
                              item.unit
                            )
                          }
                        />
                        <span className="text-black-800 font-bold whitespace-nowrap">
                          ${item.price || 0}
                        </span>
                      </div>
                      <span className="text-lg">{item.unit}</span>
                      {category.categoryName === "CRUSTACEANS" && (
                        <div className="flex items-center gap-2 ml-auto sm:ml-0">
                          <Label className="mr-2 whitespace-nowrap">
                            Cut Wanted
                          </Label>
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleItemChange(
                                category.categoryName,
                                item.itemName,
                                orderItems[category.categoryName]?.[
                                  item.itemName
                                ]?.quantity || 0,
                                10,
                                e.target.checked,
                                item.unit
                              )
                            }
                            checked={
                              orderItems[category.categoryName]?.[item.itemName]
                                ?.cutWanted || false
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}

          <Separator />

          <div>
            <Label htmlFor="special">Special Requests</Label>
            <Input id="special" className="mt-2 w-full" />
          </div>

          <div className="text-sm">
            <p>I agree to the terms and conditions by clicking submit button</p>
          </div>

          <Separator />

          <Card
            style={{
              margin: "1rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "0.5rem",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardHeader>
              <CardTitle
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isOrderSubmitted && (
                <div
                  style={{
                    marginBottom: "1rem",
                    fontWeight: "600",
                    textAlign: "center",
                    fontSize: "1rem",
                  }}
                >
                  <span>Order Number: {orderNumber}</span>
                </div>
              )}
              {Object.entries(orderItems).map(([category, items]) => (
                <div key={category} style={{ marginBottom: "1rem" }}>
                  <h4
                    style={{
                      fontWeight: "600",
                      fontSize: "1.125rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {category}
                  </h4>
                  {Object.entries(items).map(([item, details]) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.875rem",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <span style={{ flex: 1 }}>{item}</span>
                      <span style={{ flex: 1, textAlign: "center" }}>
                        {details.quantity} {details.unit} - $
                        {details.quantity * details.price}
                      </span>
                      {details.cutWanted && (
                        <span
                          style={{
                            flex: 1,
                            textAlign: "right",
                            color: "#16a34a",
                          }}
                        >
                          (Cut Wanted)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                <span>Packaging Fee</span>
                <span>$10</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "700",
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <Button
                onClick={handleSubmit}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "600",
                  borderRadius: "0.375rem",
                  border: "none",
                  textAlign: "center",
                }}
              >
                Submit Order
              </Button>
            </CardFooter>

            {/* Media Query for Small Devices */}
            <style>
              {`
      @media (max-width: 640px) {
        h4 {
          font-size: 1rem;
        }
        div {
          font-size: 0.75rem;
        }
        button {
          font-size: 0.875rem;
        }
      }
    `}
            </style>
          </Card>
        </div>
      </div>
    </div>
  );
}
