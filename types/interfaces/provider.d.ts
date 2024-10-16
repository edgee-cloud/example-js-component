export namespace Provider {
  export function page(p: Payload, cred: Dict): EdgeeRequest;
  export function track(p: Payload, cred: Dict): EdgeeRequest;
  export function identify(p: Payload, cred: Dict): EdgeeRequest;
}
export type Dict = Array<[string, string]>;
/**
 * # Variants
 * 
 * ## `"page"`
 * 
 * ## `"track"`
 * 
 * ## `"identify"`
 */
export type EventType = 'page' | 'track' | 'identify';
export interface PageEvent {
  name: string,
  category: string,
  keywords: Array<string>,
  title: string,
  url: string,
  path: string,
  search: string,
  referrer: string,
  properties: Dict,
}
export interface IdentifyEvent {
  userId: string,
  anonymousId: string,
  edgeeId: string,
  properties: Dict,
}
export interface TrackEvent {
  name: string,
  properties: Dict,
}
export interface Client {
  ip: string,
  locale: string,
  timezone: string,
  userAgent: string,
  userAgentArchitecture: string,
  userAgentBitness: string,
  userAgentFullVersionList: string,
  userAgentMobile: string,
  userAgentModel: string,
  osName: string,
  osVersion: string,
  screenWidth: number,
  screenHeight: number,
  screenDensity: number,
  continent: string,
  countryCode: string,
  countryName: string,
  region: string,
  city: string,
}
export interface Campaign {
  name: string,
  source: string,
  medium: string,
  term: string,
  content: string,
  creativeFormat: string,
  marketingTactic: string,
}
export interface Session {
  sessionId: string,
  previousSessionId: string,
  sessionCount: number,
  sessionStart: boolean,
  firstSeen: bigint,
  lastSeen: bigint,
}
export interface Payload {
  uuid: string,
  timestamp: bigint,
  timestampMillis: bigint,
  timestampMicros: bigint,
  eventType: EventType,
  page: PageEvent,
  identify: IdentifyEvent,
  track: TrackEvent,
  campaign: Campaign,
  client: Client,
  session: Session,
}
/**
 * # Variants
 * 
 * ## `"GET"`
 * 
 * ## `"PUT"`
 * 
 * ## `"POST"`
 * 
 * ## `"DELETE"`
 */
export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';
export interface EdgeeRequest {
  method: HttpMethod,
  url: string,
  headers: Dict,
  body: string,
}
