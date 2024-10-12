// src/Privacy.tsx
import React, { useEffect, useState } from 'react';

const Contact: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    fetch('html/contact.html')
      .then((response) => response.text())
      .then((html) => setHtmlContent(html))
      .catch((error) => console.error('Error fetching HTML:', error));
  }, []);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default Contact;
