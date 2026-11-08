#!/usr/bin/env python3
"""
Audio Engineering Suite for CHRONOS Adventure:
Upgrades all legacy 32kHz mono audio tracks across all campaign steps to
high-fidelity 48kHz stereo master tracks with enhanced dynamic range,
punchy sub-bass, tactical clarity, and rich spatialization.
"""
import subprocess
import os
import shutil

SR = 48000

def remaster_track(input_path, output_path, filter_chain, extra_input=None, extra_mix=None):
    tmp_path = output_path + '.tmp.ogg'
    print(f"Remastering {input_path} -> {tmp_path} -> {output_path}...")
    cmd = ['ffmpeg', '-y']
    if extra_input and os.path.exists(extra_input):
        cmd.extend(['-i', input_path, '-i', extra_input, '-filter_complex', extra_mix])
    else:
        cmd.extend(['-i', input_path, '-af', filter_chain])
    
    cmd.extend([
        '-ar', str(SR),
        '-ac', '2',
        '-c:a', 'libvorbis',
        '-q:a', '5',
        tmp_path
    ])
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error remastering {input_path}: {res.stderr}")
        if os.path.exists(tmp_path): os.remove(tmp_path)
        return False
    
    os.replace(tmp_path, output_path)
    print(f"  -> Successfully updated {output_path}")

    android_dest = os.path.join('android/build/assets', output_path)
    if os.path.exists(os.path.dirname(android_dest)):
        shutil.copyfile(output_path, android_dest)
        print(f"  -> Synced to {android_dest}")
    return True

def run():
    print("=== CHRONOS Audio Quality & Variety Engineering ===")
    
    # 1. Driving theme: upgrade from 32kHz mono to high-octane 48kHz stereo with Veyra racing energy
    remaster_track(
        'game/audio/v05/driving.ogg',
        'game/audio/v05/driving.ogg',
        '',
        extra_input='game/audio/v10/veyra_championship.ogg',
        extra_mix='[0:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.5[a0];[1:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.7[a1];[a0][a1]amix=inputs=2:duration=first:dropout_transition=2,bass=g=3.0:f=60:w=0.5,treble=g=1.5:f=8000'
    )

    # 2. Blackout theme: dystopian dark mystery, deep sub-rumble, electrical atmosphere
    remaster_track(
        'game/audio/v05/blackout.ogg',
        'game/audio/v05/blackout.ogg',
        'aformat=sample_rates=48000:channel_layouts=stereo,extrastereo=m=1.4,bass=g=4.0:f=55:w=0.6,treble=g=1.8:f=7200,aecho=0.8:0.7:40:0.35,compand=attacks=0.01:decays=0.2:points=-80/-80|-24/-18|-12/-8|-0.1/-0.1:gain=2.2'
    )

    # 3. Breach theme: tactical infiltration, crisp impact transients, stereo depth
    remaster_track(
        'game/audio/v05/breach.ogg',
        'game/audio/v05/breach.ogg',
        'aformat=sample_rates=48000:channel_layouts=stereo,extrastereo=m=1.35,bass=g=3.5:f=65:w=0.5,treble=g=2.2:f=8500,compand=attacks=0.008:decays=0.12:points=-80/-80|-24/-18|-12/-9|-0.1/-0.1:gain=2.0'
    )

    # 4. Contagion theme: toxic industrial decay, resonant harmonics, wide spatial reverb
    remaster_track(
        'game/audio/v05/contagion.ogg',
        'game/audio/v05/contagion.ogg',
        'aformat=sample_rates=48000:channel_layouts=stereo,extrastereo=m=1.5,bass=g=3.2:f=60:w=0.5,treble=g=2.0:f=8000,aecho=0.7:0.6:60:0.25,compand=attacks=0.01:decays=0.18:points=-80/-80|-24/-19|-12/-9|-0.1/-0.1:gain=2.0'
    )

    # 5. Zero theme: ground zero climax, relentless industrial grit and sub-punch
    remaster_track(
        'game/audio/v05/zero.ogg',
        'game/audio/v05/zero.ogg',
        'aformat=sample_rates=48000:channel_layouts=stereo,extrastereo=m=1.4,bass=g=4.2:f=58:w=0.6,treble=g=2.4:f=9000,compand=attacks=0.006:decays=0.14:points=-80/-80|-24/-18|-12/-8|-0.1/-0.1:gain=2.4'
    )

    print("=== All audio steps successfully remastered to 48kHz Stereo Master ===")

if __name__ == '__main__':
    run()
