EJS.Helpers.prototype.date_tag=function(t,e,r){e instanceof Date||(e=new Date);for(var n=["January","February","March","April","May","June","July","August","September","October","November","December"],o=[],i=[],a=[],s=e.getFullYear(),l=e.getMonth(),p=e.getDate(),u=s-15;u<s+15;u++)o.push({value:u,text:u});for(var f=0;f<12;f++)i.push({value:f,text:n[f]});for(var _=0;_<31;_++)a.push({value:_+1,text:_+1});var c=this.select_tag(t+"[year]",s,o,{id:t+"[year]"}),g=this.select_tag(t+"[month]",l,i,{id:t+"[month]"}),d=this.select_tag(t+"[day]",p,a,{id:t+"[day]"});return c+g+d},EJS.Helpers.prototype.form_tag=function(t,e){return e=e||{},e.action=t,1==e.multipart&&(e.method="post",e.enctype="multipart/form-data"),this.start_tag_for("form",e)},EJS.Helpers.prototype.form_tag_end=function(){return this.tag_end("form")},EJS.Helpers.prototype.hidden_field_tag=function(t,e,r){return this.input_field_tag(t,e,"hidden",r)},EJS.Helpers.prototype.input_field_tag=function(t,e,r,n){return n=n||{},n.id=n.id||t,n.value=e||"",n.type=r||"text",n.name=t,this.single_tag_for("input",n)},EJS.Helpers.prototype.is_current_page=function(t){return window.location.href==t||window.location.pathname==t},EJS.Helpers.prototype.link_to=function(t,e,r){if(!t)var t="null";if(!r)var r={};return r.confirm&&(r.onclick=' var ret_confirm = confirm("'+r.confirm+'"); if(!ret_confirm){ return false;} ',r.confirm=null),r.href=e,this.start_tag_for("a",r)+t+this.tag_end("a")},EJS.Helpers.prototype.submit_link_to=function(t,e,r){if(!t)var t="null";if(!r)var r={};return r.onclick=r.onclick||"",r.confirm&&(r.onclick=' var ret_confirm = confirm("'+r.confirm+'"); if(!ret_confirm){ return false;} ',r.confirm=null),r.value=t,r.type="submit",r.onclick=r.onclick+(e?this.url_for(e):"")+"return false;",this.start_tag_for("input",r)},EJS.Helpers.prototype.link_to_if=function(t,e,r,n,o,i){return this.link_to_unless(0==t,e,r,n,o,i)},EJS.Helpers.prototype.link_to_unless=function(t,e,r,n,o){return n=n||{},t?o&&"function"==typeof o?o(e,r,n,o):e:this.link_to(e,r,n)},EJS.Helpers.prototype.link_to_unless_current=function(t,e,r,n){return r=r||{},this.link_to_unless(this.is_current_page(e),t,e,r,n)},EJS.Helpers.prototype.password_field_tag=function(t,e,r){return this.input_field_tag(t,e,"password",r)},EJS.Helpers.prototype.select_tag=function(t,e,r,n){n=n||{},n.id=n.id||t,n.value=e,n.name=t;var o="";o+=this.start_tag_for("select",n);for(var i=0;i<r.length;i++){var a=r[i],s={value:a.value};a.value==e&&(s.selected="selected"),o+=this.start_tag_for("option",s)+a.text+this.tag_end("option")}return o+=this.tag_end("select")},EJS.Helpers.prototype.single_tag_for=function(t,e){return this.tag(t,e,"/>")},EJS.Helpers.prototype.start_tag_for=function(t,e){return this.tag(t,e)},EJS.Helpers.prototype.submit_tag=function(t,e){return e=e||{},e.type=e.type||"submit",e.value=t||"Submit",this.single_tag_for("input",e)},EJS.Helpers.prototype.tag=function(t,e,r){if(!r)var r=">";var n=" ";for(var o in e){if(null!=e[o])var i=e[o].toString();else var i="";"Class"==o&&(o="class"),n+=i.indexOf("'")!=-1?o+'="'+i+'" ':o+"='"+i+"' "}return"<"+t+n+r},EJS.Helpers.prototype.tag_end=function(t){return"</"+t+">"},EJS.Helpers.prototype.text_area_tag=function(t,e,r){return r=r||{},r.id=r.id||t,r.name=r.name||t,e=e||"",r.size&&(r.cols=r.size.split("x")[0],r.rows=r.size.split("x")[1],delete r.size),r.cols=r.cols||50,r.rows=r.rows||4,this.start_tag_for("textarea",r)+e+this.tag_end("textarea")},EJS.Helpers.prototype.text_tag=EJS.Helpers.prototype.text_area_tag,EJS.Helpers.prototype.text_field_tag=function(t,e,r){return this.input_field_tag(t,e,"text",r)},EJS.Helpers.prototype.url_for=function(t){return'window.location="'+t+'";'},EJS.Helpers.prototype.img_tag=function(t,e,r){return r=r||{},r.src=t,r.alt=e,this.single_tag_for("img",r)};