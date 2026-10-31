#!/usr/bin/env python3
"""CHRONOS: restore PNG from the verified delta ZIP to GitHub and optional rclone Drive.
No overwrites: mismatches are errors. Every successful GitHub file is read back.
Usage:
  GITHUB_TOKEN=... python3 upload_delta_35.py /path/CHRONOS_DELTA_35_PNG_RITROVATI_E_GENERATI_20261031.zip \
    --drive gdrive:CHRONOS_ASSET_DELTA_296_20261031
If GitHub CLI is logged in, GITHUB_TOKEN can be omitted.
The Drive remote must be configured using: rclone config
"""
import argparse, base64, hashlib, io, json, os, shutil, subprocess, sys, time
import urllib.error, urllib.parse, urllib.request, zipfile
from pathlib import PurePosixPath

REPO = "Flexati/Adventure-city"
BRANCH = "delivery/gpt-preproduzione-310-20261029"
PREFIX = "deliveries/gpt-preproduzione-310-20261029/asset_recovery_20261031"
API = "https://api.github.com/repos/" + REPO

def sha256(data):
    return hashlib.sha256(data).hexdigest()

def token():
    value = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if value:
        return value.strip()
    if shutil.which("gh"):
        p = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True)
        if p.returncode == 0:
            return p.stdout.strip()
    return ""

def github(method, path, auth, payload=None, allow_404=False):
    url = API + path
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method=method,
        headers={"Authorization":"Bearer "+auth,
                 "Accept":"application/vnd.github+json",
                 "X-GitHub-Api-Version":"2022-11-28",
                 "User-Agent":"CHRONOS-recovery",
                 "Content-Type":"application/json"})
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as ex:
        if ex.code == 404 and allow_404:
            return None
        raise RuntimeError("GitHub HTTP %s: %s" % (ex.code, ex.read(500).decode("utf-8","replace")))

def remote_file(path, auth):
    quote = urllib.parse.quote(path, safe="/")
    return github("GET", "/contents/"+quote+"?ref="+urllib.parse.quote(BRANCH,safe=""), auth, allow_404=True)

def upload_github(path, data, auth):
    expected_git_sha = hashlib.sha1(b"blob "+str(len(data)).encode()+b"\\0"+data).hexdigest()
    info = remote_file(path, auth)
    if info is not None:
        if info.get("sha") == expected_git_sha:
            return "exists-verified"
        raise RuntimeError("Remote path already exists with DIFFERENT bytes: "+path)
    quote = urllib.parse.quote(path, safe="/")
    body = {"message":"backup: restore original CHRONOS delta PNG "+path.rsplit("/",1)[-1],
            "content":base64.b64encode(data).decode("ascii"),"branch":BRANCH}
    result = github("PUT","/contents/"+quote,auth,body)
    received = result.get("content",{}).get("sha")
    if received != expected_git_sha:
        raise RuntimeError("Git blob SHA mismatch after upload: "+path)
    checked = remote_file(path,auth)
    if not checked or checked.get("sha") != expected_git_sha:
        raise RuntimeError("Readback SHA mismatch: "+path)
    return "uploaded-verified"

def upload_drive(local_file, rel, remote):
    if not shutil.which("rclone"):
        raise RuntimeError("rclone not installed; Drive disabled")
    path = remote.rstrip("/")+"/"+rel
    # copyto does not alter unrelated files. Use --ignore-existing to avoid overwrites.
    command = ["rclone","copyto",str(local_file),path,"--ignore-existing","--retries","2",
               "--low-level-retries","2"]
    p = subprocess.run(command,capture_output=True,text=True)
    if p.returncode:
        raise RuntimeError("Drive rclone: "+p.stderr[-300:])
    # Readback compares remote MD5 with original; Google Drive supports MD5 for PNG.
    check = subprocess.run(["rclone","md5sum",path],capture_output=True,text=True)
    expected = hashlib.md5(local_file.read_bytes()).hexdigest()
    if check.returncode or expected not in check.stdout.lower():
        raise RuntimeError("Drive MD5 verification failed: "+rel)
    return "verified"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("zip",help="Original verified delta ZIP (35 PNG + optional alternative)")
    ap.add_argument("--drive",help="rclone destination, e.g. gdrive:CHRONOS_ASSET_DELTA_296_20261031")
    ap.add_argument("--github-only",action="store_true")
    ap.add_argument("--drive-only",action="store_true")
    args=ap.parse_args()
    archive=os.path.abspath(args.zip)
    tkn=token() if not args.drive_only else ""
    if not args.drive_only and not tkn:
        sys.exit("GitHub authentication missing: use gh auth login or set GITHUB_TOKEN")
    if args.drive_only and not args.drive:
        sys.exit("--drive-only requires --drive")
    report={"zip":archive,"zip_sha256":sha256(open(archive,"rb").read()),
            "repository":REPO,"branch":BRANCH,"results":[]}
    tmpdir = os.path.join(os.path.dirname(archive),".chronos_upload_tmp")
    os.makedirs(tmpdir,exist_ok=True)
    try:
        with zipfile.ZipFile(archive) as z:
            bad=z.testzip()
            if bad:
                sys.exit("ZIP CRC FAILED: "+bad)
            pngs=sorted(n for n in z.namelist() if n.lower().endswith(".png") and not n.endswith("/"))
            if not pngs:
                sys.exit("No PNG found in ZIP.")
            for num,n in enumerate(pngs,1):
                path=PurePosixPath(n)
                if path.is_absolute() or ".." in path.parts:
                    sys.exit("Unsafe ZIP entry: "+n)
                rel=str(path)
                data=z.read(n)
                dest=os.path.join(tmpdir,*path.parts)
                os.makedirs(os.path.dirname(dest),exist_ok=True)
                with open(dest,"wb") as out:
                    out.write(data)
                row={"source":n,"size":len(data),"sha256":sha256(data),
                     "github":"not-attempted","drive":"not-attempted"}
                if not args.drive_only:
                    try:
                        row["github"]=upload_github(PREFIX+"/"+rel,data,tkn)
                    except Exception as ex:
                        row["github"]="ERROR: "+str(ex)
                if args.drive and not args.github_only:
                    try:
                        row["drive"]=upload_drive(__import__("pathlib").Path(dest),rel,args.drive)
                    except Exception as ex:
                        row["drive"]="ERROR: "+str(ex)
                report["results"].append(row)
                print("[%d/%d] %s | GH: %s | Drive: %s"%
                      (num,len(pngs),rel,row["github"],row["drive"]),flush=True)
                with open(archive+".upload-report.json","w") as f:
                    json.dump(report,f,indent=2,ensure_ascii=False)
    finally:
        shutil.rmtree(tmpdir,ignore_errors=True)
    error=any(row["github"].startswith("ERROR") or row["drive"].startswith("ERROR")
              for row in report["results"])
    if error:
        sys.exit("INCOMPLETE: inspect "+archive+".upload-report.json")
    print("ALL ATTEMPTED TRANSFERS VERIFIED; report at "+archive+".upload-report.json")

if __name__=="__main__":
    main()
