import { RouteObject } from "react-router";
import { lazy } from 'react';
import HomePage from './pages/index';
import AdminLoginPage from './pages/admin/login';
import AdminDashboardPage from './pages/admin/index';
import CoinsPage from './pages/coins';
import HowToPlayPage from './pages/how-to-play';
import RoadmapPage from './pages/roadmap';
import TokenomicsPage from './pages/tokenomics';
import LeaderboardPage from './pages/leaderboard';
import GlobalPage from './pages/global';
import AustraliaPage from './pages/australia';
import ChinaPage from './pages/china';
import UsaPage from './pages/usa';
import EuropePage from './pages/europe';
import AfricaPage from './pages/africa';
import RussiaPage from './pages/russia';
import IndiaPage from './pages/india';
import JapanPage from './pages/japan';
import SouthAmericaPage from './pages/southamerica';
import WarRoomPage from './pages/war-room';
import UsaWarRoomPage from './pages/war-room/usa';
import UkWarRoomPage from './pages/war-room/uk';
import IndiaWarRoomPage from './pages/war-room/india';
import JapanWarRoomPage from './pages/war-room/japan';
import SouthKoreaWarRoomPage from './pages/war-room/south-korea';
import BrazilWarRoomPage from './pages/war-room/brazil';
import TurkeyWarRoomPage from './pages/war-room/turkey';
import AustraliaWarRoomPage from './pages/war-room/australia';
import NigeriaWarRoomPage from './pages/war-room/nigeria';
import RussiaWarRoomPage from './pages/war-room/russia';
import ChinaWarRoomPage from './pages/war-room/china';
import EuropeWarRoomPage from './pages/war-room/europe';
import AfricaWarRoomPage from './pages/war-room/africa';
import MiddleEastWarRoomPage from './pages/war-room/middle-east';
import OceaniaWarRoomPage from './pages/war-room/oceania';
import NorthAmericaWarRoomPage from './pages/war-room/north-america';
import CentralAmericaWarRoomPage from './pages/war-room/central-america';
import ArcticWarRoomPage from './pages/war-room/arctic';
import AntarcticaWarRoomPage from './pages/war-room/antarctica';
import UploadCoinsPage from './pages/admin/upload-coins';
import GlobalUploadPage from './pages/admin/global-upload';
import CuratorAdminPage from './pages/admin/curator';
import WhitelistAdminPage from './pages/admin/whitelist';
import PumpAddressesPage from './pages/admin/pump-addresses';
import CoinDirectoryPage from './pages/coin-directory';
import CoinLeaderboardPage from './pages/coin-leaderboard';
import WhitelistPage from './pages/whitelist';
import StashPage from './pages/stash';
import MiddleEastPage from './pages/middleeast';
import OceaniaPage from './pages/oceania';
import NorthAmericaPage from './pages/northamerica';
import CentralAmericaPage from './pages/centralamerica';
import ArcticPage from './pages/arctic';
import AntarcticaPage from './pages/antarctica';
import StashKeyPage from './pages/stash-key';
import CuratorPage from './pages/curator';
import RwaPage from './pages/rwa';
import WorldMapPage from './pages/world-map';
import JourneyPage from './pages/journey';
import BuyCoinsPage from './pages/buy-coins';
import ValuePacksPage from './pages/rpg/value-packs';
import RpgHubPage from './pages/rpg/index';
import RpgProfilePage from './pages/rpg/profile';
import CartPage from './pages/cart';
import CheckoutSuccessPage from './pages/checkout/success';
import CheckoutCancelPage from './pages/checkout/cancel';
import CreateCharacterPage from './pages/rpg/create-character';
import WalletPage from './pages/wallet';
import StakingPage from './pages/staking/index';
import StakingReferralPage from './pages/staking/referral';
import InvestPage from './pages/invest';
import OasisPage from './pages/oasis';
import CraftingPage from './pages/crafting';
import CommunityPage from './pages/community';
import QuestsPage from './pages/quests';
import CalendarPage from './pages/calendar';
import HallOfLegendsPage from './pages/hall-of-legends';
import SeasonLeaderboardPage from './pages/season-leaderboard';
import BackstoriesPage from './pages/backstories';
import AboutPage from './pages/about';
import BingoPage from './pages/bingo/index';
import BingoAuctionPage from './pages/bingo/auction';
import BingoDashboardPage from './pages/bingo/dashboard';
// Eager import so renderToString doesn't hit a Suspense boundary on 404 routes
// and abort to client rendering. The prod 404 page is tiny; the dev-tools
// variant stays lazy because it pulls in dev-only code we don't want in
// production bundles.
import ProdNotFoundPage from './pages/_404';
import BlogIndexPage from './pages/Blog';
import BlogPostPage from './pages/blog/[slug]';
import LandingPage from './pages/lp';
const NotFoundPage = ProdNotFoundPage;
export const routes: RouteObject[] = [{
  path: '/',
  element: <HomePage />
}, {
  path: '/bingo',
  element: <BingoPage />
}, {
  path: '/bingo/auction',
  element: <BingoAuctionPage />
}, {
  path: '/bingo/dashboard',
  element: <BingoDashboardPage />
}, {
  path: '/coins',
  element: <CoinsPage />
}, {
  path: '/coin-directory',
  element: <CoinDirectoryPage />
}, {
  path: '/how-to-play',
  element: <HowToPlayPage />
}, {
  path: '/roadmap',
  element: <RoadmapPage />
}, {
  path: '/tokenomics',
  element: <TokenomicsPage />
}, {
  path: '/leaderboard',
  element: <LeaderboardPage />
},
// Edition pages
{
  path: '/global',
  element: <GlobalPage />
}, {
  path: '/australia',
  element: <AustraliaPage />
}, {
  path: '/china',
  element: <ChinaPage />
}, {
  path: '/usa',
  element: <UsaPage />
}, {
  path: '/europe',
  element: <EuropePage />
}, {
  path: '/africa',
  element: <AfricaPage />
}, {
  path: '/russia',
  element: <RussiaPage />
}, {
  path: '/india',
  element: <IndiaPage />
}, {
  path: '/japan',
  element: <JapanPage />
}, {
  path: '/southamerica',
  element: <SouthAmericaPage />
}, {
  path: '/war-room',
  element: <WarRoomPage />
}, {
  path: '/war-room/usa',
  element: <UsaWarRoomPage />
}, {
  path: '/war-room/uk',
  element: <UkWarRoomPage />
}, {
  path: '/war-room/india',
  element: <IndiaWarRoomPage />
}, {
  path: '/war-room/japan',
  element: <JapanWarRoomPage />
}, {
  path: '/war-room/south-korea',
  element: <SouthKoreaWarRoomPage />
}, {
  path: '/war-room/brazil',
  element: <BrazilWarRoomPage />
}, {
  path: '/war-room/turkey',
  element: <TurkeyWarRoomPage />
}, {
  path: '/war-room/australia',
  element: <AustraliaWarRoomPage />
}, {
  path: '/war-room/nigeria',
  element: <NigeriaWarRoomPage />
}, {
  path: '/war-room/russia',
  element: <RussiaWarRoomPage />
}, {
  path: '/war-room/china',
  element: <ChinaWarRoomPage />
}, {
  path: '/war-room/europe',
  element: <EuropeWarRoomPage />
}, {
  path: '/war-room/africa',
  element: <AfricaWarRoomPage />
}, {
  path: '/war-room/middle-east',
  element: <MiddleEastWarRoomPage />
}, {
  path: '/war-room/oceania',
  element: <OceaniaWarRoomPage />
}, {
  path: '/war-room/north-america',
  element: <NorthAmericaWarRoomPage />
}, {
  path: '/war-room/central-america',
  element: <CentralAmericaWarRoomPage />
}, {
  path: '/war-room/arctic',
  element: <ArcticWarRoomPage />
}, {
  path: '/war-room/antarctica',
  element: <AntarcticaWarRoomPage />
}, {
  path: '/admin/login',
  element: <AdminLoginPage />
}, {
  path: '/admin',
  element: <AdminDashboardPage />
}, {
  path: '/admin/upload-coins',
  element: <UploadCoinsPage />
}, {
  path: '/admin/global-upload',
  element: <GlobalUploadPage />
}, {
  path: '/admin/curator',
  element: <CuratorAdminPage />
}, {
  path: '/admin/whitelist',
  element: <WhitelistAdminPage />
}, {
  path: '/admin/pump-addresses',
  element: <PumpAddressesPage />
}, {
  path: '/coin-directory',
  element: <CoinDirectoryPage />
}, {
  path: '/coin-leaderboard',
  element: <CoinLeaderboardPage />
}, {
  path: '/whitelist',
  element: <WhitelistPage />
}, {
  path: '/stash',
  element: <StashPage />
}, {
  path: '/middleeast',
  element: <MiddleEastPage />
}, {
  path: '/oceania',
  element: <OceaniaPage />
}, {
  path: '/northamerica',
  element: <NorthAmericaPage />
}, {
  path: '/centralamerica',
  element: <CentralAmericaPage />
}, {
  path: '/arctic',
  element: <ArcticPage />
}, {
  path: '/antarctica',
  element: <AntarcticaPage />
}, {
  path: '/stash-key',
  element: <StashKeyPage />
}, {
  path: '/curator',
  element: <CuratorPage />
}, {
  path: '/rwa',
  element: <RwaPage />
}, {
  path: '/world-map',
  element: <WorldMapPage />
}, {
  path: '/journey',
  element: <JourneyPage />
}, {
  path: '/buy-coins',
  element: <BuyCoinsPage />
}, {
  path: '/rpg/value-packs',
  element: <ValuePacksPage />
}, {
  path: '/rpg',
  element: <RpgHubPage />
}, {
  path: '/rpg/profile',
  element: <RpgProfilePage />
}, {
  path: '/cart',
  element: <CartPage />
}, {
  path: '/checkout/success',
  element: <CheckoutSuccessPage />
}, {
  path: '/checkout/cancel',
  element: <CheckoutCancelPage />
}, {
  path: '/rpg/create-character',
  element: <CreateCharacterPage />
}, {
  path: '/wallet',
  element: <WalletPage />
}, {
  path: '/staking',
  element: <StakingPage />
}, {
  path: '/staking/referral',
  element: <StakingReferralPage />
}, {
  path: '/invest',
  element: <InvestPage />
}, {
  path: '/oasis',
  element: <OasisPage />
}, {
  path: '/crafting',
  element: <CraftingPage />
}, {
  path: '/community',
  element: <CommunityPage />
}, {
  path: '/quests',
  element: <QuestsPage />
}, {
  path: '/calendar',
  element: <CalendarPage />
}, {
  path: '/hall-of-legends',
  element: <HallOfLegendsPage />
}, {
  path: '/season-leaderboard',
  element: <SeasonLeaderboardPage />
}, {
  path: '/backstories',
  element: <BackstoriesPage />
}, {
  path: '/about',
  element: <AboutPage />
}, {
  path: '/blog',
  element: <BlogIndexPage />
}, {
  path: '/blog/:slug',
  element: <BlogPostPage />
}, {
  path: '/lp/:slug',
  element: <LandingPage />
}, {
  path: '*',
  element: <NotFoundPage />
}];

// Types for type-safe navigation
export type Path = '/' | '/coins' | '/how-to-play' | '/roadmap' | '/tokenomics' | '/leaderboard' | '/australia' | '/china' | '/usa' | '/europe' | '/africa' | '/russia' | '/india' | '/japan' | '/southamerica';
export type Params = Record<string, string | undefined>;
