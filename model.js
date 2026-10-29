(function(root){
 'use strict';
 class Investigation{
   constructor(){this.reset();}
   reset(){this.chapter=0;this.found=[new Set(),new Set(),new Set()];this.solved=[false,false,false];this.phase='intro';this.pending=null;}
   get count(){return this.found.reduce((n,s)=>n+s.size,0)+this.solved.filter(Boolean).length;}
   get ready(){return this.found[this.chapter].size===4;}
   inspect(id){if(this.phase!=='game'||this.pending)return false;const clue=CHAPTERS[this.chapter].clues.find(c=>c.id===id);if(!clue)return false;const seen=this.found[this.chapter].has(id);this.pending=seen?null:{kind:'clue',id,chapter:this.chapter};return {clue,seen};}
   claim(){const p=this.pending;if(!p||p.chapter!==this.chapter||this.phase!=='game')return false;if(p.kind==='clue')this.found[this.chapter].add(p.id);else if(p.kind==='puzzle')this.solved[this.chapter]=true;this.pending=null;return this.count;}
   dismiss(){this.pending=null;}
   answer(value){if(this.phase!=='game'||!this.ready||this.solved[this.chapter]||this.pending)return false;const p=CHAPTERS[this.chapter].puzzle;const correct=p.symbols?JSON.stringify(value)===JSON.stringify(p.correct):value===p.correct;if(correct)this.pending={kind:'puzzle',chapter:this.chapter};return correct;}
   next(){if(this.pending||!this.solved[this.chapter]||this.phase!=='game')return false;if(this.chapter<2)this.chapter++;else this.phase='reveal';return true;}
   finale(){if(this.phase!=='reveal'||this.count!==15)return false;this.phase='finale';return true;}
 }
 root.Investigation=Investigation;
})(typeof window!=='undefined'?window:globalThis);
