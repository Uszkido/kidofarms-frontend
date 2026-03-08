import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-primary text-white pt-20 pb-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold font-serif text-secondary">Kido Farms</h3>
                    <p className="text-cream/70 text-sm leading-relaxed">
                        Connecting you with fresh, organic, and locally produced farm products directly from our fields to your table.
                    </p>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-6 font-serif">Quick Links</h4>
                    <ul className="space-y-4 text-sm text-cream/60">
                        <li><Link href="/shop" className="hover:text-secondary transition-colors">Browse Shop</Link></li>
                        <li><Link href="/about" className="hover:text-secondary transition-colors">Our Mission</Link></li>
                        <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
                        <li><Link href="/blog" className="hover:text-secondary transition-colors">Farm Blog</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-6 font-serif">Categories</h4>
                    <ul className="space-y-4 text-sm text-cream/60">
                        <li><Link href="/shop?cat=Fruits" className="hover:text-secondary transition-colors">Fresh Fruits</Link></li>
                        <li><Link href="/shop?cat=Vegetables" className="hover:text-secondary transition-colors">Organic Vegetables</Link></li>
                        <li><Link href="/shop?cat=Grains" className="hover:text-secondary transition-colors">Local Grains</Link></li>
                        <li><Link href="/shop?cat=Fishes" className="hover:text-secondary transition-colors">Fresh Fishes</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-lg font-bold mb-6 font-serif">Newsletter</h4>
                    <p className="text-sm text-cream/60">Subscribe to get seasonal updates and fresh offers.</p>
                    <form className="flex">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="bg-white/10 border-none rounded-l-full px-4 py-2 text-sm w-full focus:ring-1 focus:ring-secondary outline-none"
                        />
                        <button className="bg-secondary text-primary px-6 py-2 rounded-r-full text-sm font-bold hover:bg-white transition-colors">
                            Join
                        </button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[12px] text-cream/40 gap-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <p>© 2026 Kido Farms & Orchard. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="flex gap-6 items-center">
                    <a href="https://facebook.com/kidofarms" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-all hover:scale-110">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                    </a>
                    <a href="https://x.com/kidofarms" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-all hover:scale-110">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                    <a href="https://instagram.com/kido_farms" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-all hover:scale-110">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.62 6.772 6.978 6.972 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c4.351-.2 6.77-2.618 6.97-6.971.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zM18.406 4.195a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
