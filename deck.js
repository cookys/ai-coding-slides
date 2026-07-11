/* 4 主 deck 共用導航（翻頁/進度/G目錄/N備註/H回目錄）。 */
(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var i=0, N=slides.length;
  var prog=document.getElementById('prog'), count=document.getElementById('count');
  var actl=document.getElementById('actlabel'), footl=document.getElementById('footlabel');
  var notetext=document.getElementById('notetext');
  var ov=document.getElementById('indexov'), grid=document.getElementById('indexgrid');

  slides.forEach(function(s,k){
    var b=document.createElement('button');
    var t=s.querySelector('h1'); var m=s.querySelector('.mantra q');
    var title=t? t.textContent.replace(/\s+/g,' ').trim()
      : (m? m.textContent.replace(/\s+/g,' ').trim() : (s.dataset.act||'—'));
    b.innerHTML='<span class="n">'+String(k+1).padStart(2,'0')+'</span><span>'+title+'</span>';
    b.addEventListener('click',function(){go(k); toggleOv(false);});
    grid.appendChild(b);
  });

  function go(k){
    if(k<0||k>=N) return;
    slides[i].classList.remove('on');
    i=k;
    slides[i].classList.add('on');
    prog.style.width=((i+1)/N*100)+'%';
    count.textContent=(i+1)+' / '+N;
    actl.textContent=slides[i].dataset.act||'';
    footl.textContent=slides[i].dataset.foot||'';
    var note=slides[i].querySelector('.note');
    notetext.textContent=note? note.textContent : '（此張無備註）';
    var btns=grid.querySelectorAll('button');
    btns.forEach(function(b,k2){b.classList.toggle('cur',k2===i);});
    try{ history.replaceState(null,'','#'+(i+1)); }catch(e){}
  }
  function toggleOv(force){
    var on = typeof force==='boolean'? force : !ov.classList.contains('on');
    ov.classList.toggle('on',on);
  }

  document.getElementById('btnprev').addEventListener('click',function(){go(i-1);});
  document.getElementById('btnnext').addEventListener('click',function(){go(i+1);});

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ toggleOv(false); return; }
    if(e.key==='g'||e.key==='G'){ toggleOv(); return; }
    if(ov.classList.contains('on')) return;
    if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){ e.preventDefault(); go(i+1); }
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){ e.preventDefault(); go(i-1); }
    else if(e.key==='Home'){ go(0); }
    else if(e.key==='End'){ go(N-1); }
    else if(e.key==='n'||e.key==='N'){ document.body.classList.toggle('shownotes'); }
  });

  var framed=false; try{framed=(window.self!==window.top);}catch(e){framed=true;}
  var inHub=/\/m\//.test(location.pathname);
  if(inHub||framed){
    function goHome(){ if(framed){ try{window.top.location.href='./';}catch(e){history.back();} } else { location.href='../'; } }
    var hb=document.createElement('button');hb.className='navbtn';hb.type='button';hb.textContent='\u2302 \u76ee\u9304';
    hb.title='\u56de\u8ab2\u7a0b\u76ee\u9304 (H)';hb.setAttribute('aria-label','\u56de\u8ab2\u7a0b\u76ee\u9304');
    hb.addEventListener('click',goHome);
    var bar=document.querySelector('.bottombar');bar.insertBefore(hb,document.getElementById('btnprev'));
    document.addEventListener('keydown',function(e){if((e.key==='h'||e.key==='H')&&!document.getElementById('indexov').classList.contains('on')){goHome();}});
  }
  var h=parseInt((location.hash||'').replace('#',''),10);
  go(isNaN(h)?0:Math.min(Math.max(h-1,0),N-1));
})();
