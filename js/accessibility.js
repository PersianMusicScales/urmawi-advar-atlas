"use strict";
/* Accessible keyboard tabs and focus containment without altering the music model. */
(function(){
 const tabs=[...document.querySelectorAll('#tabsNav [role="tab"]')];
 function syncTabs(){for(const tab of tabs)tab.tabIndex=tab.getAttribute("aria-selected")==="true"?0:-1;}
 const tabObserver=new MutationObserver(syncTabs);
 tabs.forEach(tab=>tabObserver.observe(tab,{attributes:true,attributeFilter:["aria-selected"]}));syncTabs();
 document.getElementById("tabsNav").addEventListener("keydown",event=>{
  const i=tabs.indexOf(event.target);if(i<0)return;
  const rtl=document.documentElement.dir==="rtl";let next;
  if(event.key==="Home")next=0;else if(event.key==="End")next=tabs.length-1;
  else if(event.key==="ArrowRight")next=(i+(rtl?-1:1)+tabs.length)%tabs.length;
  else if(event.key==="ArrowLeft")next=(i+(rtl?1:-1)+tabs.length)%tabs.length;else return;
  event.preventDefault();tabs[next].click();tabs[next].focus();
 });
 const dialogs=[...document.querySelectorAll(".dialog-backdrop,.app-sheet")];let current=null,returnTo=null,lastTrigger=null;
 const visible=el=>!!(el&&el.getClientRects().length&&getComputedStyle(el).visibility!=="hidden"&&!el.closest('[aria-hidden="true"]'));
 const focusable=root=>[...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>visible(el)&&el.tabIndex>=0&&!el.classList.contains("sheet-scrim"));
 document.addEventListener("click",e=>{const target=e.target.closest("button,a,[tabindex]");if(target&&!dialogs.some(d=>d.contains(target)))lastTrigger=target;},true);
 function refresh(){
  const next=dialogs.find(d=>d.classList.contains("open"))||null;
  if(next===current)return;
  const previous=current;current=next;
  if(next){if(!previous)returnTo=lastTrigger||document.activeElement;
   if(!next.contains(document.activeElement)){const first=focusable(next)[0];first?.focus();}
  }else if(previous){if(visible(returnTo))returnTo.focus();else if(!visible(document.activeElement))document.getElementById("workspaceMain")?.focus();returnTo=null;}
 }
 const observer=new MutationObserver(refresh);dialogs.forEach(d=>observer.observe(d,{attributes:true,attributeFilter:["class","aria-hidden"]}));
 document.addEventListener("keydown",e=>{
  if(!current)return;
  if(e.key==="Escape"){e.preventDefault();e.stopImmediatePropagation();const close=current.querySelector('.dialog-head button,[data-close-sheet]:not(.sheet-scrim)');close?.click();return;}
  if(e.key!=="Tab")return;
  const list=focusable(current);if(!list.length){e.preventDefault();return;}
  const index=list.indexOf(document.activeElement);
  if(e.shiftKey&&index<=0){e.preventDefault();list.at(-1).focus();}
  else if(!e.shiftKey&&(index<0||index===list.length-1)){e.preventDefault();list[0].focus();}
 },true);
 document.addEventListener("focusin",e=>{if(current&&!current.contains(e.target))focusable(current)[0]?.focus();});
 document.querySelectorAll("[data-close-sheet]").forEach(el=>{if(!el.getAttribute("aria-label"))el.setAttribute("aria-label","Close");});
})();
