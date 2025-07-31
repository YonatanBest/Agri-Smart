import Link from 'next/link'
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function Other_Sections() {
  return (
    <div>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t bg-white">
        <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-gray-900">
                Ready to Transform Your Farm?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join the future of farming. Sign up for updates or get in touch with our team.
            </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
            <form className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1 min-w-0" />
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                Sign Up
                </Button>
            </form>
            <p className="text-xs text-gray-500">
                We respect your privacy. Read our{" "}
                <Link href="#" className="underline underline-offset-2 text-green-600 hover:text-green-700">
                Privacy Policy
                </Link>
                .
            </p>
            </div>
        </div>
        </section>

        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-100 text-center sm:text-left">
            <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Agrilo. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">
                Terms of Service
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">
                Privacy
            </Link>
            </nav>
        </footer>
    </div>
  )
}
