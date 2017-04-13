let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleTowerFiller = require('role.towerfiller');
let utils = require('utils');
let tower = require('tower');

module.exports.loop = function () {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let upgraiders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let towerFillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'towerFiller');
    Memory.harvester_count = harvesters.length;

    if(harvesters.length == 0) {
        utils.createCreep('harvester', true);
    } else {
        if(harvesters.length < 2) {
            utils.createCreep('harvester');
        }else if(upgraiders.length < 1) {
            utils.createCreep('upgrader');
        }else if(builders.length < 1) {
            utils.createCreep('builder');
        }else if(towerFillers.length < 1) {
            utils.createCreep('towerFiller');
        }
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
    
    tower.towerLogic();

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            // roleBuilder.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'towerFiller') {
            roleTowerFiller.run(creep);
        }
    }
}