// overlay.js
// simple alert system and testing triggers
(function(){
  const alertContainer = document.getElementById('alertContainer');
  const alertSound = document.getElementById('alertSnd');
  const stinger = document.getElementById('stinger');
  const recent = document.querySelector('#recentList .entry');

  // UTIL: create DOM for an alert (type: follow/sub/raid)
  function showAlert(type, name){
    const a = document.createElement('div');
    a.className = 'alert';
    a.innerHTML = `
      <div class="thumb"><video autoplay loop muted playsinline src="assets/${type === 'follow' ? 'alert_follow.webm' : type === 'sub' ? 'alert_sub.webm' : 'alert_raid.webm'}" style="width:100%; height:100%; object-fit:cover;"></video></div>
      <div class="text"><div class="title">${type.toUpperCase()}</div><div class="name">${name}</div></div>
    `;
    alertContainer.prepend(a);
    recent.textContent = `recent: ${name} • ${type}`;
    // play sound
    alertSound.currentTime = 0;
    alertSound.play().catch(()=>{ /* autoplay may be blocked; that's fine */ });

    // auto remove
    setTimeout(()=> {
      a.style.transition = 'transform .35s ease, opacity .35s ease';
      a.style.opacity = '0';
      a.style.transform = 'translateX(40px) scale(.98)';
      setTimeout(()=> a.remove(), 380);
    }, 4200);
  }

  // expose to window for easy remote triggering
  window.OverlayTrigger = {
    follow: (name)=> showAlert('follow', name || 'unknown'),
    sub: (name)=> showAlert('sub', name || 'unknown'),
    raid: (name)=> showAlert('raid', name || 'unknown'),
    stinger: ()=> playStinger(),
  };

  // stinger function
  function playStinger(){
    if(!stinger) return;
    stinger.style.display = 'block';
    stinger.currentTime = 0;
    stinger.play().catch(()=>{/* ok */});
    stinger.onended = ()=> stinger.style.display = 'none';
  }

  // parse query params for quick testing e.g. ?alert=follow&name=trans
  function parseQueryTest(){
    try {
      const q = new URLSearchParams(location.search);
      const t = q.get('alert');
      const n = q.get('name') || 'guest';
      if(t) setTimeout(()=> window.OverlayTrigger[t](n), 600);
    } catch(e){}
  }
  parseQueryTest();

  // helpful: listen for window messages (useful if you host on same domain or using another page to send)
  window.addEventListener('message', e=>{
    const d = e.data || {};
    if(d.type === 'alert' && d.subtype){
      window.OverlayTrigger[d.subtype](d.name);
    } else if(d.type === 'stinger') {
      playStinger();
    }
  });

  // quick dev commands via keyboard (only when opened locally)
  window.addEventListener('keydown',(ev)=>{
    if(ev.key === '1') window.OverlayTrigger.follow('test_follower');
    if(ev.key === '2') window.OverlayTrigger.sub('test_sub');
    if(ev.key === '3') window.OverlayTrigger.raid('bigraid');
    if(ev.key === '4') window.OverlayTrigger.stinger();
  });
})(); 