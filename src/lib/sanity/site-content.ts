import {buildNoteDiscoveryEntries} from '../discovery/serialize'
import {SUPPORTED_LANGUAGES, isLanguage, type Language} from '../site/language'
import {getSanityClient} from './client'
import {PUBLISHED_SITE_CONTENT_QUERY} from './queries'

export const REQUIRED_PROJECT_KEYS = ['capty', 'twitter-translator', 'routescope', 'apple-price', 'usd-liquidity', 'wecom-kf-ai-agent'] as const
export const REQUIRED_SERVICE_KEYS = ['product-development', 'enterprise-ai', 'geo-visibility', 'workflow-automation', 'cloud-infrastructure'] as const

const siteCopyFields = [
  'languageName','siteControlsLabel','primaryNavigationLabel','redirectMessage','redirectLinkLabel','alternateLanguage','themeLight','themeDark','viewWork','readNotes','contactAction','selectedWork','currentNotes','workspace','activeThreads','projectsTitle','notesTitle','projectLabel','noteLabel','servicesLabel','companyLabel','aboutLabel','contactLabel','definition','bestFor','overview','whyItMatters','outcomes','workflow','principles','checklist','examples','nextSteps','faq','footerCompany','footerContact','footerOffice',
] as const
const localizedTypes = ['siteCopy','homePage','aboutPage','companyPage','contactPage','servicesPage','projectsPage','notesPage'] as const
const allowedTypes = new Set(['siteSettings', ...localizedTypes, 'project', 'service'])
const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type SiteCopy = Record<(typeof siteCopyFields)[number], string>
export type SeoFields = {title?: string; description?: string; keywords?: string[]; noIndex?: boolean}
export type SiteSettings = {
  siteName:string; siteUrl:string; authorName:string; githubUrl:string; llmsDescription:string; defaultLanguage:Language;
  legalNameZh:string; legalNameEn:string; shortNameZh:string; shortNameEn:string;
  phoneDisplay:string; phoneHref:string; addressZh:string; addressEn:string; cityZh:string; cityEn:string;
  postalCode:string; countryCode:string; icpNumber:string; icpUrl:string; verificationFile:string;
  defaultSeoTitle:string; defaultSeoDescription:string;
}
export type HomePage = {title:string;description:string;eyebrow:string;headline:string;headlineLines:string[];lede:string;identity:string;primaryActionsLabel:string;artworkAlt:string;artworkCaption:string;servicesTitle:string;servicesIntro:string;methodEyebrow:string;methodTitle:string;methodSteps:string[];companyEyebrow:string;companyTitle:string;companyText:string;seo?:SeoFields}
export type AboutPage = {title:string;description:string;eyebrow:string;headline:string;headlineLines:string[];lede:string;experienceTitle:string;experience:string[];focusTitle:string;focus:string[];workTitle:string;work:string[];contactTitle:string;contact:string;seo?:SeoFields}
export type CompanyPage = {title:string;description:string;eyebrow:string;headline:string;headlineLines:string[];lede:string;artworkAlt:string;artworkCaption:string;relationshipTitle:string;relationship:string;fieldsTitle:string;fields:string[];principlesTitle:string;principles:string[];missionTitle:string;mission:string;ctaTitle:string;ctaText:string;ctaLabel:string;seo?:SeoFields}
export type ContactPage = {title:string;description:string;eyebrow:string;headline:string;headlineLines:string[];lede:string;companyLabel:string;phoneLabel:string;addressLabel:string;icpLabel:string;callAction:string;callDescription:string;cooperationTitle:string;cooperationText:string;seo?:SeoFields}
export type ServicesPage = {title:string;description:string;eyebrow:string;headline:string;headlineLines:string[];lede:string;artworkAlt:string;artworkCaption:string;bestForLabel:string;deliverablesLabel:string;processLabel:string;evidenceLabel:string;boundariesLabel:string;ctaTitle:string;ctaText:string;ctaLabel:string;seo?:SeoFields}
export type CollectionPage = {title:string;description:string;eyebrow:string;seo?:SeoFields}
export type Project = {id:string;language:Language;translationKey:string;slug:string;title:string;kind:string;summary:string;definition:string;audience:string;overview:string;why:string;outcomes:string[];workflow:string[];next:string;faq:Array<{question:string;answer:string}>;featured:boolean;order:number;seo?:SeoFields}
export type Service = {id:string;language:Language;translationKey:string;slug:string;title:string;summary:string;bestFor:string;deliverables:string[];process:string[];evidence:string;boundaries:string;enabled:boolean;order:number;seo?:SeoFields}
export type LocalizedPair<T> = Record<Language, T>
export type SanitySiteContent = {
  settings:SiteSettings;
  site:{name:string;url:string;author:string;defaultLanguage:Language;languages:Language[]};
  company:{legalNameZh:string;legalNameEn:string;shortNameZh:string;shortNameEn:string;phoneDisplay:string;phoneHref:string;addressZh:string;addressEn:string;cityZh:string;cityEn:string;postalCode:string;countryCode:string;icpNumber:string;icpUrl:string;verificationFile:string};
  labels:Record<Language,SiteCopy>; home:Record<Language,HomePage>; about:Record<Language,AboutPage>;
  companyPages:Record<Language,CompanyPage>; contactPages:Record<Language,ContactPage>; servicesPages:Record<Language,ServicesPage>;
  projectsPages:Record<Language,CollectionPage>; notesPages:Record<Language,CollectionPage>;
  projects:Array<LocalizedPair<Project>>; services:Array<LocalizedPair<Service>>;
}

type Raw = Record<string, unknown>
function record(value: unknown, context: string): Raw { if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${context} must be an object`); return value as Raw }
function string(source: Raw, field: string): string { const value=source[field]; if (typeof value !== 'string' || !value.trim()) throw new Error(`${String(source._id || '<unknown>')} has invalid ${field}`); return value }
function boolean(source: Raw, field: string, fallback=false): boolean { const value=source[field]; if (value===undefined) return fallback; if (typeof value !== 'boolean') throw new Error(`${String(source._id)} has invalid ${field}`); return value }
function integer(source: Raw, field: string): number { const value=source[field]; if (!Number.isInteger(value) || (value as number)<0) throw new Error(`${String(source._id)} has invalid ${field}`); return value as number }
function stringArray(source: Raw, field: string): string[] { const value=source[field]; if (!Array.isArray(value) || value.length===0 || !value.every((item)=>typeof item==='string' && item.trim())) throw new Error(`${String(source._id)} has invalid ${field}`); return [...value] as string[] }
function language(source: Raw): Language { const value=string(source,'language'); if (!isLanguage(value)) throw new Error(`${String(source._id)} has unsupported language ${value}`); return value }
function seo(source: Raw): SeoFields|undefined { const value=source.seo; if (value==null) return undefined; const raw=record(value,`${String(source._id)} seo`); const result:SeoFields={}; if(raw.title!==undefined) result.title=string(raw,'title'); if(raw.description!==undefined) result.description=string(raw,'description'); if(raw.keywords!==undefined) result.keywords=stringArray(raw,'keywords'); if(raw.noIndex!==undefined){if(typeof raw.noIndex!=='boolean') throw new Error(`${String(source._id)} has invalid seo.noIndex`); result.noIndex=raw.noIndex} return result }
function localizedBase(source: Raw) { return {title:string(source,'title'),description:string(source,'description'),eyebrow:string(source,'eyebrow'),headline:string(source,'headline'),headlineLines:stringArray(source,'headlineLines'),lede:string(source,'lede'),seo:seo(source)} }
function fixed<T>(byId:Map<string,Raw>, type:string, lang:Language, parse:(source:Raw)=>T):T { const id=`${type}-${lang}`; const source=byId.get(id); if(!source) throw new Error(`missing required ${id}`); if(source._type!==type) throw new Error(`${id} has wrong type`); if(language(source)!==lang) throw new Error(`${id} has wrong language`); return parse(source) }

function parseSettings(source:Raw):SiteSettings {
  const siteUrl=string(source,'siteUrl'); let parsed:URL; try{parsed=new URL(siteUrl)}catch{throw new Error(`${String(source._id)} has invalid siteUrl`)}
  if(parsed.protocol!=='https:' || parsed.pathname!=='/' || parsed.search || parsed.hash || siteUrl.endsWith('/')) throw new Error(`${String(source._id)} has invalid siteUrl`)
  const phoneHref=string(source,'phoneHref'); if(!/^tel:[+0-9]+$/.test(phoneHref)) throw new Error(`${String(source._id)} has invalid phoneHref`)
  const icpUrl=string(source,'icpUrl'); try{if(new URL(icpUrl).protocol!=='https:') throw new Error()}catch{throw new Error(`${String(source._id)} has invalid icpUrl`)}
  const defaultLanguage=string(source,'defaultLanguage'); if(!isLanguage(defaultLanguage)) throw new Error(`${String(source._id)} has invalid defaultLanguage`)
  const countryCode=string(source,'countryCode'); if(!/^[A-Z]{2}$/.test(countryCode)) throw new Error(`${String(source._id)} has invalid countryCode`)
  return {siteName:string(source,'siteName'),siteUrl,authorName:string(source,'authorName'),githubUrl:string(source,'githubUrl'),llmsDescription:string(source,'llmsDescription'),defaultLanguage,legalNameZh:string(source,'legalNameZh'),legalNameEn:string(source,'legalNameEn'),shortNameZh:string(source,'shortNameZh'),shortNameEn:string(source,'shortNameEn'),phoneDisplay:string(source,'phoneDisplay'),phoneHref,addressZh:string(source,'addressZh'),addressEn:string(source,'addressEn'),cityZh:string(source,'cityZh'),cityEn:string(source,'cityEn'),postalCode:string(source,'postalCode'),countryCode,icpNumber:string(source,'icpNumber'),icpUrl,verificationFile:string(source,'verificationFile'),defaultSeoTitle:string(source,'defaultSeoTitle'),defaultSeoDescription:string(source,'defaultSeoDescription')}
}
function parseCopy(source:Raw):SiteCopy { return Object.fromEntries(siteCopyFields.map((field)=>[field,string(source,field)])) as SiteCopy }
function parseHome(source:Raw):HomePage { return {...localizedBase(source),identity:string(source,'identity'),primaryActionsLabel:string(source,'primaryActionsLabel'),artworkAlt:string(source,'artworkAlt'),artworkCaption:string(source,'artworkCaption'),servicesTitle:string(source,'servicesTitle'),servicesIntro:string(source,'servicesIntro'),methodEyebrow:string(source,'methodEyebrow'),methodTitle:string(source,'methodTitle'),methodSteps:stringArray(source,'methodSteps'),companyEyebrow:string(source,'companyEyebrow'),companyTitle:string(source,'companyTitle'),companyText:string(source,'companyText')} }
function parseAbout(source:Raw):AboutPage { return {...localizedBase(source),experienceTitle:string(source,'experienceTitle'),experience:stringArray(source,'experience'),focusTitle:string(source,'focusTitle'),focus:stringArray(source,'focus'),workTitle:string(source,'workTitle'),work:stringArray(source,'work'),contactTitle:string(source,'contactTitle'),contact:string(source,'contact')} }
function parseCompanyPage(source:Raw):CompanyPage { return {...localizedBase(source),artworkAlt:string(source,'artworkAlt'),artworkCaption:string(source,'artworkCaption'),relationshipTitle:string(source,'relationshipTitle'),relationship:string(source,'relationship'),fieldsTitle:string(source,'fieldsTitle'),fields:stringArray(source,'fields'),principlesTitle:string(source,'principlesTitle'),principles:stringArray(source,'principles'),missionTitle:string(source,'missionTitle'),mission:string(source,'mission'),ctaTitle:string(source,'ctaTitle'),ctaText:string(source,'ctaText'),ctaLabel:string(source,'ctaLabel')} }
function parseContact(source:Raw):ContactPage { return {...localizedBase(source),companyLabel:string(source,'companyLabel'),phoneLabel:string(source,'phoneLabel'),addressLabel:string(source,'addressLabel'),icpLabel:string(source,'icpLabel'),callAction:string(source,'callAction'),callDescription:string(source,'callDescription'),cooperationTitle:string(source,'cooperationTitle'),cooperationText:string(source,'cooperationText')} }
function parseServicesPage(source:Raw):ServicesPage { return {...localizedBase(source),artworkAlt:string(source,'artworkAlt'),artworkCaption:string(source,'artworkCaption'),bestForLabel:string(source,'bestForLabel'),deliverablesLabel:string(source,'deliverablesLabel'),processLabel:string(source,'processLabel'),evidenceLabel:string(source,'evidenceLabel'),boundariesLabel:string(source,'boundariesLabel'),ctaTitle:string(source,'ctaTitle'),ctaText:string(source,'ctaText'),ctaLabel:string(source,'ctaLabel')} }
function parseCollection(source:Raw):CollectionPage { return {title:string(source,'title'),description:string(source,'description'),eyebrow:string(source,'eyebrow'),seo:seo(source)} }
function parseFaq(source:Raw):Array<{question:string;answer:string}>{const value=source.faq;if(!Array.isArray(value)||value.length===0)throw new Error(`${String(source._id)} has invalid faq`);return value.map((item)=>{const raw=record(item,`${String(source._id)} faq`);return{question:string(raw,'question'),answer:string(raw,'answer')}})}
function route(source:Raw, kind:string, routes:Set<string>):string{const slug=string(source,'slug');buildNoteDiscoveryEntries([{translationKey:string(source,'translationKey'),language:language(source),slug,title:string(source,'title')}]);const path=`${language(source)}/${slug}`;if(routes.has(path))throw new Error(`duplicate ${kind} route ${path}`);routes.add(path);return slug}
function parseProject(source:Raw,routes:Set<string>):Project{return{id:string(source,'_id'),language:language(source),translationKey:string(source,'translationKey'),slug:route(source,'project',routes),title:string(source,'title'),kind:string(source,'kind'),summary:string(source,'summary'),definition:string(source,'definition'),audience:string(source,'audience'),overview:string(source,'overview'),why:string(source,'why'),outcomes:stringArray(source,'outcomes'),workflow:stringArray(source,'workflow'),next:string(source,'next'),faq:parseFaq(source),featured:boolean(source,'featured'),order:integer(source,'order'),seo:seo(source)}}
function parseService(source:Raw,routes:Set<string>):Service{const enabled=boolean(source,'enabled',true);if(!enabled)throw new Error(`${String(source._id)} required service is disabled`);return{id:string(source,'_id'),language:language(source),translationKey:string(source,'translationKey'),slug:route(source,'service',routes),title:string(source,'title'),summary:string(source,'summary'),bestFor:string(source,'bestFor'),deliverables:stringArray(source,'deliverables'),process:stringArray(source,'process'),evidence:string(source,'evidence'),boundaries:string(source,'boundaries'),enabled,order:integer(source,'order'),seo:seo(source)}}
function pair<T extends {translationKey:string;language:Language;order:number}>(items:T[],required:readonly string[],kind:string):Array<LocalizedPair<T>>{const groups=new Map<string,Partial<LocalizedPair<T>>>();for(const item of items){if(!kebabCase.test(item.translationKey))throw new Error(`${item.translationKey} is invalid`);const group=groups.get(item.translationKey)||{};if(group[item.language])throw new Error(`duplicate ${kind} translation ${item.translationKey} ${item.language}`);group[item.language]=item;groups.set(item.translationKey,group)}for(const key of required){const group=groups.get(key);for(const lang of SUPPORTED_LANGUAGES)if(!group?.[lang])throw new Error(`missing ${kind} translation ${key} ${lang}`)}if(groups.size!==required.length)throw new Error(`unexpected ${kind} count ${groups.size}`);const pairs=[...groups.values()] as Array<LocalizedPair<T>>;for(const value of pairs)if(value.en.order!==value.zh.order)throw new Error(`${kind} pair order mismatch ${value.en.translationKey}`);const orders=pairs.map((value)=>value.en.order);if(new Set(orders).size!==orders.length)throw new Error(`duplicate ${kind} order`);return pairs.sort((a,b)=>a.en.order-b.en.order)}

export function validateSiteContent(value:unknown):SanitySiteContent {
  if(!Array.isArray(value))throw new Error('Sanity site content response must be an array')
  const byId=new Map<string,Raw>()
  for(const item of value){const source=record(item,'Sanity site document');const id=string(source,'_id');const type=string(source,'_type');if(id.includes('.'))throw new Error(`Sanity site document id must be root: ${id}`);if(!allowedTypes.has(type))throw new Error(`unsupported Sanity site type ${type}`);if(byId.has(id))throw new Error(`duplicate id ${id}`);byId.set(id,source)}
  const settingsSource=byId.get('siteSettings');if(!settingsSource)throw new Error('missing required siteSettings');if(settingsSource._type!=='siteSettings')throw new Error('siteSettings has wrong type')
  const settings=parseSettings(settingsSource)
  const localized=<T>(type:(typeof localizedTypes)[number],parse:(source:Raw)=>T):Record<Language,T>=>({en:fixed(byId,type,'en',parse),zh:fixed(byId,type,'zh',parse)})
  const labels=localized('siteCopy',parseCopy),home=localized('homePage',parseHome),about=localized('aboutPage',parseAbout)
  const companyPages=localized('companyPage',parseCompanyPage),contactPages=localized('contactPage',parseContact),servicesPages=localized('servicesPage',parseServicesPage)
  const projectsPages=localized('projectsPage',parseCollection),notesPages=localized('notesPage',parseCollection)
  const projectRoutes=new Set<string>(),serviceRoutes=new Set<string>()
  const projects=pair([...byId.values()].filter((source)=>source._type==='project').map((source)=>parseProject(source,projectRoutes)),REQUIRED_PROJECT_KEYS,'project')
  const services=pair([...byId.values()].filter((source)=>source._type==='service').map((source)=>parseService(source,serviceRoutes)),REQUIRED_SERVICE_KEYS,'service')
  if(byId.size!==39)throw new Error(`expected 39 Sanity site documents, got ${byId.size}`)
  return {settings,site:{name:settings.siteName,url:settings.siteUrl,author:settings.authorName,defaultLanguage:settings.defaultLanguage,languages:[...SUPPORTED_LANGUAGES]},company:{legalNameZh:settings.legalNameZh,legalNameEn:settings.legalNameEn,shortNameZh:settings.shortNameZh,shortNameEn:settings.shortNameEn,phoneDisplay:settings.phoneDisplay,phoneHref:settings.phoneHref,addressZh:settings.addressZh,addressEn:settings.addressEn,cityZh:settings.cityZh,cityEn:settings.cityEn,postalCode:settings.postalCode,countryCode:settings.countryCode,icpNumber:settings.icpNumber,icpUrl:settings.icpUrl,verificationFile:settings.verificationFile},labels,home,about,companyPages,contactPages,servicesPages,projectsPages,notesPages,projects,services}
}

let siteContentPromise:Promise<SanitySiteContent>|undefined
export function getSiteContent():Promise<SanitySiteContent>{siteContentPromise ||= getSanityClient().fetch<unknown>(PUBLISHED_SITE_CONTENT_QUERY).then(validateSiteContent);return siteContentPromise}
