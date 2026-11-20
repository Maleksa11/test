(function(){
  var $=function(i){return document.getElementById(i)};
  var lang='en',L={
    en:{sub:'Paste a link to start, or search YouTube.',privacy:'Privacy and storage',privacyText:'Your watch history and interests are stored in this browser only. Search terms and requested video IDs are sent to external video search instances. There is no account system or shared server-side history in this version. Anyone using the same browser profile can see that profile’s local history.',searchPh:'Search YouTube...',searchBtn:'Search',orLink:'Or paste a video / playlist link',searching:'Searching YouTube...',loadingSuggest:'Loading suggestions...',noResults:'No videos found.',searchFail:'Search is temporarily unavailable. Try again or paste a link.',paste:'Paste & play',go:'Start',ph:'Paste link here',
      tip:'To open it like an app: on iPhone, tap Share in Safari, then “Add to Home Screen”. On Android, tap ⋮ then “Add to Home screen”.',
      videos:'Videos',playlistTab:'My list',recommendTab:'Recommended',recWait:'Loading recommendations for this video…',recFail:'Could not load recommendations right now.',recEmpty:'No recommendations found for this video.',noCurrent:'Play a video first to see recommendations.',pip:'Picture in picture',pipPreparing:'Preparing picture-in-picture. Wait a moment, then tap again.',pipUnsupported:'Picture-in-picture is not supported by this browser.',pipUnavailable:'Picture-in-picture is unavailable for this video.',pipFailed:'Could not start picture-in-picture. Try again.',audlbl:'Audio only mode',hint:'Swipe up for next • Double-tap left or right to skip',
      back:'Back',fit:'Fill / fit',shuf:'Shuffle',aud2:'Audio only',list:'List',pip:'Picture in picture',clean:'Hide buttons',close:'Close',
      listWait:'The list has not arrived yet. Let the video play a moment, then open it again.',video:'Video',
      rotate:'Turn your phone sideways',normal:'Back to normal',
      bad:'No valid link found. Paste a video or playlist link.',noclip:'Clipboard unavailable. Paste the link into the box.',clipdeny:'Clipboard access denied. Paste the link manually.'},
    ar:{sub:'الصق رابطاً للتشغيل أو ابحث في يوتيوب.',privacy:'الخصوصية والتخزين',privacyText:'سجل المشاهدة والاهتمامات محفوظان في هذا المتصفح فقط، وهما غير مشفّرين بواسطة الموقع. يتم إرسال كلمات البحث ومعرّفات الفيديو المطلوبة إلى خدمات بحث فيديو خارجية. لا يوجد في هذه النسخة نظام حسابات أو سجل مشترك على خادم. أي شخص يستخدم ملف المتصفح نفسه يستطيع رؤية السجل المحلي لذلك الملف.',searchPh:'ابحث في يوتيوب...',searchBtn:'بحث',orLink:'أو الصق رابط فيديو / قائمة تشغيل',searching:'جاري البحث في يوتيوب...',loadingSuggest:'جاري تحميل الاقتراحات...',noResults:'ما لقيت فيديوهات.',searchFail:'البحث غير متاح حالياً. جرّب مرة ثانية أو الصق رابطاً.',paste:'لصق وتشغيل',go:'ابدأ',ph:'الصق الرابط هنا',
      tip:'لتفتحها كأنها تطبيق بشاشة كاملة: على الآيفون من Safari اضغط المشاركة ثم «إضافة إلى الشاشة الرئيسية». وعلى أندرويد اضغط ⋮ ثم «إضافة إلى الشاشة الرئيسية».',
      videos:'الفيديوهات',playlistTab:'قائمتي',recommendTab:'اقتراحات',recWait:'جاري تحميل اقتراحات هذا الفيديو…',recFail:'تعذر تحميل الاقتراحات حالياً.',recEmpty:'ما لقيت اقتراحات لهذا الفيديو.',noCurrent:'شغّل فيديو أولاً لعرض الاقتراحات.',pip:'صورة داخل صورة',pipPreparing:'جاري تجهيز الصورة المصغّرة. انتظر قليلاً ثم اضغط مرة ثانية.',pipUnsupported:'هذا المتصفح لا يدعم الصورة داخل صورة.',pipUnavailable:'الصورة داخل صورة غير متاحة لهذا الفيديو.',pipFailed:'ما قدرت أشغّل الصورة داخل صورة. جرّب مرة ثانية.',audlbl:'وضع الصوت فقط',hint:'اسحب لفوق للتالي • لمستين يمين أو يسار للتقديم والترجيع',
      back:'رجوع',fit:'ملء أو احتواء',shuf:'عشوائي',aud2:'صوت فقط',list:'القائمة',pip:'صورة داخل صورة',clean:'إخفاء الأزرار',close:'إغلاق',
      listWait:'القائمة لسا ما وصلت. شغّل الفيديو شوي وافتحها مرة ثانية.',video:'فيديو',
      rotate:'دوّر التلفون على الجنب',normal:'رجعت للوضع العادي',
      bad:'ما لقيت رابط صالح. الصق رابط فيديو أو بلاي ليست.',noclip:'الحافظة غير متاحة، الصق الرابط يدوياً بالمربع.',clipdeny:'ما انسمح بالوصول للحافظة، الصق الرابط يدوياً.'}
  };
  function tr(k){return L[lang][k]}
  Object.assign(L.en,{searchPh:'Search…',searching:'Searching…',ph:'Paste a video or playlist link',paste:'Paste',go:'Play',
    forYou:'For you',popular:'Popular picks',recent:'Recently watched',feedHint:'Watch a few videos and this page will learn what you like.',
    feedFail:'Could not load videos right now.',retry:'Try again',views:'views',results:'Results',clearHist:'Clear my history',
    clearAsk:'Clear your watch history on this device?',install:'Install as an app',refresh:'Refresh'});
  Object.assign(L.ar,{searchPh:'ابحث…',searching:'جاري البحث…',ph:'الصق رابط فيديو أو قائمة تشغيل',paste:'لصق',go:'تشغيل',
    forYou:'لأجلك',popular:'مقترحات رائجة',recent:'شو شاهدت مؤخراً',feedHint:'شاهد بعض الفيديوهات وهاي الصفحة بتتعلم شو بتحب.',
    feedFail:'ما قدرت أحمّل الفيديوهات هلأ.',retry:'جرّب مرة ثانية',views:'مشاهدة',results:'النتائج',clearHist:'مسح سجلّي',
    clearAsk:'مسح سجل المشاهدة من هالجهاز؟',install:'تثبيته كتطبيق',refresh:'تحديث'});
  function setLang(l){
    lang=l;var h=document.documentElement;h.lang=l;h.dir=l==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-t]').forEach(function(e){e.textContent=tr(e.dataset.t)});
    document.querySelectorAll('[data-a]').forEach(function(e){e.setAttribute('aria-label',tr(e.dataset.a))});
    $('url').placeholder=tr('ph');$('searchInput').placeholder=tr('searchPh');$('searchInput').setAttribute('aria-label',tr('searchPh'));$('lang').textContent=l==='en'?'العربية':'English';
    applyHomeLang();
  }
  var yt=$('yt'),slide=$('slide'),stage=$('stage'),flash=$('flash');
  var playing=true,shuffle=false,fill=true,busy=false;
  var ids=[],cur=-1,T={},io=null,q=[],active=0;
  var playlistIds=[],originalPlaylistId=null,preserveSavedPlaylist=false;
  var currentVideoId='',currentTab='playlist',recommendedVideos=[],recommendedFor='',recommendationSeq=0;
  var videoInfoCache=Object.create(null),videoInfoRequests=Object.create(null),videoInfoCacheOrder=[];
  function rememberVideoInfo(id,data){
    if(videoInfoCache[id])videoInfoCacheOrder=videoInfoCacheOrder.filter(function(x){return x!==id});
    videoInfoCache[id]=data;videoInfoCacheOrder.push(id);
    while(videoInfoCacheOrder.length>12){var old=videoInfoCacheOrder.shift();delete videoInfoCache[old]}
  }
  var pipVideo=$('pipVideo'),pipPreparedId='',pipSourceLoadingId='',pipActive=false,pipOwnerId='';
  var dur=0,tcur=0,drag=false,lastSec=-1,lastTap=0;
  function fmt(s){s=Math.max(0,Math.floor(s));var m=Math.floor(s/60),h=Math.floor(m/60),r=('0'+s%60).slice(-2);return h?h+':'+('0'+m%60).slice(-2)+':'+r:m+':'+r}
  function paint(t){if(!dur)return;$('pf').style.transform='scaleX('+Math.min(1,t/dur)+')';var s=Math.floor(t);if(s!==lastSec){lastSec=s;$('tm').textContent=fmt(t)+' / '+fmt(dur)}}
  function seek(t){if(dur)t=Math.min(t,dur-1);t=Math.max(0,t);cmd('seekTo',[t,true]);tcur=t;lastSec=-1;paint(t)}
  function tap(x){
    var now=Date.now(),w=rot()?window.innerHeight:window.innerWidth,side=x<w/3?-1:(x>w*2/3?1:0);
    if(side&&now-lastTap<320){lastTap=0;toggle();seek(tcur+side*10);flash.textContent=side>0?'+10':'−10';flash.classList.add('show');setTimeout(function(){flash.classList.remove('show')},450);return}
    lastTap=now;toggle();
  }
  function touchTitleKey(id){
    var keys=[];try{keys=JSON.parse(ls('titleKeys')||'[]')}catch(e){}
    if(!Array.isArray(keys))keys=[];
    keys=keys.filter(function(x){return x!==id});keys.push(id);
    while(keys.length>150){
      var old=keys.shift();delete T[old];
      try{localStorage.removeItem('malektube:v2:t:'+old)}catch(e){}
    }
    ls('titleKeys',JSON.stringify(keys));
  }
  function title(id){
    if(T[id])return T[id];
    var v=ls('t:'+id);
    if(v){T[id]=v;touchTitleKey(id)}
    return v;
  }
  function saveTitle(id,t){
    if(!id||!t)return;
    t=String(t).slice(0,300);
    if(T[id]!==t){T[id]=t;ls('t:'+id,t)}
    touchTitleKey(id);
    document.querySelectorAll('.row[data-id="'+id+'"]').forEach(function(r){var target=r.classList.contains('rec-row')?r.querySelector('.rec-title'):r.querySelector('span');if(target)target.textContent=t});
  }
  function fetchTitle(id,done){
    fetch('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/watch?v='+id),{credentials:'omit',referrerPolicy:'no-referrer'}).then(function(r){return r.ok?r.json():null}).then(function(j){if(j&&j.title)saveTitle(id,j.title)}).catch(function(){}).then(done);
  }
  // Search and autocomplete use the documented, keyless Invidious API.
  // Public instances can become unavailable, so requests fall back to the next host.
  var apiHosts=['https://inv.nadeko.net','https://invidious.nerdvpn.de','https://yt.chocolatemoo53.com','https://invidious.tiekoetter.com'];
  var apiStart=0,searchTimer=null,suggestTimer=null,searchSeq=0,suggestSeq=0;
  function apiGet(path){
    var order=apiHosts.slice(apiStart).concat(apiHosts.slice(0,apiStart));
    function attempt(i){
      if(i>=order.length)return Promise.reject(new Error('All search instances failed'));
      var host=order[i],controller=(typeof AbortController!=='undefined')?new AbortController():null;
      var timer=controller?setTimeout(function(){controller.abort()},4000):null;
      var opts={method:'GET',mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Accept':'application/json'}};
      if(controller)opts.signal=controller.signal;
      return fetch(host+path,opts).then(function(r){
        if(!r.ok)throw new Error('HTTP '+r.status);
        return r.json();
      }).then(function(data){if(timer)clearTimeout(timer);apiStart=apiHosts.indexOf(host);return data;})
        .catch(function(e){if(timer)clearTimeout(timer);return attempt(i+1)});
    }
    return attempt(0);
  }
  function pickPipStream(data){
    var all=Array.isArray(data&&data.formatStreams)?data.formatStreams:[];
    var playable=all.filter(function(f){
      if(!f||!f.url||!f.type||!pipVideo.canPlayType(f.type))return false;
      try{var u=new URL(f.url,location.href),host=u.hostname.toLowerCase();return u.protocol==='https:'&&(host==='googlevideo.com'||host.endsWith('.googlevideo.com'))}catch(e){return false}
    });
    if(!playable.length)return null;
    function quality(f){var label=String(f.qualityLabel||f.quality||'');var m=label.match(/(\d{3,4})/);if(m)return +m[1];if(label==='medium')return 360;if(label==='small')return 240;if(label==='large')return 480;return 0}
    var under=playable.filter(function(f){var n=quality(f);return !n||n<=720});
    (under.length?under:playable).sort(function(a,b){return quality(b)-quality(a)});
    return (under.length?under:playable)[0];
  }
  function preparePipSource(id,data){
    if(!id||id!==currentVideoId)return;
    var stream=pickPipStream(data);
    if(!stream){$('b-pip').disabled=true;return}
    if(pipPreparedId===id&&pipVideo.src===stream.url){$('b-pip').disabled=pipVideo.readyState<1;return}
    try{pipVideo.pause();$('b-pip').disabled=true;pipSourceLoadingId=id;pipVideo.src=stream.url;pipVideo.load();pipPreparedId=id}catch(e){$('b-pip').disabled=true}
  }
  function renderRecommendations(id,data){
    if(id!==currentVideoId||currentTab!=='recommendations')return;
    var rows=$('rows');rows.textContent='';
    var items=Array.isArray(data&&data.recommendedVideos)?data.recommendedVideos:[];
    items=items.filter(function(v){return v&&validVideoId(v.videoId)&&v.videoId!==id}).slice(0,35);
    recommendedVideos=items;recommendedFor=id;
    if(!items.length){var p=document.createElement('p');p.style.cssText='padding:20px;color:#8a8f9a';p.textContent=tr('recEmpty');rows.appendChild(p);return}
    var frag=document.createDocumentFragment();
    items.forEach(function(v,i){
      var r=document.createElement('div');r.className='row rec-row';r.dataset.id=v.videoId;r.dataset.rec='1';r.dataset.i=i;
      var n=document.createElement('i');n.textContent=i+1;
      var im=document.createElement('img');im.loading='lazy';im.decoding='async';im.alt='';im.src='https://i.ytimg.com/vi/'+encodeURIComponent(v.videoId)+'/mqdefault.jpg';
      var copy=document.createElement('span');copy.style.cssText='display:flex;flex-direction:column;gap:3px;min-width:0';
      var titleEl=document.createElement('span');titleEl.className='rec-title';titleEl.textContent=v.title||tr('video');
      var meta=document.createElement('small');meta.style.cssText='font-size:11px;color:#8a8f9a;line-height:1.4';
      var bits=[];if(v.author)bits.push(v.author);if(v.viewCountText)bits.push(v.viewCountText);if(v.publishedText)bits.push(v.publishedText);meta.textContent=bits.join(' • ');
      copy.appendChild(titleEl);copy.appendChild(meta);r.appendChild(n);r.appendChild(im);r.appendChild(copy);frag.appendChild(r);
      if(v.title)saveTitle(v.videoId,v.title);
    });
    rows.appendChild(frag);
  }
  function resumePendingVideo(){
    if(!pendingResumeId||pendingResumeId!==currentVideoId||pendingResumeAt<=5||!playing)return;
    var resumeId=pendingResumeId,resumeAt=pendingResumeAt;
    pendingResumeId='';pendingResumeAt=0;
    setTimeout(function(){if(currentVideoId===resumeId){cmd('seekTo',[resumeAt,true]);tcur=resumeAt}},700);
  }
  function loadVideoInfo(id){
    if(!id)return Promise.reject(new Error('No current video'));
    if(videoInfoCache[id]){if(id===currentVideoId){preparePipSource(id,videoInfoCache[id]);if(currentTab==='recommendations')renderRecommendations(id,videoInfoCache[id])}return Promise.resolve(videoInfoCache[id])}
    if(videoInfoRequests[id])return videoInfoRequests[id];
    var url='/api/v1/videos/'+encodeURIComponent(id)+'?hl='+(lang==='ar'?'ar':'en')+'&region=JO';
    var req=apiGet(url).then(function(data){
      rememberVideoInfo(id,data);
      if(id===currentVideoId){preparePipSource(id,data);if(currentTab==='recommendations')renderRecommendations(id,data)}
      return data;
    }).catch(function(err){
      if(id===currentVideoId&&currentTab==='recommendations')showListMessage(tr('recFail'));
      throw err;
    });
    videoInfoRequests[id]=req;
    req.then(function(){delete videoInfoRequests[id]},function(){delete videoInfoRequests[id]});
    return req;
  }
  function showListMessage(message){var rows=$('rows');rows.textContent='';var p=document.createElement('p');p.style.cssText='padding:20px;color:#8a8f9a';p.textContent=message;rows.appendChild(p)}
  function loadRecommendations(){
    var id=currentVideoId,seq=++recommendationSeq;
    if(!id){showListMessage(tr('noCurrent'));return}
    if(recommendedFor===id&&recommendedVideos.length){renderRecommendations(id,{recommendedVideos:recommendedVideos});return}
    showListMessage(tr('recWait'));
    loadVideoInfo(id).then(function(data){if(seq===recommendationSeq&&currentVideoId===id&&currentTab==='recommendations')renderRecommendations(id,data)}).catch(function(){if(seq===recommendationSeq&&currentTab==='recommendations')showListMessage(tr('recFail'))});
  }
  function setCurrentVideo(id,videoTitle){
    if(!validVideoId(id))return;
    var changed=currentVideoId!==id;
    if(changed&&currentVideoId)recordHistory(currentVideoId);
    currentVideoId=id;
    if(videoTitle)saveTitle(id,videoTitle);
    if(changed){
      clearTimeout(histTimer);(function(hid){histTimer=setTimeout(function(){recordHistory(hid)},12000)})(id);
      recommendedVideos=[];recommendedFor='';
      $('b-pip').disabled=true;
      if(pipActive&&pipOwnerId!==id)stopPip(true);
      loadVideoInfo(id).catch(function(){});
      if($('list').classList.contains('open')&&currentTab==='recommendations')loadRecommendations();
    }
  }
  function requestPip(){
    if(!currentVideoId){hmsg(tr('pipUnavailable'));return}
    if(pipPreparedId!==currentVideoId||!pipVideo.currentSrc||pipVideo.readyState<1){loadVideoInfo(currentVideoId).catch(function(){});hmsg(tr('pipPreparing'));return}
    try{
      if(document.pictureInPictureElement===pipVideo){document.exitPictureInPicture();return}
      if(typeof pipVideo.requestPictureInPicture==='function'&&document.pictureInPictureEnabled){
        pipVideo.currentTime=Math.max(0,tcur||0);
        var playPromise=pipVideo.play();
        var pipPromise=pipVideo.requestPictureInPicture();
        Promise.all([Promise.resolve(playPromise),Promise.resolve(pipPromise)]).then(function(){pipOwnerId=currentVideoId;pipActive=true;cmd('pauseVideo');playing=false}).catch(function(){pipVideo.pause();hmsg(tr('pipFailed'))});
        return;
      }
      if(typeof pipVideo.webkitSetPresentationMode==='function'&&typeof pipVideo.webkitSupportsPresentationMode==='function'&&pipVideo.webkitSupportsPresentationMode('picture-in-picture')){
        pipVideo.currentTime=Math.max(0,tcur||0);var playPromise=pipVideo.play();pipVideo.webkitSetPresentationMode('picture-in-picture');
        playPromise.then(function(){pipOwnerId=currentVideoId;pipActive=true;cmd('pauseVideo');playing=false}).catch(function(){hmsg(tr('pipFailed'))});
        return;
      }
      hmsg(tr('pipUnsupported'));
    }catch(e){hmsg(tr('pipFailed'))}
  }
  function stopPip(resumeMain){
    try{if(document.pictureInPictureElement===pipVideo&&document.exitPictureInPicture)document.exitPictureInPicture();else if(pipVideo.webkitSetPresentationMode&&pipVideo.webkitSupportsPresentationMode&&pipVideo.webkitSupportsPresentationMode('picture-in-picture'))pipVideo.webkitSetPresentationMode('inline')}catch(e){}
    pipVideo.pause();pipActive=false;
    if(resumeMain&&pipOwnerId&&pipOwnerId===currentVideoId){cmd('seekTo',[Math.max(0,pipVideo.currentTime||tcur),true]);cmd('playVideo');playing=true}
    pipOwnerId='';
  }
  pipVideo.addEventListener('loadedmetadata',function(){if(pipSourceLoadingId&&pipSourceLoadingId===currentVideoId){$('b-pip').disabled=false;pipSourceLoadingId=''}});
  pipVideo.addEventListener('error',function(){if(pipSourceLoadingId&&pipSourceLoadingId===currentVideoId){$('b-pip').disabled=true;pipSourceLoadingId=''}});
  pipVideo.addEventListener('enterpictureinpicture',function(){pipActive=true;pipOwnerId=currentVideoId;cmd('pauseVideo');playing=false});
  pipVideo.addEventListener('leavepictureinpicture',function(){
    var owner=pipOwnerId,pos=pipVideo.currentTime||tcur;pipActive=false;
    if(owner&&owner===currentVideoId){cmd('seekTo',[Math.max(0,pos),true]);cmd('playVideo');playing=true}
    pipOwnerId='';
  });
  pipVideo.addEventListener('webkitpresentationmodechanged',function(){
    var on=pipVideo.webkitPresentationMode==='picture-in-picture';pipActive=on;
    if(on){pipOwnerId=currentVideoId;cmd('pauseVideo');playing=false}
    else if(pipOwnerId&&pipOwnerId===currentVideoId){cmd('seekTo',[Math.max(0,pipVideo.currentTime||tcur),true]);cmd('playVideo');playing=true;pipOwnerId=''}
  });
  pipVideo.addEventListener('ended',function(){if(pipActive)stopPip(true)});
  function hideSuggestions(){var box=$('suggestions');box.hidden=true;box.textContent=''}
  function showSuggestions(items,seq){
    if(seq!==suggestSeq)return;
    var box=$('suggestions');box.textContent='';
    (items||[]).slice(0,7).forEach(function(value){
      if(typeof value!=='string'||!value.trim())return;
      var b=document.createElement('button');b.type='button';b.className='suggestion';b.setAttribute('role','option');b.textContent=value;
      b.addEventListener('click',function(){$('searchInput').value=value;hideSuggestions();searchVideos(value)});
      box.appendChild(b);
    });
    box.hidden=!box.childNodes.length;
  }
  function loadSuggestions(value){
    var seq=++suggestSeq;
    if(value.length<2){hideSuggestions();return}
    apiGet('/api/v1/search/suggestions?q='+encodeURIComponent(value)).then(function(data){
      showSuggestions(data&&data.suggestions,seq);
    }).catch(function(){if(seq===suggestSeq)hideSuggestions()});
  }
  function loadSearchPage(page,seq,append){
    if(searchLoading||!searchHasMore)return;searchLoading=true;
    var language=lang==='ar'?'ar':'en';
    apiGet('/api/v1/search?q='+encodeURIComponent(currentSearchQuery)+'&type=video&page='+page+'&region=JO&hl='+language).then(function(data){
      if(seq!==searchSeq)return;
      var videos=Array.isArray(data)?data.filter(function(v){return v&&v.type==='video'&&validVideoId(v.videoId)}):[];
      var added=[],known=Object.create(null);searchItems.forEach(function(x){known[x.id]=1});
      videos.forEach(function(v){var it=normItem(v);if(!known[it.id]){known[it.id]=1;added.push(it)}});
      if(!append){searchItems=[];added.forEach(function(x){searchItems.push(x)})}
      else added.forEach(function(x){searchItems.push(x)});
      browseItems=searchItems;searchPage=page;searchHasMore=videos.length>0&&added.length>0;searchLoading=false;
      if(!append)$('results').textContent='';
      var frag=document.createDocumentFragment();
      added.forEach(function(it,i){frag.appendChild(makeCard(it,searchItems.length-added.length+i,searchItems))});
      $('results').appendChild(frag);$('searchStatus').textContent=searchItems.length?'':tr('noResults');
      recheckSentinel('resultsSentinel');
    }).catch(function(){if(seq!==searchSeq)return;searchLoading=false;if(!append)$('searchStatus').textContent=tr('searchFail')});
  }
  function loadMoreSearch(){
    if(searchLoading||!searchHasMore||$('resultsWrap').hidden)return;
    loadSearchPage(searchPage+1,searchSeq,true);
  }
  function searchVideos(value){
    var query=(value||'').trim();if(!query)return;
    clearTimeout(searchTimer);clearTimeout(suggestTimer);hideSuggestions();
    currentSearchQuery=query;searchItems=[];browseItems=searchItems;searchPage=0;searchLoading=false;searchHasMore=true;
    var seq=++searchSeq,status=$('searchStatus');
    showResults(true);$('resTitle').textContent=query;$('results').textContent='';status.textContent=tr('searching');
    loadSearchPage(1,seq,false);
  }
  $('searchInput').addEventListener('input',function(){
    var value=this.value.trim();clearTimeout(suggestTimer);clearTimeout(searchTimer);
    if(value.length<2){hideSuggestions();return}
    suggestTimer=setTimeout(function(){loadSuggestions(value)},230);
  });
  $('searchInput').addEventListener('keydown',function(e){
    if(e.key==='Enter'){e.preventDefault();searchVideos(this.value)}
    else if(e.key==='Escape')hideSuggestions();
  });
  $('searchBtn').addEventListener('click',function(){searchVideos($('searchInput').value)});
  document.addEventListener('click',function(e){if(!$('searchArea').contains(e.target))hideSuggestions()});


  // ---------- Home: cards, history and recommendations ----------
  var TOPICS={en:[['Quran','Quran recitation'],['Music','Music'],['Gaming','Gaming'],['News','News'],['Sports','Sports'],['Cooking','Cooking'],['Tech','Tech'],['Comedy','Comedy']],
    ar:[['قرآن','قرآن كريم'],['أغاني','أغاني'],['ألعاب','ألعاب'],['أخبار','أخبار'],['رياضة','رياضة'],['طبخ','طبخ'],['تقنية','تقنية'],['كوميديا','كوميديا']]};
  var FEED_N=36,feedSeq=0,lastFeed=null,histTimer=0,activeChip='home',
    feedPlan=[],feedPage=1,feedLoading=false,feedHasMore=true,feedSeen=Object.create(null),feedCursor=0,
    searchItems=[],searchPage=1,searchLoading=false,searchHasMore=true,currentSearchQuery='',
    browseItems=[],browseScrollY=0,browseView='feed',browseQuery='',moreObserver=null,
    historySaveAt=0,historyEpoch=0,pendingResumeId='',pendingResumeAt=0;
  var STOP={};('official video videos channel subscribe youtube the and for with from this that you your new full episode part live الفيديو فيديو القناة').split(' ').forEach(function(w){STOP[w]=1});
  var WSPLIT;try{WSPLIT=new RegExp('[^\\p{L}\\p{N}]+','u')}catch(e){WSPLIT=/[^a-z0-9\u0600-\u06ff]+/}
  function validVideoId(id){return typeof id==='string'&&/^[A-Za-z0-9_-]{11}$/.test(id)}
  function normItem(v){return {id:v.videoId,t:v.title||'',a:v.author||'',v:+v.viewCount||0,l:+v.lengthSeconds||0,p:v.publishedText||''}}
  function durText(s){s=+s||0;if(!s)return '';var h=Math.floor(s/3600),m=Math.floor(s%3600/60),r=s%60;return (h?h+':'+('0'+m).slice(-2):m)+':'+('0'+r).slice(-2)}
  function viewsText(n){n=+n;if(!n)return '';var x;try{x=new Intl.NumberFormat(lang==='ar'?'ar':'en',{notation:'compact',maximumFractionDigits:1}).format(n)}catch(e){x=n.toLocaleString()}return x+' '+tr('views')}
  function makeCard(it,i,list){
    var b=document.createElement('button');b.type='button';b.className='vcard';b.dataset.videoId=it.id;
    var th=document.createElement('span');th.className='thumb';
    var im=document.createElement('img');im.loading='lazy';im.decoding='async';im.alt='';im.src='https://i.ytimg.com/vi/'+encodeURIComponent(it.id)+'/mqdefault.jpg';th.appendChild(im);
    var d=durText(it.l);if(d){var em=document.createElement('em');em.textContent=d;th.appendChild(em)}
    var meta=document.createElement('span');meta.className='vmeta';
    var tt=document.createElement('b');tt.textContent=it.t||tr('video');
    var sm=document.createElement('small');sm.textContent=[it.a,viewsText(it.v),it.p].filter(Boolean).join(' • ');
    meta.appendChild(tt);meta.appendChild(sm);b.appendChild(th);b.appendChild(meta);
    b.addEventListener('click',function(){playFrom(browseItems,b.dataset.videoId)});
    return b;
  }
  function saveBrowseState(){
    browseScrollY=window.scrollY||document.documentElement.scrollTop||0;
    browseView=$('resultsWrap').hidden?'feed':'results';
    browseQuery=$('searchInput').value||'';
  }
  function restoreBrowseState(){
    requestAnimationFrame(function(){requestAnimationFrame(function(){window.scrollTo(0,browseScrollY)})});
  }
  function playFrom(list,selectedId){
    if(!selectedId)return;
    var source=Array.isArray(list)?list:[],index=-1;
    for(var n=0;n<source.length;n++){if(source[n]&&source[n].id===selectedId){index=n;break}}
    var qd=index>=0?source.slice(index,index+10):[{id:selectedId}];
    if(!qd.length||qd[0].id!==selectedId)qd=[{id:selectedId}];
    qd.forEach(function(x){if(x.t)saveTitle(x.id,x.t)});
    saveBrowseState();
    start({list:null,vids:qd.map(function(x){return x.id})});
  }
  // watch history (stored only on this device)
  function getHist(){try{var a=JSON.parse(ls('hist')||'[]');return Array.isArray(a)?a:[]}catch(e){return []}}
  function recordHistory(id){
    if(!id)return Promise.resolve();
    var epoch=historyEpoch,wasCurrent=id===currentVideoId,position=wasCurrent?Math.floor(tcur||0):0,knownDuration=wasCurrent?Math.floor(dur||0):0;
    function add(d){
      if(epoch!==historyEpoch)return;
      var h=getHist(),old=null;
      h=h.filter(function(e){if(e.i===id){old=e;return false}return true});
      var keywords=((d&&Array.isArray(d.keywords)&&d.keywords.length?d.keywords:(old&&old.k))||[]).slice(0,8).map(function(x){return String(x).slice(0,80)});
      h.unshift({i:id,t:String((d&&d.title)||title(id)||(old&&old.t)||'').slice(0,300),a:String((d&&d.author)||(old&&old.a)||'').slice(0,120),
        g:String((d&&d.genre)||(old&&old.g)||'').slice(0,120),k:keywords,
        ts:Date.now(),n:(old?old.n||1:0)+1,p:wasCurrent?position:Math.max(0,+((old&&old.p)||0)),
        l:knownDuration||+((d&&d.lengthSeconds)||(old&&old.l)||0)});
      ls('hist',JSON.stringify(h.slice(0,60)));drawHistory();
    }
    var c=videoInfoCache[id];
    if(c){add(c);return Promise.resolve(c)}
    return loadVideoInfo(id).then(function(d){add(d);return d},function(){add(null)});
  }
  function saveHistoryProgress(){
    if(!currentVideoId||!tcur||Date.now()-historySaveAt<10000)return;
    historySaveAt=Date.now();
    var h=getHist(),item=null;
    for(var i=0;i<h.length;i++)if(h[i].i===currentVideoId){item=h[i];break}
    if(!item)return;
    item.p=Math.floor(tcur);if(dur>0)item.l=Math.floor(dur);
    ls('hist',JSON.stringify(h.slice(0,60)));
  }
  function drawHistory(){
    var h=getHist().slice(0,8),wrap=$('historyWrap'),box=$('history');
    if(!wrap||!box)return;
    box.textContent='';
    wrap.hidden=!$('resultsWrap').hidden||!h.length;
    if(!h.length)return;
    var frag=document.createDocumentFragment();
    h.forEach(function(e){
      var b=document.createElement('button');b.type='button';b.className='history-card';b.dataset.videoId=e.i;
      var im=document.createElement('img');im.loading='lazy';im.decoding='async';im.alt='';im.src='https://i.ytimg.com/vi/'+encodeURIComponent(e.i)+'/mqdefault.jpg';
      var copy=document.createElement('span');copy.className='history-copy';
      var titleEl=document.createElement('b');titleEl.textContent=e.t||title(e.i)||tr('video');
      var meta=document.createElement('small');meta.textContent=[e.a,e.p?fmt(e.p):'',e.ts?new Date(e.ts).toLocaleDateString(): ''].filter(Boolean).join(' • ');
      var progress=document.createElement('span');progress.className='history-progress';
      var fillEl=document.createElement('span'),pct=e.l>0?Math.max(0,Math.min(100,(e.p||0)/e.l*100)):0;fillEl.style.width=pct+'%';progress.appendChild(fillEl);
      copy.appendChild(titleEl);copy.appendChild(meta);copy.appendChild(progress);
      b.appendChild(im);b.appendChild(copy);
      b.addEventListener('click',function(){
        saveBrowseState();pendingResumeId=e.i;pendingResumeAt=Math.max(0,+e.p||0);
        start({list:null,vids:[e.i]});
      });
      frag.appendChild(b);
    });
    box.appendChild(frag);
  }
  // interest clusters: videos that share keywords / channel are one topic
  function wordsOf(s){return (s||'').toLowerCase().split(WSPLIT).filter(function(w){return w.length>=3&&!STOP[w]})}
  function tokensOf(e){var o={};(e.k||[]).forEach(function(k){wordsOf(k).forEach(function(w){o[w]=1})});wordsOf(e.t).forEach(function(w){o[w]=1});return o}
  function sim(a,b,ea,eb){
    if(ea&&eb&&ea===eb)return 1;
    var n=0,sa=0,sb=0,k;for(k in a){sa++;if(b[k])n++}for(k in b)sb++;
    return n>=2?n/Math.max(1,Math.min(sa,sb)):0;
  }
  function cluster(h){
    var cl=[];
    h.slice(0,40).forEach(function(e,rank){
      var tk=tokensOf(e),w=Math.pow(.94,rank)*(1+.4*Math.min((e.n||1)-1,3)),best=null,bs=0;
      cl.forEach(function(c){c.m.forEach(function(m){var sc=sim(tk,m.tk,e.a,m.a);if(sc>bs){bs=sc;best=c}})});
      var mem={i:e.i,tk:tk,a:e.a};
      if(best&&bs>=.3){best.m.push(mem);best.w+=w}else cl.push({w:w,m:[mem]});
    });
    return cl;
  }
  function relatedOf(id){
    var tail='hl='+(lang==='ar'?'ar':'en')+'&region=JO',base='/api/v1/videos/'+encodeURIComponent(id);
    function pick(d){var a=d&&d.recommendedVideos;return Array.isArray(a)?a.filter(function(v){return v&&validVideoId(v.videoId)&&v.title}).map(normItem):[]}
    if(videoInfoCache[id]){var c=pick(videoInfoCache[id]);if(c.length)return Promise.resolve(c)}
    function full(){return apiGet(base+'?'+tail).then(pick)}
    return apiGet(base+'?fields=recommendedVideos(videoId,title,author,lengthSeconds,viewCount)&'+tail).then(pick).then(function(a){return a.length?a:full()}).catch(full);
  }
  function searchQ(q,page){
    page=Math.max(1,+page||1);
    return apiGet('/api/v1/search?q='+encodeURIComponent(q)+'&type=video&page='+page+'&region=JO&hl='+(lang==='ar'?'ar':'en')).then(function(d){
      return (Array.isArray(d)?d:[]).filter(function(v){return v&&v.type==='video'&&validVideoId(v.videoId)}).map(normItem);
    });
  }
  function planFor(h,rotation){
    rotation=Math.max(1,+rotation||1);
    if(!h.length){
      var topics=TOPICS[lang].slice(),shift=(rotation-1)%topics.length;
      topics=topics.slice(shift).concat(topics.slice(0,shift));
      return topics.slice(0,4).map(function(t){return {slots:Math.round(FEED_N/4),q:t[1]}});
    }
    var cl=cluster(h).sort(function(a,b){return b.w-a.w}).slice(0,4),sum=cl.reduce(function(x,c){return x+c.w},0)||1;
    return cl.map(function(c){
      var seed=h.filter(function(e){return e.i===c.m[0].i})[0]||h[0],terms=[];
      wordsOf(seed.t).slice(0,5).forEach(function(w){if(terms.indexOf(w)<0)terms.push(w)});
      (seed.k||[]).slice(0,3).forEach(function(w){wordsOf(w).forEach(function(x){if(terms.indexOf(x)<0&&terms.length<7)terms.push(x)})});
      var query=terms.slice(0,7).join(' ')||seed.t||seed.a||'YouTube';
      return {slots:Math.max(5,Math.round(FEED_N*c.w/sum)),q:query};
    });
  }
  function mergeFeed(plan,lists,h){
    var watched={},authors={};
    h.forEach(function(e){watched[e.i]=1;if(e.a)authors[e.a]=(authors[e.a]||0)+1});
    var cols=plan.map(function(p,i){
      var arr=(lists[i]||[]).filter(function(x){return !watched[x.id]});
      arr.forEach(function(x,r){x.s=1/(r+2)+.25*Math.min(1,(authors[x.a]||0)/3)});
      arr.sort(function(a,b){return b.s-a.s});
      return {arr:arr,left:p.slots,total:p.slots,pos:0};
    });
    var out=[],seen={},perAuthor={},guard=0;
    while(out.length<FEED_N&&guard++<600){
      var best=-1,br=-1;
      cols.forEach(function(c,i){if(c.pos<c.arr.length&&c.left>0){var r=c.left/c.total;if(r>br){br=r;best=i}}});
      if(best<0){for(var j=0;j<cols.length;j++)if(cols[j].pos<cols[j].arr.length){best=j;break}}
      if(best<0)break;
      var c=cols[best],x=c.arr[c.pos++];c.left--;
      if(seen[x.id])continue;if((perAuthor[x.a]||0)>=3)continue;
      seen[x.id]=1;perAuthor[x.a]=(perAuthor[x.a]||0)+1;out.push({id:x.id,t:x.t,a:x.a,v:x.v,l:x.l,p:x.p});
    }
    return out;
  }
  function readFeed(){try{var f=JSON.parse(ls('feed')||'null');return f&&Array.isArray(f.items)?f:null}catch(e){return null}}
  function feedSig(h){return h.slice(0,10).map(function(e){return e.i}).join(',')+'|'+lang}
  function drawFeed(items){
    lastFeed=items.slice();browseItems=lastFeed;feedSeen=Object.create(null);
    var f=$('feed'),frag=document.createDocumentFragment();f.textContent='';
    items.forEach(function(it,i){feedSeen[it.id]=1;frag.appendChild(makeCard(it,i,items))});f.appendChild(frag);
    var has=getHist().length>0;$('feedTitle').textContent=tr(has?'forYou':'popular');$('feedHint').textContent=tr('feedHint');$('feedHint').hidden=has;
    drawHistory();
  }
  function appendFeedItems(items){
    var fresh=[];(items||[]).forEach(function(it){if(it&&it.id&&!feedSeen[it.id]){feedSeen[it.id]=1;fresh.push(it)}});
    if(!fresh.length)return 0;
    var frag=document.createDocumentFragment(),combined=lastFeed.concat(fresh);
    fresh.forEach(function(it,i){frag.appendChild(makeCard(it,lastFeed.length+i,combined))});
    $('feed').appendChild(frag);lastFeed=combined;browseItems=lastFeed;return fresh.length;
  }
  function fetchFeedPage(page,seq,append){
    if(feedLoading)return;feedLoading=true;
    Promise.all(feedPlan.map(function(p){return searchQ(p.q,page).catch(function(){return []})})).then(function(lists){
      if(seq!==feedSeq)return;
      var items=mergeFeed(feedPlan,lists,getHist()),added=0;
      if(append)added=appendFeedItems(items);else{drawFeed(items);added=items.length}
      feedPage=page;feedHasMore=lists.some(function(a){return a.length>0})&&(!append||added>0);
      feedLoading=false;recheckSentinel('feedSentinel');
      if(!items.length&&!lastFeed.length)feedMsg(tr('feedFail'));
      else if(!append&&items.length){try{ls('feed',JSON.stringify({ts:Date.now(),sig:feedSig(getHist()),items:items}))}catch(e){}}
    }).catch(function(){if(seq===feedSeq){feedLoading=false;if(!lastFeed.length)feedMsg(tr('feedFail'))}});
  }
  function loadMoreFeed(){
    if(feedLoading||!feedHasMore||!feedPlan.length||!$('feedWrap')||$('feedWrap').hidden)return;
    fetchFeedPage(feedPage+1,feedSeq,true);
  }
  function renderHome(force){
    var h=getHist(),cache=readFeed(),seq=++feedSeq;
    feedLoading=false;feedHasMore=true;feedPage=1;feedSeen=Object.create(null);
    if(cache&&cache.items.length)drawFeed(cache.items);else drawSkeleton();
    feedCursor=(+ls('feedCursor')||0)+1;ls('feedCursor',String(feedCursor));
    var startPage=((feedCursor-1)%4)+1;
    feedPlan=planFor(h,startPage);
    fetchFeedPage(startPage,seq,false);
  }
  function drawSkeleton(){
    var f=$('feed');f.textContent='';
    for(var i=0;i<4;i++){var c=document.createElement('div');c.className='vcard sk';c.innerHTML='<span class="thumb"></span><span class="vmeta"><b></b><small></small></span>';f.appendChild(c)}
  }
  function feedMsg(text){
    var f=$('feed');f.textContent='';var p=document.createElement('p');p.className='note';p.textContent=text;
    var b=document.createElement('button');b.type='button';b.className='chip';b.style.marginTop='10px';b.textContent=tr('retry');b.onclick=function(){renderHome(true)};
    var w=document.createElement('div');w.appendChild(p);w.appendChild(b);f.appendChild(w);
  }
  function showResults(on){
    $('resultsWrap').hidden=!on;$('feedWrap').hidden=on;
    $('historyWrap').hidden=on||!getHist().length;
    if(!on){$('searchStatus').textContent='';$('results').textContent='';activeChip='home';browseItems=lastFeed||[]}
    markChip();
  }
  function renderChips(){
    var n=$('chips');n.textContent='';
    var all=[['home',tr('forYou'),'']].concat(TOPICS[lang].map(function(t){return [t[0],t[0],t[1]]}));
    all.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='chip';b.dataset.k=t[0];b.dataset.q=t[2];b.textContent=t[1];n.appendChild(b)});
    markChip();
  }
  function markChip(){
    var on=$('resultsWrap').hidden?'home':activeChip;
    $('chips').querySelectorAll('.chip').forEach(function(c){c.classList.toggle('on',c.dataset.k===on)});
  }
  function applyHomeLang(){renderChips();if(lastFeed)drawFeed(lastFeed);else $('feedTitle').textContent=tr('forYou')}
  $('chips').addEventListener('click',function(e){
    var b=e.target.closest('.chip');if(!b)return;
    if(b.dataset.k==='home'){$('searchInput').value='';showResults(false)}
    else{activeChip=b.dataset.k;$('searchInput').value=b.dataset.q;searchVideos(b.dataset.q)}
  });
  $('feedRefresh').onclick=function(){renderHome(true)};
  $('resClose').onclick=function(){$('searchInput').value='';showResults(false)};
  $('histClear').onclick=function(){
    if(!confirm(tr('clearAsk')))return;
    historyEpoch++;
    ls('hist','[]');ls('feed','');ls('feedCursor','0');feedCursor=0;
    try{
      for(var i=localStorage.length-1;i>=0;i--){
        var key=localStorage.key(i);
        if(key&&(key.indexOf('malektube:v2:t:')===0||(key.indexOf('t:')===0&&key.length===13)))localStorage.removeItem(key);
      }
    }catch(e){}
    ls('titleKeys','[]');T={};videoInfoCache=Object.create(null);videoInfoCacheOrder=[];
    drawHistory();feedSeen=Object.create(null);renderHome(true);
  };
  $('searchInput').addEventListener('input',function(){if(!this.value.trim())showResults(false)});

  function pump(){while(active<3&&q.length){var id=q.shift();active++;fetchTitle(id,function(){active--;pump()})}}
  function buildList(){
    var rows=$('rows');rows.textContent='';
    if(io){io.disconnect();io=null}
    if(currentTab==='recommendations'){loadRecommendations();return}
    var listItems=playlistIds.length?playlistIds:ids;
    if(!listItems.length){showListMessage(tr('listWait'));return}
    var frag=document.createDocumentFragment();
    listItems.forEach(function(id,i){
      var r=document.createElement('div');r.className='row'+(id===currentVideoId?' cur':'');r.dataset.id=id;r.dataset.i=i;
      var n=document.createElement('i');n.textContent=i+1;
      var im=document.createElement('img');im.loading='lazy';im.decoding='async';im.alt='';im.src='https://i.ytimg.com/vi/'+id+'/mqdefault.jpg';
      var sp=document.createElement('span');sp.textContent=title(id)||(tr('video')+' '+(i+1));
      r.appendChild(n);r.appendChild(im);r.appendChild(sp);frag.appendChild(r);
    });
    rows.appendChild(frag);
    io=new IntersectionObserver(function(es){es.forEach(function(en){
      if(!en.isIntersecting)return;io.unobserve(en.target);
      var id=en.target.dataset.id;if(!title(id)&&q.indexOf(id)<0){q.push(id);pump()}
    })},{root:rows,rootMargin:'200px'});
    rows.querySelectorAll('.row').forEach(function(r){io.observe(r)});
  }
  function setIds(a){
    var safe=Array.isArray(a)?a.filter(validVideoId):[];
    ids=safe.slice();
    if(!preserveSavedPlaylist)playlistIds=safe.slice();
    if($('list').classList.contains('open')&&currentTab==='playlist')buildList();
  }
  function setCur(i){cur=i;var rs=$('rows'),o=rs.querySelector('.cur');if(o)o.classList.remove('cur');var n=rs.querySelector('[data-i="'+i+'"]');if(n&&currentTab==='playlist')n.classList.add('cur')}
  function closeList(){$('list').classList.remove('open')}
  function switchListTab(tab){
    currentTab=tab;
    $('tabPlaylist').classList.toggle('on',tab==='playlist');$('tabRecommendations').classList.toggle('on',tab==='recommendations');
    $('tabPlaylist').setAttribute('aria-selected',tab==='playlist'?'true':'false');$('tabRecommendations').setAttribute('aria-selected',tab==='recommendations'?'true':'false');
    buildList();
  }
  function ls(k,v){
    var key='malektube:v2:'+k;
    try{
      if(v===undefined){
        var value=localStorage.getItem(key);
        if(value===null){value=localStorage.getItem(k);if(value!==null){localStorage.setItem(key,value);localStorage.removeItem(k)}}
        return value;
      }
      localStorage.setItem(key,v);return v;
    }catch(e){return null}
  }
  function parse(s){
    var vids=[],list=null;
    (s||'').split(/[\s,]+/).filter(Boolean).forEach(function(l){
      var m=l.match(/[?&]list=([\w-]+)/),v=l.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
      if(m){if(!list)list=m[1];return}
      if(v){if(vids.indexOf(v[1])<0)vids.push(v[1]);return}
      if(/^[\w-]{11}$/.test(l)&&vids.indexOf(l)<0)vids.push(l);
      else if(/^(PL|UU|OL|RD|LL)[\w-]{10,}$/.test(l)&&!list)list=l;
    });
    return (list||vids.length)?{list:list,vids:vids}:null;
  }
  function cmd(f,a){try{yt.contentWindow.postMessage(JSON.stringify({event:'command',func:f,args:a||[]}),'https://www.youtube.com')}catch(e){}}
  function listen(){
    for(var i=0;i<4;i++)setTimeout(function(){try{yt.contentWindow.postMessage(JSON.stringify({event:'listening',id:1,channel:'widget'}),'https://www.youtube.com')}catch(e){}},500+i*700);
  }
  window.addEventListener('message',function(e){
    if(e.source!==yt.contentWindow||e.origin!=='https://www.youtube.com')return;
    var d;try{d=JSON.parse(e.data)}catch(x){return}
    var s=d.event==='onStateChange'?d.info:(d.info&&d.info.playerState);
    if(s===1){playing=true;cmd('unloadModule',['captions']);cmd('unloadModule',['cc'])}else if(s===2)playing=false;
    if(s===1)resumePendingVideo();
    var inf=d.info;
    if(inf&&typeof inf==='object'){
      if(inf.playlist&&inf.playlist.length&&(inf.playlist.length!==ids.length||inf.playlist[0]!==ids[0]||inf.playlist[inf.playlist.length-1]!==ids[ids.length-1]))setIds(inf.playlist);
      if(inf.videoData&&inf.videoData.video_id){
        var activeId=inf.videoData.video_id;setCurrentVideo(activeId,inf.videoData.title||'');
        resumePendingVideo();
      }
      if(typeof inf.duration==='number'&&inf.duration>0)dur=inf.duration;
      if(typeof inf.currentTime==='number'){tcur=inf.currentTime;if(!drag)paint(tcur);saveHistoryProgress()}
      if(typeof inf.playlistIndex==='number'&&inf.playlistIndex!==cur)setCur(inf.playlistIndex);
    }
  });
  var IC_PAUSE='<svg viewBox="0 0 24 24"><path d="M9 5v14M15 5v14"/></svg>',IC_PLAY='<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="#fff"/></svg>';
  function rot(){return stage.classList.contains('land')&&window.innerHeight>window.innerWidth}
  function hmsg(t){var h=$('hint');h.textContent=t;h.style.opacity=1;clearTimeout(hmsg.t);hmsg.t=setTimeout(function(){h.style.opacity=0},2600)}
  function lockL(){try{var o=screen.orientation;if(o&&o.lock){var r=o.lock('landscape');if(r&&r.catch)r.catch(function(){})}}catch(x){}}
  function land(){
    var on=stage.classList.toggle('land');
    if(on){var r=fs(true);if(r&&r.then)r.then(lockL,lockL);else lockL();setTimeout(function(){if(rot())hmsg(tr('rotate'))},400)}
    else{try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(x){}hmsg(tr('normal'))}
  }
  function fs(on){try{var d=document,e=d.documentElement;if(on){if(!d.fullscreenElement&&e.requestFullscreen){var r=e.requestFullscreen({navigationUI:'hide'});if(r&&r.catch)r.catch(function(){});return r}}else if(d.fullscreenElement&&d.exitFullscreen)d.exitFullscreen()}catch(x){}}
  function start(p,keepSavedPlaylist){
    if(!p||(!p.list&&(!Array.isArray(p.vids)||!p.vids.some(validVideoId))))return;
    if(!p.list)p.vids=p.vids.filter(validVideoId);
    if(!p.list&&!p.vids.length)return;
    if(pendingResumeId&&(!p.vids||p.vids[0]!==pendingResumeId)){pendingResumeId='';pendingResumeAt=0}
    if(currentVideoId)recordHistory(currentVideoId);
    clearTimeout(histTimer);dur=0;tcur=0;lastSec=-1;historySaveAt=0;
    $('pf').style.transform='scaleX(0)';$('tm').textContent='0:00';
    preserveSavedPlaylist=!!keepSavedPlaylist;
    $('setup').hidden=true;stage.hidden=false;fs(true);
    ids=p.list?[]:p.vids.slice();cur=-1;
    if(!preserveSavedPlaylist){
      originalPlaylistId=p.list||null;
      playlistIds=p.list?[]:p.vids.slice();
    }
    currentVideoId='';recommendedVideos=[];recommendedFor='';$('b-pip').disabled=true;
    if(!p.list&&p.vids&&p.vids[0])setCurrentVideo(p.vids[0],title(p.vids[0])||'');
    playing=true;
    var q='autoplay=1&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&loop=1&vq=tiny&cc_load_policy=0&enablejsapi=1';
    var b='https://www.youtube.com/embed/';
    var ref='';try{if(/^https?:/.test(location.href))ref='&origin='+encodeURIComponent(location.origin)}catch(e){}
    q+=ref;
    yt.src=p.list?b+'videoseries?list='+encodeURIComponent(p.list)+'&'+q:b+p.vids[0]+'?playlist='+encodeURIComponent(p.vids.length>1?p.vids.slice(1).join(','):p.vids[0])+'&'+q;
    yt.onload=listen;
    if($('list').classList.contains('open'))buildList();
    $('hint').textContent=tr('hint');$('hint').style.opacity=1;
    setTimeout(function(){$('hint').style.opacity=0},3500);
  }
  function stop(){
    var endingId=currentVideoId;
    var save=endingId?recordHistory(endingId):Promise.resolve();
    currentVideoId='';clearTimeout(histTimer);
    if(pipActive)stopPip(false);
    yt.src='about:blank';stage.hidden=true;$('setup').hidden=false;closeList();fs(false);stage.classList.remove('land');try{screen.orientation.unlock()}catch(x){}
    if(browseView==='feed')renderHome(true);
    drawHistory();restoreBrowseState();
    save.then(function(){
      var currentScroll=window.scrollY||document.documentElement.scrollTop||0;
      drawHistory();
      if(browseView==='feed')renderHome(true);
      window.scrollTo(0,currentScroll);
    },function(){});
  }
  function go(dir){
    if(busy)return;busy=true;
    slide.style.transition='transform .2s ease,opacity .2s ease';
    slide.style.transform='translateY('+(dir>0?-18:18)+'%)';slide.style.opacity='0';
    setTimeout(function(){
      cmd(dir>0?'nextVideo':'previousVideo');playing=true;
      slide.style.transition='none';
      slide.style.transform='translateY('+(dir>0?18:-18)+'%)';
      void slide.offsetWidth;
      slide.style.transition='transform .22s ease,opacity .22s ease';
      slide.style.transform='translateY(0)';slide.style.opacity='1';
      setTimeout(function(){busy=false},230);
    },200);
  }
  function toggle(){
    if(playing){cmd('pauseVideo');playing=false;flash.innerHTML=IC_PAUSE}
    else{cmd('playVideo');playing=true;flash.innerHTML=IC_PLAY}
    flash.classList.add('show');setTimeout(function(){flash.classList.remove('show')},450);
  }
  var y0=0,x0=0,t0=0;
  var t=$('touch');
  t.addEventListener('touchstart',function(e){var p=e.changedTouches[0];y0=p.clientY;x0=p.clientX;t0=Date.now()},{passive:true});
  t.addEventListener('touchmove',function(e){e.preventDefault()},{passive:false});
  t.addEventListener('touchend',function(e){
    var p=e.changedTouches[0],dy=p.clientY-y0,dx=p.clientX-x0;
    if(rot()){var tx=dx;dx=dy;dy=-tx}
    if(Math.abs(dy)>50&&Math.abs(dy)>Math.abs(dx))go(dy<0?1:-1);
    else if(Math.abs(dy)<12&&Math.abs(dx)<12&&Date.now()-t0<400)tap(rot()?p.clientY:p.clientX);
  });
  t.addEventListener('click',function(e){if(e.detail&&!('ontouchstart' in window))toggle()});
  $('b-back').onclick=stop;
  var lastFit=0;
  $('b-fit').onclick=function(){
    var now=Date.now(),dbl=now-lastFit<350;lastFit=dbl?0:now;
    fill=!fill;slide.className=fill?'fill':'fit';ls('fill',fill?'1':'0');
    if(dbl)land();
  };
  $('b-shuf').onclick=function(){
    shuffle=!shuffle;this.classList.toggle('on',shuffle);
    cmd('setShuffle',[shuffle]);ls('shuf',shuffle?'1':'0');
    if(shuffle)go(1);
  };
  function run(txt){
    var p=parse(txt);
    if(!p){$('err').textContent=tr('bad');return}
    $('err').textContent='';ls('txt',txt);start(p);
  }
  $('go').onclick=function(){run($('url').value)};
  $('paste').onclick=function(){
    if(!navigator.clipboard||!navigator.clipboard.readText){$('err').textContent=tr('noclip');return}
    navigator.clipboard.readText().then(function(t){$('url').value=t;run(t)},function(){$('err').textContent=tr('clipdeny')});
  };
  function recheckSentinel(id){
    if(!moreObserver)return;
    var node=$(id);if(!node)return;
    moreObserver.unobserve(node);moreObserver.observe(node);
  }
  function initInfiniteScroll(){
    if('IntersectionObserver' in window){
      moreObserver=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(!entry.isIntersecting)return;
          if(entry.target.id==='feedSentinel'&&!$('feedWrap').hidden)loadMoreFeed();
          if(entry.target.id==='resultsSentinel'&&!$('resultsWrap').hidden)loadMoreSearch();
        });
      },{root:null,rootMargin:'900px 0px'});
      moreObserver.observe($('feedSentinel'));moreObserver.observe($('resultsSentinel'));
    }else{
      var scrollQueued=false;
      window.addEventListener('scroll',function(){
        if(scrollQueued)return;scrollQueued=true;
        requestAnimationFrame(function(){scrollQueued=false;
          if(window.innerHeight+window.scrollY>document.documentElement.scrollHeight-900){
            if(!$('resultsWrap').hidden)loadMoreSearch();else loadMoreFeed();
          }
        });
      },{passive:true});
    }
  }
  initInfiniteScroll();
  renderChips();renderHome(false);drawHistory();
  var qm=location.search.match(/[?&]u=(.*)$/);
  if(qm){var qu=qm[1];try{qu=decodeURIComponent(qu)}catch(e){}$('url').value=qu;run(qu)}
  if(ls('fill')==='0'){fill=false;slide.className='fit'}
  if(ls('shuf')==='1'){shuffle=true;$('b-shuf').classList.add('on')}
  $('b-aud').onclick=function(){var on=stage.classList.toggle('aud');this.classList.toggle('on',on);ls('aud',on?'1':'0');if(on)cmd('setPlaybackQuality',['tiny'])};
  if(ls('aud')==='1'){stage.classList.add('aud');$('b-aud').classList.add('on')}
  $('b-list').onclick=function(){switchListTab('playlist');$('list').classList.add('open');var c=$('rows').querySelector('.cur');if(c)c.scrollIntoView({block:'center'})};
  $('tabPlaylist').onclick=function(){switchListTab('playlist')};
  $('tabRecommendations').onclick=function(){switchListTab('recommendations')};
  $('b-pip').onclick=requestPip;
  $('lclose').onclick=closeList;
  $('lang').onclick=function(){setLang(lang==='en'?'ar':'en')};
  $('b-clean').onclick=function(){stage.classList.toggle('clean')};
  var trk=$('trk');
  function tpos(e){var r=trk.getBoundingClientRect();var u=rot()?(e.clientY-r.top)/r.height:(e.clientX-r.left)/r.width;return Math.max(0,Math.min(1,u))*dur}
  trk.addEventListener('pointerdown',function(e){if(!dur)return;drag=true;try{trk.setPointerCapture(e.pointerId)}catch(x){}paint(tpos(e))});
  trk.addEventListener('pointermove',function(e){if(drag)paint(tpos(e))});
  trk.addEventListener('pointerup',function(e){if(!drag)return;drag=false;seek(tpos(e))});
  trk.addEventListener('pointercancel',function(){drag=false});
  $('rows').addEventListener('click',function(e){
    var r=e.target.closest('.row');if(!r)return;
    if(r.dataset.rec==='1') {
      var rid=r.dataset.id;saveTitle(rid,r.querySelector('span span')?r.querySelector('span span').textContent:tr('video'));
      start({list:null,vids:[rid]},true);closeList();return;
    }
    var listItems=playlistIds.length?playlistIds:ids,chosenId=r.dataset.id,index=listItems.indexOf(chosenId);
    if(index<0)return;
    preserveSavedPlaylist=false;ids=listItems.slice();cur=index;
    if(originalPlaylistId)cmd('loadPlaylist',[originalPlaylistId,index,0]);
    else if(listItems.length>1)cmd('loadPlaylist',[listItems,index,0]);
    else cmd('loadVideoById',[chosenId,0,'small']);
    setCurrentVideo(listItems[index],title(listItems[index])||'');playing=true;closeList();
  });
})();

if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){})
