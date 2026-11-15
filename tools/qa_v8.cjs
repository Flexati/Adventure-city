// Seeded checks are explicitly distinct from the NEW GAME/full-campaign verifier.
exports.makeSave=async(stepId,options={})=>{
 const {newProgress,saveProgress,stepIndex}=await import('../game/missions.mjs');const p=newProgress();p.step=stepIndex(stepId);if(p.step<0)throw Error('Unknown step '+stepId);
 p.status=options.status||'playing';p.cityChoice='workshop';p.narrative.thermal=options.thermal??60;
 Object.assign(p.narrative.flags,{opening_completed:true,glass_owned:true,heard_lulu:true,chosen_name_nox:true,blackout_choice:'workshop',unit9_saved:true,consent_channel_respected:true,eve_kept:true,line_choice:'stay',separated:true,reunited:stepIndex(stepId)>=stepIndex('finale'),story_complete:options.status==='cleared',...(p.step>stepIndex('exp_chalk_marks')?{'exp.chalk.route':'direct','exp.chalk.completed':true,'exp.chalk.callback_seen':true}:{})},options.flags||{});
 // Saves past the blackout must carry the Rook encounter, otherwise prepareRookRecovery sends them back to it.
 if(p.step>stepIndex('blackout'))Object.assign(p.narrative.flags,{'encounter.rook.completed':true,'weapon.tessa':true});
 p.world.visited=['moon','cathedral','toxic','clockwork'];p.world.preparation={toxic:'attack',clockwork:'attack'};p.world.coins=200;
 return saveProgress(p);
};
exports.seed=async(page,url,stepId,options={})=>{
 const raw=await exports.makeSave(stepId,options);await page.goto(url);
 await page.evaluate(raw=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v7',raw);},raw);
 await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
 await page.click('#continue');for(let k=0;k<40;k++){if(await page.isVisible('#card')){await page.click('#card');continue;}if(await page.isVisible('#talk')){if(options.stopOnDialogue)return;await page.click('#next-line');continue;}const st=await page.evaluate(()=>window.cityAdventure.status());if(st.running||['ending','scene'].includes(st.mode))return;await page.waitForTimeout(80);}
};
