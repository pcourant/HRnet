import{d as r,r as c,b as R,a as s,f as S,j as m,F as M,L as $}from"./index.28e91fc3.js";import{a as E,g as U,q as k,s as j,i as A,z as f,u as L,b as N,d as P,m as F,A as O}from"./services.b66845ed.js";function T(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function X(t){return parseFloat(t)}function q(t){return E("MuiSkeleton",t)}U("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const z=["animation","className","component","height","style","variant","width"];let l=t=>t,g,b,v,y;const V=t=>{const{classes:e,variant:a,animation:i,hasChildren:n,width:d,height:o}=t;return P({root:["root",a,i,n&&"withChildren",n&&!d&&"fitContent",n&&!o&&"heightAuto"]},q,e)},B=k(g||(g=l`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),H=k(b||(b=l`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),K=j("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:a}=t;return[e.root,e[a.variant],a.animation!==!1&&e[a.animation],a.hasChildren&&e.withChildren,a.hasChildren&&!a.width&&e.fitContent,a.hasChildren&&!a.height&&e.heightAuto]}})(({theme:t,ownerState:e})=>{const a=T(t.shape.borderRadius)||"px",i=X(t.shape.borderRadius);return r({display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:A(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em"},e.variant==="text"&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${i}${a}/${Math.round(i/.6*10)/10}${a}`,"&:empty:before":{content:'"\\00a0"'}},e.variant==="circular"&&{borderRadius:"50%"},e.variant==="rounded"&&{borderRadius:(t.vars||t).shape.borderRadius},e.hasChildren&&{"& > *":{visibility:"hidden"}},e.hasChildren&&!e.width&&{maxWidth:"fit-content"},e.hasChildren&&!e.height&&{height:"auto"})},({ownerState:t})=>t.animation==="pulse"&&f(v||(v=l`
      animation: ${0} 1.5s ease-in-out 0.5s infinite;
    `),B),({ownerState:t,theme:e})=>t.animation==="wave"&&f(y||(y=l`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 1.6s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),H,(e.vars||e).palette.action.hover)),W=c.exports.forwardRef(function(e,a){const i=L({props:e,name:"MuiSkeleton"}),{animation:n="pulse",className:d,component:o="span",height:h,style:C,variant:_="text",width:w}=i,u=R(i,z),p=r({},i,{animation:n,component:o,variant:_,hasChildren:Boolean(u.children)}),x=V(p);return s(K,r({as:o,ref:a,className:N(x.root,d),ownerState:p},u,{style:r({width:w,height:h},C)}))}),D=W,I=c.exports.lazy(()=>S(()=>import("./index.aa05dfa9.js"),["assets/index.aa05dfa9.js","assets/index.28e91fc3.js","assets/index.be231945.css","assets/TextField.cab885cd.js","assets/services.b66845ed.js"]));function G(){const t={sortModel:[{field:"firstname",sort:"asc"}],filterModel:{items:[],quickFilterValues:[]}},{isLoading:e,data:a}=F(0,10,!0,t),i=a!=null&&a.total?a==null?void 0:a.total:0;return O(0,10,i,t),m(M,{children:[s("div",{className:"title",children:s("h1",{children:"HRnet"})}),m("div",{className:"container",children:[s($,{to:"/",children:"Home"}),s("h2",{children:"Current Employees"}),!e&&s(c.exports.Suspense,{fallback:s("div",{className:"table",children:s(D,{variant:"rounded",width:"100%",height:822})}),children:s(I,{})})]})]})}const Y=Object.freeze(Object.defineProperty({__proto__:null,default:G},Symbol.toStringTag,{value:"Module"}));export{D as S,Y as i};
