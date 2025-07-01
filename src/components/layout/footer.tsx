const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t h-14 flex items-center justify-center">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} K-YAYO. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
