package com.cityadventure.pizzaprotocol.debug;
import java.nio.file.*;
public final class AssetRoutesTest {
 public static void main(String[] args) throws Exception {
  Path root=Paths.get(args[0]);int count=0;
  try(java.util.stream.Stream<Path> files=Files.walk(root)) {
   for(Path f:(Iterable<Path>)files.filter(Files::isRegularFile)::iterator) {
    String relative=root.relativize(f).toString().replace('\\','/');
    String route=AssetRoutes.path("https","appassets.androidplatform.net",-1,"/game/"+relative);
    if(!("game/"+relative).equals(route))throw new AssertionError("Blocked APK resource: "+relative);
    if("application/octet-stream".equals(AssetRoutes.mime(route)))throw new AssertionError("Unknown MIME: "+relative);
    count++;
   }
  }
  if(count!=19)throw new AssertionError("Missing packaged resources: "+count);
  if(AssetRoutes.path("https","example.com",-1,"/game/index.html")!=null)throw new AssertionError("External host");
  if(AssetRoutes.path("https","appassets.androidplatform.net",-1,"/game/../secret")!=null)throw new AssertionError("Traversal");
  if(AssetRoutes.path("http","appassets.androidplatform.net",-1,"/game/index.html")!=null)throw new AssertionError("Wrong scheme");
  System.out.println("PASS: all "+count+" packaged files route with correct MIME; foreign paths blocked");
 }
}
