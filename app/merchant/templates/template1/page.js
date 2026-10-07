"use client";

import { ChevronDown, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function JumboStationaryPreview() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* HEADER */}
      <header className="bg-[#32a1c8] text-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#32a1c8] rounded-full"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">Jumbo Stationary</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => scrollTo('hero')} className="hover:text-yellow-200 transition-colors cursor-pointer">Home</button>
          <button onClick={() => scrollTo('products')} className="hover:text-yellow-200 transition-colors cursor-pointer">Products</button>
          <button onClick={() => scrollTo('about')} className="hover:text-yellow-200 transition-colors cursor-pointer">About Us</button>
        </nav>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400 overflow-hidden border-2 border-white">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Laura" className="w-full h-full object-cover" />
          </div>
          <span className="font-medium text-sm hidden sm:block">Laura</span>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
        {/* Yellow corner accent */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#ffc107]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row shadow-2xl rounded-sm overflow-hidden">
          {/* Left image */}
          <div className="md:w-1/2 h-[400px] md:h-[600px] relative">
            <img 
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80" 
              alt="Stationary Store" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right content */}
          <div className="md:w-1/2 bg-white p-10 md:p-16 flex flex-col justify-center border border-gray-100">
            <h1 className="text-5xl md:text-7xl font-bold text-[#ffc107] leading-none mb-6">
              Jumbo<br />Stationary
            </h1>
            
            <div className="flex items-center gap-2 text-gray-500 mb-10 text-sm font-medium tracking-widest uppercase">
              <MapPin size={16} className="text-[#ffc107]" />
              123 STATIONARY ST, NEW YORK
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#ffc107] rounded-full"></div>
                  10,000+ Customers
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Providing reliable products for your everyday needs.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#ffc107] rounded-full"></div>
                  Best Quality
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Find all your stationary needs in one place with best quality.
                </p>
              </div>
            </div>
            
            <div>
              <button className="border-2 border-[#ffc107] text-[#ffc107] hover:bg-[#ffc107] hover:text-white transition-colors px-8 py-3 rounded-full font-bold text-sm tracking-wide">
                Explore All Our Products
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section id="about" className="flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-[#b5d8e6] p-12 md:p-24 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-4 h-4 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-gray-800 uppercase">Our Story</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif text-[#297895] mb-8 leading-tight">
            Where Every Cup<br />Tells a Story
          </h2>
          
          <div className="max-w-md space-y-6 text-sm text-gray-700 leading-relaxed">
            <p>
              Immerse yourself in our collection and discover the joy of creating your best work with Jumbo Stationary. Let us fuel your creativity. Every product we make is crafted with premium quality materials, and a commitment to excellence.
            </p>
            <p className="font-medium text-gray-900">
              When you put pen to paper, it gives you peace of mind. Let your ideas flow freely, with a trusted brand behind you, and a world of imagination ahead. Discover why "Jumbo" is a name you can trust, with quality in your hand.
            </p>
          </div>
        </div>
        
        <div className="md:w-1/2 h-[400px] md:h-auto min-h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80" 
            alt="Our Story" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="py-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-4 h-[1px] bg-gray-400"></span>
            <span>SHOWING 1-6 OF 24 PRODUCTS</span>
          </div>
          
          <div className="relative">
            <button className="flex items-center gap-4 text-sm font-medium border border-gray-200 rounded px-4 py-2 hover:bg-gray-50">
              Sort by: Featured
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {/* Product 1 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square overflow-hidden mb-4 rounded-sm bg-gray-100">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">NEW</span>
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">IN STOCK</span>
              </div>
              <img src="https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=600&q=80" alt="Color Ballpoint Pens" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-lg">Color Ballpoint Pens</h3>
              <span className="font-bold text-[#ffc107]">$4.00</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">A set of 5 color ballpoint pens perfect for drawing, writing and more. Available in 5 colors.</p>
            <span className="text-xs font-bold text-[#ffc107] uppercase tracking-wider flex items-center gap-1">
              View Details <ChevronDown size={12} className="-rotate-90" />
            </span>
          </div>

          {/* Product 2 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square overflow-hidden mb-4 rounded-sm bg-gray-100">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">NEW</span>
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">LIMITED</span>
              </div>
              <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" alt="Heavy Artist Ribbons" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-lg">Heavy Artist Ribbons</h3>
              <span className="font-bold text-[#ffc107]">$5.00</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">Premium artistic ribbons for all your decoration and DIY needs. Sold per bundle.</p>
            <span className="text-xs font-bold text-[#ffc107] uppercase tracking-wider flex items-center gap-1">
              View Details <ChevronDown size={12} className="-rotate-90" />
            </span>
          </div>

          {/* Product 3 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square overflow-hidden mb-4 rounded-sm bg-gray-100">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">SALE</span>
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">IN STOCK</span>
              </div>
              <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80" alt="Golden Leaf Pens" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-lg">Golden Leaf Pens</h3>
              <span className="font-bold text-[#ffc107]">$3.50</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">Traditional design with luxurious golden leaf details. Smooth writing experience.</p>
            <span className="text-xs font-bold text-[#ffc107] uppercase tracking-wider flex items-center gap-1">
              View Details <ChevronDown size={12} className="-rotate-90" />
            </span>
          </div>
          
          {/* Product 4 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square overflow-hidden mb-4 rounded-sm bg-gray-100">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">NEW</span>
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">IN STOCK</span>
              </div>
              <img src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80" alt="Color Ballpoint Pencils" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-lg">Color Ballpoint Pencils</h3>
              <span className="font-bold text-[#ffc107]">$4.00</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">A pack of vibrant colored pencils for artists and students.</p>
            <span className="text-xs font-bold text-[#ffc107] uppercase tracking-wider flex items-center gap-1">
              View Details <ChevronDown size={12} className="-rotate-90" />
            </span>
          </div>
          
          {/* Product 5 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square overflow-hidden mb-4 rounded-sm bg-gray-100">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">NEW</span>
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">LIMITED</span>
              </div>
              <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80" alt="Fine Artist Brushes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-lg">Fine Artist Brushes</h3>
              <span className="font-bold text-[#ffc107]">$8.50</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">Professional grade brushes for watercolor, acrylics, and oil painting.</p>
            <span className="text-xs font-bold text-[#ffc107] uppercase tracking-wider flex items-center gap-1">
              View Details <ChevronDown size={12} className="-rotate-90" />
            </span>
          </div>
          
          {/* Product 6 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square overflow-hidden mb-4 rounded-sm bg-gray-100">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">SALE</span>
                <span className="bg-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">IN STOCK</span>
              </div>
              <img src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80" alt="Blank Canvas & Easel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-lg">Blank Canvas & Easel</h3>
              <span className="font-bold text-[#ffc107]">$12.00</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">Start your masterpiece with our premium stretched canvas and mini wooden easel.</p>
            <span className="text-xs font-bold text-[#ffc107] uppercase tracking-wider flex items-center gap-1">
              View Details <ChevronDown size={12} className="-rotate-90" />
            </span>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-16">
          <button className="text-sm font-bold text-[#ffc107] border-b-2 border-[#ffc107] pb-1 uppercase tracking-wider">PREV</button>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-800 text-sm font-bold hover:bg-gray-200">1</button>
            <button className="w-8 h-8 rounded-full text-gray-500 text-sm font-bold hover:bg-gray-100">2</button>
            <button className="w-8 h-8 rounded-full text-gray-500 text-sm font-bold hover:bg-gray-100">3</button>
          </div>
          <button className="text-sm font-bold text-gray-400 pb-1 uppercase tracking-wider hover:text-gray-800">NEXT</button>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="flex flex-col md:flex-row bg-[#b5d8e6] mb-20">
        <div className="md:w-1/2 p-12 md:p-24 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-8 border-4 border-white shadow-lg">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt="Customer" className="w-full h-full object-cover" />
          </div>
          <p className="text-lg md:text-xl font-medium text-gray-900 max-w-md leading-relaxed italic">
            "Highly recommended stationary store in town. Best quality products, wide selection, and great service. I've found everything I needed for my artwork!"
          </p>
        </div>
        <div className="md:w-1/2 h-[300px] md:h-auto min-h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80" 
            alt="Store Testimonial" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-[1000px] mx-auto px-6 mb-24">
        <h2 className="text-3xl md:text-4xl font-serif text-[#ffc107] text-center mb-12">
          Jumbo Stationary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-gray-200 rounded-sm p-6 flex flex-col items-center text-center gap-3 bg-white hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#f0f9fb] text-[#32a1c8] flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">CALL US</p>
              <p className="font-medium text-gray-900">+1 234 567 8900</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-sm p-6 flex flex-col items-center text-center gap-3 bg-white hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#f0f9fb] text-[#32a1c8] flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">VISIT US</p>
              <p className="font-medium text-gray-900">123 Stationary St, NY</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-sm p-6 flex flex-col items-center text-center gap-3 bg-white hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#f0f9fb] text-[#32a1c8] flex items-center justify-center">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">EMAIL US</p>
              <p className="font-medium text-gray-900">hello@jumbo.com</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#b5d8e6] p-8 md:p-12 rounded-sm relative overflow-hidden">
          <h3 className="text-xl font-bold text-[#297895] mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ffc107] rounded-full"></div>
            OUR DETAILS
          </h3>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full px-4 py-3 bg-white/80 border border-transparent focus:border-white rounded-sm outline-none transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-white/80 border border-transparent focus:border-white rounded-sm outline-none transition-colors" placeholder="Your Email" />
              </div>
            </div>
            <div className="flex flex-col h-full">
              <label className="block text-xs font-bold text-gray-700 mb-1">Message</label>
              <textarea className="w-full flex-1 min-h-[100px] px-4 py-3 bg-white/80 border border-transparent focus:border-white rounded-sm outline-none transition-colors resize-none mb-4" placeholder="Your Message"></textarea>
              <button type="button" className="w-full md:w-auto self-center md:self-end bg-[#ffc107] text-white font-bold px-10 py-3 rounded-full hover:bg-yellow-500 transition-colors shadow-md">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#3B9DB9] text-white py-16 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          
          <div className="space-y-5 md:pr-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-[2.5px] border-white rotate-45 shrink-0 ml-1"></div>
              <span className="font-serif font-bold text-xl tracking-tight ml-2">Jumbo Stationary</span>
            </div>
            <p className="text-[13px] text-white/90 leading-relaxed font-medium">
              Curating quality stationary and modern supplies for the creative individual. Your haven for high-quality products.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-base mb-5 text-white tracking-wide">Shop Collections</h4>
            <ul className="space-y-4 text-[13px] text-white/90 font-medium">
              <li><a href="#" className="hover:opacity-80 transition-opacity">Home</a></li>
              <li><a href="#" className="hover:opacity-80 transition-opacity">Products</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-base mb-5 text-white tracking-wide">Information</h4>
            <ul className="space-y-4 text-[13px] text-white/90 font-medium">
              <li><a href="#" className="hover:opacity-80 transition-opacity">Our Story</a></li>
            </ul>
          </div>
          
          <div className="relative">
            <h4 className="font-serif font-bold text-base mb-5 text-white tracking-wide">Connect</h4>
            <ul className="space-y-4 text-[13px] text-white/90 font-medium md:mb-12">
              <li className="flex items-center gap-3">
                <Mail size={16} /> hello@jumbostationary.com
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} /> 123 Stationary Ave, NY
              </li>
            </ul>
            
            <div className="flex gap-5 mt-8 md:mt-0 md:absolute md:bottom-0 md:right-0">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Instagram size={18} strokeWidth={2} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Facebook size={18} strokeWidth={2} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Twitter size={18} strokeWidth={2} />
              </a>
            </div>
          </div>
          
        </div>
      </footer>
    </div>
  );
}
