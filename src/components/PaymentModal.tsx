import React, { useState, useEffect } from "react";
import { X, Check, Star } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  data: object;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  data,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">(
    "pending",
  );

  useEffect(() => {
    if (isOpen) {
      console.log("Attempting to connect to SSE endpoint...");

      const sse = new EventSource("https://upi.234892.xyz/event/" + data?.id);

      // Log when connection is established
      sse.onopen = () => {
        console.log("SSE connection opened successfully");
      };

      // This is the key change - use addEventListener for named events
      sse.addEventListener("update", (event) => {
        console.log("Update event received:", event);
        console.log("Update data:", event.data);

        try {
          // Parse the data - it looks like it might be a JSON array
          const parsedData = JSON.parse(event.data);
          console.log("Parsed update data:", parsedData);

          // Check if the data indicates success (assuming [1] means success)
          if (parsedData.includes(1)) {
            setPaymentStatus("success");
          }
        } catch (error) {
          console.log("Error parsing update data:", error);
          console.log("Raw update data:", event.data);
        }
      });

      // Keep the error handler
      sse.onerror = (error) => {
        console.error("EventSource error:", error);
        if (sse.readyState !== 2) {
          sse.close();
        }
      };

      return () => {
        console.log("Closing SSE connection");
        sse.close();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus("pending");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={paymentStatus === "pending"}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {paymentStatus === "pending" ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Scan the QR code to pay ₹{total.toFixed(2)}
              </p>
              <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
                <img
                  src={data?.qr}
                  alt="Payment QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>
            <div className="text-center">
              <div className="animate-pulse text-gray-600">
                Waiting for payment...
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <button
              onClick={onClose}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
