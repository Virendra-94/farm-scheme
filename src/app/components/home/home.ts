import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, AfterViewInit {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    // Only run browser-specific code in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
    }
  }

  private initScrollAnimations() {
    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver not available, skipping scroll animations');
      return;
    }

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    // Add parallax effect to hero image
    this.addParallaxEffect();
  }

  private addParallaxEffect() {
    // Check if window is available
    if (typeof window === 'undefined') {
      return;
    }

    const heroImage = document.querySelector('.hero-image') as HTMLElement;
    if (heroImage) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroImage.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(5deg) translateY(${rate}px)`;
      });
    }
  }
}
