function getJson(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return JSON.parse(xhr.response);
}
function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
}
function formatAbilityModifier(score) {
    return score > 0 ? "+".concat(score) : String(score);
}
function toCheck(value) {
    return value ? 'x' : '-';
}
function setCharacterInfo(characterInfo) {
    $('#character-name').text(characterInfo.name);
    $('#class').text(characterInfo["class"]);
    $('#level').text(characterInfo.level);
    $('#race').text(characterInfo.race);
    $('#background').text(characterInfo.background);
    $('#alignment').text(characterInfo.alignment);
    $('#experience-points').text(characterInfo.experiencePoints);
}
function setAbilityScores(abilityScores) {
    for (var _i = 0, abilityScores_1 = abilityScores; _i < abilityScores_1.length; _i++) {
        var abilityScore = abilityScores_1[_i];
        var el = $("#ability-score-".concat(abilityScore.name.toLowerCase()));
        el.find('.modifier').text(formatAbilityModifier(getAbilityModifier(abilityScore.score)));
        el.find('.score').text(abilityScore.score);
    }
}
function setSavingThrows(abilityScores, proficiencyBonus) {
    for (var _i = 0, abilityScores_2 = abilityScores; _i < abilityScores_2.length; _i++) {
        var abilityScore = abilityScores_2[_i];
        var el = $("#saving-throw-".concat(abilityScore.name.toLowerCase()));
        var score = getAbilityModifier(abilityScore.score);
        if (abilityScore.proficiency) {
            score += proficiencyBonus;
        }
        el.find('.proficiency').text(toCheck(abilityScore.proficiency));
        el.find('.value').text(formatAbilityModifier(score));
    }
}
function getAbilityForSkill(skillName, abilities) {
    switch (skillName) {
        case 'Athletics':
            return abilities.filter(function (el) { return el.name == 'Strength'; })[0];
        case 'Acrobatics':
        case 'Sleight of Hand':
        case 'Stealth':
            return abilities.filter(function (el) { return el.name == 'Dexterity'; })[0];
        case 'Arcana':
        case 'History':
        case 'Investigation':
        case 'Nature':
        case 'Religion':
            return abilities.filter(function (el) { return el.name == 'Intelligence'; })[0];
        case 'Animal Handling':
        case 'Insight':
        case 'Medicine':
        case 'Perception':
        case 'Survival':
            return abilities.filter(function (el) { return el.name == 'Wisdom'; })[0];
        case 'Deception':
        case 'Intimidation':
        case 'Performance':
        case 'Persuasion':
            return abilities.filter(function (el) { return el.name == 'Charisma'; })[0];
        default: return null;
    }
}
function setSkills(skills, proficiencyBonus, abilities) {
    for (var _i = 0, skills_1 = skills; _i < skills_1.length; _i++) {
        var skill = skills_1[_i];
        var el = $("#skill-".concat(skill.name.toLowerCase().replace(/\s/g, '-')));
        var ability = getAbilityForSkill(skill.name, abilities);
        var score = getAbilityModifier(ability.score);
        if (skill.proficiency) {
            score += proficiencyBonus;
        }
        if (skill.expertise) {
            score += proficiencyBonus;
        }
        el.find('.proficiency').text(toCheck(skill.proficiency));
        el.find('.expertise').text(toCheck(skill.expertise));
        el.find('.value').text(formatAbilityModifier(score));
    }
}
function setPassiveWisdom(skills, proficiencyBonus, abilities) {
    var perception = skills.filter(function (el) { return el.name == 'Perception'; })[0];
    var abilityScore = getAbilityForSkill('Perception', abilities);
    var score = 10 + getAbilityModifier(abilityScore.score);
    if (perception.proficiency) {
        score += proficiencyBonus;
    }
    if (perception.expertise) {
        score += proficiencyBonus;
    }
    $('#passive-wisdom .value').text(formatAbilityModifier(score));
}
function populateList(selector, data) {
    var el = $(selector);
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var d = data_1[_i];
        el.append($("<li>".concat(d, "</li>")));
    }
}
function setProficiencies(proficiencies) {
    populateList('#proficiency-languages ol', proficiencies.languages);
    populateList('#proficiency-armor ol', proficiencies.armor);
    populateList('#proficiency-weapons ol', proficiencies.weapons);
    populateList('#proficiency-tools ol', proficiencies.tools);
}
function setAttacks(attacks, abilities) {
    var el = $('#attacks .items');
    var str = abilities.filter(function (el) { return el.name == 'Strength'; })[0];
    var dex = abilities.filter(function (el) { return el.name == 'Dexterity'; })[0];
    for (var _i = 0, attacks_1 = attacks; _i < attacks_1.length; _i++) {
        var attack = attacks_1[_i];
        var score = attack.finesse ? dex : str;
        var mod = getAbilityModifier(score.score);
        el.append($("\n            <tr>\n                <td>".concat(toCheck(attack.finesse), "</td>\n                <td class='left'>").concat(attack.name, "</td>\n                <td class='right'>").concat(formatAbilityModifier(mod), "</td>\n                <td class='right'>").concat(attack.damage, "</td>\n                <td class='right'>").concat(formatAbilityModifier(mod), "</td>\n            </tr>\n        ")));
    }
}
function setFeaturesAndTraits(data) {
    var el = $('#features-traits .items');
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var ft = data_2[_i];
        el.append($("\n            <tr>\n                <th class='left'>".concat(ft.name, "</th>\n            </tr>\n            <tr>\n                <td>").concat(ft.description, "</td>\n            </tr>\n        ")));
    }
}
function setEquipment(data) {
    var el = $('#equipment');
    for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
        var eq = data_3[_i];
        el.append($("\n            <tr>\n                <td>".concat(eq.name, "</td>\n                <td class='right'>").concat(eq.amount, "</td>\n            </tr>\n        ")));
    }
}
function setDeathSaves(successes, failures) {
    var s = successes.filter(function (x) { return x; }).length;
    var f = failures.filter(function (x) { return x; }).length;
    $('#death-saves .value').text("".concat(s, "/").concat(f));
}
function setArmorClass(armor, shield) {
    var ac = shield ? 2 : 0;
    switch (armor.toLowerCase()) {
        case 'padded':
        case 'leather':
            ac += 11;
            break;
        case 'studded leather':
        case 'hide':
            ac += 12;
            break;
        case 'chainshirt':
            ac += 13;
            break;
        case 'scalemail':
        case 'breastplate':
        case 'ringmail':
            ac += 14;
            break;
        case 'halfplate':
            ac += 15;
            break;
        case 'chainmail':
            ac += 16;
            break;
        case 'splint':
            ac += 17;
            break;
        case 'plate':
            ac += 18;
            break;
    }
    $('#armor-class').find('.value').text(ac);
}
document.addEventListener('DOMContentLoaded', function (e) {
    var data = getJson('!{sheetUrl}');
    setCharacterInfo(data.characterInfo);
    setAbilityScores(data.abilityScores);
    $('#inspiration .value').text(data.inspiration);
    $('#proficiency-bonus .value').text(data.proficiencyBonus);
    setSavingThrows(data.abilityScores, data.proficiencyBonus);
    setSkills(data.skills, data.proficiencyBonus, data.abilityScores);
    setPassiveWisdom(data.skills, data.proficiencyBonus, data.abilityScores);
    setProficiencies(data.proficiencies);
    setAttacks(data.attacks, data.abilityScores);
    var dex = data.abilityScores.filter(function (el) { return el.name == 'Dexterity'; })[0];
    setArmorClass(data.armor, data.shield);
    $('#initiative .value').text(getAbilityModifier(dex.score));
    $('#speed .value').text(data.speed);
    $('#max-hp .value').text(data.maximumHitpoints);
    $('#cur-hp .value').text(data.currentHitpoints);
    $('#temp-hp .value').text(data.temporaryHitpoints);
    $('#max-hit-dice .value').text(data.hitDiceTotal);
    $('#cur-hit-dice .value').text(data.hitDice);
    setDeathSaves(data.deathSaveSuccesses, data.deathSaveFailures);
    setEquipment(data.equipment);
    $('#currency-copper .value').text(data.currency.copper);
    $('#currency-silver .value').text(data.currency.silver);
    $('#currency-electrum .value').text(data.currency.electrum);
    $('#currency-gold .value').text(data.currency.gold);
    $('#currency-platinum .value').text(data.currency.platinum);
    $('#personality-traits .text').text(data.personalityTraits);
    $('#ideals .text').text(data.ideals);
    $('#bonds .text').text(data.bonds);
    $('#flaws .text').text(data.flaws);
    setFeaturesAndTraits(data.features);
});
