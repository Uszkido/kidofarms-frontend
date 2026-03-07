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

            <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:row justify-between items-center text-[12px] text-cream/40 gap-4">
                <p>© 2026 Kido Farms & Orchard. All rights reserved.</p>
                <div className="flex gap-8">
                    <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
