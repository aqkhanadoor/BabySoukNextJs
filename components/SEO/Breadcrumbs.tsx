'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import StructuredData, { createBreadcrumbSchema } from './StructuredData';

interface BreadcrumbItem {
    name: string;
    url: string;
    current?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
    const allItems = [
        { name: 'Home', url: '/' },
        ...items
    ];

    return (
        <>
            <StructuredData data={createBreadcrumbSchema(allItems)} />

            <nav
                className={`flex items-center space-x-2 text-sm text-playful-foreground/70 py-4 ${className}`}
                aria-label="Breadcrumb"
            >
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link
                            href="/"
                            className="hover:text-playful-primary transition-colors flex items-center gap-1"
                            aria-label="Home"
                        >
                            <Home className="h-4 w-4" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </li>

                    {items.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <ChevronRight className="h-4 w-4 text-playful-foreground/50" />
                            {item.current ? (
                                <span
                                    className="font-medium text-playful-foreground"
                                    aria-current="page"
                                >
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.url}
                                    className="hover:text-playful-primary transition-colors"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
};

export default Breadcrumbs;