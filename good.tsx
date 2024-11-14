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
 
 
const generateOrderNumber = () => Math.floor(10000 + Math.random() * 90000).toString();


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
        const uniqueOrderNumber = await generateOrderNumber();
        setOrderNumber(uniqueOrderNumber);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);
  const handleItemChange = (category, item, quantity, price = 10, cutWanted = false,unit) => {
    setOrderItems((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: {
          quantity: quantity || 0,
          price,
          cutWanted,
          unit,
        },
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
    return total  + 10;
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
  
    // Order details object with UUID
    const orderDetailsData = {
      orderNumber,  // This will be the UUID
      customerName,
      phone,
      mobile,
      type: (document.getElementById("xmas") as HTMLInputElement)?.checked
        ? "XMAS"
        : "NYE",
      orderDate: new Date(date),
      specialRequest,
      items: [] as OrderItem[],
      subtotal: calculateTotal() - 10,
      packagingFee: 10,
      total: calculateTotal(),
    };
  
    Object.entries(orderItems).forEach(([category]) => {
      Object.entries(orderItems[category]).forEach(([item, details]) => {
        orderDetailsData.items.push({
          item: item._id,
          quantity: details.quantity,
          price: details.price,
        });
      });
    });
  
    // User data with UUID order number
    const userData = {
      name: customerName,
      phone,
      mobile,
      orders: [orderNumber],  // Order UUID for tracking
    };
  
    try {
      // Submit user details
      console.log("Order Number:", orderNumber);

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, userData);
      // Submit order details
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
  
      // Show UUID order number and reload page after printing
      setTimeout(() => {
        window.print();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    }
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
        {categories
          .filter((category) => category.isActive)
          .map((category) => (
            <div key={category._id} className="space-y-2">
              <h3 className="font-bold">{category.categoryName}</h3>
              {category.items
                .filter((item) => item.isActive)
                .map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Label className="flex-1">{item.itemName}</Label>
                    <div className="flex gap-4 items-center">
                    <Input
  className="w-20"
  placeholder=""
  onChange={(e) =>
    handleItemChange(
      category.categoryName,
      item.itemName,
      Number(e.target.value),
      10,
      orderItems[category.categoryName]?.[item.itemName]?.cutWanted || false,
      item.unit // Passing the unit of the item
    )
  }
/>
                      <span className="text-gray-500">Price: $10</span>
                    </div>
                    {category.categoryName === "CRUSTACEANS" && (
                      <div className="flex items-center gap-2">
                        <Label className="mr-2">Cut Wanted</Label>
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleItemChange(
                              category.categoryName,
                              item.itemName,
                              orderItems[category.categoryName]?.[item.itemName]?.quantity || 0,
                              10,
                              e.target.checked
                            )
                          }
                          checked={
                            orderItems[category.categoryName]?.[item.itemName]?.cutWanted || false
                          }
                        />
                      </div>
                    )} <span>{item.unit}</span>
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
      <div className="mb-4 font-semibold">
        <span>Order Number: {orderNumber}</span>
      </div>
    )}
    {Object.entries(orderItems).map(([category, items]) => (
      <div key={category}>
        <h4 className="font-semibold">{category}</h4>
        {Object.entries(items).map(([item, details]) => (
          <div key={item} className="flex justify-between">
            <span>{item}</span>
            <span>
              {details.quantity} {details.unit} - ${details.quantity * details.price}
            </span>
            {details.cutWanted && <span>(Cut Wanted)</span>}
          </div>
        ))}
      </div>
    ))}
    <div className="flex justify-between">
      <span>Packaging Fee</span>
      <span>$10</span>
    </div>
    <div className="flex justify-between font-bold">
      <span>Total</span>
      <span>${calculateTotal().toFixed(2)}</span>
    </div>
  </CardContent>
  <CardFooter className="flex flex-col sm:flex-row gap-4">
    <Button onClick={handleSubmit}>Submit Order</Button>
  </CardFooter>
</Card>

          </div>
        </div>
      </div>
    );
    
}  