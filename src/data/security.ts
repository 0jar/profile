export const themeScript =
  '(function(){try{var s=localStorage.getItem("theme"),d=window.matchMedia("(prefers-color-scheme: dark)").matches,t=s==="dark"||s==="light"?s:d?"dark":"light";if(document.documentElement.dataset.pageType!=="cv")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();';
