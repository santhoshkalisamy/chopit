import React from 'react'
import Link from 'next/link'
import { GlobeIcon } from 'lucide-react'

const Navbar = () => {
    return (
        <nav className="bg-slate-900 py-4 px-6 shadow-md mb-8">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <GlobeIcon className="h-6 w-6 text-blue-500" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        ChopIt
                    </h1>
                </Link>
                <div className="flex gap-4">
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    )
}
export default Navbar
