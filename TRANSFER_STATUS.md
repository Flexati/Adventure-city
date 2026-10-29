# City Adventure transfer

Source: amzajaguar-blip/City-Adventure- at 16ca83ce7daa65bccc6b369af0dac4034731a0b9,
imported with full history in merge commit 0c3aa04 on branch `ccr-5ed8f6bd-u7sh6a`.

Transfer complete. The temporary force-push bridge workflow was removed: once this
branch reaches `main` it would have overwritten `main` with the old source head.

Legacy RIOTLINE packs (PNG atlases, audio pack, production pack, ~150 MB) were removed
from the working tree. They remain in history and can be restored with:

    git show 0c3aa04:CITY_ADVENTURE_COMPLETE_AUDIO_PACK.zip > CITY_ADVENTURE_COMPLETE_AUDIO_PACK.zip

RELEASE_GATE = BLOCKED. See docs/RELEASE_GATE.md.
