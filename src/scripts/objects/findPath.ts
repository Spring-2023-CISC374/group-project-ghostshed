import Phaser from 'phaser'

interface TilePosition{
    x: number,
    y: number
}

const toKey = (x:number, y:number) => `${x}x${y}`

export const findPath = (start: Phaser.Math.Vector2, target: Phaser.Math.Vector2, groundLayer: Phaser.Tilemaps.TilemapLayer) => {
    if(!groundLayer.getTileAt(target.x, target.y)){
        console.log("not a valid target")
        return []
    }
    const startKey = toKey(start.x, start.y)
    const targeKey = toKey(target.x, target.y)

    const queue: TilePosition[] = []
	const parentForKey: { [key: string]: { key: string, position: TilePosition } } = {}

    parentForKey[startKey] = {
		key: '',
		position: { x: -1, y: -1 }
	}

    queue.push(start)

    while(queue.length > 0){
        const {x, y} = queue.shift()!
        let currentKey= toKey(x, y)
        if(currentKey === targeKey){
            break
        }

        let neighbors = [
			{ x, y: y - 1 },	// top
			{ x: x + 1, y }, 	// right
			{ x, y: y + 1 },	// bottom
			{ x: x - 1, y}		// left
        ]

        for (let i = 0; i < neighbors.length; ++i){
			const neighbor = neighbors[i]

            //if the tile does not exist, then look at another tile
			if (!groundLayer.getTileAt(neighbor.x, neighbor.y)){
				continue
			}

			const key = toKey(neighbor.x, neighbor.y)

			if (key in parentForKey){
				continue
			}

			parentForKey[key] = {
				key: currentKey,
				position: { x, y }
			}

			queue.push(neighbor)
		}
	}

    const path: Phaser.Math.Vector2[] = []
    let tempTargetKey = targeKey
    let tempCurrentPos = parentForKey[targeKey].position

    while(tempTargetKey !== startKey){
        const pos = groundLayer.tileToWorldXY(tempCurrentPos.x, tempCurrentPos.y)
        pos.x += groundLayer.tilemap.tileWidth * 0.5
		pos.y += groundLayer.tilemap.tileHeight * 0.5

        path.push(pos)

        let { key, position } = parentForKey[tempTargetKey]
		tempTargetKey = key
		tempCurrentPos = position
    }

    return path.reverse();
}