export default function Navbar() {
  return (
    <nav className="bg-[#121212] border-b border-[#333] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-white text-xl font-semibold hover:text-gray-300 transition-colors">
            Company
          </a>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="/create" className="text-gray-300 hover:text-white transition-colors relative group">
            Create
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="/shareholders" className="text-gray-300 hover:text-white transition-colors relative group">
            Shareholders
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="/about" className="text-gray-300 hover:text-white transition-colors relative group">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
