/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const Effect = require('../models/effect');
const Character = require('../models/character');
const Item = require('../models/item');
const Material = require('../models/material');
const Race = require('../models/race');
const Skill = require('../models/skill');
const Spell = require('../models/spell');
const Title = require('../models/title');
const Classes = require('../models/classes');
const AOE = require('../models/aoe');
const Enchantment = require('../models/enchantment');
const Magic = require('../models/magic');
const Talent = require('../models/talent');

function removeResponse(err, modelName) {
  if (err) return false;
  return true;
}

function deleteWithID(id, model) {
  switch (model) {
    case 'AOE':
      return AOE.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Class':
      return Classes.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Effect':
      return Effect.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Enchant':
      return Enchantment.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Item':
      return Item.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Magic':
      return Magic.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Material':
      return Material.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Race':
      return Race.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Skill':
      return Skill.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Spell':
      return Spell.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Talent':
      return Talent.findByIdAndDelete(id, (err) => removeResponse(err, model));
    case 'Title':
      return Title.findByIdAndDelete(id, (err) => removeResponse(err, model));
    default:
      return '';
  }
}

function selectAndUpdateModel(id, newModel, modelType) {
  switch (modelType) {
    case 'aoe':
      return AOE.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'character':
      return Character.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'class':
      return Classes.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'effect':
      return Effect.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'enchant':
      return Enchantment.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'item':
      return Item.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'magic':
      return Magic.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'material':
      return Material.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'race':
      return Race.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'skill':
      return Skill.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'spell':
      return Spell.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'talent':
      return Talent.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    case 'title':
      return Title.findByIdAndUpdate(id, newModel, (err, result) => {
        if (err) return console.log('failed to update');
        return '';
      });
    default:
      console.log(modelType);
      return '';
  }
}

function updateModel(id, model, modelType, list, target) {
  let index = 0;
  list.every((item, i) => {
    if (item._id == target) {
      index = i;
      return false;
    }
    return true;
  });
  list.splice(index, 1);
  selectAndUpdateModel(id, model, modelType);
}

function updateInventory(id, model, modelType, target) {
  const inventoryIndex = [];
  const equipedIndex = [];

  model.inventory.forEach((item, i) => {
    if (item._id == target) {
      inventoryIndex.push(i);
    }
  });
  inventoryIndex.reverse();
  inventoryIndex.forEach((index) => {
    model.inventory.splice(index, 1);
  });

  model.equiped.forEach((item, i) => {
    if (item._id == target) {
      equipedIndex.push(i);
    }
  });
  equipedIndex.reverse();
  equipedIndex.forEach((index) => {
    model.equiped.splice(index, 1);
  });

  selectAndUpdateModel(id, model, modelType);
}

function updateSkill(id, model, modelType, lists, target) {
  lists.forEach((list, i) => {
    const listId = list.map((item) => `${item._id}`);
    const index = listId.indexOf(target);
    if (index >= 0) {
      list.splice(index, 1);
    }
  });
  selectAndUpdateModel(id, model, modelType);
}

function updateModels(modelName, modelKey, models, id) {
  switch (modelName) {
    case 'AOE':
      switch (modelKey) {
        case 'skill':
          return models.forEach((model) => {
            updateModel(model._id, model, 'skill', model.aoes, id);
          });
        case 'spell':
          return models.forEach((model) => {
            updateModel(model._id, model, 'spell', model.aoes, id);
          });
        default:
          console.log(`key:${modelKey}`);
          return '';
      }
    case 'Class':
      return models.forEach((model) => {
        updateModel(model._id, model, 'character', model.class, id);
      });
    case 'Effect':
      switch (modelKey) {
        case 'character':
          return models.forEach((model) => {
            updateModel(model._id, model, 'character', model.status, id);
          });
        case 'classes':
          return models.forEach((model) => {
            updateModel(model._id, model, 'class', model.effects, id);
          });
        case 'item':
          return models.forEach((model) => {
            updateModel(model._id, model, 'item', model.subStats, id);
          });
        case 'material':
          return models.forEach((model) => {
            updateModel(model._id, model, 'material', model.effects, id);
          });
        case 'race':
          return models.forEach((model) => {
            const data = {};
            Object.keys(model._doc).forEach((key) => {
              if (model[key] != undefined && key !== 'id') {
                data[key] = model[key];
              }
              if (key === 'training') {
                data[key] = null;
              }
            });
            Race.findByIdAndUpdate(model._id, data, (err, newModel) => {
              if (err) return console.log(err);
              return '';
            });
          });
        case 'skill':
          return models.forEach((model) => {
            updateModel(model._id, model, 'skill', model.effects, id);
          });
        case 'spell':
          return models.forEach((model) => {
            updateModel(model._id, model, 'spell', model.effects, id);
          });
        case 'title':
          return models.forEach((model) => {
            updateModel(model._id, model, 'title', model.effects, id);
          });
        default:
          console.log(`key:${modelKey}`);
          return '';
      }
    case 'Enchant':
      return models.forEach((model) => {
        updateModel(model._id, model, 'item', model.enchantments, id);
      });
    case 'Item':
      return models.forEach((model) => {
        updateInventory(model._id, model, 'character', id);
      });
    case 'Magic':
      switch (modelKey) {
        case 'character':
          return models.forEach((model) => {
            updateModel(model._id, model, 'character', model.magics, id);
          });
        case 'spell':
          return models.forEach((model) => {
            updateModel(model._id, model, 'spell', model.magics, id);
          });
        default:
          console.log(`key:${modelKey}`);
          return '';
      }
    case 'Material':
      return models.forEach((model) => {
        const data = {};
        Object.keys(model._doc).forEach((key) => {
          if (model[key] != undefined && key !== 'id') {
            data[key] = model[key];
          }
          if (key === 'material') {
            data[key] = null;
          }
        });
        Item.findByIdAndUpdate(model._id, data, (err, newModel) => {
          if (err) return console.log(err);
          return '';
        });
      });
    case 'Race':
      return models.forEach((model) => {
        const data = {};
        Object.keys(model._doc).forEach((key) => {
          if (model[key] != undefined && key !== 'id') {
            data[key] = model[key];
          }
          if (key === 'race') {
            data[key] = null;
          }
        });
        Character.findByIdAndUpdate(model._id, data, (err, newModel) => {
          if (err) return console.log(err);
          return '';
        });
      });
    case 'Skill':
      switch (modelKey) {
        case 'character':
          return models.forEach((model) => {
            updateSkill(model._id, model, 'character', [model.skills, model.traits, model.unique], id);
          });
        case 'classes':
          return models.forEach((model) => {
            updateModel(model._id, model, 'class', model.skills, id);
          });
        case 'enchant':
          return models.forEach((model) => {
            deleteWithID(model._id, 'Enchant');
          });
        case 'race':
          return models.forEach((model) => {
            updateSkill(model._id, model, 'race', [model.mainSkills, model.subSkills], id);
          });
        case 'title':
          return models.forEach((model) => {
            updateModel(model._id, model, 'title', model.skills, id);
          });
        default:
          console.log(`key:${modelKey}`);
          return '';
      }
    case 'Spell':
      switch (modelKey) {
        case 'character':
          return models.forEach((model) => {
            updateModel(model._id, model, 'character', model.spells, id);
          });
        case 'enchant':
          return models.forEach((model) => {
            deleteWithID(model._id, 'Enchant');
          });
        case 'spell':
          return models.forEach((model) => {
            const data = {};
            Object.keys(model._doc).forEach((key) => {
              if (model[key] != undefined && key !== 'id') {
                data[key] = model[key];
              }
              if (key === 'followUp') {
                data[key] = null;
              }
            });
            Spell.findByIdAndUpdate(model._id, data, (err, newModel) => {
              if (err) return console.log(err);
              return '';
            });
          });
        default:
          console.log(`key:${modelKey}`);
          return '';
      }
    case 'Talent':
      switch (modelKey) {
        case 'character':
          return models.forEach((model) => {
            updateModel(model._id, model, 'character', model.talents, id);
          });
        case 'enchant':
          return models.forEach((model) => {
            deleteWithID(model._id, 'Enchant');
          });
        case 'talent':
          return models.forEach((model) => {
            updateModel(model._id, model, 'talent', model.parent, id);
          });
        default:
          console.log(`key:${modelKey}`);
          return '';
      }
    case 'Title':
      return models.forEach((model) => {
        updateModel(model._id, model, 'character', model.titles, id);
      });
    default:
      console.log(modelKey);
      return '';
  }
}

const ignoreModel = ['Class', 'Item', 'Race', 'Title'];

exports.handleDeletion = (results, modelName, res, id) => {
  let reload = false;
  if (!Object.values(results).every((value) => value.length === 0)) {
    Object.entries(results).forEach(([modelKey, models]) => {
      if (models.length < 1) {
        return;
      }
      if (!ignoreModel.find((model) => model == modelName)) { reload = true; }
      updateModels(modelName, modelKey, models, id);
    });
  }
  if (id === 0 && !deleteWithID(id, modelName)) {
    reload = false;
    return res.json({ fail: true });
  }
  return res.json({ reload });
};

/*
async.parallel({
    spell(callback) {
      Spell.find({ aoes: req.params.id })
        .exec(callback);
    },
    skill(callback) {
      Skill.find({ aoes: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) return res.status(404).json({ err, msg: 'Error retrieving results' });
    return handleDeletion(results, 'AOE', res, req.params.id);
  });

    return handleDeletion(results, 'AOE', res, req.params.id);

  */
