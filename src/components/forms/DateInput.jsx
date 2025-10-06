// src/components/forms/DateInput.jsx

import React, { useState } from "react";
import { CalendarDays } from "lucide-react";

const DateInput = ({ placeholder }) => {
  const [inputType, setInputType] = useState('text');

  return (
    <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md"> 
      <CalendarDays className="text-gray-500 mr-2" />
      <input
        type={inputType}
        placeholder={placeholder}
        onFocus={() => setInputType("date")}
        onBlur={(e) => {
          if (e.target.value === "") {
            setInputType("text");
          }
        }}
        className="flex-grow outline-none border-none bg-transparent text-gray-700"
      />
    </div>
  );
};

export default DateInput;