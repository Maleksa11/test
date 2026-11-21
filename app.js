(function(){
  var $=function(i){return document.getElementById(i)};
  var L={
    en:{sub:'Paste a link to start, or search YouTube.',privacy:'Privacy and storage',privacyText:'Your watch history and interests are stored in this browser only. Search terms and requested video IDs are sent to external video search instances. There is no account system or shared server-side history in this version. Anyone using the same browser profile can see that profile’s local history.',searchPh:'Search YouTube...',searchBtn:'Search',orLink:'Or paste a video / playlist link',searching:'Searching YouTube...',loadingSuggest:'Loading suggestions...',noResults:'No videos found.',searchFail:'Search is temporarily unavailable. Try again or paste a link.',paste:'Paste & play',go:'Start',ph:'Paste link here',
      tip:'To open it like an app: on iPhone, tap Share in Safari, then “Add to Home Screen”. On Android, tap ⋮ then “Add to Home screen”.',
      videos:'Videos',playlistTab:'My list',recommendTab:'Recommended',recWait:'Loading recommendations for this video…',recFail:'Could not load recommendations right now.',recEmpty:'No recommendations found for this video.',noCurrent:'Play a video first to see recommendations.',pip:'Picture in picture',pipPreparing:'Preparing picture-in-picture. Wait a moment, then tap again.',pipUnsupported:'Picture-in-picture is not supported by this browser.',pipUnavailable:'Picture-in-picture is unavailable for this video.',pipFailed:'Could not start picture-in-picture. Try again.',audlbl:'Audio only mode',hint:'Swipe up for next • Double-tap left or right to skip',
      back:'Back',fit:'Fill / fit',shuf:'Shuffle',aud2:'Audio only',list:'List',pip:'Picture in picture',clean:'Hide buttons',close:'Close',
      listWait:'The list has not arrived yet. Let the video play a moment, then open it again.',video:'Video',
      rotate:'Turn your phone sideways',normal:'Back to normal',
      bad:'No valid link found. Paste a video or playlist link.',noclip:'Clipboard unavailable. Paste the link into the box.',clipdeny:'Clipboard access denied. Paste the link manually.'}
  };
  function tr(k){return L.en[k]}
  Object.assign(L.en,{searchPh:'Search…',searching:'Searching…',ph:'Paste a video or playlist link',paste:'Paste',go:'Play',
    forYou:'For you',popular:'Popular picks',recent:'Recently watched',feedHint:'Watch a few videos and this page will learn what you like.',
    feedFail:'Could not load videos right now.',retry:'Try again',views:'views',results:'Results',clearHist:'Clear my history',
    clearAsk:'Clear your watch history on this device?',historyMore:'Show more',historyLess:'Show less',install:'Install as an app',refresh:'Refresh',
    loadingMore:'Loading more videos…',
    play:'Play',pause:'Pause',playerLoading:'Loading video…',playerTap:'Video is ready. Tap Play if it does not start.',playerError:'YouTube could not play this video. Try another video.',removeHistory:'Remove from watch history',autoplayOn:'Turn autoplay on',autoplayOff:'Turn autoplay off',autoplayEnabled:'Autoplay on',autoplayDisabled:'Autoplay off'});
  var yt=$('yt'),slide=$('slide'),stage=$('stage'),flash=$('flash');
  var playing=true,shuffle=false,fill=false,busy=false,viewMode=0,autoplayEnabled=ls('autoplay')!=='0';
  var ids=[],cur=-1,T={},io=null,q=[],active=0;
  var playlistIds=[],originalPlaylistId=null,preserveSavedPlaylist=false;
  var customQueueActive=false,customQueueIds=[],customQueueIndex=-1,currentDurationHint=0;
  var customAdvanceTimer=0,lastAutoAdvanceId='';
  var currentVideoId='',currentTab='playlist',recommendedVideos=[],recommendedFor='',recommendationSeq=0;
  var historyExpanded=false,HISTORY_LIMIT=500,HISTORY_PREVIEW=3,historyDeleted=Object.create(null);
  var videoInfoCache=Object.create(null),videoInfoRequests=Object.create(null),videoInfoCacheOrder=[];
  function rememberVideoInfo(id,data){
    if(videoInfoCache[id])videoInfoCacheOrder=videoInfoCacheOrder.filter(function(x){return x!==id});
    videoInfoCache[id]=data;videoInfoCacheOrder.push(id);
    while(videoInfoCacheOrder.length>12){var old=videoInfoCacheOrder.shift();delete videoInfoCache[old]}
  }
  var pipVideo=$('pipVideo'),pipPreparedId='',pipSourceLoadingId='',pipActive=false,pipOwnerId='',pipWasPlaying=false;
  function setPipButtonDisabled(disabled){var b=$('b-pip');if(b)b.disabled=!!disabled}
  try{pipVideo.autoPictureInPicture=true}catch(e){}
  var requestedStartId='',requestedStartQueue=[],startCorrectionSent=false;
  var playerLoadToken=0,playerStartTimer=0,playerHasStarted=false,playerWantsPlay=false;
  var dur=0,tcur=0,drag=false,lastSec=-1,lastTap=0,progressPollTimer=0,controlsHideTimer=0;
  var progressClockRunning=false,lastClockAt=0,lastRemoteTimeAt=0,progressPollToken=0;
  function fmt(s){s=Math.max(0,Math.floor(s));var m=Math.floor(s/60),h=Math.floor(m/60),r=('0'+s%60).slice(-2);return h?h+':'+('0'+m%60).slice(-2)+':'+r:m+':'+r}
  function setInlineIcon(el,kind){
    if(!el)return;
    var ns='http://www.w3.org/2000/svg';
    var svg=document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('aria-hidden','true');
    var path=document.createElementNS(ns,'path');
    if(kind==='pause')path.setAttribute('d','M9 5v14M15 5v14');
    else if(kind==='remove')path.setAttribute('d','M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3');
    else {path.setAttribute('d','M8 5.5v13l11-6.5z');path.setAttribute('fill','#fff')}
    svg.appendChild(path);el.textContent='';el.appendChild(svg);
  }
  function paint(t){
    if(!Number.isFinite(dur)||dur<=0)return;
    t=Math.max(0,Math.min(dur,Number.isFinite(+t)?+t:0));
    $('pf').style.transform='scaleX('+Math.max(0,Math.min(1,t/dur))+')';
    var sec=Math.floor(t),currentText=fmt(t),durationText=fmt(dur);
    if(sec!==lastSec||$('tmCurrent').textContent!==currentText){lastSec=sec;$('tmCurrent').textContent=currentText}
    if($('tmDuration').textContent!==durationText)$('tmDuration').textContent=durationText;
  }
  function seek(t){
    if(!Number.isFinite(+t))return;
    if(dur)t=Math.min(+t,Math.max(0,dur-0.25));
    t=Math.max(0,+t);cmd('seekTo',[t,true]);tcur=t;lastSec=-1;
    lastClockAt=Date.now();lastRemoteTimeAt=lastClockAt;paint(t);
    if(playerHasStarted)cmd('getCurrentTime');
  }
  function startProgressPolling(token){
    if(progressPollTimer&&progressPollToken===token)return;
    clearInterval(progressPollTimer);progressPollToken=token;lastClockAt=Date.now();
    progressPollTimer=setInterval(function(){
      if(token!==playerLoadToken||stage.hidden||pipActive||!playerHasStarted)return;
      var now=Date.now(),elapsed=Math.min(1.5,Math.max(0,(now-lastClockAt)/1000));
      lastClockAt=now;
      if(progressClockRunning&&dur>0&&now-lastRemoteTimeAt>1800&&elapsed>0){
        tcur=Math.min(dur,tcur+elapsed);if(!drag)paint(tcur);saveHistoryProgress();
      }
      if(!drag)cmd('getCurrentTime');
      if(!dur)cmd('getDuration');
    },500);
  }
  function scheduleControlsHide(){
    clearTimeout(controlsHideTimer);
    if(stage.hidden||!playing||$('list').classList.contains('open'))return;
    controlsHideTimer=setTimeout(function(){
      if(stage.hidden||!playing||$('list').classList.contains('open'))return;
      if(drag){scheduleControlsHide();return}
      stage.classList.add('controls-hidden');
    },2800);
  }
  function revealControls(){
    if(stage.hidden)return;
    stage.classList.remove('controls-hidden');scheduleControlsHide();
  }
  function updatePlayButton(){
    var b=$('b-toggle');if(!b)return;
    b.dataset.a=playing?'pause':'play';b.setAttribute('aria-label',tr(playing?'pause':'play'));
    setInlineIcon(b,playing?'pause':'play');
  }
  function updateAutoplayButton(){
    var b=$('b-autoplay');if(!b)return;
    var label=tr(autoplayEnabled?'autoplayOff':'autoplayOn');
    b.classList.toggle('on',autoplayEnabled);
    b.setAttribute('aria-pressed',autoplayEnabled?'true':'false');
    b.setAttribute('aria-label',label);b.title=label;
  }
  function storyboardAt(id,seconds){
    var data=videoInfoCache[id],boards=data&&Array.isArray(data.storyboards)?data.storyboards:[];
    if(!boards.length)return null;
    boards=boards.filter(function(b){
      return b&&b.templateUrl&&+b.width>0&&+b.height>0&&+b.count>0&&+b.storyboardWidth>0&&+b.storyboardHeight>0;
    }).sort(function(a,b){return (+b.width||0)-(+a.width||0)});
    for(var i=0;i<boards.length;i++){
      var sb=boards[i],interval=+sb.interval||0;
      if(!interval)interval=Math.max(1,(+(data.lengthSeconds)||dur||1)*1000/(+sb.count));
      var frame=Math.max(0,Math.min(+sb.count-1,Math.floor(seconds*1000/interval)));
      var perSheet=(+sb.storyboardWidth)*(+sb.storyboardHeight);
      if(!perSheet)continue;
      var sheet=Math.floor(frame/perSheet),tile=frame%perSheet,url=String(sb.templateUrl).replace('$M',String(sheet));
      try{var u=new URL(url);if(u.protocol!=='https:'||!(u.hostname==='i.ytimg.com'||u.hostname.endsWith('.ytimg.com')))continue}
      catch(e){continue}
      return {url:url,col:tile%(+sb.storyboardWidth),row:Math.floor(tile/(+sb.storyboardWidth)),
        cols:+sb.storyboardWidth,rows:+sb.storyboardHeight,w:+sb.width,h:+sb.height};
    }
    return null;
  }
  function hideSeekPreview(){var p=$('seekPreview');if(p)p.style.display='none';seekHover=false}
  function showSeekPreview(e){
    if(!dur||!trk)return;
    var r=trk.getBoundingClientRect(),ratio=rot()?(e.clientY-r.top)/Math.max(1,r.height):(e.clientX-r.left)/Math.max(1,r.width);
    ratio=Math.max(0,Math.min(1,ratio));
    var seconds=ratio*dur,frame=storyboardAt(currentVideoId,seconds);
    var p=$('seekPreview'),thumb=$('seekThumb'),tw=160;
    p.classList.toggle('no-thumb',!frame);p.style.display='flex';
    var half=Math.min(p.offsetWidth/2,Math.max(24,trk.clientWidth/2));
    var left=Math.max(half,Math.min(trk.clientWidth-half,ratio*trk.clientWidth));
    p.style.left=left+'px';$('previewTime').textContent=fmt(seconds);
    if(frame){
      var th=Math.max(54,Math.round(tw*frame.h/frame.w));
      thumb.style.width=tw+'px';thumb.style.height=th+'px';
      thumb.style.backgroundImage='url("'+frame.url.replace(/["\\]/g,'')+'")';
      thumb.style.backgroundSize=(frame.cols*tw)+'px '+(frame.rows*th)+'px';
      thumb.style.backgroundPosition=(-frame.col*tw)+'px '+(-frame.row*th)+'px';
    }
    seekHover=true;
  }
  function tap(x){
    var wasHidden=stage.classList.contains('controls-hidden');
    var now=Date.now(),w=rot()?window.innerHeight:window.innerWidth,side=x<w/3?-1:(x>w*2/3?1:0);
    if(side&&lastTap&&now-lastTap<320){
      lastTap=0;seek(tcur+side*10);flash.textContent=side>0?'+10':'−10';
      flash.classList.add('show');setTimeout(function(){flash.classList.remove('show')},450);
      if(!wasHidden)scheduleControlsHide();
      return;
    }
    lastTap=side?now:0;
    if(wasHidden){revealControls();return}
    clearTimeout(controlsHideTimer);stage.classList.add('controls-hidden');
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
  function apiGet(path,retryEmptySearch,validateData){
    try{
      var safePath=new URL(path,'https://malektube-api.invalid');
      if(safePath.origin!=='https://malektube-api.invalid'||safePath.pathname.indexOf('/api/v1/')!==0||safePath.hash)throw new Error('Blocked API path');
      path=safePath.pathname+safePath.search;
    }catch(e){return Promise.reject(new Error('Blocked API path'))}
    var order=apiHosts.slice(apiStart).concat(apiHosts.slice(0,apiStart));
    function attempt(i,emptySeen){
      if(i>=order.length)return emptySeen?Promise.resolve([]):Promise.reject(new Error('All search instances failed'));
      var host=order[i],controller=(typeof AbortController!=='undefined')?new AbortController():null;
      var timer=controller?setTimeout(function(){controller.abort()},5000):null;
      var opts={method:'GET',mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Accept':'application/json'}};
      if(controller)opts.signal=controller.signal;
      return fetch(host+path,opts).then(function(r){
        if(!r.ok)throw new Error('HTTP '+r.status);
        return r.json();
      }).then(function(data){
        if(timer)clearTimeout(timer);
        if(validateData&&!validateData(data))return attempt(i+1,emptySeen);
        if(retryEmptySearch){
          if(!Array.isArray(data))return attempt(i+1,emptySeen);
          if(!data.some(isSearchVideo))return attempt(i+1,true);
        }
        apiStart=apiHosts.indexOf(host);return data;
      },function(){
        if(timer)clearTimeout(timer);
        return attempt(i+1,emptySeen);
      });
    }
    return attempt(0,false);
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
    if(!stream){setPipButtonDisabled(true);return}
    if(pipPreparedId===id&&pipVideo.src===stream.url){setPipButtonDisabled(pipVideo.readyState<1);return}
    try{pipVideo.pause();setPipButtonDisabled(true);pipSourceLoadingId=id;pipVideo.src=stream.url;pipVideo.load();pipPreparedId=id}catch(e){setPipButtonDisabled(true)}
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
      var r=document.createElement('div');r.className='row rec-row';r.dataset.id=v.videoId;r.dataset.rec='1';r.dataset.i=i;r.dataset.duration=String(+v.lengthSeconds||0);
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
    setTimeout(function(){if(currentVideoId===resumeId)seek(resumeAt)},700);
  }
  function applyDurationFallback(id,data){
    var seconds=Number(data&&data.lengthSeconds);
    if(id===currentVideoId&&dur<=0&&Number.isFinite(seconds)&&seconds>0){
      dur=seconds;lastSec=-1;paint(tcur);
    }
  }
  function loadVideoInfo(id){
    if(!id)return Promise.reject(new Error('No current video'));
    if(videoInfoCache[id]){
      if(id===currentVideoId){applyDurationFallback(id,videoInfoCache[id]);preparePipSource(id,videoInfoCache[id]);if(currentTab==='recommendations')renderRecommendations(id,videoInfoCache[id])}
      return Promise.resolve(videoInfoCache[id]);
    }
    if(videoInfoRequests[id])return videoInfoRequests[id];
    var url='/api/v1/videos/'+encodeURIComponent(id)+'?hl='+('en')+'&region=JO';
    var req=apiGet(url,false,function(data){return !!(data&&validVideoId(data.videoId))}).then(function(data){
      rememberVideoInfo(id,data);
      if(id===currentVideoId){applyDurationFallback(id,data);preparePipSource(id,data);if(currentTab==='recommendations')renderRecommendations(id,data)}
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
      delete historyDeleted[id];
      var wasPlaying=playerHasStarted&&playing;
      dur=0;tcur=0;lastSec=-1;progressClockRunning=wasPlaying;lastClockAt=Date.now();lastRemoteTimeAt=lastClockAt;
      lastAutoAdvanceId='';
      if(customQueueActive){
        var queueIndex=customQueueIds.indexOf(id);
        if(queueIndex>=0){customQueueIndex=queueIndex;cur=queueIndex;if($('list').classList.contains('open')&&currentTab==='playlist')setCur(queueIndex)}
      }
      $('pf').style.transform='scaleX(0)';$('tmCurrent').textContent='0:00';$('tmDuration').textContent='0:00';hideSeekPreview();
      clearTimeout(histTimer);(function(hid){histTimer=setTimeout(function(){recordHistory(hid)},12000)})(id);
      if(currentDurationHint>0){dur=currentDurationHint;currentDurationHint=0;paint(tcur)}
      recommendedVideos=[];recommendedFor='';
      setPipButtonDisabled(true);
      if(pipActive&&pipOwnerId!==id)stopPip(true);
      if(pipVideo){try{pipVideo.autoPictureInPicture=true}catch(e){}}
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
        Promise.all([Promise.resolve(playPromise),Promise.resolve(pipPromise)]).then(function(){
          pipOwnerId=currentVideoId;pipActive=true;pipWasPlaying=!pipVideo.paused;
          cmd('pauseVideo');playing=pipWasPlaying;updatePlayButton();
        }).catch(function(){pipVideo.pause();hmsg(tr('pipFailed'))});
        return;
      }
      if(typeof pipVideo.webkitSetPresentationMode==='function'&&typeof pipVideo.webkitSupportsPresentationMode==='function'&&pipVideo.webkitSupportsPresentationMode('picture-in-picture')){
        pipVideo.currentTime=Math.max(0,tcur||0);var playPromise=pipVideo.play();pipVideo.webkitSetPresentationMode('picture-in-picture');
        playPromise.then(function(){
          pipOwnerId=currentVideoId;pipActive=true;pipWasPlaying=!pipVideo.paused;
          cmd('pauseVideo');playing=pipWasPlaying;updatePlayButton();
        }).catch(function(){hmsg(tr('pipFailed'))});
        return;
      }
      hmsg(tr('pipUnsupported'));
    }catch(e){hmsg(tr('pipFailed'))}
  }
  function stopPip(resumeMain){
    var owner=pipOwnerId,position=pipVideo.currentTime||tcur,shouldResume=pipWasPlaying||!pipVideo.paused;
    try{if(document.pictureInPictureElement===pipVideo&&document.exitPictureInPicture)document.exitPictureInPicture();else if(pipVideo.webkitSetPresentationMode&&pipVideo.webkitSupportsPresentationMode&&pipVideo.webkitSupportsPresentationMode('picture-in-picture'))pipVideo.webkitSetPresentationMode('inline')}catch(e){}
    pipActive=false;pipVideo.pause();
    if(owner&&owner===currentVideoId){
      tcur=Math.max(0,position);saveHistoryProgress();if(!drag)paint(tcur);
      if(resumeMain){
        cmd('seekTo',[tcur,true]);
        if(shouldResume){cmd('playVideo');playing=true}else{cmd('pauseVideo');playing=false}
        updatePlayButton();
      }
    }
    pipOwnerId='';pipWasPlaying=false;
  }
  pipVideo.addEventListener('loadedmetadata',function(){
    if(pipSourceLoadingId&&pipSourceLoadingId===currentVideoId){setPipButtonDisabled(false);pipSourceLoadingId=''}
    if(document.visibilityState==='hidden'&&playing&&!pipActive&&pipPreparedId===currentVideoId){
      try{requestPip()}catch(e){}
    }
  });
  pipVideo.addEventListener('error',function(){if(pipSourceLoadingId&&pipSourceLoadingId===currentVideoId){setPipButtonDisabled(true);pipSourceLoadingId=''}});
  pipVideo.addEventListener('timeupdate',function(){
    if(pipActive){
      tcur=pipVideo.currentTime||tcur;
      if(!drag)paint(tcur);
      saveHistoryProgress();
    }
  });
  pipVideo.addEventListener('play',function(){
    if(pipActive){pipWasPlaying=true;playing=true;updatePlayButton()}
  });
  pipVideo.addEventListener('pause',function(){
    if(pipActive){pipWasPlaying=false;playing=false;updatePlayButton()}
  });
  pipVideo.addEventListener('enterpictureinpicture',function(){
    pipActive=true;pipOwnerId=currentVideoId;pipWasPlaying=!pipVideo.paused;
    cmd('pauseVideo');playing=pipWasPlaying;updatePlayButton();
  });
  pipVideo.addEventListener('leavepictureinpicture',function(){
    var owner=pipOwnerId,pos=pipVideo.currentTime||tcur,shouldResume=pipWasPlaying;
    pipActive=false;
    if(owner&&owner===currentVideoId){
      tcur=Math.max(0,pos);saveHistoryProgress();cmd('seekTo',[tcur,true]);
      if(shouldResume){cmd('playVideo');playing=true}else{cmd('pauseVideo');playing=false}
      updatePlayButton();
    }
    pipOwnerId='';pipWasPlaying=false;
  });
  pipVideo.addEventListener('webkitpresentationmodechanged',function(){
    var on=pipVideo.webkitPresentationMode==='picture-in-picture';
    if(on){
      pipActive=true;pipOwnerId=currentVideoId;pipWasPlaying=!pipVideo.paused;
      cmd('pauseVideo');playing=pipWasPlaying;updatePlayButton();
    }else if(pipOwnerId&&pipOwnerId===currentVideoId){
      var pos=pipVideo.currentTime||tcur,shouldResume=pipWasPlaying;pipActive=false;
      tcur=Math.max(0,pos);saveHistoryProgress();cmd('seekTo',[tcur,true]);
      if(shouldResume){cmd('playVideo');playing=true}else{cmd('pauseVideo');playing=false}
      updatePlayButton();pipOwnerId='';pipWasPlaying=false;
    }
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
    if(searchLoading||!searchHasMore)return;searchLoading=true;setMoreLoading('results',true);
    var language='en';
    apiGet('/api/v1/search?q='+encodeURIComponent(currentSearchQuery)+'&type=video&page='+page+'&region=JO&hl='+language,true).then(function(data){
      if(seq!==searchSeq)return;
      var videos=Array.isArray(data)?data.filter(isSearchVideo):[];
      var added=[],known=Object.create(null);searchItems.forEach(function(x){known[x.id]=1});
      videos.forEach(function(v){var it=normItem(v);if(!known[it.id]){known[it.id]=1;added.push(it)}});
      if(!append){searchItems=[];added.forEach(function(x){searchItems.push(x)})}
      else added.forEach(function(x){searchItems.push(x)});
      browseItems=searchItems;searchPage=page;searchHasMore=videos.length>0&&added.length>0;searchLoading=false;setMoreLoading('results',false);
      if(!append)$('results').textContent='';
      var frag=document.createDocumentFragment();
      added.forEach(function(it,i){frag.appendChild(makeCard(it,searchItems.length-added.length+i,searchItems))});
      $('results').appendChild(frag);$('searchStatus').textContent=searchItems.length?'':tr('noResults');
      recheckSentinel('resultsSentinel');
    }).catch(function(){if(seq!==searchSeq)return;searchLoading=false;setMoreLoading('results',false);if(!append)$('searchStatus').textContent=tr('searchFail')});
  }
  function loadMoreSearch(){
    if(searchLoading||!searchHasMore||$('resultsWrap').hidden)return;
    loadSearchPage(searchPage+1,searchSeq,true);
  }
  function searchVideos(value){
    var query=(value||'').trim().slice(0,200);if(!query)return;
    clearTimeout(searchTimer);clearTimeout(suggestTimer);hideSuggestions();
    currentSearchQuery=query;searchItems=[];browseItems=searchItems;searchPage=0;searchLoading=false;setMoreLoading('results',false);searchHasMore=true;
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
  var TOPICS=[['Quran','Quran recitation'],['Music','Music'],['Gaming','Gaming'],['News','News'],['Sports','Sports'],['Cooking','Cooking'],['Tech','Tech'],['Comedy','Comedy']];
  var FEED_N=36,feedSeq=0,lastFeed=null,histTimer=0,activeChip='home',
    feedPlan=[],feedPage=1,feedLoading=false,feedHasMore=true,feedSeen=Object.create(null),feedCursor=0,
    searchItems=[],searchPage=1,searchLoading=false,searchHasMore=true,currentSearchQuery='',
    browseItems=[],browseScrollY=0,browseView='feed',browseQuery='',moreObserver=null,
    historySaveAt=0,historyEpoch=0,pendingResumeId='',pendingResumeAt=0;
  var STOP={};('official video videos channel subscribe youtube the and for with from this that you your new full episode part live').split(' ').forEach(function(w){STOP[w]=1});
  var WSPLIT;try{WSPLIT=new RegExp('[^\\p{L}\\p{N}]+','u')}catch(e){WSPLIT=/[^a-z0-9\u0600-\u06ff]+/}
  function validVideoId(id){return typeof id==='string'&&/^[A-Za-z0-9_-]{11}$/.test(id)}
  function isSearchVideo(v){
    if(!v||!validVideoId(v.videoId))return false;
    var type=String(v.type||'').toLowerCase();
    return !type||type==='video'||type==='shortvideo';
  }
  function normItem(v){return {id:v.videoId,t:String(v.title||'').slice(0,300),a:String(v.author||'').slice(0,120),v:+v.viewCount||0,l:+v.lengthSeconds||0,p:String(v.publishedText||'').slice(0,100)}}
  function durText(s){s=+s||0;if(!s)return '';var h=Math.floor(s/3600),m=Math.floor(s%3600/60),r=s%60;return (h?h+':'+('0'+m).slice(-2):m)+':'+('0'+r).slice(-2)}
  function viewsText(n){n=+n;if(!n)return '';var x;try{x=new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(n)}catch(e){x=n.toLocaleString()}return x+' '+tr('views')}
  function makeCard(it,i,list){
    var b=document.createElement('button');b.type='button';b.className='vcard';b.dataset.videoId=it.id;
    var th=document.createElement('span');th.className='thumb';
    var im=document.createElement('img');im.loading='lazy';im.decoding='async';im.alt='';im.src='https://i.ytimg.com/vi/'+encodeURIComponent(it.id)+'/mqdefault.jpg';th.appendChild(im);
    var d=durText(it.l);if(d){var em=document.createElement('em');em.textContent=d;th.appendChild(em)}
    var meta=document.createElement('span');meta.className='vmeta';
    var tt=document.createElement('b');tt.textContent=it.t||tr('video');
    var sm=document.createElement('small');sm.textContent=[it.a,viewsText(it.v),it.p].filter(Boolean).join(' • ');
    meta.appendChild(tt);meta.appendChild(sm);b.appendChild(th);b.appendChild(meta);
    b.addEventListener('click',function(){playFrom(list,b.dataset.videoId)});
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
    if(!validVideoId(selectedId)){hmsg(tr('playerError'));return;}
    var source=Array.isArray(list)?list:[],index=-1;
    for(var n=0;n<source.length;n++){if(source[n]&&source[n].id===selectedId){index=n;break}}
    var qd=index>=0?source.slice(index,index+10):[{id:selectedId}];
    if(!qd.length||qd[0].id!==selectedId)qd=[{id:selectedId}];
    qd.forEach(function(x){if(x.t)saveTitle(x.id,x.t)});
    saveBrowseState();
    start({list:null,vids:qd.map(function(x){return x.id}),durationHint:+(qd[0]&&qd[0].l)||0});
  }
  // watch history (stored only on this device)
  function safeStoredString(value,max){return typeof value==='string'?value.slice(0,max):''}
  function safeStoredNumber(value,min,max,fallback){
    var n=Number(value);
    return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;
  }
  function getHist(){
    try{
      var stored=ls('hist')||'[]';
      if(stored.length>1000000)return [];
      var raw=JSON.parse(stored);
      if(!Array.isArray(raw))return [];
      var clean=[],seen=Object.create(null);
      for(var i=0;i<Math.min(raw.length,HISTORY_LIMIT*2)&&clean.length<HISTORY_LIMIT;i++){
        var e=raw[i];
        if(!e||!validVideoId(e.i)||seen[e.i])continue;
        seen[e.i]=1;
        var keywords=Array.isArray(e.k)?e.k.filter(function(x){return typeof x==='string'&&x.trim()}).slice(0,8).map(function(x){return x.slice(0,80)}):[];
        clean.push({
          i:e.i,t:safeStoredString(e.t,300),a:safeStoredString(e.a,120),g:safeStoredString(e.g,120),k:keywords,
          ts:safeStoredNumber(e.ts,0,8640000000000000,0),n:safeStoredNumber(e.n,1,1000000,1),
          p:safeStoredNumber(e.p,0,1000000000,0),l:safeStoredNumber(e.l,0,1000000000,0)
        });
      }
      return clean;
    }catch(e){return []}
  }
  function recordHistory(id){
    if(!id||historyDeleted[id])return Promise.resolve();
    var epoch=historyEpoch,wasCurrent=id===currentVideoId,position=wasCurrent?Math.floor(tcur||0):0,knownDuration=wasCurrent?Math.floor(dur||0):0;
    function add(d){
      if(epoch!==historyEpoch||historyDeleted[id])return;
      var h=getHist(),old=null;
      h=h.filter(function(e){if(e.i===id){old=e;return false}return true});
      var keywords=((d&&Array.isArray(d.keywords)&&d.keywords.length?d.keywords:(old&&old.k))||[]).slice(0,8).map(function(x){return String(x).slice(0,80)});
      h.unshift({i:id,t:String((d&&d.title)||title(id)||(old&&old.t)||'').slice(0,300),a:String((d&&d.author)||(old&&old.a)||'').slice(0,120),
        g:String((d&&d.genre)||(old&&old.g)||'').slice(0,120),k:keywords,
        ts:Date.now(),n:(old?old.n||1:0)+1,p:wasCurrent?position:Math.max(0,+((old&&old.p)||0)),
        l:knownDuration||+((d&&d.lengthSeconds)||(old&&old.l)||0)});
      ls('hist',JSON.stringify(h.slice(0,HISTORY_LIMIT)));drawHistory();
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
    ls('hist',JSON.stringify(h.slice(0,HISTORY_LIMIT)));
  }
  function drawHistory(){
    var all=getHist().slice(0,HISTORY_LIMIT),h=historyExpanded?all:all.slice(0,HISTORY_PREVIEW);
    var wrap=$('historyWrap'),box=$('history'),toggle=$('historyToggle');
    if(!wrap||!box)return;
    box.textContent='';
    wrap.hidden=!$('resultsWrap').hidden||!all.length;
    if(!all.length){
      historyExpanded=false;
      if(toggle)toggle.hidden=true;
      return;
    }
    if(toggle){
      toggle.hidden=all.length<=HISTORY_PREVIEW;
      toggle.classList.toggle('expanded',historyExpanded);
      toggle.setAttribute('aria-expanded',historyExpanded?'true':'false');
      toggle.textContent=historyExpanded?tr('historyLess'):tr('historyMore')+' ('+all.length+')';
    }
    var frag=document.createDocumentFragment();
    h.forEach(function(e){
      var card=document.createElement('div');card.className='history-card';
      var b=document.createElement('button');b.type='button';b.className='history-play';b.dataset.videoId=e.i;
      var im=document.createElement('img');im.loading='lazy';im.decoding='async';im.alt='';im.src='https://i.ytimg.com/vi/'+encodeURIComponent(e.i)+'/mqdefault.jpg';
      var copy=document.createElement('span');copy.className='history-copy';
      var titleEl=document.createElement('b');titleEl.textContent=e.t||title(e.i)||tr('video');
      var meta=document.createElement('small');meta.textContent=[e.a,e.p?fmt(e.p):'',e.ts?new Date(e.ts).toLocaleDateString(): ''].filter(Boolean).join(' • ');
      var progress=document.createElement('span');progress.className='history-progress';
      var fillEl=document.createElement('span'),pct=e.l>0?Math.max(0,Math.min(100,(e.p||0)/e.l*100)):0;fillEl.style.width=pct+'%';progress.appendChild(fillEl);
      copy.appendChild(titleEl);copy.appendChild(meta);copy.appendChild(progress);b.appendChild(im);b.appendChild(copy);
      b.addEventListener('click',function(){
        saveBrowseState();pendingResumeId=e.i;pendingResumeAt=Math.max(0,+e.p||0);
        start({list:null,vids:[e.i],durationHint:+e.l||0});
      });
      var remove=document.createElement('button');remove.type='button';remove.className='history-remove';
      remove.setAttribute('aria-label',tr('removeHistory'));remove.title=tr('removeHistory');
      setInlineIcon(remove,'remove');
      remove.addEventListener('click',function(event){event.preventDefault();event.stopPropagation();removeHistoryItem(e.i)});
      card.appendChild(b);card.appendChild(remove);frag.appendChild(card);
    });
    box.appendChild(frag);
  }
  function removeHistoryItem(id){
    if(!validVideoId(id))return;
    historyDeleted[id]=true;
    if(id===currentVideoId)clearTimeout(histTimer);
    var remaining=getHist().filter(function(item){return item.i!==id});
    ls('hist',JSON.stringify(remaining.slice(0,HISTORY_LIMIT)));
    drawHistory();
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
    var tail='hl='+('en')+'&region=JO',base='/api/v1/videos/'+encodeURIComponent(id);
    function pick(d){var a=d&&d.recommendedVideos;return Array.isArray(a)?a.filter(function(v){return v&&validVideoId(v.videoId)&&v.title}).map(normItem):[]}
    if(videoInfoCache[id]){var c=pick(videoInfoCache[id]);if(c.length)return Promise.resolve(c)}
    function full(){return apiGet(base+'?'+tail).then(pick)}
    return apiGet(base+'?fields=recommendedVideos(videoId,title,author,lengthSeconds,viewCount)&'+tail).then(pick).then(function(a){return a.length?a:full()}).catch(full);
  }
  function searchQ(q,page){
    page=Math.max(1,+page||1);
    return apiGet('/api/v1/search?q='+encodeURIComponent(q)+'&type=video&page='+page+'&region=JO&hl='+('en'),true).then(function(d){
      return (Array.isArray(d)?d:[]).filter(isSearchVideo).map(normItem);
    });
  }
  function planFor(h,rotation){
    rotation=Math.max(1,+rotation||1);
    if(!h.length){
      var topics=TOPICS.slice(),shift=(rotation-1)%topics.length;
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
  function readFeed(){
    try{
      var stored=ls('feed')||'null';
      if(stored.length>200000)return null;
      var f=JSON.parse(stored);
      if(!f||!Array.isArray(f.items))return null;
      var clean=[],seen=Object.create(null);
      for(var i=0;i<Math.min(f.items.length,FEED_N*4)&&clean.length<FEED_N;i++){
        var item=f.items[i];
        if(!item||!validVideoId(item.id)||seen[item.id])continue;
        seen[item.id]=1;
        clean.push({
          id:item.id,t:safeStoredString(item.t,300),a:safeStoredString(item.a,120),
          v:safeStoredNumber(item.v,0,9007199254740991,0),l:safeStoredNumber(item.l,0,1000000000,0),
          p:safeStoredString(item.p,100)
        });
      }
      return clean.length?{ts:safeStoredNumber(f.ts,0,8640000000000000,0),sig:safeStoredString(f.sig,512),items:clean}:null;
    }catch(e){return null}
  }
  function feedSig(h){return h.slice(0,10).map(function(e){return e.i}).join(',')+'|en'}
  function drawFeed(items){
    lastFeed=items.slice();browseItems=lastFeed;feedSeen=Object.create(null);
    var f=$('feed'),frag=document.createDocumentFragment();f.textContent='';
    items.forEach(function(it,i){feedSeen[it.id]=1;frag.appendChild(makeCard(it,i,lastFeed))});f.appendChild(frag);
    var has=getHist().length>0;$('feedTitle').textContent=tr(has?'forYou':'popular');$('feedHint').textContent=tr('feedHint');$('feedHint').hidden=has;
    drawHistory();
  }
  function appendFeedItems(items){
    var fresh=[];(items||[]).forEach(function(it){if(it&&it.id&&!feedSeen[it.id]){feedSeen[it.id]=1;fresh.push(it)}});
    if(!fresh.length)return 0;
    var frag=document.createDocumentFragment(),startIndex=lastFeed.length;
    fresh.forEach(function(it){lastFeed.push(it)});
    fresh.forEach(function(it,i){frag.appendChild(makeCard(it,startIndex+i,lastFeed))});
    $('feed').appendChild(frag);browseItems=lastFeed;return fresh.length;
  }
  function setMoreLoading(kind,on){var el=$(kind==='feed'?'feedLoading':'resultsLoading');if(el)el.hidden=!on}
  function fetchFeedPage(page,seq,append){
    if(feedLoading)return;feedLoading=true;setMoreLoading('feed',true);
    Promise.all(feedPlan.map(function(p){return searchQ(p.q,page).catch(function(){return []})})).then(function(lists){
      if(seq!==feedSeq)return;
      var items=mergeFeed(feedPlan,lists,getHist()),added=0;
      if(append)added=appendFeedItems(items);else{drawFeed(items);added=items.length}
      feedPage=page;feedHasMore=lists.some(function(a){return a.length>0})&&(!append||added>0);
      feedLoading=false;setMoreLoading('feed',false);recheckSentinel('feedSentinel');
      if(!items.length&&!lastFeed.length)feedMsg(tr('feedFail'));
      else if(!append&&items.length){try{ls('feed',JSON.stringify({ts:Date.now(),sig:feedSig(getHist()),items:items}))}catch(e){}}
    }).catch(function(){if(seq===feedSeq){feedLoading=false;setMoreLoading('feed',false);if(!lastFeed.length)feedMsg(tr('feedFail'))}});
  }
  function loadMoreFeed(){
    if(feedLoading||!feedHasMore||!feedPlan.length||!$('feedWrap')||$('feedWrap').hidden)return;
    fetchFeedPage(feedPage+1,feedSeq,true);
  }
  function renderHome(force){
    var h=getHist(),cache=readFeed(),seq=++feedSeq;
    feedLoading=false;setMoreLoading('feed',false);feedHasMore=true;feedPage=1;feedSeen=Object.create(null);
    if(cache&&cache.items.length)drawFeed(cache.items);else drawSkeleton();
    feedCursor=(+ls('feedCursor')||0)+1;ls('feedCursor',String(feedCursor));
    var startPage=((feedCursor-1)%4)+1;
    feedPlan=planFor(h,startPage);
    fetchFeedPage(startPage,seq,false);
  }
  function drawSkeleton(){
    var f=$('feed');f.textContent='';
    for(var i=0;i<4;i++){
      var c=document.createElement('div');c.className='vcard sk';
      var thumb=document.createElement('span');thumb.className='thumb';
      var meta=document.createElement('span');meta.className='vmeta';
      meta.appendChild(document.createElement('b'));meta.appendChild(document.createElement('small'));
      c.appendChild(thumb);c.appendChild(meta);f.appendChild(c);
    }
  }
  function feedMsg(text){
    var f=$('feed');f.textContent='';var p=document.createElement('p');p.className='note';p.textContent=text;
    var b=document.createElement('button');b.type='button';b.className='chip';b.style.marginTop='10px';b.textContent=tr('retry');b.onclick=function(){renderHome(true)};
    var w=document.createElement('div');w.appendChild(p);w.appendChild(b);f.appendChild(w);
  }
  function showResults(on){
    $('resultsWrap').hidden=!on;$('feedWrap').hidden=on;
    setMoreLoading('feed',!on&&feedLoading);setMoreLoading('results',on&&searchLoading);
    $('historyWrap').hidden=on||!getHist().length;
    if(!on){$('searchStatus').textContent='';$('results').textContent='';activeChip='home';browseItems=lastFeed||[]}
    markChip();
  }
  function renderChips(){
    var n=$('chips');n.textContent='';
    var all=[['home',tr('forYou'),'']].concat(TOPICS.map(function(t){return [t[0],t[0],t[1]]}));
    all.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='chip';b.dataset.k=t[0];b.dataset.q=t[2];b.textContent=t[1];n.appendChild(b)});
    markChip();
  }
  function markChip(){
    var on=$('resultsWrap').hidden?'home':activeChip;
    $('chips').querySelectorAll('.chip').forEach(function(c){c.classList.toggle('on',c.dataset.k===on)});
  }
  $('chips').addEventListener('click',function(e){
    var b=e.target.closest('.chip');if(!b)return;
    if(b.dataset.k==='home'){$('searchInput').value='';showResults(false)}
    else{activeChip=b.dataset.k;$('searchInput').value=b.dataset.q;searchVideos(b.dataset.q)}
  });
  $('feedRefresh').onclick=function(){renderHome(true)};
  $('resClose').onclick=function(){$('searchInput').value='';showResults(false)};
  $('historyToggle').onclick=function(){historyExpanded=!historyExpanded;drawHistory()};
  $('histClear').onclick=function(){
    if(!confirm(tr('clearAsk')))return;
    historyEpoch++;
    ls('hist','[]');historyExpanded=false;ls('feed','');ls('feedCursor','0');feedCursor=0;
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
    if(customQueueActive)return;
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
  function setPlayerStatus(mode){
    var box=$('playerStatus'),spinner=box.querySelector('.load-spinner'),label=$('playerStatusText');
    if(!mode){box.hidden=true;return}
    box.hidden=false;spinner.hidden=mode!=='loading';
    label.textContent=tr(mode==='loading'?'playerLoading':mode==='blocked'?'playerTap':'playerError');
  }
  function cmd(f,a){
    try{
      if(!yt.contentWindow)return false;
      yt.contentWindow.postMessage(JSON.stringify({event:'command',func:f,args:a||[]}), 'https://www.youtube.com');
      return true;
    }catch(e){return false}
  }
  function listen(token){
    token=token||playerLoadToken;
    [0,350,800,1400,2200].forEach(function(delay){
      setTimeout(function(){
        if(token!==playerLoadToken||stage.hidden)return;
        try{yt.contentWindow.postMessage(JSON.stringify({event:'listening',id:1,channel:'widget'}),'https://www.youtube.com')}catch(e){}
        cmd('addEventListener',['onAutoplayBlocked']);
        cmd('addEventListener',['onError']);
        cmd('addEventListener',['onStateChange']);
        if(playerWantsPlay&&!playerHasStarted&&!pipActive){
          setTimeout(function(){if(token===playerLoadToken&&playerWantsPlay&&!playerHasStarted)cmd('playVideo')},120);
        }
      },delay);
    });
    clearTimeout(playerStartTimer);
    playerStartTimer=setTimeout(function(){
      if(token===playerLoadToken&&!playerHasStarted&&stage&&!stage.hidden){
        playerWantsPlay=false;playing=false;setPlayerStatus('blocked');updatePlayButton();
      }
    },10000);
  }
  window.addEventListener('message',function(e){
    if(e.source!==yt.contentWindow||e.origin!=='https://www.youtube.com')return;
    var d;try{d=JSON.parse(e.data)}catch(x){return}
    if(d.event==='onAutoplayBlocked'){
      clearTimeout(playerStartTimer);playerWantsPlay=false;playing=false;
      setPlayerStatus('blocked');updatePlayButton();return;
    }
    if(d.event==='onError'){
      clearTimeout(playerStartTimer);playerWantsPlay=false;playing=false;
      setPlayerStatus('error');updatePlayButton();return;
    }
    var s=d.event==='onStateChange'?d.info:(d.info&&d.info.playerState);
    if(!pipActive){
      if(s===1){
        var clockWasRunning=progressClockRunning;
        playerHasStarted=true;playerWantsPlay=false;clearTimeout(playerStartTimer);setPlayerStatus('');
        playing=true;progressClockRunning=true;
        if(!clockWasRunning){lastClockAt=Date.now();lastRemoteTimeAt=lastClockAt}
        cmd('unloadModule',['captions']);cmd('unloadModule',['cc']);
        startProgressPolling(playerLoadToken);revealControls();
      }else if(s===2||s===3){
        progressClockRunning=false;lastClockAt=Date.now();
        if(s===2){playing=false;clearTimeout(controlsHideTimer);stage.classList.remove('controls-hidden')}
        if(s===2&&!playerHasStarted&&playerWantsPlay)setPlayerStatus('blocked');
      }else if(s===0){
        progressClockRunning=false;playing=false;clearTimeout(controlsHideTimer);stage.classList.remove('controls-hidden');
      }
      updatePlayButton();
      if(s===1)resumePendingVideo();
    }
    var inf=d.info;
    if(inf&&typeof inf==='object'){
      if(!customQueueActive&&inf.playlist&&inf.playlist.length&&(inf.playlist.length!==ids.length||inf.playlist[0]!==ids[0]||inf.playlist[inf.playlist.length-1]!==ids[ids.length-1]))setIds(inf.playlist);
      if(inf.videoData&&inf.videoData.video_id){
        var activeId=inf.videoData.video_id;
        if(requestedStartId&&activeId!==requestedStartId){
          if(!startCorrectionSent){
            startCorrectionSent=true;
            if(customQueueActive)cmd('loadVideoById',[requestedStartId,0]);
            else if(requestedStartQueue.length)cmd('loadPlaylist',[requestedStartQueue,0,0]);
          }
          return;
        }
        setCurrentVideo(activeId,inf.videoData.title||'');
        if(activeId===requestedStartId){requestedStartId='';requestedStartQueue=[];startCorrectionSent=false}
        if(customQueueActive){
          var activeQueueIndex=customQueueIds.indexOf(activeId);
          if(activeQueueIndex>=0&&activeQueueIndex!==customQueueIndex){customQueueIndex=activeQueueIndex;cur=activeQueueIndex;}
        }
        resumePendingVideo();
      }
      if(!pipActive){
        if(typeof inf.duration==='number'&&Number.isFinite(inf.duration)&&inf.duration>0){dur=inf.duration;if(!drag)paint(tcur)}
        if(typeof inf.currentTime==='number'&&Number.isFinite(inf.currentTime)&&inf.currentTime>=0){
          tcur=inf.currentTime;lastRemoteTimeAt=Date.now();lastClockAt=lastRemoteTimeAt;
          if(!drag)paint(tcur);saveHistoryProgress();
        }
      }
      if(!customQueueActive&&typeof inf.playlistIndex==='number'&&inf.playlistIndex!==cur)setCur(inf.playlistIndex);
    }
    if(s===1)lastAutoAdvanceId='';
    if(s===0&&playerHasStarted&&currentVideoId&&!requestedStartId&&lastAutoAdvanceId!==currentVideoId){
      var endedId=currentVideoId,endedToken=playerLoadToken;
      lastAutoAdvanceId=endedId;clearTimeout(customAdvanceTimer);
      if(!autoplayEnabled){
        cmd('seekTo',[0,true]);cmd('playVideo');
      }else if(customQueueActive&&customQueueIds.length>1){
        customAdvanceTimer=setTimeout(function(){
          if(endedToken===playerLoadToken&&currentVideoId===endedId&&!playing&&!requestedStartId)go(1);
        },320);
      }
    }
  });
  function rot(){return stage.classList.contains('land')&&window.innerHeight>window.innerWidth}
  function hmsg(t){var h=$('hint');h.textContent=t;h.style.opacity=1;clearTimeout(hmsg.t);hmsg.t=setTimeout(function(){h.style.opacity=0},2600)}
  function lockL(){try{var o=screen.orientation;if(o&&o.lock){var r=o.lock('landscape');if(r&&r.catch)r.catch(function(){})}}catch(x){}}
  function land(on){
    if(typeof on!=='boolean')on=!stage.classList.contains('land');
    var was=stage.classList.contains('land');if(was===on)return;
    stage.classList.toggle('land',on);
    if(on){var r=fs(true);if(r&&r.then)r.then(lockL,lockL);else lockL();setTimeout(function(){if(rot())hmsg(tr('rotate'))},400)}
    else{fs(false);try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(x){}hmsg(tr('normal'))}
  }
  function applyVideoMode(mode){
    viewMode=((mode%4)+4)%4;
    fill=viewMode===1||viewMode===3;
    slide.className=fill?'fill':'fit';
    ls('fill',fill?'1':'0');
    land(viewMode>=2);
  }
  function fs(on){try{var d=document,e=d.documentElement;if(on){if(!d.fullscreenElement&&e.requestFullscreen){var r=e.requestFullscreen({navigationUI:'hide'});if(r&&r.catch)r.catch(function(){});return r}}else if(d.fullscreenElement&&d.exitFullscreen)d.exitFullscreen()}catch(x){}}
  function start(p,keepSavedPlaylist){
    (p.vids||[]).forEach(function(id){delete historyDeleted[id]});
    if(!p||(!p.list&&(!Array.isArray(p.vids)||!p.vids.some(validVideoId))))return;
    if(!p.list)p.vids=p.vids.filter(validVideoId);
    if(!p.list&&!p.vids.length)return;
    if(pendingResumeId&&(!p.vids||p.vids[0]!==pendingResumeId)){pendingResumeId='';pendingResumeAt=0}
    if(currentVideoId)recordHistory(currentVideoId);
    clearTimeout(histTimer);clearInterval(progressPollTimer);clearTimeout(controlsHideTimer);clearTimeout(customAdvanceTimer);
    dur=0;tcur=0;lastSec=-1;historySaveAt=0;progressClockRunning=false;lastClockAt=0;lastRemoteTimeAt=0;
    lastAutoAdvanceId='';currentDurationHint=Number(p.durationHint)||0;
    customQueueActive=!p.list;customQueueIds=p.list?[]:p.vids.slice();customQueueIndex=p.list?-1:0;
    stage.classList.remove('controls-hidden');
    $('pf').style.transform='scaleX(0)';$('tmCurrent').textContent='0:00';$('tmDuration').textContent='0:00';hideSeekPreview();
    preserveSavedPlaylist=!!keepSavedPlaylist;
    playerLoadToken++;var activeLoadToken=playerLoadToken;
    clearTimeout(playerStartTimer);playerHasStarted=false;playerWantsPlay=true;
    playing=false;setPlayerStatus('loading');
    $('setup').hidden=true;stage.hidden=false;
    ids=p.list?[]:p.vids.slice();cur=p.list?-1:0;
    if(!preserveSavedPlaylist){
      originalPlaylistId=p.list||null;
      playlistIds=p.list?[]:p.vids.slice();
    }
    requestedStartId=p.list?'':p.vids[0];
    requestedStartQueue=p.list?[]:p.vids.slice();
    startCorrectionSent=false;
    currentVideoId='';recommendedVideos=[];recommendedFor='';setPipButtonDisabled(true);
    playing=false;
    var q='autoplay=1&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&loop=1&vq=tiny&cc_load_policy=0&enablejsapi=1';
    var b='https://www.youtube.com/embed/';
    var ref='';try{if(/^https?:/.test(location.href))ref='&origin='+encodeURIComponent(location.origin)}catch(e){}
    q+=ref;
    yt.onload=function(){if(activeLoadToken===playerLoadToken)listen(activeLoadToken)};
    yt.onerror=function(){
      if(activeLoadToken===playerLoadToken){
        clearTimeout(playerStartTimer);playerWantsPlay=false;playing=false;
        setPlayerStatus('error');updatePlayButton();
      }
    };
    var singleVideoLoop=!p.list&&p.vids.length===1?'&playlist='+encodeURIComponent(p.vids[0]):'';
    yt.src=p.list?b+'videoseries?list='+encodeURIComponent(p.list)+'&'+q:b+p.vids[0]+'?'+q+singleVideoLoop;
    playerStartTimer=setTimeout(function(){
      if(activeLoadToken===playerLoadToken&&!playerHasStarted&&!stage.hidden){
        playerWantsPlay=false;playing=false;setPlayerStatus('blocked');updatePlayButton();
      }
    },14000);
    if($('list').classList.contains('open'))buildList();
    $('hint').textContent=tr('hint');$('hint').style.opacity=1;updatePlayButton();paint(0);
    setTimeout(function(){$('hint').style.opacity=0},3500);
  }
  function stop(){
    if(pipActive)stopPip(false);
    var endingId=currentVideoId;
    var save=endingId?recordHistory(endingId):Promise.resolve();
    currentVideoId='';clearTimeout(histTimer);clearTimeout(playerStartTimer);clearInterval(progressPollTimer);clearTimeout(controlsHideTimer);clearTimeout(customAdvanceTimer);
    playerLoadToken++;playerWantsPlay=false;playerHasStarted=false;playing=false;progressClockRunning=false;
    customQueueActive=false;customQueueIds=[];customQueueIndex=-1;currentDurationHint=0;
    setPlayerStatus('');stage.classList.remove('controls-hidden');
    yt.src='about:blank';stage.hidden=true;$('setup').hidden=false;closeList();fs(false);stage.classList.remove('land');viewMode=0;fill=false;slide.className='fit';ls('fill','0');try{screen.orientation.unlock()}catch(x){}
    if(browseView==='feed')renderHome(true);
    drawHistory();restoreBrowseState();
    save.then(function(){
      var currentScroll=window.scrollY||document.documentElement.scrollTop||0;
      drawHistory();
      if(browseView==='feed')renderHome(true);
      window.scrollTo(0,currentScroll);
    },function(){});
  }
  function customQueueStep(dir){
    if(!customQueueActive||!customQueueIds.length)return false;
    var total=customQueueIds.length,index=customQueueIds.indexOf(currentVideoId);
    if(index<0)index=Math.max(0,Math.min(total-1,customQueueIndex));
    var nextIndex;
    if(shuffle&&dir>0&&total>1){
      nextIndex=Math.floor(Math.random()*(total-1));
      if(nextIndex>=index)nextIndex++;
    }else nextIndex=(index+dir+total)%total;
    var target=customQueueIds[nextIndex];
    if(!validVideoId(target))return false;
    customQueueIndex=nextIndex;cur=nextIndex;
    requestedStartId=target;requestedStartQueue=customQueueIds.slice(nextIndex);startCorrectionSent=false;
    cmd('loadVideoById',[target,0]);
    return true;
  }
  function go(dir){
    if(busy)return;busy=true;
    slide.style.transition='transform .2s ease,opacity .2s ease';
    slide.style.transform='translateY('+(dir>0?-18:18)+'%)';slide.style.opacity='0';
    setTimeout(function(){
      if(!customQueueStep(dir))cmd(dir>0?'nextVideo':'previousVideo');
      playing=true;progressClockRunning=true;lastClockAt=Date.now();updatePlayButton();
      slide.style.transition='none';
      slide.style.transform='translateY('+(dir>0?18:-18)+'%)';
      void slide.offsetWidth;
      slide.style.transition='transform .22s ease,opacity .22s ease';
      slide.style.transform='translateY(0)';slide.style.opacity='1';
      revealControls();
      setTimeout(function(){busy=false},230);
    },200);
  }
  function toggle(){
    revealControls();
    if(pipActive){
      if(pipVideo.paused){
        var pp=pipVideo.play();pipWasPlaying=true;playing=true;
        if(pp&&pp.catch)pp.catch(function(){pipWasPlaying=false;playing=false;updatePlayButton()});
        setInlineIcon(flash,'play');
      }else{
        pipVideo.pause();pipWasPlaying=false;playing=false;setInlineIcon(flash,'pause');
      }
    }else if(playing){cmd('pauseVideo');playing=false;setInlineIcon(flash,'pause')}
    else{
      playerWantsPlay=true;setPlayerStatus('loading');cmd('playVideo');playing=true;setInlineIcon(flash,'play');
    }
    updatePlayButton();
    if(playing)revealControls();else{clearTimeout(controlsHideTimer);stage.classList.remove('controls-hidden')}
    flash.classList.add('show');setTimeout(function(){flash.classList.remove('show')},450);
  }
  var gestureStart=null;
  var t=$('touch');
  t.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    gestureStart={id:e.pointerId,x:e.clientX,y:e.clientY,at:Date.now()};
    try{t.setPointerCapture(e.pointerId)}catch(x){}
  },{passive:true});
  t.addEventListener('pointerup',function(e){
    var g=gestureStart;if(!g||g.id!==e.pointerId)return;gestureStart=null;
    var dx=e.clientX-g.x,dy=e.clientY-g.y;
    if(rot()){var tx=dx;dx=dy;dy=-tx}
    if(Math.abs(dy)>50&&Math.abs(dy)>Math.abs(dx))go(dy<0?1:-1);
    else if(Math.abs(dy)<12&&Math.abs(dx)<12&&Date.now()-g.at<500)tap(rot()?e.clientY:e.clientX);
  });
  t.addEventListener('pointercancel',function(){gestureStart=null});
  $('ui').addEventListener('click',function(e){if(e.target.closest('button')&&e.target.id!=='b-back')revealControls()});
  $('controlsDock').addEventListener('click',function(e){if(e.target.closest('button'))revealControls();else if(!e.target.closest('#trk'))tap(rot()?e.clientY:e.clientX)});
  $('b-toggle').onclick=toggle;
  $('b-back').onclick=stop;
  $('b-fit').onclick=function(){applyVideoMode(viewMode+1)};
  $('b-autoplay').onclick=function(){autoplayEnabled=!autoplayEnabled;ls('autoplay',autoplayEnabled?'1':'0');updateAutoplayButton();hmsg(tr(autoplayEnabled?'autoplayEnabled':'autoplayDisabled'))};
  updateAutoplayButton();
  $('b-shuf').onclick=function(){
    shuffle=!shuffle;this.classList.toggle('on',shuffle);
    if(!customQueueActive)cmd('setShuffle',[shuffle]);
    ls('shuf',shuffle?'1':'0');
    if(shuffle)go(1);
  };
  function run(txt){
    txt=String(txt||'').slice(0,2048);$('url').value=txt;
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
  fill=false;viewMode=0;slide.className='fit';ls('fill','0');
  if(qm){var qu=qm[1];try{qu=decodeURIComponent(qu)}catch(e){}$('url').value=qu;run(qu)}
  if(ls('shuf')==='1'){shuffle=true;$('b-shuf').classList.add('on')}
  $('b-aud').onclick=function(){var on=stage.classList.toggle('aud');this.classList.toggle('on',on);ls('aud',on?'1':'0');if(on)cmd('setPlaybackQuality',['tiny'])};
  if(ls('aud')==='1'){stage.classList.add('aud');$('b-aud').classList.add('on')}
  $('b-list').onclick=function(){switchListTab('playlist');$('list').classList.add('open');var c=$('rows').querySelector('.cur');if(c)c.scrollIntoView({block:'center'})};
  $('tabPlaylist').onclick=function(){switchListTab('playlist')};
  $('tabRecommendations').onclick=function(){switchListTab('recommendations')};
  $('lclose').onclick=closeList;
  var trk=$('trk');
  function tpos(e){var r=trk.getBoundingClientRect();var u=rot()?(e.clientY-r.top)/Math.max(1,r.height):(e.clientX-r.left)/Math.max(1,r.width);return Math.max(0,Math.min(1,u))*dur}
  trk.addEventListener('pointerdown',function(e){
    if(!dur)return;
    drag=true;trk.classList.add('dragging');
    try{trk.setPointerCapture(e.pointerId)}catch(x){}
    showSeekPreview(e);paint(tpos(e));e.preventDefault();
  });
  trk.addEventListener('pointermove',function(e){
    if(drag)paint(tpos(e));
    showSeekPreview(e);
  });
  trk.addEventListener('pointerenter',function(e){showSeekPreview(e)});
  trk.addEventListener('pointerup',function(e){
    if(!drag)return;
    var target=tpos(e);drag=false;trk.classList.remove('dragging');
    seek(target);hideSeekPreview();scheduleControlsHide();
  });
  trk.addEventListener('pointercancel',function(){drag=false;trk.classList.remove('dragging');hideSeekPreview()});
  trk.addEventListener('pointerleave',function(){if(!drag)hideSeekPreview()});
  trk.addEventListener('lostpointercapture',function(){if(drag){drag=false;trk.classList.remove('dragging')}hideSeekPreview()});
  try{
    if(navigator.mediaSession&&navigator.mediaSession.setActionHandler){
      navigator.mediaSession.setActionHandler('enterpictureinpicture',function(){
        if(playing&&currentVideoId&&!pipActive)requestPip();
      });
    }
  }catch(e){}
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState!=='hidden'||pipActive||!playing||!currentVideoId)return;
    if(pipPreparedId===currentVideoId&&pipVideo.readyState>=1){
      try{requestPip()}catch(e){}
    }
  });

  $('rows').addEventListener('click',function(e){
    var r=e.target.closest('.row');if(!r)return;
    if(r.dataset.rec==='1') {
      var rid=r.dataset.id;saveTitle(rid,r.querySelector('span span')?r.querySelector('span span').textContent:tr('video'));
      start({list:null,vids:[rid],durationHint:+r.dataset.duration||0},true);closeList();return;
    }
    var listItems=playlistIds.length?playlistIds:ids,chosenId=r.dataset.id,index=listItems.indexOf(chosenId);
    if(index<0)return;
    preserveSavedPlaylist=false;ids=listItems.slice();cur=index;
    requestedStartId=chosenId;requestedStartQueue=listItems.slice(index);startCorrectionSent=false;
    if(customQueueActive){
      customQueueIds=listItems.slice();customQueueIndex=index;
      cmd('loadVideoById',[chosenId,0]);
    }else if(originalPlaylistId)cmd('loadPlaylist',[originalPlaylistId,index,0]);
    else if(listItems.length>1)cmd('loadPlaylist',[listItems,index,0]);
    else cmd('loadVideoById',[chosenId,0]);
    playing=true;updatePlayButton();closeList();
  });
})();

if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js?v=17',{updateViaCache:'none'}).catch(function(){})
