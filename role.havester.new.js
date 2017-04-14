let con = require('constants');

/**
 * @return index: index of container whose harvester is dead or will die soon
 */
let chooseContainerIndex = () => {
    let existingCreepIndexes = Game.creeps.filter((creep) => {
        creep.memory.role == 'containerHarvester' &&
        creep.ticksToLive > 40
    }).map((creep) => creep.memory.containerIndex);
    let indexesCount = con.room.find(FIND_SOURCES).length;
    for (let i = 0; i++; i < indexesCount) {
        if (existingCreepIndexes.indexOf(i) == -1) {
            return i;
        }
    }
    return -1;
}

let roleContainerHarvester = {

    /** ContainerHarvester logic.
     * Goes to related container and harvest from source to it.
     * @param {Creep} creep 
     * **/
    run: function(creep) {
        let container = creep.room.find(
            FIND_STRUCTURES, {
                filter: stucture => 
                (stucture.structureType == STRUCTURE_CONTAINER)
            }
        )[creep.memory.index];
        if (!creep.pos.isEqualTo(container)) {
            creep.moveTo(container);
        } else {
            let source = creep.pos.findInRange(FIND_SOURCES, 1)[0];
            creep.harvest(source);
        }
	},

    /**
     * Creation of containerHarvester.
     * This creep designed to fully harvest full source by itself.
     * Binded to appropriate container.
     */
    create: function() {
        let body = Array(5).fill(WORK);
        let availableEnergy = con.room.energyAvailable - 500;
        let containerIndex = chooseContainerIndex();
        let moveCount;

        if (containerIndex == -1) {
            return False;
        }
        if (availableEnergy < 50) {
            console.log('Not Enough enegry for containerHarvester');
            return False;
        }
        moveCount = Math.min(5, availableEnergy/50<<0);
        body.concat(Array(moveCount).fill(MOVE));
        let newName = Game.spawns['Spawn1'].createCreep(
            body, undefined, {
                role: 'containerHarvester',
                index: containerIndex
            });
        console.log(
            `Spawning new containerHarvester[${containerIndex}]: ${newName}`);
    },

    /**
     * @return bool: true if room is available for containerHarvester
     */
    isContainerHarvesterAvailable: function() {
        return true;
    }
};

module.exports = roleContainerHarvester;