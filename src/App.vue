<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const activeProductTab = ref('instrument')
const activeIndustryTab = ref('wire')
const currentAboutInfoTab = ref('core')
let aboutShowcaseTimer = null

const nav = [
  { label: '首页', path: '/' },
  { label: '公司概览', path: '/about' },
  { label: '产品中心', path: '/products' },
  { label: '行业应用', path: '/solutions' },
  { label: '新闻中心', path: '/news' },
  { label: '联系我们', path: '/contact' }
]

const subHeroVisuals = {
  products: { image:'./assets/cmk-home.png', label:'PRODUCT SYSTEM', note:'仪器检测 · 运动控制' },
  solutions: { image:'./assets/hmc-c04-j05-home.png', label:'SMART SOLUTION', note:'控制 · 视觉 · 上位系统' },
  news: { image:'./assets/pressure-home.png', label:'TECHNOLOGY UPDATE', note:'产品动态 · 企业信息' },
  about: { image:'./assets/about-frontdesk.png', label:'HUIZHONG INTELLIGENCE', note:'2013 — 至今' },
  contact: { image:'./assets/hec-ety64-x04-transparent.png', label:'SERVICE & SUPPORT', note:'咨询 · 下载 · 售后' }
}

const productTabs = [
  { k:'instrument', n:'仪器仪表' },
  { k:'motion', n:'运动控制卡' },
  { k:'vision', n:'视觉检测' },
  { k:'mes', n:'MES看板' },
  { k:'software', n:'定制软件' }
]

const products = [
  {
    id:'cmk', type:'instrument', no:'01', title:'CMK检测仪', en:'INSTRUMENT', image:'./assets/cmk-home.png',
    desc:'CMK检测仪是国内首款针对端子机稳定测试的测量仪器，该系统通过高精度的位移传感器和压力传感器，测量端子机重复压接高度和压力的一致性，并自动生成检测报告。',
    chips:['位移传感器','压力传感器','自动生成检测报告'],
    detailDate:'2025-08-06',
    detailParagraphs:[
      'CMK检测仪是国内首款针对端子机稳定测试的测量仪器，该系统通过高精度的位移传感器和压力传感器，测量端子机重复压接高度和压力的一致性，并自动生成检测报告。',
      '该系统也提供了扫码和联网的功能，可以在端子机上贴一个身份识别的二维码，然后通过CMK检测仪扫码后开始检测，检测完成上传检测报告到云端，访问报告的时候通过扫码端子机上的二维码访问。'
    ],
    detailPoints:[
      '压力重复精度：0.5%',
      '压接高度精测精度：0.0001MM',
      '自动生成端子机CMK检测报告',
      '可扫码上传报告，并通过手机扫码访问',
      '界面美观、操作简单、向导式操作'
    ]
  },
  {
    id:'pull-height', type:'instrument', no:'02', title:'拉力高度测试仪', en:'INSTRUMENT', image:'./assets/pull-height-home.png',
    desc:'该仪器是一款专业测试端子拉拔力的设备，可以检测端子高度、宽度和拉力，实现产品的首检和点检功能。',
    chips:['端子高度','宽度检测','拉力测试'],
    detailDate:'2025-08-04',
    detailParagraphs:[
      '拉力高度测试仪于今年6月正式上线啦，该仪器是一款专业测试端子拉拔力的设备，可以检测端子高度、宽度和拉力，实现产品的首检和点检功能，可以有效管控产品质量。该设备简单易用，一键测试、判断检测结果、记录检测数据、生成检测报告。并提供扫码和联网功能，可以直接对接工厂端的MES系统。'
    ],
    detailPoints:[
      '操作简单：傻瓜式操作、数据自动记录、图形展示',
      '高精度检测：压力检测精度0.1g，高度检测精度0.001MM',
      '可连接MES：测试数据可上传至工厂MES，并接收MES派发的检测任务',
      '连接设备：可配套自动机和半自动端子机使用，实现设备的首检和点检功能，合格后放行，保证产品质量',
      '通讯口丰富：USB、Wi-Fi、网口',
      '可连接扫码枪：方便工厂进行来料管控'
    ]
  },
  {
    id:'pressure', type:'instrument', no:'03', title:'压力管理检测仪', en:'INSTRUMENT', image:'./assets/pressure-home.png',
    desc:'压力管理是一种端子压接的全过程进行检测的系统，以保证端子压接质量的稳定性，提高良品率，系统捕捉每次的压接信号，开始采集曲线，再将当前曲线和模板曲线进行对比来分析压接质量的好坏。',
    chips:['压接全过程检测','曲线采集','模板曲线对比'],
    detailDate:'2024-08-28',
    detailParagraphs:[
      '压力管理是一种端子压接的全过程进行检测的系统，以保证端子压接质量的稳定性，提高良品率，系统捕捉每次的压接信号，开始采集曲线，再将当前曲线和模板曲线进行对比来分析压接质量的好坏。'
    ],
    detailPoints:[
      '高速采集：采样频率100KHz，显现更精准的曲线采集，强大的芯片处理能力，分析后及时给出结果。',
      '算法强大：先进的压力曲线算法，提供高精度的缺陷检测，减少误报。',
      '全方位检测：可有效检测出端子压接过程的不良，包括胶皮咬入压接位置、断铜丝、压接尺寸变化、端子变形、模具损坏等。',
      '操作简单：可以用于各种自动或半自动压接机，使用简单、傻瓜式操作。',
      '大小线功能：可以实现多种线材打同一种端子，每一种线材都有自己独立的参数。',
      '系统能力强大：压力管理可以嵌入到视觉系统、上位机系统里，提升系统整合能力，为设备连接MES系统提供强有力的支持。'
    ]
  },
  {
    id:'hmc-c04-j05', type:'motion', no:'04', title:'HMC-C04-J05 简易4轴-打码机专用', en:'MOTION CONTROL', image:'./assets/hmc-c04-j05-home.png',
    desc:'采用脉冲输出方式、OC输出方式，频率1Hz~200KHz；I/O：8入8出，可扩展512路，输出电流500mA；1个以太网口，支持ModbusTCP协议；1个RS485接口、1个485接口，支持Modbus和自由口协议；支持USB数据导入和程序更新。',
    chips:['4轴控制','ModbusTCP','USB程序更新'], detailDate:'2025-09-29',
    detailParagraphs:['HMC-C04-J05是一款面向打码机等设备场景的简易4轴运动控制卡，支持脉冲输出、OC输出、以太网与串口通信，并可通过USB进行数据导入和程序更新。'],
    detailPoints:['频率1Hz~200KHz','I/O：8入8出，可扩展512路','支持ModbusTCP、Modbus及自由口协议','支持USB数据导入和程序更新']
  },
  {
    id:'hmc-t02', type:'motion', no:'05', title:'HMC-T02 简易2轴运动控制卡', en:'MOTION CONTROL', image:'./assets/hmc-t02-transparent.png',
    desc:'采用脉冲输出方式，方向+脉冲的集电极信号输出，频率最大200KHz；1路编码器口，最高计数频率4Mhz；I/O板内支持16路输入16路输出，可扩展512路；3路RS485接口，支持标准Modbus和自由协议；支持USB接口数据传输和程序升级。',
    chips:['2轴控制','编码器接口','RS485'], detailDate:'2025-09-29',
    detailParagraphs:['HMC-T02是一款简易2轴运动控制卡，适合需要脉冲控制、编码器采集、I/O扩展和RS485通信的设备控制场景。'],
    detailPoints:['频率最大200KHz','1路编码器口，最高计数频率4Mhz','板内支持16路输入16路输出，可扩展512路','3路RS485接口，支持标准Modbus和自由协议']
  },
  {
    id:'hec-ety64-x04', type:'motion', no:'06', title:'HEC-ETY64-X04 / HEC-ETXY32-X04 总线卡', en:'MOTION CONTROL', image:'./assets/hec-ety64-x04-transparent.png',
    desc:'HEC-ETXY32-X04：I/O：32入32出，可扩展512路，输出电流500mA。',
    chips:['32入32出','可扩展512路','输出电流500mA'], detailDate:'2025-09-29',
    detailParagraphs:['HEC-ETY64-X04 / HEC-ETXY32-X04面向设备总线控制与I/O扩展场景，可根据设备规模进行扩展，并提供稳定的工业通信能力。'],
    detailPoints:['I/O：32入32出','可扩展512路','输出电流500mA']
  }
]

const industryTabs = [
  { k:'wire', n:'线束行业' },
  { k:'dispensing', n:'点胶行业' },
  { k:'led', n:'LED行业' },
  { k:'3c', n:'3C行业' },
  { k:'other', n:'其他行业' }
]

const industryItems = [
  {
    id:'wire-integration', type:'wire', date:'09.06', year:'2024', title:'设备系统集成方案', sub:'线束行业 - 设备系统集成方案', image:'./assets/industry-integration.png', detailImage:'./assets/industry-integration-detail.png',
    detailDate:'2024-09-06',
    detailTitle:'系统描述',
    detailText:'一个线束设备有控制、压力管理、视觉、上位系统等模块，现在汇众已经可以做到整个系统集成，并且可以对接MES系统。以前都是有几个供应商一起完成，有些供应商还是几个人的团队，所以每个技术模块都很独立分散，这个设备商带来的很大的困扰，整个系统不仅成本上去了，供应商还容易扯皮，沟通成本和时间成本都增加了。汇众整体方案可以有效这些问题，整体成本也会更低。',
    bullets:['控制层、驱动层、检测层与上位系统整合','支持MES系统对接','降低多供应商沟通成本'],
    secondaryTitle:'方案亮点',
    secondaryText:'围绕线束设备全流程，提供从底层控制到上位软件的一体化系统方案。'
  },
  {
    id:'wire-mes', type:'wire', date:'08.28', year:'2024', title:'线束行业-MES解决方案', sub:'工厂 MES解决方案', image:'./assets/industry-mes.png', detailImage:'./assets/industry-mes-detail.png',
    detailDate:'2024-08-28',
    detailTitle:'系统描述',
    detailText:'面向线束制造场景，汇众可结合设备端数据采集、质量检测与上位软件，搭建贴合现场流程的MES方案，帮助企业实现工单流转、状态监控、质量追溯与数据看板展示。',
    bullets:['工单与设备数据联动','品质追溯与过程监控','支持现场看板与报表'],
    secondaryTitle:'应用价值',
    secondaryText:'让设备信息、生产进度与质量数据统一沉淀，提升管理效率。'
  },
  {
    id:'wire-overview', type:'wire', date:'06.12', year:'2024', title:'线束行业', sub:'线束行业综合解决方案', image:'./assets/industry-wire.png', detailImage:'./assets/industry-wire-detail.png',
    detailDate:'2024-06-12',
    detailTitle:'系统描述',
    detailText:'针对线束行业常见的检测、压接、传输与控制需求，汇众可提供仪器仪表、视觉检测、运动控制及上位软件协同方案，帮助设备厂商快速形成稳定的整机能力。',
    bullets:['仪器检测 + 视觉检测组合','运动控制与上位软件联动','适配多种线束设备场景'],
    secondaryTitle:'应用价值',
    secondaryText:'通过模块化能力组合，快速落地线束行业自动化设备解决方案。'
  }
]

const filteredIndustryItems = computed(() => industryItems.filter(item => item.type === activeIndustryTab.value))
const currentIndustryName = computed(() => industryTabs.find(t => t.k === activeIndustryTab.value)?.n || '')
const currentSolution = computed(() => industryItems.find(item => item.id === route.params.id) || industryItems[0])


const news = [
  {
    id:'pull-height-launch', date:'06.16', year:'2025', detailDate:'2025-06-16', tag:'产品动态', title:'拉力高度测试仪重磅上线',
    desc:'该仪器是一款专业测试端子拉拔力的设备，可以检测端子高度、宽度和拉力，实现产品的首检和点检功能。', image:'./assets/news-pull-height.png', productImage:'./assets/pull-height-home.png',
    paragraphs:[
      '拉力高度测试仪于今年6月正式上线啦，该仪器是一款专业测试端子拉拔力的设备，可以检测端子高度、宽度和拉力，实现产品的首检和点检功能，可以有效管控产品质量。该设备简单易用，一键测试、判断检测结果、记录检测数据、生成检测报告。并提供扫码和联网功能，可以直接对接工厂端的MES系统。'
    ],
    points:[
      '操作简单：傻瓜式操作、数据自动记录、图形展示',
      '高精度检测：压力检测精度0.1g，高度检测精度0.001MM',
      '可连接MES：测试数据可上传至工厂MES，并接收MES派发的检测任务',
      '连接设备：可配套自动机和半自动端子机使用，实现设备的首检和点检功能，合格后放行，保证产品质量',
      '通讯口丰富：USB、Wi-Fi、网口',
      '可连接扫码枪：方便工厂进行来料管控'
    ]
  },
  {
    id:'cmk-launch', date:'08.23', year:'2024', detailDate:'2024-08-23', tag:'产品动态', title:'CMK检测仪正式上线',
    desc:'CMK检测仪是国内首款针对端子机稳定测试的测量仪器，该系统通过高精度的位移传感器和压力传感器，测量端子机重复压接高度和压力的一致性，并自动生成检测报告。', image:'./assets/news-cmk.png', productImage:'./assets/cmk-home.png',
    paragraphs:[
      'CMK检测仪是国内首款针对端子机稳定测试的测量仪器，该系统通过高精度的位移传感器和压力传感器，测量端子机重复压接高度和压力的一致性，并自动生成检测报告。',
      '该系统也提供了扫码和联网的功能，可以在端子机上贴一个身份识别的二维码，然后通过CMK检测仪扫码后开始检测，检测完成上传检测报告到云端，访问报告的时候通过扫码端子机上的二维码访问。'
    ],
    points:['压力重复精度：0.5%','压接高度精测精度：0.0001MM','自动生成端子机CMK检测报告','可扫码上传报告，并通过手机扫码访问','界面美观、操作简单、向导式操作']
  },
  {
    id:'relocation', date:'09.17', year:'2026', detailDate:'2026-09-17', tag:'公司动态', title:'汇众智慧即将乔迁深圳工业软件园',
    desc:'因业务持续升级、团队规模不断壮大及研发协作空间需求提升，汇众智慧计划乔迁至深圳工业软件园。', image:'./assets/about-frontdesk.png', productImage:'./assets/about-frontdesk.png',
    paragraphs:[
      '随着公司业务持续升级、团队规模不断壮大，现有办公空间已逐步难以满足研发、项目交付与跨部门协作需求。为进一步提升办公与研发环境、强化技术团队协同效率，深圳市汇众智慧科技有限公司计划乔迁至深圳工业软件园。',
      '拟迁新址：广东省深圳市龙岗区深圳工业软件园（坂嘉路与坂李大道交叉口正北方向约146米）。新办公地点将承载公司后续研发、项目管理、客户服务及团队协作等更多职能。',
      '乔迁筹备期间，公司各项业务、项目交付与售后服务将保持正常运行。具体启用时间及后续联系信息如有调整，将通过公司官网另行通知。'
    ],
    points:['业务持续升级，办公与研发空间同步扩充','团队规模不断壮大，提升跨部门协作效率','新址位于深圳工业软件园，进一步贴近产业与技术生态']
  }
]

const historyItems = [
  { range:'2013~2013', title:'成立', text:'深圳市汇众智慧科技有限公司成立于2013年5月，注册资本500万元，是一家国家高新技术企业，专为机械制造行业提供专业自动化解决方案。' },
  { range:'2014~2016', title:'坚持', text:'进一步确立核心团队以差异化项目咨询与企业信息化建设为核心，压力业务范围辐射整个广东省。' },
  { range:'2017~2019', title:'发展', text:'坚持走差异化服务为方向，探索创新型机械制造行业提供专业自动化解决方案。' },
  { range:'2020~2021', title:'提速', text:'迈向战略新高度，从专业服务转向到专注服务，确定工业系统解决方案为核心，专注细节服务，全系统与企业合作。' },
  { range:'2022~2022', title:'飞跃', text:'实行资源整合战略建立一体化服务方式，公司新址迁入甲级商务写字楼创客园，标志着汇众智慧进入企业发展时期。' },
  { range:'2023~2023', title:'优化', text:'通过外来精英资源纳入，实行开放式管理服务团队从原来几十人发展到上百人，业务范围拓展至全中国。' },
  { range:'2024~2024', title:'强化', text:'引入标准化流程管理制度，通过科学工具导入，提升项目服务效率与服务品质。' },
  { range:'2025~以后', title:'创造', text:'以专业为根基，以细节为准则，始终以超越期待的温度服务每一份托付，并结合国际发展趋势不断强化自己……' }
]

const honors = [
  { title:'5轴运动IO扩展卡软件著作权', image:'./assets/user-honor-01.png' },
  { title:'多轴运动控制平台相关证书', image:'./assets/user-honor-02.png' },
  { title:'创新型中小企业证书', image:'./assets/user-honor-03.png' },
  { title:'通讯驱动板软件著作权', image:'./assets/user-honor-04.png' },
  { title:'轨迹生成软件 2017', image:'./assets/user-honor-05.png' },
  { title:'专精特新证书', image:'./assets/user-honor-06.jpg' },
  { title:'知识产权相关证书', image:'./assets/user-honor-07.png' },
  { title:'电机驱动板软件著作权', image:'./assets/user-honor-08.png' },
  { title:'步进驱动器软件著作权', image:'./assets/user-honor-09.png' },
  { title:'运动控制卡软件著作权', image:'./assets/user-honor-10.png' },
  { title:'专精特新企业认证', image:'./assets/user-honor-11.jpg' },
  { title:'高新技术企业证书', image:'./assets/user-honor-12.png' },
  { title:'知识产权管理体系认证证书', image:'./assets/user-honor-13.png' }
]

const activities = [
  { title:'汇众智慧2024年年会', image:'./assets/activity-cover-annual.png' },
  { title:'2025元宵剪影', image:'./assets/activity-cover-lantern.png' },
  { title:'年会舞蹈串烧', image:'./assets/activity-cover-dance-mix.png' },
  { title:'年会之美食', image:'./assets/activity-cover-food.png' },
  { title:'年会游戏', image:'./assets/activity-cover-game.png' },
  { title:'2025开门红', image:'./assets/activity-cover-opening.png' },
  { title:'年会小品', image:'./assets/activity-cover-skit.png' },
  { title:'年会之舞蹈', image:'./assets/activity-cover-dance.png' }
]

const downloads = [
  { date:'08.07', year:'2025', title:'压力管理产品选型手册', image:'./assets/download-pressure.png' },
  { date:'07.08', year:'2025', title:'线束行业画册', image:'./assets/download-wire-brochure.png' },
  { date:'06.20', year:'2025', title:'线束设备方案画册', image:'./assets/download-wire-solution.png' },
  { date:'06.18', year:'2025', title:'CMK测试仪-用户手册', image:'./assets/download-cmk-manual.png' },
  { date:'05.06', year:'2025', title:'Wi-Fi版压力管理说明资料 - 英文版', image:'./assets/download-wifi-en.png' },
  { date:'08.30', year:'', title:'深圳市汇众智慧科技有限公司产品与解决方案', image:'./assets/download-company-solutions.png' }
]


const aboutTabs = [
  { key:'about', label:'关于我们' },
  { key:'history', label:'发展历程' },
  { key:'honor', label:'荣誉资质' },
  { key:'activity', label:'公司活动' }
]

const companyIntro = '深圳市汇众智慧科技有限公司成立于2013年，拥有国家高新技术企业、专精特新企业认证，同时拥有多项发明专利、软件著作权、实用新型等知识产权。公司专注于运动控制、机器视觉、上位系统的开发、应用开发和销售，为客户提供专业的设备自动化综合性系统解决方案。'

const aboutInfoTabs = [
  { key:'core', label:'核心业务' },
  { key:'tech', label:'技术优势' },
  { key:'application', label:'应用领域' },
  { key:'vision', label:'愿景' }
]

const aboutInfoSections = {
  core: {
    title:'核心业务',
    items:[
      '运动控制卡开发：公司已成功开发出多系列的运动控制卡，广泛应用于各种自动化设备中。',
      '机器视觉检测与定位：提供高精度的视觉检测和定位解决方案，帮助客户实现精准的自动化操作。',
      '上位软件开发服务：为客户定制开发上位机软件，提升设备的智能化及工业4.0水平。',
      '仪器仪表检测系统开发：开发高精度的传感器检测系统，满足不同行业的精密检测需求。',
      '行业系统解决方案：为多个行业提供从底层研发到设备自动化的完整解决方案，涵盖3C、LED、线束、新能源、半导体、包装等机械行业。'
    ]
  },
  tech: {
    title:'技术优势',
    items:[
      '一站式服务：汇众智慧是国内少数能够提供从底层研发到设备自动化系统解决方案的一站式服务的公司。',
      '丰富的行业经验：公司拥有一支优秀的技术团队，多年来在实际案例中积累了丰富的经验，能够根据客户需求和行业发展趋势，提供定制化的解决方案。',
      '自动化控制平台：公司致力于打造一个完整的自动化控制平台，让每个客户都能体验到私人定制的服务。'
    ]
  },
  application: {
    title:'应用领域',
    items:[
      '3C行业：为电子产品制造提供高精度的自动化解决方案。',
      'LED行业：提供高效的LED生产设备自动化系统。',
      '线束行业：为线束制造提供精准的自动化检测和控制系统。',
      '新能源行业：支持新能源设备的高效生产和检测。',
      '半导体行业：提供高精度的半导体制造自动化解决方案。',
      '包装行业：为包装机械提供智能化的控制系统。'
    ]
  },
  vision: {
    title:'愿景',
    text:'汇众智慧以客户需求和行业发展为导向，致力于将先进的技术嵌入各个行业，推动中国设备制造企业的自动化升级，助力中国工业4.0的发展，持续为中小智能制造企业赋能控制系统。通过不断的技术创新和优质的服务，汇众智慧正在成为中国自动化领域的重要力量，为客户提供最具性价比的产品和系统解决方案。'
  }
}

const contactTabs = [
  { key:'contact', label:'联系我们' },
  { key:'download', label:'下载中心' },
  { key:'service', label:'售后服务' }
]

const currentKey = computed(() => {
  if (route.path.startsWith('/product/')) return 'productDetail'
  if (route.path.startsWith('/solution/')) return 'solutionDetail'
  if (route.path.startsWith('/news/')) return 'newsDetail'
  if (route.path === '/support') return 'contact'
  return route.path === '/' ? 'home' : route.path.slice(1)
})

const currentProduct = computed(() => products.find(p => p.id === route.params.id) || products[0])
const currentNews = computed(() => news.find(n => n.id === route.params.id) || news[0])
const filteredProducts = computed(() => products.filter(p => p.type === activeProductTab.value))
const currentAboutTab = computed(() => aboutTabs.some(t => t.key === route.query.tab) ? route.query.tab : 'about')
const currentContactTab = computed(() => contactTabs.some(t => t.key === route.query.tab) ? route.query.tab : 'contact')
const homeNewsTrack = ref(null)
const newsPageTrack = ref(null)

function go(path) {
  menuOpen.value = false
  router.push(path)
}
function setAboutTab(tab){ router.push({ path:'/about', query:{ tab } }) }
function setContactTab(tab){ router.push({ path:'/contact', query:{ tab } }) }
function openSolution(id){ router.push('/solution/' + id) }
function demoDownload(){ alert('当前演示版仅展示资料目录，未接入原官网下载文件。') }
function scrollNewsTrack(target, direction){
  const el = target === 'home' ? homeNewsTrack.value : newsPageTrack.value
  if (!el) return
  const amount = Math.min(Math.max(el.clientWidth * 0.72, 360), 560)
  el.scrollBy({ left: amount * direction, behavior: 'smooth' })
}

watch(() => route.params.id, () => {
  if (currentKey.value === 'solutionDetail' && currentSolution.value?.type) {
    activeIndustryTab.value = currentSolution.value.type
  }
}, { immediate: true })

let io
function observeReveals(){
  nextTick(() => document.querySelectorAll('.reveal').forEach(el => {
    if (!el.dataset.io) { el.dataset.io='1'; io?.observe(el) }
  }))
}
watch(() => route.fullPath, () => { window.scrollTo({ top: 0, behavior: 'smooth' }); observeReveals() })
watch(activeProductTab, () => observeReveals())
watch(activeIndustryTab, () => observeReveals())

function setAboutInfoTab(key){
  currentAboutInfoTab.value = key
  startAboutShowcaseAuto()
}
function startAboutShowcaseAuto(){
  stopAboutShowcaseAuto()
  aboutShowcaseTimer = setInterval(() => {
    const currentIndex = aboutInfoTabs.findIndex(item => item.key === currentAboutInfoTab.value)
    const next = aboutInfoTabs[(currentIndex + 1) % aboutInfoTabs.length]
    currentAboutInfoTab.value = next.key
  }, 5200)
}
function stopAboutShowcaseAuto(){
  if(aboutShowcaseTimer){
    clearInterval(aboutShowcaseTimer)
    aboutShowcaseTimer = null
  }
}

onMounted(() => {
  io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('show')), { threshold: .12 })
  observeReveals()
  startAboutShowcaseAuto()
})
onUnmounted(() => {
  io?.disconnect()
  stopAboutShowcaseAuto()
})

const currentSubHeroVisual = computed(() => subHeroVisuals[currentKey.value] || subHeroVisuals.products)
const subHeroIndex = computed(() => ({ about:'02', products:'03', solutions:'04', news:'05', contact:'06' }[currentKey.value] || '01'))

const pageMeta = computed(() => ({
  products:['PRODUCT CENTER','产品中心','仪器仪表 · 运动控制卡 · 视觉检测 · MES看板 · 定制软件'],
  solutions:['INDUSTRY APPLICATION','行业应用','从技术模块到真实设备现场'],
  news:['NEWS CENTER','新闻中心','产品动态与企业信息'],
  about:['COMPANY PROFILE','公司概览','了解汇众智慧的发展、资质与企业活动'],
  contact:['CONTACT US','联系我们','联系方式 · 下载中心 · 售后服务']
}[currentKey.value] || ['HUIZHONG INTELLIGENCE','汇众智慧','技术嵌入行业']))
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="header-inner">
        <button class="brand" @click="go('/')">
          <img src="./assets/logo.png" alt="汇众智慧" style="height:48px;width:auto;display:block">
        </button>
        <nav :class="['main-nav', { open: menuOpen }]">
          <button v-for="item in nav" :key="item.path" :class="{ active: route.path === item.path || (item.path === '/products' && route.path.startsWith('/product/')) || (item.path === '/solutions' && route.path.startsWith('/solution/')) || (item.path === '/news' && route.path.startsWith('/news/')) || (item.path==='/contact' && route.path==='/support') }" @click="go(item.path)">{{ item.label }}</button>
        </nav>
        <div class="header-actions">
          <button class="search-btn" aria-label="搜索"><span></span></button>
          <div class="lang-switch"><b>CN</b><span>/</span><button>EN</button></div>
          <button class="consult-btn" @click="go('/contact')">业务咨询 <b>→</b></button>
          <button class="menu-btn" @click="menuOpen = !menuOpen"><i></i><i></i><i></i></button>
        </div>
      </div>
    </header>

    <main>
      <template v-if="currentKey === 'home'">
        <section class="home-image-hero" aria-label="汇众智慧首页Banner">
          <img class="home-image-hero-bg" src="./assets/home-banner-stage-user.png" width="1984" height="793" alt="汇众智慧工业自动化产品展示" fetchpriority="high" decoding="sync">
          <div class="home-image-hero-copy">
            <p class="adaptive-eyebrow"><span></span> INDUSTRIAL AUTOMATION</p>
            <h1>以技术驱动产业<br><em>让设备更智能</em></h1>
            <p>专注运动控制、机器视觉与上位机系统的研发与应用，为设备制造企业提供稳定、易集成的自动化系统解决方案。</p>
            <div class="adaptive-actions">
              <button class="adaptive-primary" @click="go('/about')">了解我们 <b>→</b></button>
              <button class="adaptive-secondary" @click="go('/products')">查看产品中心</button>
            </div>
          </div>
        </section>

        <section class="ref-about ref-section about-text-only">
          <div class="ref-about-heading reveal">
            <p class="ref-eyebrow">ABOUT US</p>
            <h2>公司概览</h2>
            <span class="about-heading-line"></span>
            <button class="ref-link" @click="go('/about')">了解更多 <b>→</b></button>
          </div>
          <div class="ref-about-copy reveal about-text-panel">
            <p class="ref-body">{{ companyIntro }}</p>
            <div class="ref-about-stats">
              <div><b>2013</b><span>公司成立</span></div>
              <div><b>高新技术企业</b><span>核心资质</span></div>
              <div><b>专精特新</b><span>企业认证</span></div>
            </div>
          </div>
        </section>

        <section class="ref-products ref-section">
          <div class="ref-section-side reveal">
            <p class="ref-eyebrow">PRODUCTS</p>
            <h2>产品中心</h2>
            <span>围绕仪器检测与运动控制，持续提供稳定、可靠、易集成的产品能力。</span>
            <button class="ref-outline" @click="go('/products')">了解更多 <b>→</b></button>
          </div>
          <div class="ref-product-grid">
            <article v-for="item in products.slice(0,4)" :key="item.id" class="ref-product-card reveal" @click="go('/product/'+item.id)">
              <div class="ref-product-media"><img :src="item.image" :alt="item.title"></div>
              <div class="ref-product-copy">
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
                <button aria-label="查看产品详情">→</button>
              </div>
            </article>
          </div>
        </section>

        <section class="ref-industry ref-section">
          <div class="ref-section-side reveal">
            <p class="ref-eyebrow">INDUSTRIES</p>
            <h2>行业应用</h2>
            <span>从技术模块到真实设备现场，将硬件、控制与软件能力组合成可落地的技术方案。</span>
            <button class="ref-outline" @click="go('/solutions')">查看全部 <b>→</b></button>
          </div>
          <div class="ref-industry-grid industry-banner-grid industry-mosaic-grid">
            <article v-for="(item,index) in industryItems.slice(0,3)" :key="item.id" :class="['ref-industry-card','industry-banner-card','reveal','industry-mosaic-card','industry-mosaic-'+index]" @click="openSolution(item.id)">
              <div class="industry-banner-media">
                <img :src="item.image" :alt="item.title">
              </div>
              <div class="industry-banner-meta">
                <div><small>{{ item.year }} / {{ item.date }}</small><span>{{ item.sub }}</span></div>
                <b>→</b>
              </div>
            </article>
          </div>
        </section>

        <section class="ref-news ref-section home-news-scroll-section">
          <div class="ref-news-title reveal">
            <p class="ref-eyebrow">NEWS</p>
            <h2>新闻中心</h2>
            <div class="news-scroll-actions">
              <button aria-label="向左滚动" @click="scrollNewsTrack('home', -1)">←</button>
              <button aria-label="向右滚动" @click="scrollNewsTrack('home', 1)">→</button>
              <button class="news-more-btn" @click="go('/news')">全部新闻</button>
            </div>
          </div>
          <div ref="homeNewsTrack" class="ref-news-list news-horizontal-track home-news-track">
            <article v-for="item in news" :key="item.id" class="ref-news-row news-scroll-card reveal" @click="go('/news/'+item.id)">
              <div class="ref-news-thumb"><img :src="item.image" :alt="item.title"></div>
              <div class="ref-news-date"><span>{{ item.year }}</span><b>{{ item.date }}</b></div>
              <div class="ref-news-copy"><small>{{ item.tag }}</small><h3>{{ item.title }}</h3><p>{{ item.desc }}</p></div>
              <i>→</i>
            </article>
          </div>
        </section>

        <section class="ref-home-contact">
          <div><small>HUIZHONG INTELLIGENCE</small><h2>专注设备自动化综合性系统解决方案</h2><p>运动控制 · 机器视觉 · 上位系统 · 仪器检测</p></div>
          <button @click="go('/contact')">联系我们 <b>→</b></button>
        </section>
      </template>

      <template v-else-if="currentKey !== 'productDetail' && currentKey !== 'solutionDetail' && currentKey !== 'newsDetail'">
        <section class="adaptive-sub-hero sub-hero-clean">
          <div class="sub-grid-bg"></div>
          <div class="sub-hero-glow"></div>
          <div class="adaptive-sub-inner sub-hero-clean-inner">
            <div class="adaptive-sub-copy">
              <p>{{pageMeta[0]}}</p>
              <h1>{{pageMeta[1]}}</h1>
              <span>{{pageMeta[2]}}</span>
              <div class="sub-accent-line"><i></i><small>HUIZHONG INTELLIGENCE</small></div>
            </div>
            <div class="sub-clean-signature" aria-hidden="true">
              <b>{{subHeroIndex}}</b>
              <span>{{pageMeta[0]}}</span>
            </div>
          </div>
        </section>
      </template>

      <template v-if="currentKey === 'products'">
        <section class="section inner-section subpage-compact">
          <div class="inner-heading reveal"><div><p>PRODUCT CENTER</p><h2>产品中心</h2></div></div>
          <div class="filter-tabs reveal">
            <button v-for="tab in productTabs" :key="tab.k" :class="{active:activeProductTab===tab.k}" @click="activeProductTab=tab.k">{{ tab.n }}</button>
          </div>
          <div v-if="filteredProducts.length" class="home-product-grid product-center-home-grid">
            <article v-for="item in filteredProducts" :key="item.id" class="home-product-card" @click="go('/product/'+item.id)">
              <div class="product-tech-art">
                <img :src="item.image" :alt="item.title" class="home-product-image">
              </div>
              <div class="home-product-copy">
                <small>{{ item.en }}</small>
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
                <button>了解详情 <b>→</b></button>
              </div>
            </article>
          </div>
          <div v-else class="support-panel reveal" style="max-width:760px;margin:40px auto 0;text-align:center">
            <h3>暂无内容</h3>
            <p style="color:#7890aa;line-height:1.8;margin:0">当前分类暂无内容。</p>
          </div>
        </section>
      </template>

      <template v-if="currentKey === 'productDetail'">
        <section class="article-detail-page product-article-page">
          <div class="article-detail-head">
            <h1>{{ currentProduct.title }}</h1>
            <span>{{ currentProduct.detailDate }}</span>
          </div>
          <div class="article-detail-body">
            <p v-for="paragraph in currentProduct.detailParagraphs" :key="paragraph">{{ paragraph }}</p>
            <div class="article-product-visual">
              <img :src="currentProduct.image" :alt="currentProduct.title">
            </div>
            <div class="article-detail-points">
              <p v-for="item in currentProduct.detailPoints" :key="item">{{ item }}</p>
            </div>
          </div>
          <div class="article-detail-footer-actions">
            <button class="btn line" @click="go('/products')">返回产品中心</button>
            <button class="btn solid" @click="go('/contact')">联系咨询 <b>→</b></button>
          </div>
        </section>
      </template>

      <template v-if="currentKey === 'solutions'">
        <section class="section inner-section industry-center-section subpage-compact">
          <div class="inner-heading reveal"><div><p>INDUSTRY APPLICATION</p><h2>行业应用</h2></div></div>
          <div class="filter-tabs reveal industry-tabs">
            <button v-for="tab in industryTabs" :key="tab.k" :class="{active:activeIndustryTab===tab.k}" @click="activeIndustryTab=tab.k">{{ tab.n }}</button>
          </div>
          <div v-if="filteredIndustryItems.length" class="industry-page-card-grid">
            <article v-for="item in filteredIndustryItems" :key="item.id" class="industry-page-card reveal" @click="openSolution(item.id)">
              <div class="industry-page-card-media"><img :src="item.image" :alt="item.title"></div>
              <div class="industry-page-card-body">
                <small>{{ item.year }} / {{ item.date }}</small>
                <h3>{{ item.title }}</h3>
                <p>{{ item.sub }}</p>
                <button class="industry-link" @click.stop="openSolution(item.id)">查看详情 <b>→</b></button>
              </div>
            </article>
          </div>
          <div v-else class="support-panel industry-empty" style="max-width:760px;margin:40px auto 0;text-align:center">
            <h3>暂无内容</h3>
            <p style="color:#7890aa;line-height:1.8;margin:0">当前分类暂无内容。</p>
          </div>
        </section>
      </template>


      <template v-if="currentKey === 'solutionDetail'">
        <section class="section inner-section solution-detail-page subpage-compact">
          <div class="solution-detail-head reveal show">
            <h2>{{ currentSolution.title }}</h2>
            <span>{{ currentSolution.detailDate }}</span>
          </div>
          <div class="solution-detail-layout reveal show">
            <div class="solution-detail-visual">
              <img :src="currentSolution.detailImage || currentSolution.image" :alt="currentSolution.title">
            </div>
            <div class="solution-detail-content">
              <div class="solution-detail-block">
                <h3>{{ currentSolution.detailTitle }}</h3>
                <p>{{ currentSolution.detailText }}</p>
              </div>
              <div class="solution-detail-block">
                <h3>{{ currentSolution.secondaryTitle }}</h3>
                <ul>
                  <li v-for="item in currentSolution.bullets" :key="item">{{ item }}</li>
                </ul>
                <p>{{ currentSolution.secondaryText }}</p>
              </div>
              <div class="solution-detail-actions">
                <button class="btn solid" @click="go('/contact')">业务咨询 <b>→</b></button>
                <button class="btn line" @click="go('/solutions')">返回行业应用</button>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-if="currentKey === 'news'">
        <section class="section inner-section subpage-compact news-page-section">
          <div class="inner-heading reveal news-page-heading">
            <div><p>NEWS CENTER</p><h2>新闻中心</h2></div>
            <div class="news-scroll-actions page-news-actions">
              <button aria-label="向左滚动" @click="scrollNewsTrack('page', -1)">←</button>
              <button aria-label="向右滚动" @click="scrollNewsTrack('page', 1)">→</button>
            </div>
          </div>
          <div ref="newsPageTrack" class="news-subpage-track">
            <article v-for="(item,index) in news" :key="item.title" class="news-subpage-card reveal" @click="go('/news/'+item.id)">
              <div class="news-subpage-media">
                <img :src="item.image" :alt="item.title">
                <span>0{{ index + 1 }}</span>
              </div>
              <div class="news-subpage-content">
                <div class="news-subpage-meta"><span>{{item.year}} / {{item.date}}</span><b>{{item.tag}}</b></div>
                <h3>{{item.title}}</h3>
                <p>{{item.desc}}</p>
                <i>→</i>
              </div>
            </article>
          </div>
        </section>
      </template>

      <template v-if="currentKey === 'newsDetail'">
        <section class="article-detail-page news-article-page">
          <div class="article-detail-head">
            <h1>{{ currentNews.title }}</h1>
            <span>{{ currentNews.detailDate }}</span>
          </div>
          <div class="article-detail-body">
            <p v-for="paragraph in currentNews.paragraphs" :key="paragraph">{{ paragraph }}</p>
            <div class="article-product-visual news-detail-visual">
              <img :src="currentNews.productImage || currentNews.image" :alt="currentNews.title">
            </div>
            <div class="article-detail-points" v-if="currentNews.points?.length">
              <p v-for="item in currentNews.points" :key="item">{{ item }}</p>
            </div>
          </div>
          <div class="article-detail-footer-actions">
            <button class="btn line" @click="go('/news')">返回新闻中心</button>
            <button class="btn solid" @click="go('/contact')">联系我们 <b>→</b></button>
          </div>
        </section>
      </template>

      <template v-if="currentKey === 'about'">
        <section class="section inner-section about-tabs-section">
          <div class="filter-tabs reveal" style="margin-bottom:0">
            <button v-for="tab in aboutTabs" :key="tab.key" :class="{active:currentAboutTab===tab.key}" @click="setAboutTab(tab.key)">{{tab.label}}</button>
          </div>
        </section>

        <section v-if="currentAboutTab==='about'" class="section inner-section about-page about-page-full subpage-compact">
          <div class="about-overview-grid about-overview-grid-restored">
            <div class="about-copy reveal about-copy-wide about-copy-restored">
              <p>WHO WE ARE</p>
              <h2>深圳市汇众智慧科技有限公司</h2>
              <span class="about-lead">{{ companyIntro }}</span>
              <div class="about-stats about-stats-upgrade about-stats-wide">
                <div><b>2013</b><span>公司成立</span></div>
                <div><b>高新技术企业</b><span>核心资质</span></div>
                <div><b>专精特新</b><span>企业认证</span></div>
              </div>
            </div>

            <div class="about-side-card reveal about-side-card-restored">
              <img src="./assets/about-frontdesk.png" alt="汇众智慧公司前台">
            </div>
          </div>

          <div class="about-auto-showcase reveal" @mouseenter="stopAboutShowcaseAuto" @mouseleave="startAboutShowcaseAuto">
            <div class="about-showcase-rail">
              <p>OUR CAPABILITIES</p>
              <button v-for="(tab,index) in aboutInfoTabs" :key="tab.key" :class="{ active: currentAboutInfoTab === tab.key }" @click="setAboutInfoTab(tab.key)">
                <b>0{{ index + 1 }}</b><span>{{ tab.label }}</span><i></i>
              </button>
            </div>
            <div class="about-showcase-stage" :key="currentAboutInfoTab">
              <div class="about-showcase-head">
                <div>
                  <small>HUIZHONG INTELLIGENCE</small>
                  <h3>{{ aboutInfoSections[currentAboutInfoTab].title }}</h3>
                </div>
                <strong>{{ String(aboutInfoTabs.findIndex(item => item.key === currentAboutInfoTab) + 1).padStart(2,'0') }}</strong>
              </div>
              <template v-if="aboutInfoSections[currentAboutInfoTab].items">
                <div class="about-showcase-list">
                  <article v-for="(item,index) in aboutInfoSections[currentAboutInfoTab].items" :key="item">
                    <b>{{ String(index + 1).padStart(2,'0') }}</b><p>{{ item }}</p>
                  </article>
                </div>
              </template>
              <p v-else class="about-showcase-text">{{ aboutInfoSections[currentAboutInfoTab].text }}</p>
              <div class="about-showcase-progress"><i></i></div>
            </div>
          </div>
        </section>

        <section v-if="currentAboutTab==='history'" class="section inner-section history-section subpage-compact">
          <div class="inner-heading history-heading reveal">
            <div><p>DEVELOPMENT HISTORY</p><h2>发展历程</h2></div>
            <span>从成立到持续深化自动化系统能力，记录汇众智慧每一个阶段的积累与变化。</span>
          </div>
          <div class="history-flow">
            <article v-for="(item,index) in historyItems" :key="item.range" class="history-flow-item reveal">
              <div class="history-flow-year"><small>{{ String(index + 1).padStart(2,'0') }}</small><strong>{{ item.range }}</strong></div>
              <div class="history-flow-node"><i></i></div>
              <div class="history-flow-copy"><h3>{{ item.title }}</h3><p>{{ item.text }}</p></div>
            </article>
          </div>
        </section>

        <section v-if="currentAboutTab==='honor'" class="culture-section honor-scroll-section">
          <div class="culture-title reveal"><p>HONOR & QUALIFICATION</p><h2>荣誉资质</h2></div>
          <div class="honor-marquee honor-marquee-left" aria-label="荣誉资质第一排滚动展示">
            <div class="honor-track honor-track-left">
              <div v-for="loop in 2" :key="'top-'+loop" class="honor-set" :aria-hidden="loop === 2 ? 'true' : undefined">
                <article v-for="(item,i) in honors.slice(0,7)" :key="loop+'-top-'+item.title" class="honor-card">
                  <b>{{ String(i + 1).padStart(2,'0') }}</b><img :src="item.image" :alt="item.title"><h3>{{item.title}}</h3>
                </article>
              </div>
            </div>
          </div>
          <div class="honor-marquee honor-marquee-right" aria-label="荣誉资质第二排滚动展示">
            <div class="honor-track honor-track-right">
              <div v-for="loop in 2" :key="'bottom-'+loop" class="honor-set" :aria-hidden="loop === 2 ? 'true' : undefined">
                <article v-for="(item,i) in honors.slice(7)" :key="loop+'-bottom-'+item.title" class="honor-card">
                  <b>{{ String(i + 8).padStart(2,'0') }}</b><img :src="item.image" :alt="item.title"><h3>{{item.title}}</h3>
                </article>
              </div>
            </div>
          </div>
          <div class="activity-scroll-hint">双排滚动 · 鼠标移入暂停</div>
        </section>

        <section v-if="currentAboutTab==='activity'" class="culture-section activity-section">
          <div class="culture-title reveal"><p>COMPANY ACTIVITIES</p><h2>公司活动</h2></div>
          <div class="activity-marquee" aria-label="公司活动横向滚动展示">
            <div class="activity-track">
              <div v-for="loop in 2" :key="loop" class="activity-set" :aria-hidden="loop === 2 ? 'true' : undefined">
                <article v-for="(item,i) in activities" :key="`${loop}-${item.title}`" class="activity-card">
                  <b>{{ String(i + 1).padStart(2, '0') }}</b>
                  <img :src="item.image" :alt="item.title">
                  <h3>{{item.title}}</h3>
                </article>
              </div>
            </div>
          </div>
          <div class="activity-scroll-hint">横向滚动 · 鼠标移入暂停</div>
        </section>
      </template>

      <template v-if="currentKey === 'contact'">
        <section class="section inner-section contact-tabs-section">
          <div class="filter-tabs reveal" style="margin-bottom:0">
            <button v-for="tab in contactTabs" :key="tab.key" :class="{active:currentContactTab===tab.key}" @click="setContactTab(tab.key)">{{tab.label}}</button>
          </div>
        </section>

        <section v-if="currentContactTab==='contact'" class="section inner-section subpage-compact contact-modern-section">
          <div class="contact-modern-head reveal">
            <div><p>CONTACT US</p><h2>联系我们</h2></div>
            <span>如需产品选型、项目方案、技术支持或售后服务，欢迎与汇众智慧联系。</span>
          </div>
          <div class="contact-modern-grid">
            <div class="contact-modern-info reveal">
              <div class="contact-address-card">
                <small>COMPANY ADDRESS</small>
                <h3>深圳市汇众智慧科技有限公司</h3>
                <p>深圳市龙岗区坂田街道坂田社区管德宽创客园D栋二层</p>
              </div>
              <div class="contact-quick-grid">
                <article><small>服务热线</small><b>0755-83238487</b><span>工作日技术与售后咨询</span></article>
                <article><small>商务热线</small><b>199 2549 7983</b><span>项目合作与产品咨询</span></article>
                <article class="contact-email-card"><small>联系邮箱 / 投诉邮箱</small><b>hzzh@hzzh-kj.com</b><span>邮件咨询与问题反馈</span></article>
              </div>
            </div>
            <div class="contact-map-card reveal">
              <img src="./assets/contact-map-new.png" alt="汇众智慧位置地图">
              <div class="contact-map-overlay"><span>SHENZHEN · LONGGANG</span><b>汇众智慧</b></div>
            </div>
          </div>
        </section>

        <section v-if="currentContactTab==='download'" class="section inner-section subpage-compact download-modern-section">
          <div class="download-modern-head reveal">
            <div>
              <p>DOWNLOAD CENTER</p>
              <h2>下载中心</h2>
            </div>
            <span>产品手册、行业方案与使用资料统一归档，便于快速查找与下载。</span>
          </div>
          <div class="download-modern-grid">
            <article v-for="(item,index) in downloads" :key="item.title" class="download-modern-card reveal">
              <div class="download-modern-preview">
                <span class="download-index">{{ String(index + 1).padStart(2,'0') }}</span>
                <img :src="item.image" :alt="item.title">
              </div>
              <div class="download-modern-body">
                <div class="download-modern-meta">
                  <span>资料下载</span>
                  <time>{{ item.year ? item.year + ' / ' : '' }}{{ item.date }}</time>
                </div>
                <h3>{{item.title}}</h3>
                <p>产品资料与行业方案文档</p>
                <button @click="demoDownload">下载资料 <b>→</b></button>
              </div>
            </article>
          </div>
        </section>

        <section v-if="currentContactTab==='service'" class="section inner-section support-layout subpage-compact">
          <div class="support-intro reveal"><p>AFTER-SALES SERVICE</p><h2>售后服务</h2><span>如需产品使用、资料、故障排查或其他售后支持，可通过服务热线、商务热线或邮箱与汇众智慧联系。</span><div class="support-badges"><i>产品使用咨询</i><i>资料咨询</i><i>售后沟通</i><i>技术问题反馈</i></div></div>
          <div class="support-panel reveal"><h3>售后联系方式</h3><label>服务热线<input value="0755-83238487" readonly></label><label>商务热线<input value="199 2549 7983" readonly></label><label>联系邮箱<input value="hzzh@hzzh-kj.com" readonly></label><label>投诉邮箱<input value="hzzh@hzzh-kj.com" readonly></label></div>
        </section>
      </template>
    </main>

    <footer class="site-footer">
      <div class="footer-top">
        <div class="footer-brand"><img src="./assets/logo.png" alt="汇众智慧" style="height:54px;width:auto;display:block;filter:brightness(0) invert(1);opacity:.95"><p>专注运动控制、视觉、上位系统的开发、应用开发和销售，为客户提供专业的设备自动化综合性系统解决方案。</p></div>
        <div class="footer-links"><div><b>快速导航</b><button v-for="item in nav" :key="item.path" @click="go(item.path)">{{item.label}}</button></div><div><b>产品分类</b><span>仪器仪表</span><span>运动控制卡</span><span>视觉检测</span><span>MES看板</span><span>定制软件</span></div><div><b>联系我们</b><span>深圳市龙岗区坂田街道坂田社区管德宽创客园D栋二层</span><span>0755-83238487</span><span>hzzh@hzzh-kj.com</span></div></div>
      </div>
      <div class="footer-bottom"><span>© 2026 深圳市汇众智慧科技有限公司</span><span>www.hzzh-kj.com</span></div>
    </footer>
  </div>
</template>
