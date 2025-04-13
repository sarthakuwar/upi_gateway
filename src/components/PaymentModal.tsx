import React, { useState, useEffect } from "react";
import { X, Check, Loader, ExternalLink } from "lucide-react";
import { createRequestResponse } from "upigateway";
import { upiClient } from "../utils/upigateway";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  data: createRequestResponse;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  data,
  onPaymentSuccess,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">(
    "pending",
  );
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log("Attempting to connect to SSE endpoint...");

      const sse = new EventSource("https://upi.234892.xyz/event/" + data?.id);

      // Log when connection is established
      sse.onopen = () => {
        console.log("SSE connection opened successfully");
      };

      sse.addEventListener("update", (event) => {
        console.log("Update event received:", event);
        console.log("Update data:", event.data);

        try {
          const parsedData = JSON.parse(event.data);
          console.log("Parsed update data:", parsedData);

          if (parsedData.includes(1)) {
            setPaymentStatus("success");
            onPaymentSuccess();
          }
        } catch (error) {
          console.log("Error parsing update data:", error);
          console.log("Raw update data:", event.data);
        }
      });

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
  }, [isOpen, onPaymentSuccess, data?.id]);

  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus("pending");
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = async () => {
    if (paymentStatus === "pending" && data?.id) {
      // Set loading state while canceling request
      setIsClosing(true);
      
      try {
        // Cancel the UPI request
        await upiClient.cancelRequest({ id: data.id });
        console.log("Payment request cancelled successfully");
      } catch (error) {
        console.error("Error cancelling payment request:", error);
      } finally {
        // Close modal regardless of success or failure
        setIsClosing(false);
        onClose();
      }
    } else {
      // If payment is already successful, just close the modal
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        {paymentStatus === "pending" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Complete Payment</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full"
                disabled={isClosing}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">UPI</span>
              </div>
            </div>
            <div className="mb-6">
              <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-center">
                <img
                  src={data?.qr}
                  alt="Payment QR Code"
                  className="w-48 h-48"
                />
              </div>
              <div className="mb-4 mt-2">
  <a 
    href={data?.uri} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
  >
    <ExternalLink className="w-5 h-5" />
    <span>Pay with UPI App</span>
  </a>
</div>
            </div>
            <div className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                {isClosing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Cancelling payment...</span>
                  </>
                ) : (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Waiting for payment...</span>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="py-6">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-50 p-4 rounded-full">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Payment Successful!</h3>
            <p className="text-gray-600 mb-8 text-center">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;