# Ghost Shed
A game about ghosts and haunted interior design

*Developed by Collective Games*

## Try It

Latest stable build is live at https://spring-2023-cisc374.github.io/group-project-ghostshed/

## Contributions

#### Jaydon 
RoomScene, Tilemap, tile rendering and Free-roam player movement

This example was really helpful in figuring out the tilemap loading syntax needed: https://labs.phaser.io/edit.html?src=src\tilemap\collision\tile%20callbacks.js

#### Patrick
Perform Actions
- Checks what zone the player is in
- If in the proper zone prints out what action is being done
- Doesn't effect anything on screen. But will when everything is finalized

#### Ben
Ghosts and Path Following
- Created a Ghost class that extends a Phaser Sprite
- new Ghost constructor takes in an integer representing the zone (2, 3, 4)
- The Ghost will travel along a path that is defined based on the zone

#### Dan
Audio
- Created custom audio
- Loaded into scene

### Aaron
