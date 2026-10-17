/**
 * Re-exports coin data for use in server API handlers.
 * Keeping this as a separate server-side module avoids any
 * SSR boundary issues with the main src/data/coins.ts file.
 */
export {
  PERMANENT_COINS,
  SEASONAL_YEAR_ONE,
  FINALE_COINS,
  YEAR_TWO_GROUPS,
  COINS,
} from '../../data/coins.js';
