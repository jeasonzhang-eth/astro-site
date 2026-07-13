import test from 'node:test'
import assert from 'node:assert/strict'
import {REQUIRED_PROJECT_KEYS, REQUIRED_SERVICE_KEYS, validateSiteContent} from '../src/lib/sanity/site-content'

const languages = ['en', 'zh'] as const
const copyFields = [
  'languageName','siteControlsLabel','primaryNavigationLabel','redirectMessage','redirectLinkLabel','alternateLanguage','themeLight','themeDark','viewWork','readNotes','contactAction','selectedWork','currentNotes','workspace','activeThreads','projectsTitle','notesTitle','projectLabel','noteLabel','servicesLabel','companyLabel','aboutLabel','contactLabel','definition','bestFor','overview','whyItMatters','outcomes','workflow','principles','checklist','examples','nextSteps','faq','footerCompany','footerContact','footerOffice',
]

function strings(fields: readonly string[]) { return Object.fromEntries(fields.map((field) => [field, `${field} copy`])) }
function page(id: string, type: string, language: 'en'|'zh', extra: Record<string, unknown> = {}) {
  return {_id: id, _type: type, language, title: `${type} title`, description: `${type} description`, eyebrow: `${type} eyebrow`, headline: `${type} headline`, headlineLines:[`${type} line`], lede: `${type} lede`, ...extra}
}
function validDocuments() {
  const documents: Array<Record<string, unknown>> = [{
    _id:'siteSettings', _type:'siteSettings', siteName:'Jeason Zhang', siteUrl:'https://beishuyinqing.cn', authorName:'Jeason Zhang', githubUrl:'https://github.com/jeasonzhang-eth', llmsDescription:'Entity description', defaultLanguage:'zh',
    legalNameZh:'深圳市倍数引擎软件技术有限责任公司', legalNameEn:'Shenzhen Multiple Engine Software Technology Co., Ltd.', shortNameZh:'倍数引擎', shortNameEn:'Multiple Engine',
    phoneDisplay:'185 9314 1894', phoneHref:'tel:18593141894', addressZh:'深圳地址', addressEn:'Shenzhen address', cityZh:'深圳', cityEn:'Shenzhen', postalCode:'518000', countryCode:'CN', icpNumber:'粤ICP备号', icpUrl:'https://beian.miit.gov.cn', verificationFile:'verify.txt',
    defaultSeoTitle:'Default title', defaultSeoDescription:'Default description',
  }]
  for (const language of languages) {
    documents.push({_id:`siteCopy-${language}`,_type:'siteCopy',language,...strings(copyFields)})
    documents.push(page(`homePage-${language}`,'homePage',language,{identity:'identity',primaryActionsLabel:'actions',artworkAlt:'alt',artworkCaption:'caption',servicesTitle:'services title',servicesIntro:'services intro',methodEyebrow:'method eyebrow',methodTitle:'method title',methodSteps:['one'],companyEyebrow:'company eyebrow',companyTitle:'company title',companyText:'company text'}))
    documents.push(page(`aboutPage-${language}`,'aboutPage',language,{experienceTitle:'experience',experience:['one'],focusTitle:'focus',focus:['one'],workTitle:'work',work:['one'],contactTitle:'contact',contact:'contact text'}))
    documents.push(page(`companyPage-${language}`,'companyPage',language,{artworkAlt:'alt',artworkCaption:'caption',relationshipTitle:'relationship',relationship:'text',fieldsTitle:'fields',fields:['one'],principlesTitle:'principles',principles:['one'],missionTitle:'mission',mission:'text',ctaTitle:'cta',ctaText:'text',ctaLabel:'label'}))
    documents.push(page(`contactPage-${language}`,'contactPage',language,{companyLabel:'company',phoneLabel:'phone',addressLabel:'address',icpLabel:'icp',callAction:'call',callDescription:'description',cooperationTitle:'cooperation',cooperationText:'text'}))
    documents.push(page(`servicesPage-${language}`,'servicesPage',language,{artworkAlt:'alt',artworkCaption:'caption',bestForLabel:'best',deliverablesLabel:'deliverables',processLabel:'process',evidenceLabel:'evidence',boundariesLabel:'boundaries',ctaTitle:'cta',ctaText:'text',ctaLabel:'label'}))
    documents.push({_id:`projectsPage-${language}`,_type:'projectsPage',language,title:'Projects',description:'Projects description',eyebrow:'Projects'})
    documents.push({_id:`notesPage-${language}`,_type:'notesPage',language,title:'Notes',description:'Notes description',eyebrow:'Notes'})
  }
  REQUIRED_PROJECT_KEYS.forEach((translationKey, order) => languages.forEach((language) => documents.push({_id:`project-${translationKey}-${language}`,_type:'project',language,translationKey,slug:translationKey,title:`${translationKey} ${language}`,kind:'Product',summary:'summary',definition:'definition',audience:'audience',overview:'overview',why:'why',outcomes:['outcome'],workflow:['step'],next:'next',faq:[{question:'q',answer:'a'}],featured:order<3,order})))
  REQUIRED_SERVICE_KEYS.forEach((translationKey, order) => languages.forEach((language) => documents.push({_id:`service-${translationKey}-${language}`,_type:'service',language,translationKey,slug:translationKey,title:`${translationKey} ${language}`,summary:'summary',bestFor:'best for',deliverables:['item'],process:['step'],evidence:'evidence',boundaries:'boundaries',enabled:true,order})))
  return documents
}

test('validation builds a complete bilingual site snapshot', () => {
  const content = validateSiteContent(validDocuments())
  assert.equal(content.site.url, 'https://beishuyinqing.cn')
  assert.equal(content.projects.length, 6)
  assert.equal(content.services.length, 5)
  assert.equal(content.home.zh.methodSteps[0], 'one')
})

test('validation rejects missing fixed IDs and localizable pairs', () => {
  assert.throws(() => validateSiteContent(validDocuments().filter((document) => document._id !== 'homePage-en')), /missing required homePage-en/)
  assert.throws(() => validateSiteContent(validDocuments().filter((document) => document._id !== `project-${REQUIRED_PROJECT_KEYS[0]}-en`)), /missing project translation/)
})

test('validation rejects duplicate IDs, unsafe settings, and incomplete fields', () => {
  const duplicate = validDocuments(); duplicate.push({...duplicate[0]})
  assert.throws(() => validateSiteContent(duplicate), /duplicate id/)
  const badUrl = validDocuments(); badUrl[0] = {...badUrl[0], siteUrl:'http://example.com'}
  assert.throws(() => validateSiteContent(badUrl), /siteUrl/)
  const emptySteps = validDocuments(); const home = emptySteps.find((document) => document._id === 'homePage-en')!; home.methodSteps=[]
  assert.throws(() => validateSiteContent(emptySteps), /methodSteps/)
})

test('validation rejects duplicate collection routes and disabled required services', () => {
  const duplicateRoute = validDocuments(); const project = duplicateRoute.find((document) => document._id === `project-${REQUIRED_PROJECT_KEYS[1]}-en`)!; project.slug=REQUIRED_PROJECT_KEYS[0]
  assert.throws(() => validateSiteContent(duplicateRoute), /duplicate project route/)
  const disabled = validDocuments(); const service = disabled.find((document) => document._type === 'service')!; service.enabled=false
  assert.throws(() => validateSiteContent(disabled), /required service is disabled/)
})
