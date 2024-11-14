import { useState } from "react";

export default function Modal({ cart, total, discount, finalTotal, onClose, resetCart }) {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    resetCart(); 
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-all duration-300 ease-in-out">
      <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-2xl transform transition-transform duration-500 ease-out scale-95 hover:scale-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Order Summary
        </h2>   
        {orderConfirmed ? (
          <div className="text-center text-green-600 font-semibold">
            Your order has been confirmed! Thank you for shopping with us.
          </div>
        ) : (
          <>
            <ul className="space-y-4 mb-6">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <div className="text-sm text-gray-600">
                    <p>
                      Quantity: <span className="font-medium">{item.quantity}</span>
                    </p>
                    <p>
                      Price: <span className="font-medium">SAR {item.price}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t pt-6 space-y-3">
              <p className="flex justify-between font-medium text-gray-700">
                <span>Original Total:</span>
                <span>SAR {total}</span>
              </p>
              <p className="flex justify-between text-gray-500">
                <span>Discount:</span>
                <span>SAR {discount}</span>
              </p>
              <p className="flex justify-between text-lg font-bold text-gray-800">
                <span>Final Total:</span>
                <span>SAR {finalTotal}</span>
              </p>
            </div>
            <div className='flex justify-center'>
            <button
              onClick={handleConfirmOrder}
              className="mt-6 w-1/3 p-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
            >
              Confirm Order
            </button>
            </div>
          </>
        )}
        <div className='flex justify-center'>
        <button
          onClick={onClose}
          className="mt-6 w-1/3 p-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          Close
        </button>
        </div>
      </div>
    </div>
  );
}
