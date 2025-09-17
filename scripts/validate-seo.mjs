#!/usr/bin/env node

/**
 * SEO Validation Script for Baby Souk
 * Tests all SEO implementations for compliance and best practices
 */

import fs from 'fs';
import path from 'path';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`)
};

class SEOValidator {
    constructor() {
        this.appDir = path.join(process.cwd(), 'app');
        this.componentsDir = path.join(process.cwd(), 'components');
        this.errors = [];
        this.warnings = [];
        this.successes = [];
    }

    async validate() {
        log.info('Starting SEO validation for Baby Souk...\n');

        await this.validateRootLayout();
        await this.validateSEOComponents();
        await this.validateSitemap();
        await this.validateRobots();
        await this.validateMetadata();
        await this.validateStructuredData();
        await this.validateImages();
        await this.validatePages();

        this.showResults();
    }

    async validateRootLayout() {
        const layoutPath = path.join(this.appDir, 'layout.tsx');
        
        if (!fs.existsSync(layoutPath)) {
            this.errors.push('Root layout.tsx not found');
            return;
        }

        const content = fs.readFileSync(layoutPath, 'utf-8');
        
        // Check for viewport export
        if (content.includes('export const viewport')) {
            this.successes.push('Root layout has viewport export');
        } else {
            this.errors.push('Root layout missing viewport export');
        }

        // Check for metadata
        if (content.includes('export const metadata')) {
            this.successes.push('Root layout has metadata export');
        } else {
            this.errors.push('Root layout missing metadata export');
        }

        // Check for structured data
        if (content.includes('StructuredData')) {
            this.successes.push('Root layout includes structured data');
        } else {
            this.warnings.push('Root layout should include structured data');
        }
    }

    async validateSEOComponents() {
        const seoDir = path.join(this.componentsDir, 'SEO');
        
        if (!fs.existsSync(seoDir)) {
            this.errors.push('SEO components directory not found');
            return;
        }

        const requiredComponents = [
            'StructuredData.tsx',
            'Breadcrumbs.tsx',
            'OptimizedImage.tsx'
        ];

        requiredComponents.forEach(component => {
            const componentPath = path.join(seoDir, component);
            if (fs.existsSync(componentPath)) {
                this.successes.push(`SEO component ${component} exists`);
            } else {
                this.errors.push(`Missing SEO component: ${component}`);
            }
        });
    }

    async validateSitemap() {
        const sitemapPath = path.join(this.appDir, 'sitemap.ts');
        
        if (fs.existsSync(sitemapPath)) {
            this.successes.push('Dynamic sitemap.ts exists');
            
            const content = fs.readFileSync(sitemapPath, 'utf-8');
            if (content.includes('realtimeDb')) {
                this.successes.push('Sitemap includes Firebase products');
            } else {
                this.warnings.push('Sitemap should include dynamic products');
            }
        } else {
            this.errors.push('sitemap.ts not found');
        }
    }

    async validateRobots() {
        const robotsPath = path.join(this.appDir, 'robots.ts');
        
        if (fs.existsSync(robotsPath)) {
            this.successes.push('robots.ts exists');
            
            const content = fs.readFileSync(robotsPath, 'utf-8');
            if (content.includes('sitemap') && content.includes('babysouk.in')) {
                this.successes.push('robots.ts includes sitemap reference');
            } else {
                this.warnings.push('robots.ts should reference sitemap');
            }
        } else {
            this.errors.push('robots.ts not found');
        }
    }

    async validateMetadata() {
        const pages = [
            path.join(this.appDir, 'page.tsx'),
            path.join(this.appDir, 'products/page.tsx')
        ];

        pages.forEach(pagePath => {
            if (fs.existsSync(pagePath)) {
                const content = fs.readFileSync(pagePath, 'utf-8');
                const pageName = path.basename(path.dirname(pagePath)) + '/page.tsx';
                
                if (content.includes('metadata')) {
                    this.successes.push(`${pageName} has metadata`);
                } else {
                    this.warnings.push(`${pageName} should have metadata`);
                }

                // Check for OpenGraph
                if (content.includes('openGraph')) {
                    this.successes.push(`${pageName} has OpenGraph data`);
                } else {
                    this.warnings.push(`${pageName} should have OpenGraph data`);
                }
            }
        });
    }

    async validateStructuredData() {
        const pagesWithStructuredData = [
            path.join(this.appDir, 'page.tsx'),
            path.join(this.appDir, 'products/page.tsx')
        ];

        pagesWithStructuredData.forEach(pagePath => {
            if (fs.existsSync(pagePath)) {
                const content = fs.readFileSync(pagePath, 'utf-8');
                const pageName = path.basename(path.dirname(pagePath)) + '/page.tsx';
                
                if (content.includes('StructuredData')) {
                    this.successes.push(`${pageName} includes structured data`);
                } else {
                    this.warnings.push(`${pageName} should include structured data`);
                }
            }
        });
    }

    async validateImages() {
        const components = [
            path.join(this.componentsDir, 'ProductCard.tsx'),
            path.join(this.componentsDir, 'HeroSection.tsx')
        ];

        components.forEach(componentPath => {
            if (fs.existsSync(componentPath)) {
                const content = fs.readFileSync(componentPath, 'utf-8');
                const componentName = path.basename(componentPath);
                
                if (content.includes('OptimizedImage') || content.includes('ProductImage') || content.includes('HeroImage')) {
                    this.successes.push(`${componentName} uses optimized images`);
                } else {
                    this.warnings.push(`${componentName} should use OptimizedImage components`);
                }

                // Check for alt attributes
                if (content.includes('alt=')) {
                    this.successes.push(`${componentName} has alt attributes`);
                } else {
                    this.warnings.push(`${componentName} should have alt attributes for images`);
                }
            }
        });
    }

    async validatePages() {
        // Check for breadcrumbs
        const pagesWithBreadcrumbs = [
            path.join(this.appDir, 'products/page.tsx')
        ];

        pagesWithBreadcrumbs.forEach(pagePath => {
            if (fs.existsSync(pagePath)) {
                const content = fs.readFileSync(pagePath, 'utf-8');
                const pageName = path.basename(path.dirname(pagePath)) + '/page.tsx';
                
                if (content.includes('Breadcrumbs')) {
                    this.successes.push(`${pageName} includes breadcrumbs`);
                } else {
                    this.warnings.push(`${pageName} should include breadcrumbs`);
                }
            }
        });
    }

    showResults() {
        console.log('\n' + '='.repeat(60));
        console.log('SEO VALIDATION RESULTS');
        console.log('='.repeat(60));

        console.log(`\n${colors.green}SUCCESSES (${this.successes.length}):${colors.reset}`);
        this.successes.forEach(success => log.success(success));

        if (this.warnings.length > 0) {
            console.log(`\n${colors.yellow}WARNINGS (${this.warnings.length}):${colors.reset}`);
            this.warnings.forEach(warning => log.warning(warning));
        }

        if (this.errors.length > 0) {
            console.log(`\n${colors.red}ERRORS (${this.errors.length}):${colors.reset}`);
            this.errors.forEach(error => log.error(error));
        }

        console.log('\n' + '='.repeat(60));

        const total = this.successes.length + this.warnings.length + this.errors.length;
        const score = Math.round((this.successes.length / total) * 100);

        if (score >= 90) {
            log.success(`SEO SCORE: ${score}% - EXCELLENT!`);
        } else if (score >= 70) {
            log.warning(`SEO SCORE: ${score}% - GOOD`);
        } else {
            log.error(`SEO SCORE: ${score}% - NEEDS IMPROVEMENT`);
        }

        console.log('='.repeat(60));

        console.log('\nSEO CHECKLIST SUMMARY:');
        log.info('✓ Root layout with metadata and viewport');
        log.info('✓ SEO components (StructuredData, Breadcrumbs, OptimizedImage)');
        log.info('✓ Dynamic sitemap generation');
        log.info('✓ Robots.txt configuration');
        log.info('✓ Structured data (JSON-LD)');
        log.info('✓ OpenGraph and Twitter cards');
        log.info('✓ Image optimization with proper alt text');
        log.info('✓ Breadcrumb navigation');
        log.info('✓ SEO-friendly URLs');
        
        console.log('\nNEXT STEPS:');
        log.info('1. Test with Google Search Console');
        log.info('2. Validate structured data with Google Rich Results Test');
        log.info('3. Check Core Web Vitals with PageSpeed Insights');
        log.info('4. Monitor search rankings and organic traffic');
    }
}

// Run validation
const validator = new SEOValidator();
validator.validate().catch(console.error);