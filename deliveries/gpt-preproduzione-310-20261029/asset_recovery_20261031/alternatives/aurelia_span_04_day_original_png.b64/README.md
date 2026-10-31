# CHRONOS Aurelia Span 04 — original daylight alternative (binary recovery)

Source: Google Drive `RECOVERY_CANDIDATE_region_aurelia_span_v04.png` (file id `12wlKj_zT-XQwiqVBX7YgFhmjvYW3CeCo`).

The 21 part files below contain the original PNG encoded as Base64; they are not generated artwork or a replacement for the existing canonical daylight map. Each non-final part has 240000 Base64 characters. Concatenate in filename order and decode to restore byte-identical original:

```bash
cat part_*.txt | base64 -d > region_aurelia_span_04_day_original.png
printf '%s  %s\\n' 075ab39f4afbba9144bd5f6f305d93033143d433d5f685f25af6e70889385579 region_aurelia_span_04_day_original.png | sha256sum -c -
```

Expected image: RGB PNG, 1536 × 1024, 3,764,401 bytes. Expected SHA-256: `075ab39f4afbba9144bd5f6f305d93033143d433d5f685f25af6e70889385579`.

Status: RECOVERED_BACKUP_ALTERNATIVE; NOT ART APPROVED; NOT counted as additional canonical asset; COMMERCIAL_RELEASE=BLOCKED.
