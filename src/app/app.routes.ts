import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { FarmerDashboardComponent } from './components/dashboard/farmer-dashboard/farmer-dashboard';
import { BidderDashboardComponent } from './components/dashboard/bidder-dashboard/bidder-dashboard';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard';
import { BiddingMarketplaceComponent } from './components/bidding/bidding-marketplace/bidding-marketplace';
import { PlaceSellRequestComponent } from './components/bidding/place-sell-request/place-sell-request';
import { SoldHistoryComponent } from './components/bidding/sold-history/sold-history';
import { InsuranceApplicationComponent } from './components/insurance/insurance-application/insurance-application';
import { InsuranceCalculatorComponent } from './components/insurance/insurance-calculator/insurance-calculator';
import { ClaimInsuranceComponent } from './components/insurance/claim-insurance/claim-insurance';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },
  
  // Farmer routes
  { path: 'farmer', component: FarmerDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'FARMER' } },
  { path: 'farmer/sell-request', component: PlaceSellRequestComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'FARMER' } },
  { path: 'farmer/sold-history', component: SoldHistoryComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'FARMER' } },
  { path: 'farmer/marketplace', component: BiddingMarketplaceComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'FARMER' } },
  { path: 'farmer/insurance/apply', component: InsuranceApplicationComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'FARMER' } },
  { path: 'farmer/insurance/calculator', component: InsuranceCalculatorComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'FARMER' } },
  { path: 'farmer/insurance/claim', component: ClaimInsuranceComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'FARMER' } },
  
  // Bidder routes
  { path: 'bidder', component: BidderDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'BIDDER' } },
  { path: 'bidder/marketplace', component: BiddingMarketplaceComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'BIDDER' } },
  
  // Admin routes
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ADMIN' } },
  
  // Redirect to home for any unmatched routes
  { path: '**', redirectTo: '' }
];
