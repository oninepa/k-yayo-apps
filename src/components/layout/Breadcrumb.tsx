import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-300">•</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-purple-600 transition-colors hover:underline capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-gray-700 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent capitalize">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
