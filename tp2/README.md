# SGI 2023/2024 - TP2

## Group T04G02

| Name                        | Number    | E-Mail                     |
| --------------------------- | --------- | -------------------------- |
| João António Semedo Pereira | 202007145 | <up202007145@edu.fe.up.pt> |
| Nuno Afonso Anjos Pereira   | 202007865 | <up202007865@edu.fe.up.pt> |

----

## Project information

Strong Points:
- Use of complex geometry (the plane has a lot of tiny parts which needed to be well coordinated).
- Extensive GUI control.
- All features for `tp2` are available and fully implemented.

Scene:
- The scene features a hangar with a plane inside. There are also some cargo crates inside and a big TV Plasma playing footage from a plane landing.
- [scene](/tp2/scenes/hangar/scene.xml)
- [screenshots](/tp2/screenshots/)

----

## Issues/Problems

- Poor use of the `polygon` primitive: it was used just so we could say it was used.
- Better LOD representations: there are many of them but with few representations.
- Black lower half of the plane nose: we tried to color the rest of the texture but the result was never good enough to stay. With other features to implement, we decided to leave it as it is. On the other hand, we can say it is a feature :)
