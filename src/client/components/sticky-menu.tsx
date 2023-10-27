import React, { useEffect, useState } from 'react';

interface StickyMenuProps {
  links: {
    to: string;
    label: string;
  }[];
}

const StickyMenu: React.FC<StickyMenuProps> = ({ links }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        console.log(rect.top);
        if (rect.top <= 0) {
          setActiveSection(section.id);
          console.log(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className='sticky-menu'>
      {links.map((link, index) => (
        <a
          key={link.to}
          href={link.to}
          className={activeSection === link.to ? 'active' : ''}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default StickyMenu;
