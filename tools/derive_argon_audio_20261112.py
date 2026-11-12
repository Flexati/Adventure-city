#!/usr/bin/env python3
"""Derivati audio del lotto 4 di Argon (ramo delivery/argon-asset-giro2-20261110 @ 10592a7, mai modificato).
Uso: git archive origin/delivery/argon-asset-giro2-20261110 deliveries/argon-asset-giro2-20261110/A | tar -x -C <cartella>
     python3 tools/derive_argon_audio_20261112.py <cartella>/deliveries/argon-asset-giro2-20261110/A
Ogni suono viene solo portato a picco -1 dBFS (gli originali superano lo zero digitale fino a +3 dB), con 4 ms di dissolvenza
in apertura e 20 ms in chiusura contro i click, e ricodificato OGG Vorbis. Nessun suono è composto da questo script.
Esclusi (motivi nel registro): audio_intro_jaguar_storm (ronzio a 48 Hz in 88 % delle finestre), sfx_melee_* (il gioco non ha
colpi in mischia), sfx_shop_buy_upgrade / sfx_relic_chime (hanno già i loro originali chrono 'purchase', 'upgrade', 'relic')."""
import hashlib,json,subprocess,sys
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1];SRC=Path(sys.argv[1]);COMMIT='10592a7'
KEEP={'sfx_special_duo_wave':'colpo DUO (evento duo)','sfx_special_black_pulse':'BLACK PULSE (evento overdrive)','sfx_special_barrier_deploy':'barriera di Lulù (evento barrier)',
 'sfx_shop_open':'apertura del negozio','sfx_smith_anvil_forge':'apertura della fucina','sfx_npc_greet_warm':'incontro con un abitante'}
SKIP={'audio_intro_jaguar_storm':'ronzio persistente a 48 Hz (88 % delle finestre da 0,5 s) e 1170 campioni oltre lo zero: contro la richiesta dell\'autore (niente ronzio); l\'intro è comunque muta (nessun gesto prima dell\'avvio)',
 'sfx_melee_nox_slash':'il gioco non ha colpi in mischia: in attesa della decisione sul blueprint V10.4','sfx_melee_lulu_strike':'il gioco non ha colpi in mischia: in attesa della decisione sul blueprint V10.4 (come sfx_melee_nox_slash)',
 'sfx_shop_buy_upgrade':'esistono già gli originali chrono purchase e upgrade (D47)','sfx_relic_chime':"esiste già l'originale chrono relic (D47)",'sfx_alchemist_brew':'nessun servizio «alchimista» nel gioco (le botteghe tossiche sono negozi): resta in attesa'}
def pcm(p):
    r=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ac','1','-ar','44100','-'],capture_output=True,check=True);return np.frombuffer(r.stdout,dtype=np.float32)
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
out=ROOT/'game/audio/v10';assets=[]
for name,use in KEEP.items():
    src=SRC/(name+'.ogg');x=pcm(src);gain=.891/float(np.abs(x).max())
    dest=out/(name+'.ogg');dur=len(x)/44100
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(src),'-af',f'volume={gain:.5f},afade=t=in:d=0.004,afade=t=out:st={dur-.02:.3f}:d=0.02','-c:a','libvorbis','-q:a','5','-ar','44100',str(dest)],check=True)
    y=pcm(dest);assets.append({'asset_id':'audio.'+name,'versione':1,'derivato':f'game/audio/v10/{dest.name}','uso':use,
     'grezzo':[f'delivery/argon-asset-giro2-20261110@{COMMIT}:deliveries/argon-asset-giro2-20261110/A/{src.name}'],'grezzo_sha256':[sha(src)],'derivato_sha256':sha(dest),
     'picco_grezzo':round(float(np.abs(x).max()),3),'picco_derivato':round(float(np.abs(y).max()),3),'durata_s':round(len(y)/44100,2),'stato':'INTEGRATED'})
    print(name,'picco',assets[-1]['picco_grezzo'],'->',assets[-1]['picco_derivato'],dest.stat().st_size,'byte')
(ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_AUDIO_20261112.json').write_text(json.dumps({'nota':"Derivati audio del lotto 4 di Argon (12 novembre 2026). Gli originali restano sul ramo di consegna e non si modificano.",'assets':assets,
 'esclusi':[{'file':k+'.ogg','motivo':v} for k,v in SKIP.items()]},ensure_ascii=False,indent=1)+'\n')
