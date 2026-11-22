export type Theme = "light" | "dark";
export const THEME_KEY = "sylva-theme";

/* Exécuté dans <head> avant le premier rendu : pas de flash. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.dataset.theme=t}catch(e){}})()`;

