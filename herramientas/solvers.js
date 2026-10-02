// Solucionador de cuartos: empujar cajas y hielo.
function sokoban(rows,opt={trap:true,cap:Infinity}){
  const H=rows.length,W=rows[0].length;let S,D;const boxes=[];
  const g=rows.map((r,y)=>r.split('').map((c,x)=>{if(c==='S'){S=[x,y];return '.'}if(c==='D'){D=[x,y];return 'D'}if(c==='$'){boxes.push(x+','+y);return '.'}return c}));
  const wall=(x,y)=>g[y]?.[x]===undefined||g[y][x]==='#';
  const boxOk=(x,y)=>!wall(x,y)&&g[y][x]==='.';
  const key=(p,b)=>p+'|'+[...b].sort().join(';');
  const start={p:S.join(','),b:new Set(boxes),d:0,pushes:0};
  const seen=new Map([[key(start.p,start.b),0]]);const q=[start];let best=null,states=0,trapped=0;
  const reach=(p,b,target)=>{const s=new Set([p]);const qq=[p];while(qq.length){const [x,y]=qq.shift().split(',').map(Number);for(const[a,c]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=(x+a)+','+(y+c);if(s.has(n)||wall(x+a,y+c)||b.has(n))continue;s.add(n);qq.push(n)}}return s.has(target)};
  while(q.length&&states<opt.cap){const st=q.shift();states++;
    if(opt.trap&&!reach(st.p,st.b,S.join(',')))trapped++;
    const [x,y]=st.p.split(',').map(Number);
    if(x===D[0]&&y===D[1]){best=best||st;continue}
    for(const[a,c]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+c,n=nx+','+ny;if(wall(nx,ny))continue;let b=st.b,pu=st.pushes;
      if(b.has(n)){const bx=nx+a,by=ny+c;if(!boxOk(bx,by)||b.has(bx+','+by))continue;b=new Set(b);b.delete(n);b.add(bx+','+by);pu++}
      const k=key(n,b);if(seen.has(k))continue;seen.set(k,1);q.push({p:n,b,d:st.d+1,pushes:pu,prev:st,mv:[a,c]})}}
  // camino sin empujar?
  const free=reach(S.join(','),new Set(boxes),D.join(','));
  return {solvable:!!best,moves:best&&best.d,pushes:best&&best.pushes,states,trapped,freeWalk:free,path:best&&path(best)};
}
function path(st){const o=[];while(st.prev){o.unshift(st.mv);st=st.prev}return o}
function ice(rows){
  const H=rows.length,W=rows[0].length;let S,D;
  const g=rows.map((r,y)=>r.split('').map((c,x)=>{if(c==='S'){S=[x,y];return '.'}if(c==='D'){D=[x,y];return 'D'}return c}));
  const block=(x,y)=>g[y]?.[x]===undefined||g[y][x]==='#'||g[y][x]==='r';
  const step=(x,y,a,c)=>{let nx=x+a,ny=y+c;if(block(nx,ny))return null;while(g[ny][nx]==='i'&&!block(nx+a,ny+c)){nx+=a;ny+=c}return [nx,ny]};
  const bfs=(from)=>{const d=new Map([[from.join(','),0]]);const q=[from];const prev=new Map();while(q.length){const[x,y]=q.shift();for(const[a,c]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=step(x,y,a,c);if(!n)continue;const k=n.join(',');if(d.has(k))continue;d.set(k,d.get(x+','+y)+1);prev.set(k,x+','+y);q.push(n)}}return d};
  const d=bfs(S);const reachable=[...d.keys()];
  const back=reachable.filter(k=>!bfs(k.split(',').map(Number)).has(S.join(',')));
  return {solvable:d.has(D.join(',')),moves:d.get(D.join(',')),reachable:reachable.length,noReturn:back};
}
module.exports={sokoban,ice};
