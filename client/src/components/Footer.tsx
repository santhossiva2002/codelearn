export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} CodeLearn. A simple online code editor for learning.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Help</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">About</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
