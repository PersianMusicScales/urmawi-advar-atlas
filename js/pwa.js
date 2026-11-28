"use strict";
/* PWA, responsive navigation, persistence and install layer — v4.4.0 */
const ADVAR_VERSION="4.4.0";
const PWA_TEXT={
 en:{family:"Persian Music Scales · Historical Theory Series",eyebrow:"A scholarly interactive edition",lead:"Explore al-Urmawī’s exact fret divisions, intervals, and modal theory.",start:"Start guided lesson",open:"Open Atlas",sources:"About the sources",dismissWelcome:"Do not show this opening next time",learn:"Learn",explore:"Explore",construct:"Construct",listen:"Listen",more:"More",mobileModes:"Species & Modes",mobileTrain:"Train & Data",modes:"Species & Modes",training:"Training & Data",instrument:"Instrument view",about:"About",settings:"Settings",install:"Install app",scales:"Persian Music Scales",showInstrument:"Show illustrative instrument",hideInstrument:"Hide illustrative instrument",zoomOut:"Zoom out",zoomIn:"Zoom in",play:"Play",settingsTitle:"Settings",settingWelcome:"Show opening screen on launch",settingMotion:"Reduce motion",aboutTitle:"About the Atlas",aboutSeries:"Persian Music Scales · Historical Theory Series",aboutSummary:"A multilingual digital-humanities atlas for exploring exact string divisions, interval structures, listening models, and modal categories.",creator:"Creator and developer",creatorCopy:"Researcher, independent developer, and creator of Persian Music Scales.",links:"Project links",close:"Close",installTitle:"Install Advar Atlas",installHelp:"Use your browser menu and choose “Install app” or “Add to Home Screen”.",offline:"You are offline. The cached Atlas remains available.",online:"Connection restored.",update:"A new version is available.",updateButton:"Update",orientationTitle:"Turn your phone sideways",orientationCopy:"Landscape view is required to display the complete monochord clearly.",orientationButton:"Open in landscape"},
 fa:{family:"گام‌های موسیقی ایرانی · مجموعهٔ نظریهٔ تاریخی",eyebrow:"ویرایش تعاملی پژوهشی",lead:"تقسیمات دقیق دستان، فواصل و نظریهٔ مقامی ارموی را کاوش کنید.",start:"شروع درس هدایت‌شده",open:"گشودن اطلس",sources:"دربارهٔ منابع",dismissWelcome:"این صفحه در اجرای بعدی نمایش داده نشود",learn:"آموزش",explore:"کاوش",construct:"ساخت",listen:"شنیدن",more:"بیشتر",mobileModes:"اجناس و ادوار",mobileTrain:"تمرین و داده",modes:"اجناس و ادوار",training:"تمرین و داده",instrument:"نمای ساز",about:"درباره",settings:"تنظیمات",install:"نصب برنامه",scales:"گام‌های موسیقی ایرانی",showInstrument:"نمایش ساز تصویری",hideInstrument:"پنهان‌کردن ساز تصویری",zoomOut:"کوچک‌نمایی",zoomIn:"بزرگ‌نمایی",play:"پخش",settingsTitle:"تنظیمات",settingWelcome:"نمایش صفحهٔ آغاز در اجرای برنامه",settingMotion:"کاهش حرکت",aboutTitle:"دربارهٔ اطلس",aboutSeries:"گام‌های موسیقی ایرانی · مجموعهٔ نظریهٔ تاریخی",aboutSummary:"اطلسی چندزبانه در حوزهٔ علوم انسانی دیجیتال برای بررسی تقسیمات دقیق سیم، ساختار فواصل، مدل‌های شنیداری و مقوله‌های مقامی.",creator:"طراح و توسعه‌دهنده",creatorCopy:"محقق، توسعه‌دهندهٔ مستقل و خالق پروژهٔ گام‌های موسیقی ایرانی.",links:"پیوندهای پروژه",close:"بستن",installTitle:"نصب اطلس ادوار",installHelp:"منوی مرورگر را باز کنید و «Install app» یا «Add to Home Screen» را انتخاب کنید.",offline:"اتصال اینترنت قطع است؛ نسخهٔ ذخیره‌شدهٔ اطلس در دسترس است.",online:"اتصال اینترنت برقرار شد.",update:"نسخهٔ تازه‌ای در دسترس است.",updateButton:"به‌روزرسانی",orientationTitle:"گوشی را افقی کنید",orientationCopy:"برای نمایش کامل و خوانای تک‌سیم، حالت افقی لازم است.",orientationButton:"گشودن در حالت افقی"},
 ar:{family:"مقامات الموسيقى الفارسية · سلسلة النظرية التاريخية",eyebrow:"نسخة علمية تفاعلية",lead:"استكشف تقسيمات الدساتين الدقيقة والفواصل والنظرية المقامية عند الأرموي.",start:"ابدأ الدرس الموجّه",open:"افتح الأطلس",sources:"حول المصادر",dismissWelcome:"لا تعرض شاشة البداية في المرة القادمة",learn:"التعلّم",explore:"الاستكشاف",construct:"البناء",listen:"الاستماع",more:"المزيد",mobileModes:"الأجناس والأدوار",mobileTrain:"التدريب والبيانات",modes:"الأجناس والأدوار",training:"التدريب والبيانات",instrument:"عرض الآلة",about:"حول",settings:"الإعدادات",install:"تثبيت التطبيق",scales:"مقامات الموسيقى الفارسية",showInstrument:"إظهار الآلة التوضيحية",hideInstrument:"إخفاء الآلة التوضيحية",zoomOut:"تصغير",zoomIn:"تكبير",play:"تشغيل",settingsTitle:"الإعدادات",settingWelcome:"إظهار شاشة البداية عند التشغيل",settingMotion:"تقليل الحركة",aboutTitle:"حول الأطلس",aboutSeries:"مقامات الموسيقى الفارسية · سلسلة النظرية التاريخية",aboutSummary:"أطلس رقمي متعدد اللغات لدراسة تقسيمات الوتر الدقيقة وبنى الفواصل والنماذج السمعية والفئات المقامية.",creator:"المنشئ والمطوّر",creatorCopy:"باحث ومطوّر مستقل ومنشئ مشروع مقامات الموسيقى الفارسية.",links:"روابط المشروع",close:"إغلاق",installTitle:"تثبيت أطلس الأدوار",installHelp:"افتح قائمة المتصفح واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».",offline:"أنت غير متصل؛ النسخة المخزنة من الأطلس ما زالت متاحة.",online:"تمت استعادة الاتصال.",update:"يتوفر إصدار جديد.",updateButton:"تحديث",orientationTitle:"أدر الهاتف أفقياً",orientationCopy:"العرض الأفقي مطلوب لإظهار مخطط الوتر الكامل بوضوح.",orientationButton:"افتح بالعرض الأفقي"},
 tr:{family:"Persian Music Scales · Tarihsel Kuram Dizisi",eyebrow:"Bilimsel etkileşimli sürüm",lead:"Urmevî’nin kesin perde bölümlerini, aralıklarını ve makam kuramını keşfedin.",start:"Yönlendirilmiş derse başla",open:"Atlası aç",sources:"Kaynaklar hakkında",dismissWelcome:"Bu açılışı bir daha gösterme",learn:"Öğren",explore:"Keşfet",construct:"Kur",listen:"Dinle",more:"Daha",mobileModes:"Cinsler ve Devirler",mobileTrain:"Alıştırma ve Veri",modes:"Cinsler ve Devirler",training:"Alıştırma ve Veri",instrument:"Çalgı görünümü",about:"Hakkında",settings:"Ayarlar",install:"Uygulamayı yükle",scales:"Persian Music Scales",showInstrument:"Açıklayıcı çalgıyı göster",hideInstrument:"Açıklayıcı çalgıyı gizle",zoomOut:"Uzaklaştır",zoomIn:"Yakınlaştır",play:"Çal",settingsTitle:"Ayarlar",settingWelcome:"Başlangıç ekranını açılışta göster",settingMotion:"Hareketi azalt",aboutTitle:"Atlas hakkında",aboutSeries:"Persian Music Scales · Tarihsel Kuram Dizisi",aboutSummary:"Kesin tel bölümlerini, aralık yapılarını, dinleme modellerini ve makamsal kategorileri inceleyen çok dilli bir dijital beşerî bilimler atlası.",creator:"Yaratıcı ve geliştirici",creatorCopy:"Araştırmacı, bağımsız geliştirici ve Persian Music Scales projesinin yaratıcısı.",links:"Proje bağlantıları",close:"Kapat",installTitle:"Advar Atlası yükle",installHelp:"Tarayıcı menüsünü açın ve “Uygulamayı yükle” veya “Ana Ekrana Ekle” seçeneğini seçin.",offline:"Çevrimdışısınız; önbelleğe alınan Atlas kullanılabilir.",online:"Bağlantı yeniden kuruldu.",update:"Yeni bir sürüm kullanılabilir.",updateButton:"Güncelle",orientationTitle:"Telefonu yatay çevirin",orientationCopy:"Monokordun tamamını açıkça görmek için yatay görünüm gereklidir.",orientationButton:"Yatay görünümde aç"}
};
const pwaText=(key)=>((PWA_TEXT[typeof uiLanguage!=="undefined"?uiLanguage:"en"]||PWA_TEXT.en)[key]||PWA_TEXT.en[key]||key);
const qs=(s,root=document)=>root.querySelector(s),qsa=(s,root=document)=>[...root.querySelectorAll(s)];
const stateKey="urmawiAdvarPwaStateV4";let deferredInstallPrompt=null;let pendingWorker=null;let completedLessons=new Set();let mobileTheoryWidth=1050;
function readState(){try{return JSON.parse(localStorage.getItem(stateKey)||"{}")||{}}catch(_){return {}}}
function writeState(patch={}){const next={...readState(),...patch,version:ADVAR_VERSION,updatedAt:Date.now()};try{localStorage.setItem(stateKey,JSON.stringify(next))}catch(_){}return next}
function isPhone(){return matchMedia("(max-width:700px)").matches||(matchMedia("(pointer:coarse)").matches&&Math.min(screen.width,screen.height)<=700)}
function isEmbed(){return new URLSearchParams(location.search).get("embed")==="1"||window.self!==window.top}
function setPwaText(id,key){const el=$(id);if(el)el.textContent=pwaText(key)}
function applyPwaLanguage(){
 const logo=$("atlasHomeLogo");if(logo){const lang=["en","fa","ar","tr"].includes(uiLanguage)?uiLanguage:"en";const labels={en:"Al-Urmawī Advar Atlas home",fa:"صفحهٔ اصلی اطلس ادوار ارموی",ar:"الصفحة الرئيسية لأطلس الأدوار",tr:"Urmevî Advar Atlası ana sayfası"};logo.href="./?lang="+lang+"&panel=learn&welcome=0";logo.setAttribute("aria-label",labels[lang]);}

 const referenceLabels={en:"Scholarly reference and pitch data",fa:"مرجع پژوهشی و داده‌های نغمه‌ها",ar:"المرجع العلمي وبيانات النغمات",tr:"Bilimsel kaynak ve perde verileri"}; const referenceLang=referenceLabels[uiLanguage]?uiLanguage:"en";
 qsa("[data-reference-link]").forEach(a=>{a.href="reference/"+referenceLang+"/";a.textContent=referenceLabels[referenceLang];a.hreflang=referenceLang;});
 const eyebrow=qs(".eyebrow");if(eyebrow){eyebrow.innerHTML=`<a class="family-link" href="https://persianmusicscales.github.io/${document.documentElement.lang==="fa"?"fa/":"en/"}" target="_blank" rel="noopener">${pwaText("scales")}</a><span> · ${pwaText("family").split(" · ").slice(1).join(" · ")||"Historical Theory Series"}</span>`}
 setPwaText("welcomeFamily","family");setPwaText("welcomeEyebrow","eyebrow");setPwaText("welcomeLead","lead");setPwaText("welcomeStart","start");setPwaText("welcomeAtlas","open");setPwaText("welcomeSources","sources");setPwaText("welcomeDismiss","dismissWelcome");
 setPwaText("mobileLearn","learn");setPwaText("mobileExplore","explore");setPwaText("mobileConstruct","construct");setPwaText("mobileListen","listen");setPwaText("mobileModes","mobileModes");setPwaText("mobileTrain","mobileTrain");setPwaText("mobileMore","more");setPwaText("moreSheetTitle","more");setPwaText("moreModes","modes");setPwaText("moreTraining","training");setPwaText("moreInstrument","instrument");setPwaText("moreSources","sources");setPwaText("moreAbout","about");setPwaText("moreSettings","settings");setPwaText("moreInstall","install");setPwaText("moreScales","scales");
 setPwaText("settingsTitle","settingsTitle");setPwaText("settingWelcomeLabel","settingWelcome");setPwaText("settingMotionLabel","settingMotion");
 setPwaText("aboutDialogTitle","aboutTitle");setPwaText("aboutSeries","aboutSeries");setPwaText("aboutSummary","aboutSummary");setPwaText("aboutCreatorTitle","creator");setPwaText("aboutCreatorCopy","creatorCopy");setPwaText("aboutLinksTitle","links");setPwaText("closeAboutDialog","close");
 setPwaText("installHelpTitle","installTitle");setPwaText("installHelpCopy","installHelp");setPwaText("closeInstallHelp","close");setPwaText("installAppBtn","install");setPwaText("updateToastText","update");setPwaText("updateAppBtn","updateButton");
 $("theoryToggle").textContent=({en:"String diagram",fa:"نمودار تک‌سیم",ar:"مخطط الوتر",tr:"Tel diyagramı"})[uiLanguage] || "String diagram";
 const copy=instrumentCopy[uiLanguage] || instrumentCopy.en;
 ["creatorByline","creatorProjects","fretLabel","mobilePitchPlay","orientationCopy","aboutCreatorCopy"].forEach((id,i)=>setInstrumentText(id,copy[i]));
 setInstrumentText("mobileInstrumentToggle",copy[document.body.classList.contains("fret-zoom")?7:6]);
 setPwaText("orientationTitle","orientationTitle"); setPwaText("orientationCopy","orientationCopy");syncMobileStepNav();
 const hubLang=uiLanguage==="fa"?"fa":"en";
 $("projectHub").href="https://persianmusicscales.github.io/"+hubLang+"/";
 $("projectArticle").href=$("projectHub").href+"article/";
 setInstrumentText("projectHub",copy[8]);setInstrumentText("projectArticle",copy[9]);

}
function showWelcome(){document.body.classList.add("welcome-visible");$("welcomeScreen")?.classList.remove("hidden")}
function hideWelcome(){document.body.classList.remove("welcome-visible");$("welcomeScreen")?.classList.add("hidden")}
function openDialog(id){$(id)?.classList.add("open")}
function closeDialog(id){$(id)?.classList.remove("open");if(id==="aboutDialog")$("creatorProjects").focus()}
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&$("aboutDialog")?.classList.contains("open"))closeDialog("aboutDialog")});
function openSheet(id){qsa(".app-sheet.open").forEach(x=>{x.classList.remove("open");x.setAttribute("aria-hidden","true")});const el=$(id);if(el){el.classList.add("open");el.setAttribute("aria-hidden","false")}}
function closeSheets(){qsa(".app-sheet.open").forEach(el=>{el.classList.remove("open");el.setAttribute("aria-hidden","true")})}
/* Persistent mobile controls delegate to the original lesson and construction buttons.
   This preserves lesson completion, playback and all existing model state. */
function mobileStepSources(){
 if(activePanel==="learn")return {prev:"lessonPrevious",play:"lessonDemonstrate",next:"lessonNext",count:"lessonProgressText",title:"lessonTitle",target:".lesson-main"};
 if(activePanel==="construct")return {prev:"constructionPrev",play:"constructionPlay",next:"constructionNext",count:"constructionCount",title:"constructionHeading",target:".step-info"};
 return null;
}
function syncMobileStepNav(){
 const nav=$("mobileStepNav");if(!nav)return;const sources=mobileStepSources();
 nav.hidden=!sources;document.body.classList.toggle("has-mobile-step-nav",!!sources);
 if(!sources)return;
 const lang=["en","fa","ar","tr"].includes(uiLanguage)?uiLanguage:"en";
 const labels={en:["Lesson navigation","Go to current content"],fa:["پیمایش درس","رفتن به محتوای فعلی"],ar:["التنقل بين الدروس","الانتقال إلى المحتوى الحالي"],tr:["Ders gezinme","Geçerli içeriğe git"]}[lang];
 nav.setAttribute("aria-label",labels[0]);
 for(const [id,key] of [["mobileStepPrev","prev"],["mobileStepPlay","play"],["mobileStepNext","next"]]){
  const button=$(id),source=$(sources[key]);if(!button||!source)continue;
  const label=source.textContent.trim();if(button.textContent!==label)button.textContent=label;
  if(button.disabled!==source.disabled)button.disabled=source.disabled;
 }
 const count=$(sources.count).textContent.trim(),title=$(sources.title).textContent.trim();
 if($("mobileStepCount").textContent!==count)$("mobileStepCount").textContent=count;
 if($("mobileStepTitle").textContent!==title)$("mobileStepTitle").textContent=title;
 $("mobileStepPosition").setAttribute("aria-label",labels[1]+": "+count+" — "+title);
 $("mobileStepPosition").title=title;
}
function setupMobileStepNav(){
 const nav=$("mobileStepNav");if(!nav)return;
 for(const [id,key] of [["mobileStepPrev","prev"],["mobileStepPlay","play"],["mobileStepNext","next"]]){
  $(id).addEventListener("click",()=>{const sources=mobileStepSources();if(!sources)return;const source=$(sources[key]);if(source&&!source.disabled)source.click();syncMobileStepNav();});
 }
 $("mobileStepPosition").addEventListener("click",()=>{const sources=mobileStepSources();if(sources)qs(sources.target)?.scrollIntoView({block:"start",behavior:"auto"});});
 const observer=new MutationObserver(syncMobileStepNav);
 for(const id of ["lessonPrevious","lessonDemonstrate","lessonNext","lessonProgressText","lessonTitle","constructionPrev","constructionPlay","constructionNext","constructionCount","constructionHeading"]){
  const node=$(id);if(node)observer.observe(node,{attributes:true,attributeFilter:["disabled"],childList:true,subtree:true,characterData:true});
 }
 syncMobileStepNav();
}
function syncMobileNav(){qsa("[data-mobile-panel]").forEach(b=>b.classList.toggle("active",b.dataset.mobilePanel===activePanel));$("mobileMoreBtn")?.classList.toggle("active",["modes","train"].includes(activePanel));syncMobileStepNav()}
function centerSelectedFret(behavior="smooth"){
 if(!isPhone())return;const shell=$("monoScrollShell");if(!shell)return;const target=xFor(NOTES[selected])*(mobileTheoryWidth/1244)-shell.clientWidth/2;shell.scrollTo({left:Math.max(0,target),behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":behavior})
}
function restoreState(){
 const st=readState();completedLessons=new Set(Array.isArray(st.completedLessons)?st.completedLessons:[]);mobileTheoryWidth=Math.max(800,Math.min(1600,Number(st.mobileTheoryWidth)||1050));document.documentElement.style.setProperty("--mobile-theory-width",`${mobileTheoryWidth}px`);if($("mobileZoomLabel"))$("mobileZoomLabel").textContent=`${Math.round(mobileTheoryWidth/10.5)}%`;if(Number.isInteger(st.scoreCorrect))scoreCorrect=st.scoreCorrect;if(Number.isInteger(st.scoreTotal))scoreTotal=st.scoreTotal;updateScore();
 if(Number.isInteger(st.selected))selected=Math.max(0,Math.min(NOTES.length-1,st.selected));
 if(Number.isInteger(st.lessonIndex))lessonIndex=Math.max(0,Math.min(LESSONS.length-1,st.lessonIndex));
 if(Number.isInteger(st.constructionStep))constructionStep=Math.max(0,Math.min(CONSTRUCTION.length-1,st.constructionStep));
 const values={baseFrequency:st.baseFrequency,stringLength:st.stringLength,waveform:st.waveform,audioMode:st.audioMode,masterVolume:st.masterVolume,pluckDecay:st.pluckDecay};Object.entries(values).forEach(([id,v])=>{if(v!==undefined&&$(id))$(id).value=v});
 document.body.classList.toggle("reduce-motion",!!st.reduceMotion);
 const requestedPanel=new URLSearchParams(location.search).get("panel");const panel=requestedPanel||st.activePanel||"learn";activatePanel(["learn","explore","construct","listen","modes","train"].includes(panel)?panel:"learn");
 if(!new URLSearchParams(location.search).has("view")&&Number.isInteger(st.viewMode))applyViewMode(st.viewMode);
 renderLessons();renderMonochord();updateExplore();syncMobileNav();setTimeout(centerSelectedFret,60)
}
function saveCurrent(){writeState({activePanel,selected,lessonIndex,constructionStep,viewMode,completedLessons:[...completedLessons],mobileTheoryWidth,scoreCorrect,scoreTotal,baseFrequency:$("baseFrequency")?.value,stringLength:$("stringLength")?.value,waveform:$("waveform")?.value,audioMode:$("audioMode")?.value,masterVolume:$("masterVolume")?.value,pluckDecay:$("pluckDecay")?.value,reduceMotion:document.body.classList.contains("reduce-motion")})}
function hookStateFunctions(){
 const oldActivate=activatePanel;activatePanel=function(name){oldActivate(name);syncMobileNav();saveCurrent()};
 const oldSelect=selectNote;selectNote=function(index,play=false){oldSelect(index,play);saveCurrent();updateMobilePitchBar();setTimeout(centerSelectedFret,20)};
 const oldLesson=setLesson;setLesson=function(i){oldLesson(i);decorateLessons();saveCurrent()};
 const oldConstruction=setConstruction;setConstruction=function(i){oldConstruction(i);saveCurrent()};
 const oldView=applyViewMode;applyViewMode=function(mode=viewMode){oldView(mode);saveCurrent()};
 const oldLanguage=applyStaticLanguage;applyStaticLanguage=function(){oldLanguage();applyPwaLanguage()};
 const oldRender=renderMonochord;renderMonochord=function(){oldRender();attachLongPress();updateMobilePitchBar()};const oldLessons=renderLessons;renderLessons=function(){oldLessons();decorateLessons()};const oldAnswer=answerQuiz;answerQuiz=function(button,value){oldAnswer(button,value);saveCurrent()};
}

function decorateLessons(){qsa(".lesson-btn").forEach((b,i)=>{b.classList.toggle("completed",completedLessons.has(i));b.setAttribute("aria-label",`${i+1}. ${b.textContent.trim()}${completedLessons.has(i)?" ✓":""}`)})}
function markLessonComplete(i){completedLessons.add(Math.max(0,Math.min(LESSONS.length-1,i)));decorateLessons();saveCurrent()}
function changeTheoryZoom(delta){mobileTheoryWidth=Math.max(800,Math.min(1600,mobileTheoryWidth+delta));document.documentElement.style.setProperty("--mobile-theory-width",`${mobileTheoryWidth}px`);if($("mobileZoomLabel"))$("mobileZoomLabel").textContent=`${Math.round(mobileTheoryWidth/10.5)}%`;saveCurrent();setTimeout(()=>centerSelectedFret("auto"),20)}
const instrumentCopy={
 en:["Created by Pouya Hosseini","Projects","Fret","▸ Play pitch","Rotate your phone for a wider fretboard view.","Pouya Hosseini is a Persian musician and electrochemist. He plays setar and santur and develops interactive tools for studying musical intervals.","Zoom fretboard","Whole setar","Persian Music Scales hub","Read the article"],
 fa:["ساختهٔ پویا حسینی","پروژه‌ها","دستان","▸ پخش صدا","برای دیدن نمای بازتر دستهٔ ساز، گوشی را افقی بگیرید.","پویا حسینی نوازندهٔ سه‌تار و سنتور و پژوهشگر الکتروشیمی است. او ابزارهای تعاملی برای بررسی فواصل موسیقایی می‌سازد.","بزرگ‌نمایی دسته","نمای کامل سه‌تار","گام‌های موسیقی ایرانی","مطالعهٔ مقاله"],
 ar:["من إعداد بويا حسيني","المشاريع","الدستان","▸ استمع إلى النغمة","أدر الهاتف لعرض أوسع لدساتين الآلة.","بويا حسيني موسيقي إيراني وباحث في الكيمياء الكهربائية. يعزف على السيتار والسنطور ويطوّر أدوات تفاعلية لدراسة الفواصل الموسيقية.","تكبير الدساتين","عرض الآلة كاملة","بوابة الموسيقى الفارسية","اقرأ المقال"],
 tr:["Geliştiren: Pouya Hosseini","Projeler","Perde","▸ Sesi çal","Perdeleri daha geniş görmek için telefonunuzu çevirin.","Pouya Hosseini, setar ve santur çalan İranlı bir müzisyen ve elektrokimyacıdır. Müzikal aralıkları incelemek için etkileşimli araçlar geliştirir.","Perdeleri büyüt","Tüm setarı göster","İran müziği portalı","Makaleyi oku"]
};
function setInstrumentText(id,text){$(id).textContent=text}
function updateMobilePitchBar(){
 const n=NOTES[selected];
 $("fretPicker").value=String(selected);
 $("pitchReading").textContent=String(n.lenD)+"/"+n.lenN+" · "+fixed(cents(n),1)+"¢ · "+fixed(currentBase()*frequencyRatio(n),1)+" Hz";
}
function attachLongPress(){qsa("#fretLayer .fret").forEach((el,i)=>{if(el.dataset.longpress)return;el.dataset.longpress="1";let timer=null;const clear=()=>{if(timer){clearTimeout(timer);timer=null}};el.addEventListener("pointerdown",()=>{timer=setTimeout(()=>{tone(i);navigator.vibrate?.(18)},420)},{passive:true});el.addEventListener("pointerup",clear,{passive:true});el.addEventListener("pointercancel",clear,{passive:true});el.addEventListener("pointerleave",clear,{passive:true})})}
function setupSwipeLessons(){const el=$("panel-learn");if(!el)return;let x0=0,y0=0;el.addEventListener("pointerdown",e=>{x0=e.clientX;y0=e.clientY},{passive:true});el.addEventListener("pointerup",e=>{const dx=e.clientX-x0,dy=e.clientY-y0;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.4)setLesson(lessonIndex+(dx<0?1:-1))},{passive:true})}
function toggleInstrument(){
 const zoom=document.body.classList.toggle("fret-zoom");
 $("mobileInstrumentToggle").setAttribute("aria-pressed",String(zoom));
 applyPwaLanguage();
 const wrap=qs(".instrument-wrap");
 wrap.scrollLeft=zoom ? instrumentXFor(NOTES[selected])/1244*wrap.scrollWidth-wrap.clientWidth/2 : 0;
}
function syncSettings(){const st=readState();if($("settingWelcome"))$("settingWelcome").checked=st.showWelcome!==false;if($("settingMotion"))$("settingMotion").checked=document.body.classList.contains("reduce-motion")}
function requestInstall(){if(deferredInstallPrompt){deferredInstallPrompt.prompt();deferredInstallPrompt.userChoice.finally(()=>{deferredInstallPrompt=null;updateInstallButtons()})}else openDialog("installHelpDialog")}
function updateInstallButtons(){const installed=matchMedia("(display-mode:standalone)").matches||navigator.standalone;const visible=!installed&&(!!deferredInstallPrompt||/iphone|ipad|ipod/i.test(navigator.userAgent));["installAppBtn","moreInstallBtn"].forEach(id=>{const el=$(id);if(el)el.hidden=!visible})}
function announceNetwork(online){const el=$("networkBanner");if(!el)return;el.textContent=online?pwaText("online"):pwaText("offline");el.classList.add("show");setTimeout(()=>el.classList.remove("show"),online?2600:4600)}
function registerServiceWorker(){if(!("serviceWorker" in navigator)||!/^https?:$/.test(location.protocol))return;navigator.serviceWorker.register("./service-worker.js").then(reg=>{reg.addEventListener("updatefound",()=>{const w=reg.installing;if(!w)return;w.addEventListener("statechange",()=>{if(w.state==="installed"&&navigator.serviceWorker.controller){pendingWorker=w;$("updateToast").hidden=false}})})}).catch(console.warn);navigator.serviceWorker.addEventListener("controllerchange",()=>location.reload())}
function setupWelcome(){const st=readState(),params=new URLSearchParams(location.search);const skip=params.get("welcome")==="0"||params.get("skipWelcome")==="1"||isEmbed();if(skip||st.showWelcome===false)hideWelcome();else showWelcome()}
function initializePwa(){
 $("theoryToggle").onclick=()=>{const open=$("monoPanel").classList.toggle("diagram-open");$("theoryToggle").setAttribute("aria-expanded",String(open));if(open)centerSelectedFret("auto")};
 NOTES.forEach((n,i)=>$("fretPicker").add(new Option((i+1)+" · "+n.label+" · "+n.translit,String(i))));
 $("fretPicker").addEventListener("change",()=>selectNote(Number($("fretPicker").value),true));
 $("creatorProjects").addEventListener("click",()=>{openDialog("aboutDialog");$("closeAboutDialog").focus()});
 document.body.classList.toggle("embed-mode",isEmbed());hookStateFunctions();restoreState();applyPwaLanguage();attachLongPress();setupSwipeLessons();setupMobileStepNav();setupWelcome();updateMobilePitchBar();syncSettings();updateInstallButtons();registerServiceWorker();
 $("welcomeStart")?.addEventListener("click",()=>{activatePanel("learn");setLesson(0);hideWelcome();if(isPhone())$("panel-learn").scrollIntoView({block:"start"});writeState({showWelcome:true})});$("welcomeAtlas")?.addEventListener("click",()=>{activatePanel("explore");hideWelcome();window.scrollTo(0,0);writeState({showWelcome:true})});$("welcomeSources")?.addEventListener("click",()=>{hideWelcome();openSourceDialog()});$("welcomeDismiss")?.addEventListener("click",()=>{writeState({showWelcome:false});hideWelcome()});
 qsa("[data-mobile-panel]").forEach(b=>b.addEventListener("click",()=>{activatePanel(b.dataset.mobilePanel);$("panel-"+b.dataset.mobilePanel).scrollIntoView({block:"start"})}));$("mobileHeaderMenuBtn")?.addEventListener("click",()=>openSheet("mobileMoreSheet"));qsa("[data-more-panel]").forEach(b=>b.addEventListener("click",()=>{activatePanel(b.dataset.morePanel);closeSheets()}));qsa("[data-close-sheet]").forEach(b=>b.addEventListener("click",closeSheets));
 $("mobileInstrumentToggle")?.addEventListener("click",toggleInstrument);$("mobileZoomOut")?.addEventListener("click",()=>changeTheoryZoom(-125));$("mobileZoomIn")?.addEventListener("click",()=>changeTheoryZoom(125));$("mobilePitchPlay")?.addEventListener("click",()=>tone(selected));$("moreSourcesBtn")?.addEventListener("click",()=>{closeSheets();openSourceDialog()});$("moreAboutBtn")?.addEventListener("click",()=>{closeSheets();openDialog("aboutDialog")});$("moreSettingsBtn")?.addEventListener("click",()=>{closeSheets();syncSettings();openSheet("settingsSheet")});
 $("closeAboutDialog")?.addEventListener("click",()=>closeDialog("aboutDialog"));$("aboutDialog")?.addEventListener("click",e=>{if(e.target===$("aboutDialog"))closeDialog("aboutDialog")});$("closeInstallHelp")?.addEventListener("click",()=>closeDialog("installHelpDialog"));$("installHelpDialog")?.addEventListener("click",e=>{if(e.target===$("installHelpDialog"))closeDialog("installHelpDialog")});

 $("installAppBtn")?.addEventListener("click",requestInstall);$("moreInstallBtn")?.addEventListener("click",()=>{closeSheets();requestInstall()});
 $("lessonDemonstrate")?.addEventListener("click",()=>markLessonComplete(lessonIndex),{capture:true});$("lessonNext")?.addEventListener("click",()=>markLessonComplete(lessonIndex),{capture:true});
 $("settingWelcome")?.addEventListener("change",e=>writeState({showWelcome:e.target.checked}));$("settingMotion")?.addEventListener("change",e=>{document.body.classList.toggle("reduce-motion",e.target.checked);saveCurrent()});
 ["baseFrequency","stringLength","waveform","audioMode","masterVolume","pluckDecay"].forEach(id=>$(id)?.addEventListener("change",saveCurrent));$("languageSelect")?.addEventListener("change",()=>setTimeout(applyPwaLanguage,0));
 $("updateAppBtn")?.addEventListener("click",()=>pendingWorker?.postMessage({type:"SKIP_WAITING"}));$("dismissUpdateBtn")?.addEventListener("click",()=>$("updateToast").hidden=true);
 window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;updateInstallButtons()});window.addEventListener("appinstalled",()=>{deferredInstallPrompt=null;updateInstallButtons();writeState({installed:true})});window.addEventListener("online",()=>announceNetwork(true));window.addEventListener("offline",()=>announceNetwork(false));window.addEventListener("resize",()=>{setTimeout(centerSelectedFret,50)});
 if(!navigator.onLine)announceNetwork(false);setTimeout(()=>{centerSelectedFret("auto")},180);$("appVersion").textContent=ADVAR_VERSION;
}
initializePwa();
