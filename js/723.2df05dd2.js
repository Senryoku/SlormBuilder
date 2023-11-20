"use strict";(self["webpackChunkslormbuilder"]=self["webpackChunkslormbuilder"]||[]).push([[723,586],{99754:function(e,t,l){l.d(t,{Z:function(){return v}});var o=l(66252),a=l(3577);const i=["onMouseenter","onClick"],A={class:"image-container"},s={key:0,class:"evolve-marker"};function n(e,t,l,n,r,u){const d=(0,o.up)("ReaperIcon"),p=(0,o.up)("Reaper"),g=(0,o.up)("Tooltip");return(0,o.wg)(),(0,o.iD)("div",{class:(0,a.C_)(["reaper-gallery",{large:!l.smallDisplay}])},[l.smallDisplay?((0,o.wg)(),(0,o.iD)(o.HY,{key:0},[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(u.filteredReapers,(t=>((0,o.wg)(),(0,o.iD)("div",{key:l.type+t.REF,class:(0,a.C_)(["weapon-spot",l.type]),onMouseenter:e=>u.displayTooltip(e,t),onClick:l=>e.$emit("select",t)},[(0,o._)("div",A,[(0,o.Wm)(d,{type:l.type,item:t},null,8,["type","item"])]),t.previous?((0,o.wg)(),(0,o.iD)("div",s)):(0,o.kq)("",!0)],42,i)))),128)),(0,o.Wm)(g,{ref:"tooltip"},{default:(0,o.w5)((()=>[((0,o.wg)(),(0,o.j4)(p,{type:l.type,item:r.hoveredReaper,key:r.hoveredReaper.REF},null,8,["type","item"]))])),_:1},512)],64)):((0,o.wg)(!0),(0,o.iD)(o.HY,{key:1},(0,o.Ko)(u.filteredReapers,(t=>((0,o.wg)(),(0,o.j4)(p,{key:l.type+t.REF,item:t,type:l.type,onClick:l=>e.$emit("select",t)},null,8,["item","type","onClick"])))),128))],2)}var r=l(2262),u=l(94623),d=l(9135),p=l(37334),g=l(31675),m={name:"ReaperGallery",components:{Reaper:p["default"],Tooltip:g.Z,ReaperIcon:d.Z},props:{type:{type:String,required:!0},smallDisplay:{type:Boolean,default:!1},lootable:{type:Boolean,default:!1}},data(){return{Reapers:u.k2.filter((e=>e[this.settings.language+"_NAME"])),tooltip:(0,r.iH)(null),hoveredReaper:(0,r.iH)(u.k2[0])}},methods:{displayTooltip(e,t){this.hoveredReaper=t,this.$refs.tooltip.display(e)}},computed:{filteredReapers(){return this.Reapers.filter((e=>!this.lootable||null!==e.LOOTABLE))}}},c=l(83744);const h=(0,c.Z)(m,[["render",n],["__scopeId","data-v-68d248f8"]]);var v=h},60422:function(e,t,l){l.r(t),l.d(t,{default:function(){return v}});var o=l(66252),a=l(3577);const i=e=>((0,o.dD)("data-v-4a5e9bf2"),e=e(),(0,o.Cn)(),e),A={class:"reapers"},s=i((()=>(0,o._)("div",{class:"header"},[(0,o._)("h1",null,"Slorm Reapers")],-1))),n={class:"filters"},r={class:"type-select"},u=["onClick"];function d(e,t,l,i,d,p){const g=(0,o.up)("Toggle"),m=(0,o.up)("reaper-gallery");return(0,o.wg)(),(0,o.iD)("div",A,[s,(0,o._)("div",n,[(0,o._)("div",null,[(0,o.Wm)(g,{modelValue:d.smallDisplay,"onUpdate:modelValue":t[0]||(t[0]=e=>d.smallDisplay=e)},{default:(0,o.w5)((()=>[(0,o.Uk)((0,a.zw)(e.t("Small Icons")),1)])),_:1},8,["modelValue"])]),(0,o.Uk)(" "+(0,a.zw)(e.t("Filters"))+" ",1),(0,o._)("div",null,[(0,o.Wm)(g,{modelValue:d.lootable,"onUpdate:modelValue":t[1]||(t[1]=e=>d.lootable=e)},{default:(0,o.w5)((()=>[(0,o.Uk)((0,a.zw)(e.t("Lootable")),1)])),_:1},8,["modelValue"])]),(0,o._)("div",r,[((0,o.wg)(),(0,o.iD)(o.HY,null,(0,o.Ko)(["sword","bow","staff"],(t=>(0,o._)("button",{key:t,onClick:e=>d.type=t},(0,a.zw)(e.t(t+"s")),9,u))),64))])]),(0,o.Wm)(m,{type:d.type,smallDisplay:d.smallDisplay,lootable:d.lootable},null,8,["type","smallDisplay","lootable"])])}var p=l(72498),g=l(99754),m={name:"Reapers",props:{large:{type:Boolean,default:!1}},components:{ReaperGallery:g.Z,Toggle:p.Z},data(e){return{type:"sword",lootable:!1,smallDisplay:!e.large}}},c=l(83744);const h=(0,c.Z)(m,[["render",d],["__scopeId","data-v-4a5e9bf2"]]);var v=h},72498:function(e,t,l){l.d(t,{Z:function(){return d}});var o=l(66252),a=l(3577);const i=["src"],A={class:"label"};function s(e,t,l,s,n,r){return(0,o.wg)(),(0,o.iD)("div",{class:(0,a.C_)(["toggle clickable unselectable",{checked:l.modelValue}]),onClick:t[0]||(t[0]=(...e)=>r.toggle&&r.toggle(...e))},[(0,o._)("img",{class:"toggle-image",src:r.image},null,8,i),(0,o._)("div",A,[(0,o.WI)(e.$slots,"default")])],2)}var n={name:"Toggle",props:{modelValue:{type:Boolean,required:!0}},methods:{toggle(){this.$emit("update:modelValue",!this.modelValue)}},computed:{image(){return this.modelValue?l(68859):l(36830)}}},r=l(83744);const u=(0,r.Z)(n,[["render",s]]);var d=u},31675:function(e,t,l){l.d(t,{Z:function(){return d}});var o=l(66252),a=l(49963);const i={class:"tooltip",ref:"el"};function A(e,t,l,A,s,n){return(0,o.wg)(),(0,o.iD)("div",i,[(0,o.Wm)(a.uT,{name:"fade",mode:"out-in",onEnter:n.transitionEnter},{default:(0,o.w5)((()=>[(0,o.wy)(((0,o.wg)(),(0,o.iD)("div",{key:A.triggerCount},[(0,o.WI)(e.$slots,"default")])),[[a.F8,A.show]])])),_:3},8,["onEnter"])],512)}var s=l(2262),n={name:"Tooltip",setup(){const e=(0,s.iH)(!1),t=(0,s.iH)(null),l=(0,s.iH)(null);return{show:e,el:t,target:l,triggerCount:(0,s.iH)(0)}},methods:{transitionEnter(){this.mousemove(this.lastEvent)},mousemove(e){let t=window.innerWidth,l=window.innerHeight,o=this.$refs.el.clientWidth,a=this.$refs.el.clientHeight,i=12+e.clientX,A=5+e.clientY;const s=10;this.$refs.el.style.top=window.innerHeight<a?0:Math.min(A,l-a-s)+"px",this.$refs.el.style.left=window.clientWidth<o?0:Math.min(i,t-o-s)+"px",this.lastEvent=e},mouseleave(e){this.hide(e.target)},display(e){++this.triggerCount,this.show=!0,this.target=e.target,this.target.addEventListener("mousemove",this.mousemove),this.target.addEventListener("mouseleave",this.mouseleave),this.lastEvent=e},hide(e){this.target===e&&(++this.triggerCount,this.show=!1,this.target=null),e.removeEventListener("mouseleave",this.mouseleave),e.removeEventListener("mousemove",this.mousemove)}}},r=l(83744);const u=(0,r.Z)(n,[["render",A]]);var d=u},36830:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAsCAYAAACaAr0vAAAA10lEQVR42u3ZsQ3CMAAEwFSgDEAkhKCgoaHIFFSZgBUYgYqCYViGlaC2i5gQkRj5XvrKSvPXWE5V/T6vqDJxAAAAAGCuwW/XS1AgAAAAAFDu4EAAAAAAoJzBn6dl0C9A5i4AAAAAlAwwavBH29/4+/Z4CBqf13U9aXMAAQAAAIAJAQYNkhr8vlv0ttvug+YGAgAAAACFAYwCiQc9b1ZBU4OvmyaoWxAAAAAA5Ps2NBRk6OAe4wAAAADgf/4Rpwb9YHABAEAAFAJiLgAABEA5IOYAAEAAZJM3gRTAmrC7S2wAAAAASUVORK5CYII="},68859:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAsCAYAAACaAr0vAAAA00lEQVR42u3YoQ3CQBiG4SpIB6AJISAwGESnQHUCVmAEFIJhWIaVQN+JHk0JPXrPn3wS8z4VtFXl4ntFcwAAOACFBL9dL8GAAAAAAEC5wYEAAAAAwFdfbCZdKujztAw2BxAAAAAAmCp4Xdc/3djgj7Z/8e/b4yFYDiAAAAAAUArA0CCp4Pfdonfddh8sRxAAAAAAKAVgLEgc9LxZBUsFXzdNMP+CAAAAUDhA1h/jhoL8Y3AAAAAAcJ89EKmgggMAAAAAEMEBAAAAoDwQOQAAcDMGeAMbasCaaAOb0QAAAABJRU5ErkJggg=="}}]);
//# sourceMappingURL=723.2df05dd2.js.map