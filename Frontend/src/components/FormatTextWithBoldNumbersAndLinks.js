import React from "react";
import './Homepage.css';

const FormatTextWithBoldNumbersAndLinks = ({text}) => {
    return text.split("\n").map((line, index) => {
      const parts = line.split(/\b(\d+|\bhttps?:\/\/[^\s]+)\b/);
      return (
        <React.Fragment key={index}>
          {parts.map((part, partIndex) => {
            const isNumber = /^\d+$/.test(part.trim());
            const isLink = /^https?:\/\/[^\s]+$/.test(part.trim());

            if (isNumber) {
              return <strong key={partIndex}>{part}</strong>;
            } else if (isLink) {
              // const fileName = part.split('/').pop(); // Extract the filename from the link
              return (
                <a
                  key={partIndex}
                  href={part}
                  className="anchor-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {part}
                </a>
              );
            } else {
              return part;
            }
          })}
          <br />
        </React.Fragment>
      );
    });
  };

  export default FormatTextWithBoldNumbersAndLinks
