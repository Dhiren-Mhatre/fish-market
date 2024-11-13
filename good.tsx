"use client";

import { useState, useEffect } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox"; // Adjust the path if needed

interface ItemDetails {
  quantity: number;
  price: number;
}

interface CategoryItem {
  _id: string;
  itemName: string;
}

interface Category {
  _id: string;
  categoryName: string;
  items: CategoryItem[];
}

interface OrderItems {
  [category: string]: {
    [item: string]: ItemDetails;
  };
}
interface OrderItem {
  item: string;
  quantity: number;
  price: number;
}

export function ComprehensiveOrderForm() {
  const [orderItems, setOrderItems] = useState<OrderItems>({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [xmasChecked, setXmasChecked] = useState(false);
  const [nyeChecked, setNyeChecked] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
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
        setCategories(categoriesResponse.data);
        setOrderNumber(uuidv4());
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleItemChange = (
    category: string,
    item: string,
    value: number,
    price = 10
  ) => {
    setOrderItems((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: { quantity: value, price },
      },
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(orderItems).forEach((category) => {
      Object.values(category).forEach((item) => {
        total += item.quantity * item.price;
      });
    });
    return total + 50 + 10;
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

    if (!customerName || !phone || !mobile || (!xmasChecked && !nyeChecked)) {
      alert("Please fill all the required fields and acknowledge the terms!");
      return;
    }

    const orderDetailsData = {
      orderNumber,
      customerName,
      phone,
      mobile,
      type: (document.getElementById("xmas") as HTMLInputElement)?.checked
        ? "XMAS"
        : "NYE",
      orderDate: new Date(date),
      specialRequest,
      items: [] as OrderItem[], // Explicitly type the items array
      subtotal: calculateTotal() - 60,
      deposit: 50,
      packagingFee: 10,
      total: calculateTotal(),
    };

    Object.entries(orderItems).forEach(([category]) => {
      Object.entries(orderItems[category]).forEach(([item, details]) => {
        orderDetailsData.items.push({
          item: item._id, // Make sure item is the _id here, not the name
          quantity: details.quantity,
          price: details.price,
        });
      });
    });

    const orderHistoryData = {
      orderNumber,
      name: orderDetailsData.customerName,
      phone: orderDetailsData.phone,
      orderTotal: orderDetailsData.total,
      type: orderDetailsData.type,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order-details`,
        orderDetailsData
      );
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order-history`,
        orderHistoryData
      );

      alert("Order submitted successfully!");
      setIsOrderSubmitted(true);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    }
  };

 

  const clearFormData = () => {
    setOrderItems({});
    setOrderNumber(uuidv4());
    (document.getElementById("customer-name") as HTMLInputElement).value = "";
    (document.getElementById("phone") as HTMLInputElement).value = "";
    (document.getElementById("mobile") as HTMLInputElement).value = "";
    (document.getElementById("special") as HTMLInputElement).value = "";
    
  };

  return (
    
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="border rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">ORDER FORM</h1>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="flex items-center gap-2">
                <Label htmlFor="xmas" className="font-bold">XMAS</Label>
                <input
                  type="checkbox"
                  id="xmas"
                  checked={xmasChecked}
                  onChange={handleXmasChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="nye" className="font-bold">NYE</Label>
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
              
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input id="customer-name" className="w-full" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" className="w-full" />
              </div>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" type="tel" className="w-full" />
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
    
            {categories.map((category) => (
              <div key={category._id} className="space-y-2">
                <h3 className="font-bold">{category.categoryName}</h3>
                {category.items.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Label className="flex-1">{item.itemName}</Label>
                    <div className="flex gap-4 items-center">
                      <Input
                        className="w-20"
                        placeholder="kg"
                        onChange={(e) =>
                          handleItemChange(
                            category.categoryName,
                            item.itemName,
                            Number(e.target.value)
                          )
                        }
                      />
                      <span className="text-gray-500">Price: $10</span>
                    </div>
                    {category.categoryName === "CRUSTACEANS" && (
                      <div>
                        <Label className="mr-2">Cut Wanted</Label>
                        <Checkbox
                          onChange={() =>
                            handleItemChange(
                              category.categoryName,
                              item.itemName,
                              orderItems[category.categoryName]?.[item.itemName]?.quantity || 0,
                              10
                            )
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
              <p>
                I agree to the terms and conditions by clicking submit button
              </p>
            </div>
    
            <Separator />
    
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
              {isOrderSubmitted && (
                <div className="flex justify-between font-bold">
                  <span>Order Number</span>
                  <span>{orderNumber}</span>
                </div>
              )}

                <div className="space-y-2">
                  {Object.entries(orderItems).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="font-semibold">{category}</h4>
                      {Object.entries(items).map(([item, details]) => (
                        <div key={item} className="flex justify-between">
                          <span>{item}</span>
                          <span>{details.quantity} kg - ${(details.quantity * details.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span>Deposit</span>
                    <span>$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging Fee</span>
                    <span>$10</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleSubmit}>Submit Order</Button>
                <Button onClick={() => window.print()} className="sm:ml-4">
                  Print Order
                </Button>
                <Button onClick={clearFormData} className="sm:ml-4">
                  Clear Data
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
    
}  