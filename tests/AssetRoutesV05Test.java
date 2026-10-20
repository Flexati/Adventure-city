package com.cityadventure.pizzaprotocol.debug;
import java.nio.file.*;
public final class AssetRoutesV05Test {
 public static void main(String[] args) throws Exception {
  Path root=Paths.get(args[0]); int count=0;
  try(java.util.stream.Stream<Path> files=Files.walk(root)) {
   for(Path f:(Iterable<Path>)files.filter(Files::isRegularFile)::iterator) {
    String relative=root.relativize(f).toString().replace('\\','/');
    String route=AssetRoutes.path("https","appassets.androidplatform.net",-1,"/game/"+relative);
    if(!("game/"+relative).equals(route)||Files.size(f)==0)throw new AssertionError(relative);
    if("application/octet-stream".equals(AssetRoutes.mime(route)))throw new AssertionError(relative);
    count++;
   }
  }
  if(count!=38)throw new AssertionError("Resource count: "+count);
  if(AssetRoutes.path("https","example.com",-1,"/game/index.html")!=null)throw new AssertionError("Foreign host");
  if(AssetRoutes.path("https","appassets.androidplatform.net",-1,"/game/../secret")!=null)throw new AssertionError("Traversal");
  System.out.println("PASS: "+count+" nonempty packaged resources and MIME routes");
 }
}
