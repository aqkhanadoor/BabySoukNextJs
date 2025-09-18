'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    sizes?: string;
    fill?: boolean;
    loading?: 'eager' | 'lazy';
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
}

const OptimizedImage = ({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 85,
    sizes,
    fill = false,
    loading = 'lazy',
    placeholder = 'empty',
    blurDataURL
}: OptimizedImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Generate a simple blur placeholder if none provided
    const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    if (hasError) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
                <span className="text-gray-400 text-sm">Failed to load image</span>
            </div>
        );
    }

    const imageProps: any = {
        src: src || '/placeholder.svg',
        quality,
        onLoad: handleLoad,
        onError: handleError,
        loading: priority ? 'eager' : loading,
        className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    };

    if (fill) {
        imageProps.fill = true;
        imageProps.sizes = sizes || '100vw';
    } else {
        imageProps.width = width;
        imageProps.height = height;
    }

    if (priority) {
        imageProps.priority = true;
    }

    if (placeholder === 'blur') {
        imageProps.placeholder = 'blur';
        imageProps.blurDataURL = blurDataURL || defaultBlurDataURL;
    }

    // Ensure alt text is always provided
    const altText = alt || 'Optimized image';

    return (
        <>
            {isLoading && (
                <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
            )}
            <Image {...imageProps} alt={altText} />
        </>
    );
};

// SEO-optimized image component with structured data
export const ProductImage = ({
    product,
    imageIndex = 0,
    className = '',
    priority = false
}: {
    product: any;
    imageIndex?: number;
    className?: string;
    priority?: boolean;
}) => {
    // Handle both array and single image formats for compatibility
    let imageSrc = '/placeholder.svg';

    if (product.images && Array.isArray(product.images)) {
        imageSrc = product.images[imageIndex] || product.images[0] || '/placeholder.svg';
    } else if (product.image) {
        // Fallback to single image property if images array doesn't exist
        imageSrc = product.image;
    }

    // Ensure the image path is valid
    if (!imageSrc || imageSrc === '' || imageSrc === 'undefined') {
        imageSrc = '/placeholder.svg';
    }

    const altText = `${product.name} - Premium ${product.category} for babies | Baby Souk`;

    return (
        <OptimizedImage
            src={imageSrc}
            alt={altText}
            width={600}
            height={600}
            className={className}
            priority={priority}
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
        />
    );
};

// Hero image component
export const HeroImage = ({
    src,
    alt,
    className = ''
}: {
    src: string;
    alt: string;
    className?: string;
}) => (
    <OptimizedImage
        src={src}
        alt={alt}
        width={1200}
        height={630}
        className={className}
        priority={true}
        quality={95}
        sizes="100vw"
        placeholder="blur"
    />
);

export default OptimizedImage;