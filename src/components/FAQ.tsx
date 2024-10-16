import { FAQItem } from "@/app/Models/interface";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface FAQProps {
  faqs: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="mb-4 border border-gray-600 rounded-lg p-4"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <h4 className="text-lg font-semibold">{faq.question}</h4>
            <FaChevronDown
              className={`transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""
                }`}
            />
          </div>
          {activeIndex === index && (
            <p className="text-gray-400 mt-2 transition-opacity duration-300">
              {faq.answer}
            </p>
          )}
        </div>
      ))}
      <p className="text-2xl font-bold text-grey-300 mb-4">Still have questions</p>
      <button className={`px-4 py-2 rounded-md bg-gray-600 text-yellow-500 ml-4`}>Contact us</button>
    </div>
  );
};

export default FAQ;
