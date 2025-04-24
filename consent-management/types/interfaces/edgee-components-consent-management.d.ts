/** @module Interface edgee:components/consent-management@1.0.0 **/
export function map(cookies: Dict, settings: Dict): Consent | undefined;
export type Dict = Array<[string, string]>;
/**
 * # Variants
 * 
 * ## `"pending"`
 * 
 * ## `"granted"`
 * 
 * ## `"denied"`
 */
export type Consent = 'pending' | 'granted' | 'denied';
