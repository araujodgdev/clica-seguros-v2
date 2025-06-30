import { Layers } from "lucide-react"
import Link from "next/link"

const footerLinks = {
    platform: [
      { name: 'Platform Overview', href: '#' },
      { name: 'Virtual Accounts', href: '#' },
      { name: 'Multi-Currency Accounts', href: '#' },
    ],
    developers: [
      { name: 'Documentation', href: '#' },
      { name: 'Support', href: '#' },
      { name: 'Sign In', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Compliance', href: '#' },
    ],
    contact: [
        { name: 'General Inquiries', href: '#' },
        { name: 'Sales', href: '#' },
        { name: 'Support', href: '#' },
    ]
  }

export function Footer() {
    return (
        <footer className="border-t border-neutral-light-gray bg-neutral-off-white">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
                    {/* Logo */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center space-x-2">
                           <Layers className="h-8 w-8 text-neutral-charcoal" />
                           <span className="text-lg font-bold">HIFI</span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="col-span-1">
                        <h3 className="font-semibold text-neutral-dark-gray">Platform</h3>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.platform.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-neutral-medium-gray transition-colors hover:text-neutral-dark-gray">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="font-semibold text-neutral-dark-gray">Developers</h3>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.developers.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-neutral-medium-gray transition-colors hover:text-neutral-dark-gray">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="col-span-1">
                        <h3 className="font-semibold text-neutral-dark-gray">Company</h3>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.company.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-neutral-medium-gray transition-colors hover:text-neutral-dark-gray">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="font-semibold text-neutral-dark-gray">Contact</h3>
                        <ul className="mt-4 space-y-2">
                            {footerLinks.contact.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-neutral-medium-gray transition-colors hover:text-neutral-dark-gray">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between border-t border-neutral-light-gray pt-8 text-sm text-neutral-medium-gray md:flex-row">
                    <p>&copy; {new Date().getFullYear()} HIFI BRIDGE. ALL RIGHTS RESERVED.</p>
                    <div className="mt-4 flex space-x-4 md:mt-0">
                        <Link href="#" className="transition-colors hover:text-neutral-dark-gray">TERMS OF SERVICE</Link>
                        <Link href="#" className="transition-colors hover:text-neutral-dark-gray">PRIVACY POLICY</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
