import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  features = [
    {
      icon: '🌾',
      title: 'Crop Bidding',
      description: 'Online marketplace for farmers to sell crops through competitive bidding, ensuring fair prices and eliminating middlemen.'
    },
    {
      icon: '🛡️',
      title: 'Crop Insurance',
      description: 'PM Fasal Bima Yojana integration providing comprehensive insurance coverage against natural calamities and crop failures.'
    },
    {
      icon: '📱',
      title: 'Digital Platform',
      description: 'User-friendly digital interface making agricultural commerce accessible to farmers across different regions.'
    },
    {
      icon: '💰',
      title: 'Financial Support',
      description: 'Government-backed schemes and subsidies to support farmers and stabilize agricultural income.'
    }
  ];

  benefits = [
    {
      title: 'For Farmers',
      items: [
        'Get better prices through competitive bidding',
        'Access to crop insurance with government support',
        'Eliminate middlemen and increase profits',
        'Digital platform for easy crop management',
        'Financial stability through insurance coverage'
      ]
    },
    {
      title: 'For Bidders/Traders',
      items: [
        'Direct access to quality crops from farmers',
        'Transparent bidding process',
        'Quality assurance through admin verification',
        'Wide variety of crops from different regions',
        'Secure payment and delivery system'
      ]
    },
    {
      title: 'For Government',
      items: [
        'Better implementation of agricultural schemes',
        'Digital records for policy making',
        'Reduced corruption through transparency',
        'Support for farmers through subsidies',
        'Data-driven agricultural development'
      ]
    }
  ];

  statistics = [
    { number: '1000+', label: 'Farmers Registered' },
    { number: '500+', label: 'Successful Bids' },
    { number: '₹50M+', label: 'Total Transaction Value' },
    { number: '95%', label: 'Farmer Satisfaction' }
  ];

  schemes = [
    {
      name: 'PM Fasal Bima Yojana',
      description: 'Comprehensive crop insurance scheme providing coverage against natural calamities, pests, and diseases.',
      features: [
        '2% premium for Kharif crops',
        '1.5% premium for Rabi crops', 
        '5% premium for annual commercial crops',
        '80% government subsidy on premium'
      ]
    },
    {
      name: 'Digital Agriculture Mission',
      description: 'Promoting digital adoption in agriculture through technology-enabled solutions.',
      features: [
        'Online marketplace for crops',
        'Digital payment systems',
        'Real-time market information',
        'Quality assessment tools'
      ]
    }
  ];
}
