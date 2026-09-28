(function(root){
 const paths={'↗':'M5 19 19 5M5 5h14v14','→':'M4 12h16m-6-6 6 6-6 6','←':'M20 12H4m6-6-6 6 6 6','↓':'M12 4v16m-6-6 6 6 6-6'};
 function markup(text){return text.replace(/[↗→←↓]/g,arrow=>'<svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="'+paths[arrow]+'"/></svg>')}
 function label(text){return markup(text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'))}
 const icons={markup,label};
 if(typeof module==='object'&&module.exports)module.exports=icons;else root.BkmunIcons=icons;
})(typeof globalThis==='object'?globalThis:this);
